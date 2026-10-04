import {
  defineCalculation,
  executeCalculation,
} from "@ogwusearch/engineering-core";

import type {
  CalculationExecutionContext,
} from "@ogwusearch/engineering-core";

import type {
  CalculationResult,
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

function calculate(
  input: EarthingInput,
  context: CalculationExecutionContext,
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

  const output: EarthingOutput = {
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

    ...(earthResistanceTargetOhm !== undefined && {
      earthResistanceTargetOhm,
    }),

    compatibility: {
      ...(earthResistanceCompatible !== undefined && {
        earthResistanceCompatible,
      }),
    },
  };

  /*
   * Preserve the existing Earthing trace exactly.
   *
   * createEarthingTrace() already contains the complete
   * four-step Earthing trace. The generic execution context
   * owns the trace collection.
   */
  for (const step of createEarthingTrace(input, output)) {
    context.trace.add(step);
  }

  return output;
}

function createEarthingWarnings(
  _input: EarthingInput,
  output: EarthingOutput,
): EngineeringWarning[] {
  if (
    output.compatibility.earthResistanceCompatible !== false
  ) {
    return [];
  }

  return [
    {
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
    },
  ];
}

const earthingCalculation =
  defineCalculation<
    EarthingInput,
    EarthingOutput
  >({
    name: "earthing-sizing",

    validate(input) {
      return validateEarthing(input);
    },

    assumptions(input) {
      return createEarthingAssumptions(input);
    },

    calculate,

    warnings:
      createEarthingWarnings,
  });

/**
 * Executes the Earthing sizing calculation through
 * the canonical engineering-core lifecycle.
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
export function runEarthingSizing(
  input: EarthingInput,
): CalculationResult<EarthingOutput> {
  return executeCalculation(
    earthingCalculation,
    input,
    {
      metadata: {
        extras: {
          module:
            "@ogwusearch/solar-engine/earthing",
        },
      },
    },
  );
}