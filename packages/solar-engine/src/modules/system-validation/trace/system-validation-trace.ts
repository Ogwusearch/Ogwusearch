import type {
  CalculationTrace,
  CalculationTraceStep,
} from "@ogwusearch/engineering-types";

import type {
  SystemValidationOutput,
} from "../types/index.js";

export function createSystemValidationTrace(
  output: SystemValidationOutput,
): CalculationTrace {
  const steps: CalculationTraceStep[] = [];

  steps.push({
    id: "system-validation-evaluate-checks",
    name: "Evaluate system validation checks",
    description:
      "Evaluate system-level relationships using authoritative upstream calculation results.",
    outputs: {
      checkCount: output.checks.length,
      failedCheckCount: output.failedCheckCount,
      warningCheckCount: output.warningCheckCount,
    },
    sequence: 1,
  });

  let sequence = 2;

  for (const check of output.checks) {
    steps.push({
      id: `system-validation-check-${sequence - 1}`,
      name: check.name,
      description: check.message,
      inputs: {
        actual: check.actual,
        expected: check.expected,
      },
      outputs: {
        result: check.status,
      },
      sequence,
    });

    sequence += 1;
  }

  return {
    steps,
  };
}