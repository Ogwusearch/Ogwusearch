import type { EngineeringIssue } from "@ogwusearch/engineering-types";

import type {
  PeakDemandInput,
  PeakDemandLoadInput,
} from "../types/index.js";

import { invalid } from "./rules.js";

function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isFiniteNumber(
  value: unknown,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

function validateLoad(
  load: unknown,
  index: number,
): EngineeringIssue[] {
  const issues: EngineeringIssue[] = [];
  const path = `loads[${index}]`;

  if (!isObject(load)) {
    return [
      invalid(
        "INVALID_LOAD",
        "Load must be an object.",
        path,
        load,
      ),
    ];
  }

  if (
    typeof load.loadId !== "string" ||
    load.loadId.trim().length === 0
  ) {
    issues.push(
      invalid(
        "INVALID_LOAD_ID",
        "Load ID must be a non-empty string.",
        `${path}.loadId`,
        load.loadId,
      ),
    );
  }

  if (!isFiniteNumber(load.runningPowerW)) {
    issues.push(
      invalid(
        "INVALID_RUNNING_POWER",
        "Running power must be a finite number.",
        `${path}.runningPowerW`,
        load.runningPowerW,
      ),
    );
  } else if (load.runningPowerW <= 0) {
    issues.push(
      invalid(
        "INVALID_RUNNING_POWER",
        "Running power must be greater than zero.",
        `${path}.runningPowerW`,
        load.runningPowerW,
      ),
    );
  }

  if (load.demandFactor !== undefined) {
    if (!isFiniteNumber(load.demandFactor)) {
      issues.push(
        invalid(
          "INVALID_DEMAND_FACTOR",
          "Demand factor must be a finite number.",
          `${path}.demandFactor`,
          load.demandFactor,
        ),
      );
    } else if (
      load.demandFactor <= 0 ||
      load.demandFactor > 1
    ) {
      issues.push(
        invalid(
          "INVALID_DEMAND_FACTOR",
          "Demand factor must be greater than 0 and less than or equal to 1.",
          `${path}.demandFactor`,
          load.demandFactor,
        ),
      );
    }
  }

  if (load.startingPowerW !== undefined) {
    if (!isFiniteNumber(load.startingPowerW)) {
      issues.push(
        invalid(
          "INVALID_STARTING_POWER",
          "Starting power must be a finite number.",
          `${path}.startingPowerW`,
          load.startingPowerW,
        ),
      );
    } else if (
      isFiniteNumber(load.runningPowerW) &&
      load.startingPowerW < load.runningPowerW
    ) {
      issues.push(
        invalid(
          "INVALID_STARTING_POWER",
          "Starting power must be greater than or equal to running power.",
          `${path}.startingPowerW`,
          load.startingPowerW,
        ),
      );
    }
  }

  if (load.surgeFactor !== undefined) {
    if (!isFiniteNumber(load.surgeFactor)) {
      issues.push(
        invalid(
          "INVALID_SURGE_FACTOR",
          "Surge factor must be a finite number.",
          `${path}.surgeFactor`,
          load.surgeFactor,
        ),
      );
    } else if (load.surgeFactor < 1) {
      issues.push(
        invalid(
          "INVALID_SURGE_FACTOR",
          "Surge factor must be greater than or equal to 1.",
          `${path}.surgeFactor`,
          load.surgeFactor,
        ),
      );
    }
  }

  if (load.powerFactor !== undefined) {
    if (!isFiniteNumber(load.powerFactor)) {
      issues.push(
        invalid(
          "INVALID_POWER_FACTOR",
          "Power factor must be a finite number.",
          `${path}.powerFactor`,
          load.powerFactor,
        ),
      );
    } else if (
      load.powerFactor <= 0 ||
      load.powerFactor > 1
    ) {
      issues.push(
        invalid(
          "INVALID_POWER_FACTOR",
          "Power factor must be greater than 0 and less than or equal to 1.",
          `${path}.powerFactor`,
          load.powerFactor,
        ),
      );
    }
  }

  return issues;
}

export function validatePeakDemandInput(
  input: PeakDemandInput,
): EngineeringIssue[] {
  const issues: EngineeringIssue[] = [];

  if (!isObject(input)) {
    return [
      invalid(
        "INVALID_INPUT",
        "Peak demand input must be a non-null object.",
        "input",
        input,
      ),
    ];
  }

  if (!Array.isArray(input.loads)) {
    return [
      invalid(
        "INVALID_LOADS",
        "Loads must be an array.",
        "loads",
        input.loads,
      ),
    ];
  }

  if (input.loads.length === 0) {
    issues.push(
      invalid(
        "EMPTY_LOADS",
        "At least one electrical load is required.",
        "loads",
      ),
    );
  }

  const seenIds = new Set<string>();

  input.loads.forEach((load, index) => {
    issues.push(
      ...validateLoad(load, index),
    );

    if (
      isObject(load) &&
      typeof load.loadId === "string" &&
      load.loadId.trim().length > 0
    ) {
      if (seenIds.has(load.loadId)) {
        issues.push(
          invalid(
            "DUPLICATE_LOAD_ID",
            "Load IDs must be unique.",
            `loads[${index}].loadId`,
            load.loadId,
          ),
        );
      }

      seenIds.add(load.loadId);
    }
  });

  if (input.diversityFactor !== undefined) {
    if (!Number.isFinite(input.diversityFactor)) {
      issues.push(
        invalid(
          "INVALID_DIVERSITY_FACTOR",
          "Diversity factor must be a finite number.",
          "diversityFactor",
          input.diversityFactor,
        ),
      );
    } else if (input.diversityFactor < 1) {
      issues.push(
        invalid(
          "INVALID_DIVERSITY_FACTOR",
          "Diversity factor must be greater than or equal to 1.",
          "diversityFactor",
          input.diversityFactor,
        ),
      );
    }
  }

  if (input.demandMargin !== undefined) {
    if (!Number.isFinite(input.demandMargin)) {
      issues.push(
        invalid(
          "INVALID_DEMAND_MARGIN",
          "Demand margin must be a finite number.",
          "demandMargin",
          input.demandMargin,
        ),
      );
    } else if (
      input.demandMargin < 0 ||
      input.demandMargin > 1
    ) {
      issues.push(
        invalid(
          "INVALID_DEMAND_MARGIN",
          "Demand margin must be between 0 and 1.",
          "demandMargin",
          input.demandMargin,
        ),
      );
    }
  }

  return issues;
}

export function isPeakDemandInput(
  input: unknown,
): input is PeakDemandInput {
  if (!isObject(input)) {
    return false;
  }

  if (!Array.isArray(input.loads)) {
    return false;
  }

  return input.loads.every(
    (load): load is PeakDemandLoadInput =>
      isObject(load) &&
      typeof load.loadId === "string" &&
      Number.isFinite(load.runningPowerW),
  );
}
