import {
  defineCalculation,
  executeCalculation,
} from "@ogwusearch/engineering-core";

import type {
  CalculationResult,
  EngineeringError,
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  CableInput,
  CableOutput,
} from "./types/index.js";

import {
  validateCable,
} from "./validation/index.js";

import {
  createCableAssumptions,
} from "./assumptions/index.js";

import {
  calculateCurrent,
  calculateCableSize,
} from "./calculation/index.js";

import {
  createCableTrace,
} from "./trace/index.js";

import {
  CABLE_CONSTANTS,
} from "./constants.js";

function toEngineeringError(
  issue: EngineeringIssue,
): EngineeringError {
  return {
    ...issue,
    severity: "ERROR",
  };
}

export function runCableSizing(
  input: CableInput,
): CalculationResult<CableOutput> {
  const definition =
    defineCalculation<
      CableInput,
      CableOutput
    >({
      name: "Cable Sizing",

      validate(
        value,
      ): EngineeringIssue[] {
        return validateCable(value).map(
          toEngineeringError,
        );
      },

      assumptions: (
        value,
      ) =>
        createCableAssumptions(
          value,
        ),

      calculate: (
        value,
        context,
      ): CableOutput => {
        const current =
          calculateCurrent(
            value,
          );

        const sizing =
          calculateCableSize(
            value,
            current.operatingCurrentA,
          );

        const output: CableOutput = {
          mode: value.mode,

          operatingCurrentA:
            current.operatingCurrentA,

          designCurrentA:
            sizing.designCurrentA,

          requiredAmpacityA:
            sizing.requiredAmpacityA,

          selectedConductorAreaMm2:
            sizing.selectedConductorAreaMm2,

          selectedConductorAmpacityA:
            sizing.selectedConductorAmpacityA,

          conductorMaterial:
            value.conductorMaterial,

          conductorCount:
            value.conductorCount,

          ...(value.cableLengthM !==
            undefined && {
            cableLengthM:
              value.cableLengthM,
          }),

          ...(value.resistivityOhmMm2PerM !==
            undefined && {
            resistivityOhmMm2PerM:
              value.resistivityOhmMm2PerM,
          }),

          ...(value.powerFactor !==
            undefined && {
            powerFactor:
              value.powerFactor,
          }),

          ...(value.systemVoltageV !==
            undefined && {
            systemVoltageV:
              value.systemVoltageV,
          }),

          ...(value.loadPowerW !==
            undefined && {
            loadPowerW:
              value.loadPowerW,
          }),
        };

        const trace =
          createCableTrace(
            value,
            output,
          );

        for (
          const step of trace
        ) {
          context.trace.add(step);
        }

        return output;
      },
    });

  return executeCalculation(
    definition,
    input,
    {
      metadata: {
        module:
          "@ogwusearch/solar-engine",
        version:
          CABLE_CONSTANTS.CALCULATION_VERSION,
        name: "Cable Sizing",
        extras: {
          engine: "cable-sizing",
          unitSystem: "SI",
        },
      },
    },
  );
}