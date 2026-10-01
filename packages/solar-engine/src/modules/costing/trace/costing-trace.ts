import type {
  CalculationTrace,
} from "@ogwusearch/engineering-types";

import type {
  CostingInput,
  CostingOutput,
} from "../types/index.js";

/**
 * Returns a deterministic snapshot of the costing trace data.
 *
 * Runtime execution records the authoritative trace through
 * CalculationExecutionContext.trace.
 *
 * This helper is intentionally kept lightweight so it does not
 * duplicate calculation logic.
 */
export function createCostingTrace(
  input: CostingInput,
  output: CostingOutput,
): CalculationTrace {
  return {
    steps: [
      {
        id: "costing-summary",
        name: "Costing Summary",
        description:
          "Summary of the calculated costing result.",
        inputs: {
          itemCount: input.items.length,
          currency: input.currency,
        },
        outputs: {
          subtotal: output.subtotal,
          additionalCosts: output.additionalCosts,
          contingency: output.contingency,
          totalCost: output.totalCost,
        },
        unit: input.currency,
        sequence: 1,
      },
    ],
  };
}
