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
  calculateACBreaker,
  calculateDCFUse,
  calculateOvercurrentDevice,
  calculateStringFuse,
} from "./calculation/index.js";

import {
  createProtectionAssumptions,
} from "./assumptions/index.js";

import {
  createProtectionTrace,
} from "./trace/index.js";

import type {
  ProtectionInput,
  ProtectionOutput,
} from "./types/index.js";

import {
  validateProtection,
} from "./validation/index.js";

/**
 * Executes the Protection-specific calculation.
 *
 * Protection owns the selection of the calculation
 * strategy. Generic lifecycle orchestration belongs
 * to engineering-core.
 */
function calculate(
  input: ProtectionInput,
  context: CalculationExecutionContext,
): ProtectionOutput {
  let output: ProtectionOutput;

  switch (input.protection.type) {
    case "AC_BREAKER":
      output = calculateACBreaker(input);
      break;

    case "DC_FUSE":
      output = calculateDCFUse(input);
      break;

    case "OVERCURRENT_DEVICE":
      output = calculateOvercurrentDevice(input);
      break;

    case "STRING_FUSE":
      output = calculateStringFuse(input);
      break;
  }

  /*
   * Preserve the existing Protection trace.
   *
   * createProtectionTrace() owns the Protection-specific
   * trace steps. engineering-core owns the trace lifecycle.
   */
  for (const step of createProtectionTrace(input, output)) {
    context.trace.add(step);
  }

  return output;
}

/**
 * Creates Protection-specific compatibility warnings.
 *
 * These conditions do not invalidate the calculation.
 * They remain warnings exactly as they were in the
 * previous Protection lifecycle implementation.
 */
function createProtectionWarnings(
  _input: ProtectionInput,
  output: ProtectionOutput,
): EngineeringWarning[] {
  const warnings: EngineeringWarning[] = [];

  if (
    output.compatibility.currentCompatible === false
  ) {
    warnings.push({
      code:
        "PROTECTIVE_CURRENT_RATING_INSUFFICIENT",

      message:
        "Selected protective current rating is below the required protective rating.",

      severity: "WARNING",

      path:
        "device.currentRatingA",

      metadata: {
        extras: {
          required:
            output.requiredProtectiveCurrentA,

          selected:
            output.selectedProtectiveCurrentA,
        },
      },
    });
  }

  if (
    output.compatibility.voltageCompatible === false
  ) {
    warnings.push({
      code:
        "PROTECTIVE_VOLTAGE_RATING_INSUFFICIENT",

      message:
        "Selected device voltage rating is below the required system voltage.",

      severity: "WARNING",

      path:
        "device.voltageRatingV",

      metadata: {
        extras: {
          required:
            output.requiredVoltageRatingV,

          selected:
            output.selectedDeviceVoltageRatingV,
        },
      },
    });
  }

  if (
    output.compatibility
      .interruptingCompatible === false
  ) {
    warnings.push({
      code:
        "INTERRUPTING_RATING_INSUFFICIENT",

      message:
        "Selected interrupting rating is below the required fault-current check.",

      severity: "WARNING",

      path:
        "device.interruptingRatingA",

      metadata: {
        extras: {
          required:
            output.interruptingRatingRequirementA,

          selected:
            output.selectedDeviceInterruptingRatingA,
        },
      },
    });
  }

  return warnings;
}

const protectionCalculation =
  defineCalculation<
    ProtectionInput,
    ProtectionOutput
  >({
    name: "protection-sizing",

    validate(input) {
      return validateProtection(input);
    },

    assumptions(input) {
      return createProtectionAssumptions(input);
    },

    calculate,

    warnings:
      createProtectionWarnings,
  });

/**
 * Executes Protection sizing through the canonical
 * engineering-core calculation lifecycle.
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
export function runProtectionSizing(
  input: ProtectionInput,
): CalculationResult<ProtectionOutput> {
  return executeCalculation(
    protectionCalculation,
    input,
    {
      metadata: {
        extras: {
          module:
            "@ogwusearch/solar-engine/protection",
        },
      },
    },
  );
}