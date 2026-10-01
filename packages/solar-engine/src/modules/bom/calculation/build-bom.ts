import type {
  CalculationTrace,
  EngineeringAssumption,
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  BOMInput,
  BOMOutput,
} from "../types/index.js";

import {
  aggregateBOMItems,
} from "./aggregate-quantities.js";

import {
  collectBOMItems,
} from "./collect-items.js";

import {
  createBOMTrace,
} from "../trace/index.js";

import {
  validateBOMItems,
} from "../validation/index.js";

export function buildBOM(
  input: BOMInput,
  assumptions: ReadonlyArray<EngineeringAssumption> = [],
): BOMOutput {
  const collected =
    collectBOMItems(input);

  const items =
    aggregateBOMItems(collected);

  const issues: EngineeringIssue[] =
    validateBOMItems(items);

  const summaries =
    new Map<
      string,
      {
        itemCount: number;
        totalQuantity: number;
        units: Set<string>;
      }
    >();

  for (const item of items) {
    const existing =
      summaries.get(item.category);

    if (existing === undefined) {
      summaries.set(
        item.category,
        {
          itemCount: 1,
          totalQuantity: item.quantity,
          units: new Set([item.unit]),
        },
      );
      continue;
    }

    existing.itemCount += 1;
    existing.totalQuantity += item.quantity;
    existing.units.add(item.unit);
  }

  const categorySummaries =
    [...summaries.entries()]
      .sort(([a], [b]) =>
        a.localeCompare(b),
      )
      .map(
        ([
          category,
          summary,
        ]) => ({
          category,
          itemCount:
            summary.itemCount,
          totalQuantity:
            summary.totalQuantity,
          units:
            [...summary.units].sort(),
        }),
      );

  const trace: CalculationTrace =
    createBOMTrace(
      input,
      items,
    );

  return {
    items,
    totalItemCount: items.length,
    summaries: categorySummaries,
    assumptions: [...assumptions],
    issues,
    trace,
  };
}
