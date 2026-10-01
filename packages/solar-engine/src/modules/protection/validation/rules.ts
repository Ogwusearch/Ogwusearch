import type { EngineeringIssue } from "@ogwusearch/engineering-types";

import type {
  ElectricalMode,
  ProtectionInput,
  ProtectionType,
} from "../types/index.js";

function issue(
  code: string,
  message: string,
  path: string,
  actual: unknown,
): EngineeringIssue {
  return {
    code,
    message,
    severity: "ERROR",
    path,
    metadata: {
      extras: {
        actual,
      },
    },
  };
}

function isProtectionType(
  value: string,
): value is ProtectionType {
  return (
    value === "AC_BREAKER" ||
    value === "DC_FUSE" ||
    value === "OVERCURRENT_DEVICE" ||
    value === "STRING_FUSE"
  );
}

function isElectricalMode(
  value: string,
): value is ElectricalMode {
  return value === "AC" || value === "DC";
}

export function validateProtectionRules(
  input: ProtectionInput,
): EngineeringIssue[] {
  const issues: EngineeringIssue[] = [];

  if (!isProtectionType(input.protection.type)) {
    issues.push(
      issue(
        "INVALID_PROTECTION_TYPE",
        "Protection type is invalid.",
        "protection.type",
        input.protection.type,
      ),
    );
  }

  if (!isElectricalMode(input.protection.mode)) {
    issues.push(
      issue(
        "INVALID_ELECTRICAL_MODE",
        "Electrical mode must be AC or DC.",
        "protection.mode",
        input.protection.mode,
      ),
    );
  }

  const { electrical } = input;

  if (
    !Number.isFinite(electrical.operatingCurrentA) ||
    electrical.operatingCurrentA <= 0
  ) {
    issues.push(
      issue(
        "INVALID_OPERATING_CURRENT",
        "Operating current must be a finite value greater than zero.",
        "electrical.operatingCurrentA",
        electrical.operatingCurrentA,
      ),
    );
  }

  if (
    !Number.isFinite(electrical.systemVoltageV) ||
    electrical.systemVoltageV <= 0
  ) {
    issues.push(
      issue(
        "INVALID_SYSTEM_VOLTAGE",
        "System voltage must be a finite value greater than zero.",
        "electrical.systemVoltageV",
        electrical.systemVoltageV,
      ),
    );
  }

  if (electrical.designCurrentA !== undefined) {
    if (
      !Number.isFinite(electrical.designCurrentA) ||
      electrical.designCurrentA <= 0
    ) {
      issues.push(
        issue(
          "INVALID_DESIGN_CURRENT",
          "Design current must be a finite value greater than zero.",
          "electrical.designCurrentA",
          electrical.designCurrentA,
        ),
      );
    }

    if (
      Number.isFinite(electrical.operatingCurrentA) &&
      electrical.designCurrentA <
        electrical.operatingCurrentA
    ) {
      issues.push(
        issue(
          "DESIGN_CURRENT_BELOW_OPERATING_CURRENT",
          "Design current must be greater than or equal to operating current.",
          "electrical.designCurrentA",
          electrical.designCurrentA,
        ),
      );
    }
  }

  if (electrical.shortCircuitCurrentA !== undefined) {
    if (
      !Number.isFinite(electrical.shortCircuitCurrentA) ||
      electrical.shortCircuitCurrentA <= 0
    ) {
      issues.push(
        issue(
          "INVALID_SHORT_CIRCUIT_CURRENT",
          "Short-circuit current must be a finite value greater than zero.",
          "electrical.shortCircuitCurrentA",
          electrical.shortCircuitCurrentA,
        ),
      );
    }
  }

  const margin = input.design?.designMargin;

  if (
    margin !== undefined &&
    (!Number.isFinite(margin) ||
      margin < 0 ||
      margin > 1)
  ) {
    issues.push(
      issue(
        "INVALID_DESIGN_MARGIN",
        "Design margin must be a finite ratio between 0 and 1.",
        "design.designMargin",
        margin,
      ),
    );
  }

  const factor =
    input.design?.explicitProtectionFactor;

  if (
    factor !== undefined &&
    (!Number.isFinite(factor) || factor <= 0)
  ) {
    issues.push(
      issue(
        "INVALID_PROTECTION_FACTOR",
        "Explicit protection factor must be a finite value greater than zero.",
        "design.explicitProtectionFactor",
        factor,
      ),
    );
  }

  const device = input.device;

  if (
    device?.currentRatingA !== undefined &&
    (!Number.isFinite(device.currentRatingA) ||
      device.currentRatingA <= 0)
  ) {
    issues.push(
      issue(
        "INVALID_DEVICE_CURRENT_RATING",
        "Device current rating must be a finite value greater than zero.",
        "device.currentRatingA",
        device.currentRatingA,
      ),
    );
  }

  if (
    device?.voltageRatingV !== undefined &&
    (!Number.isFinite(device.voltageRatingV) ||
      device.voltageRatingV <= 0)
  ) {
    issues.push(
      issue(
        "INVALID_DEVICE_VOLTAGE_RATING",
        "Device voltage rating must be a finite value greater than zero.",
        "device.voltageRatingV",
        device.voltageRatingV,
      ),
    );
  }

  if (
    device?.interruptingRatingA !== undefined &&
    (!Number.isFinite(device.interruptingRatingA) ||
      device.interruptingRatingA <= 0)
  ) {
    issues.push(
      issue(
        "INVALID_INTERRUPT_RATING",
        "Interrupting rating must be a finite value greater than zero.",
        "device.interruptingRatingA",
        device.interruptingRatingA,
      ),
    );
  }

  if (device?.availableCurrentRatingsA !== undefined) {
    for (const [
      index,
      rating,
    ] of device.availableCurrentRatingsA.entries()) {
      if (
        !Number.isFinite(rating) ||
        rating <= 0
      ) {
        issues.push(
          issue(
            "INVALID_AVAILABLE_DEVICE_RATING",
            "Available device ratings must contain finite values greater than zero.",
            `device.availableCurrentRatingsA[${index}]`,
            rating,
          ),
        );
      }
    }
  }

  if (
    input.protection.type === "STRING_FUSE" &&
    input.protection.mode !== "DC"
  ) {
    issues.push(
      issue(
        "STRING_FUSE_REQUIRES_DC",
        "String-fuse protection must use DC electrical mode.",
        "protection.mode",
        input.protection.mode,
      ),
    );
  }

  if (
    input.protection.type === "AC_BREAKER" &&
    input.protection.mode !== "AC"
  ) {
    issues.push(
      issue(
        "AC_BREAKER_REQUIRES_AC",
        "AC breaker protection must use AC electrical mode.",
        "protection.mode",
        input.protection.mode,
      ),
    );
  }

  if (
    input.protection.type === "DC_FUSE" &&
    input.protection.mode !== "DC"
  ) {
    issues.push(
      issue(
        "DC_FUSE_REQUIRES_DC",
        "DC fuse protection must use DC electrical mode.",
        "protection.mode",
        input.protection.mode,
      ),
    );
  }

  if (
    input.protection.type === "STRING_FUSE" &&
    electrical.shortCircuitCurrentA === undefined
  ) {
    issues.push(
      issue(
        "STRING_FUSE_REQUIRES_SHORT_CIRCUIT_CURRENT",
        "String-fuse calculation requires short-circuit current.",
        "electrical.shortCircuitCurrentA",
        electrical.shortCircuitCurrentA,
      ),
    );
  }

  if (
    device?.interruptingRatingA !== undefined &&
    electrical.shortCircuitCurrentA === undefined
  ) {
    issues.push(
      issue(
        "INTERRUPTING_CHECK_REQUIRES_FAULT_CURRENT",
        "An interrupting-rating check requires short-circuit current.",
        "electrical.shortCircuitCurrentA",
        electrical.shortCircuitCurrentA,
      ),
    );
  }

  return issues;
}