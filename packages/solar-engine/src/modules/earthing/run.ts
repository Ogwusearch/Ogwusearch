import type {
  CalculationResult,
  EngineeringError,
  EngineeringIssue,
  EngineeringWarning,
} from "@ogwusearch/engineering-types";

import {
  calculateBondingConductorArea,
  calculateEarthConductorArea,
  calculateEarthResistance,
} from "./calculation/index.js";

import {
  createEarthingAssumptions,
} from "./assumptions/index.js";

import {
  createEarthingTrace,
} from "./trace/index.js";

import type {
  EarthingInput,
  EarthingOutput,
} from "./types/index.js";

import {
  validateEarthing,
} from "./validation/index.js";

function toEngineeringErrors(
  issues: EngineeringIssue[],
): EngineeringError[] {
  return issues
    .filter(
      (issue) =>
        issue.severity === "ERROR",
    )
    .map((issue) => ({
      code: issue.code,
      message: issue.message,
      severity: "ERROR" as const,

      ...(issue.path !== undefined && {
        path: issue.path,
      }),

      ...(issue.expected !== undefined && {
        expected: issue.expected,
      }),

      ...(issue.actual !== undefined && {
        actual: issue.actual,
      }),

      ...(issue.metadata !== undefined && {
        metadata: issue.metadata,
      }),
    }));
}

function createModuleMetadata() {
  return {
    extras: {
      module:
        "@ogwusearch/solar-engine/earthing",
    },
  };
}
function calculate(
  input: EarthingInput,
): EarthingOutput {
  const requiredEarthConductorAreaMm2 =
    calculateEarthConductorArea(input);

  const requiredBondingConductorAreaMm2 =
    calculateBondingConductorArea(
      requiredEarthConductorAreaMm2,
      input,
    );

  const earthResistanceOhm =
    calculateEarthResistance(input);

  const earthResistanceTargetOhm =
    input.design?.earthResistanceTargetOhm;

  const earthResistanceCompatible =
    earthResistanceOhm === undefined ||
    earthResistanceTargetOhm === undefined
      ? undefined
      : earthResistanceOhm <=
        earthResistanceTargetOhm;

  return {
    mode: input.mode,

    faultCurrentA:
      input.electrical.faultCurrentA,

    faultClearingTimeS:
      input.electrical.faultClearingTimeS,

    requiredEarthConductorAreaMm2,

    /**
     * No catalogue selection is performed by this
     * calculation layer. The calculated engineering
     * requirement is returned as the selected value.
     */
    selectedEarthConductorAreaMm2:
      requiredEarthConductorAreaMm2,

    requiredBondingConductorAreaMm2,

    /**
     * No catalogue selection is performed for the
     * bonding conductor at this layer.
     */
    selectedBondingConductorAreaMm2:
      requiredBondingConductorAreaMm2,

    ...(earthResistanceOhm !== undefined && {
      earthResistanceOhm,
    }),

    ...(earthResistanceTargetOhm !==
      undefined && {
      earthResistanceTargetOhm,
    }),

    compatibility: {
      ...(earthResistanceCompatible !==
        undefined && {
        earthResistanceCompatible,
      }),
    },
  };
}
/**
 * Thin earthing lifecycle wrapper.
 *
 * Generic lifecycle orchestration belongs to
 * engineering-core. This module owns only the
 * earthing-specific validation, calculation,
 * assumptions, trace, and warnings.
 */
export function runEarthingSizing(
  input: EarthingInput,
): CalculationResult<EarthingOutput> {
  const validationIssues =
    validateEarthing(input);

  const errors =
    toEngineeringErrors(
      validationIssues,
    );

  if (errors.length > 0) {
    return {
      status: "ERROR",
      valid: false,
      errors,
      warnings: [],
      assumptions: [],
      trace: {
        steps: [],
      },
      metadata:
        createModuleMetadata(),
    };
  }

  try {
    const output =
      calculate(input);

    const assumptions =
      createEarthingAssumptions(input);

    const traceSteps =
      createEarthingTrace(
        input,
        output,
      );

    const warnings:
      EngineeringWarning[] = [];

    if (
      output.compatibility
        .earthResistanceCompatible === false
    ) {
      warnings.push({
        code:
          "EARTH_RESISTANCE_TARGET_EXCEEDED",
        message:
          "Calculated earth resistance exceeds the supplied earth-resistance target.",
        severity: "WARNING",
        path:
          "design.earthResistanceTargetOhm",
        metadata: {
          extras: {
            calculated:
              output.earthResistanceOhm,
            target:
              output.earthResistanceTargetOhm,
          },
        },
      });
    }

    return {
      status:
        warnings.length > 0
          ? "WARNING"
          : "SUCCESS",

      valid: true,

      value: output,

      errors: [],

      warnings,

      assumptions,

      trace: {
        steps: traceSteps,
      },

      metadata:
        createModuleMetadata(),
    };
  } catch (error) {
    const calculationError:
      EngineeringError = {
        code:
          "EARTHING_CALCULATION_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Earthing calculation failed.",
        severity: "ERROR",
        metadata: {
          extras: {
            cause: error,
          },
        },
      };

    return {
      status: "ERROR",
      valid: false,
      errors: [
        calculationError,
      ],
      warnings: [],
      assumptions: [],
      trace: {
        steps: [],
      },
      metadata:
        createModuleMetadata(),
    };
  }
}