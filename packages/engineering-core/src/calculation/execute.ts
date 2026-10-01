import type {
  CalculationResult,
  EngineeringAssumption,
  EngineeringError,
  EngineeringIssue,
  EngineeringWarning,
  CalculationOutput,
  EngineeringId,
} from "@ogwusearch/engineering-types";

import { defineCalculation } from "./definition.js";

import {
  createCalculationContext,
} from "./context.js";

import type {
  CalculationDefinition,
  CalculationExecutionContext,
} from "./types.js";

import {
  createTraceContext,
} from "../trace/trace-context.js";

import {
  createResult,
} from "../result/create-result.js";


export interface ExecuteCalculationOptions {
  readonly calculationId?: EngineeringId;
  readonly projectId?: EngineeringId;
  readonly runId?: EngineeringId;
  readonly startedAt?: string;
  readonly metadata?: CalculationExecutionContext["metadata"];
  readonly options?: CalculationExecutionContext["options"];
}


/**
 * Splits engineering issues into
 * blocking errors and non-blocking warnings.
 */
function splitIssues(
  issues: readonly EngineeringIssue[],
): {
  errors: EngineeringError[];
  warnings: EngineeringWarning[];
} {

  const errors: EngineeringError[] = [];
  const warnings: EngineeringWarning[] = [];


  for (const issue of issues) {

    if (issue.severity === "ERROR") {

      errors.push({
        ...issue,
        severity: "ERROR",
      });

    } else {

      warnings.push({
        ...issue,
        severity: "WARNING",
      });

    }
  }


  return {
    errors,
    warnings,
  };
}



/**
 * Executes a generic engineering calculation.
 *
 * Lifecycle:
 *
 * validate
 *      ↓
 * assumptions
 *      ↓
 * calculate
 *      ↓
 * warnings
 *      ↓
 * CalculationResult
 */
export function executeCalculation<
  TInput,
  TOutput extends CalculationOutput,
>(
  definition: CalculationDefinition<
    TInput,
    TOutput
  >,
  input: TInput,
  options: ExecuteCalculationOptions = {},
): CalculationResult<TOutput> {


  const calculation =
    defineCalculation(definition);



  const calculationId =
    options.calculationId ??
    `calculation:${calculation.name}`;



  const context =
    createCalculationContext({

      calculationId,

      ...(options.projectId !== undefined && {
        projectId: options.projectId,
      }),

      ...(options.runId !== undefined && {
        runId: options.runId,
      }),

      ...(options.startedAt !== undefined && {
        startedAt: options.startedAt,
      }),

      ...(options.metadata !== undefined && {
        metadata: options.metadata,
      }),

      ...(options.options !== undefined && {
        options: options.options,
      }),
    });



  const trace =
    createTraceContext();



  const executionContext:
    CalculationExecutionContext = {
      ...context,
      trace,
    };



  // ----------------------------------------------------------
  // Validation
  // ----------------------------------------------------------

  let validationIssues:
    EngineeringIssue[] = [];


  try {

    validationIssues =
      calculation.validate
        ? calculation.validate(input)
        : [];


  } catch (error) {

    return createResult({

      status: "ERROR",

      valid: false,

      errors: [
        {
          code: "VALIDATION_FAILED",
          severity: "ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Validation failed.",
        },
      ],

      warnings: [],

      assumptions: [],

      trace: {
        steps: [
          ...trace.steps,
        ],
      },

      metadata:
        context.metadata ?? {},
    });
  }



  const {
    errors,
    warnings,
  } =
    splitIssues(validationIssues);



  // ----------------------------------------------------------
  // Assumptions
  // ----------------------------------------------------------

  let assumptions:
    EngineeringAssumption[] = [];


  try {

    assumptions =
      typeof calculation.assumptions === "function"

        ? calculation.assumptions(input)

        : calculation.assumptions
          ? [
              ...calculation.assumptions,
            ]

          : [];


  } catch (error) {

    return createResult({

      status: "ERROR",

      valid: false,

      errors: [
        ...errors,
        {
          code: "INVALID_ASSUMPTION",
          severity: "ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Unable to resolve calculation assumptions.",
        },
      ],

      warnings,

      assumptions: [],

      trace: {
        steps: [
          ...trace.steps,
        ],
      },

      metadata:
        context.metadata ?? {},
    });
  }



  // Stop execution when validation fails

  if (errors.length > 0) {

    return createResult({

      status: "ERROR",

      valid: false,

      errors,

      warnings,

      assumptions,

      trace: {
        steps: [
          ...trace.steps,
        ],
      },

      metadata:
        context.metadata ?? {},
    });
  }



  // ----------------------------------------------------------
  // Calculation + Post Calculation Warnings
  // ----------------------------------------------------------

  try {

    const value =
      calculation.calculate(
        input,
        executionContext,
      );



    let calculationWarnings:
      EngineeringWarning[] = [];



    if (calculation.warnings) {


      const generatedWarnings =
        typeof calculation.warnings === "function"

          ? calculation.warnings(
              input,
              value,
            )

          : calculation.warnings;



      const {
        warnings: normalizedWarnings,
      } =
        splitIssues(
          generatedWarnings,
        );


      calculationWarnings =
        normalizedWarnings;
    }



    const allWarnings =
      [
        ...warnings,
        ...calculationWarnings,
      ];



    return createResult({

      status:
        allWarnings.length > 0
          ? "WARNING"
          : "SUCCESS",


      valid: true,


      value,


      errors: [],


      warnings:
        allWarnings,


      assumptions,


      trace: {
        steps: [
          ...trace.steps,
        ],
      },


      metadata:
        context.metadata ?? {},
    });



  } catch (error) {


    return createResult({

      status: "ERROR",

      valid: false,


      errors: [
        {
          code: "CALCULATION_FAILED",
          severity: "ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Calculation failed.",
        },
      ],


      warnings,


      assumptions,


      trace: {
        steps: [
          ...trace.steps,
        ],
      },


      metadata:
        context.metadata ?? {},
    });
  }
}