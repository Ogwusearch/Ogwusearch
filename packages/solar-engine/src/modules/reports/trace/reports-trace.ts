import type {
  CalculationTrace,
  CalculationTraceStep,
} from "@ogwusearch/engineering-types";

import type {
  ReportsOutput,
} from "../types/index.js";

export function createReportsTrace(
  output: ReportsOutput,
): CalculationTrace {
  const steps: CalculationTraceStep[] = [
    {
      id: "reports-collect-results",
      name: "Collect calculation results",
      description:
        "Collect authoritative upstream calculation results without modifying their engineering values.",
      outputs: {
        resultCount: output.results.length,
      },
      sequence: 1,
    },
    {
      id: "reports-build-sections",
      name: "Build report sections",
      description:
        "Organize authoritative calculation results into deterministic report sections.",
      outputs: {
        sectionCount: output.sections.length,
      },
      sequence: 2,
    },
    {
      id: "reports-aggregate-issues",
      name: "Aggregate report issues",
      description:
        "Preserve errors and warnings exposed by the authoritative source calculations.",
      outputs: {
        errorCount: output.errors.length,
        warningCount: output.warnings.length,
      },
      sequence: 3,
    },
  ];

  return {
    steps,
  };
}
