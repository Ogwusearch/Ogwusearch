import type {
  CalculationResult,
  EngineeringError,
  EngineeringIssue,
  EngineeringWarning,
} from "@ogwusearch/engineering-types";

import {
  calculateACBreaker,
  calculateDCFUse,
  calculateOvercurrentDevice,
  calculateStringFuse,
} from "./calculation/index.js";

import { createProtectionAssumptions } from "./assumptions/index.js";
import { createProtectionTrace } from "./trace/index.js";

import type {
  ProtectionInput,
  ProtectionOutput,
} from "./types/index.js";

import { validateProtection } from "./validation/index.js";

function toEngineeringErrors(
  issues: EngineeringIssue[],
): EngineeringError[] {
  return issues
    .filter((issue) => issue.severity === "ERROR")
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

function calculate(
  input: ProtectionInput,
): ProtectionOutput {
  switch (input.protection.type) {
    case "AC_BREAKER":
      return calculateACBreaker(input);

    case "DC_FUSE":
      return calculateDCFUse(input);

    case "OVERCURRENT_DEVICE":
      return calculateOvercurrentDevice(input);

    case "STRING_FUSE":
      return calculateStringFuse(input);
  }
}

function createModuleMetadata() {
  return {
    extras: {
      module:
        "@ogwusearch/solar-engine/protection",
    },
  };
}

/**
 * Thin protection-level lifecycle wrapper.
 *
 * Generic lifecycle orchestration belongs to engineering-core.
 * This function provides the Protection module's local calculation
 * pipeline and preserves deterministic behavior.
 */
export function runProtectionSizing(
  input: ProtectionInput,
): CalculationResult<ProtectionOutput> {
  const validationIssues = validateProtection(input);
  const errors = toEngineeringErrors(validationIssues);

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
      metadata: createModuleMetadata(),
    };
  }

  try {
    const output = calculate(input);

    const assumptions =
      createProtectionAssumptions(input);

    const traceSteps =
      createProtectionTrace(input, output);

    const compatibilityWarnings: EngineeringWarning[] =
      [];

    if (
      output.compatibility.currentCompatible === false
    ) {
      compatibilityWarnings.push({
        code:
          "PROTECTIVE_CURRENT_RATING_INSUFFICIENT",
        message:
          "Selected protective current rating is below the required protective rating.",
        severity: "WARNING",
        path: "device.currentRatingA",
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
      compatibilityWarnings.push({
        code:
          "PROTECTIVE_VOLTAGE_RATING_INSUFFICIENT",
        message:
          "Selected device voltage rating is below the required system voltage.",
        severity: "WARNING",
        path: "device.voltageRatingV",
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
      compatibilityWarnings.push({
        code: "INTERRUPTING_RATING_INSUFFICIENT",
        message:
          "Selected interrupting rating is below the required fault-current check.",
        severity: "WARNING",
        path: "device.interruptingRatingA",
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

    return {
      status:
        compatibilityWarnings.length > 0
          ? "WARNING"
          : "SUCCESS",
      valid: true,
      value: output,
      errors: [],
      warnings: compatibilityWarnings,
      assumptions,
      trace: {
        steps: traceSteps,
      },
      metadata: createModuleMetadata(),
    };
  } catch (error) {
    const calculationError: EngineeringError = {
      code: "PROTECTION_CALCULATION_ERROR",
      message:
        error instanceof Error
          ? error.message
          : "Protection calculation failed.",
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
      errors: [calculationError],
      warnings: [],
      assumptions: [],
      trace: {
        steps: [],
      },
      metadata: createModuleMetadata(),
    };
  }
}