import type {
  CalculationTrace,
  EngineeringAssumption,
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type { BOMItem } from "./item.js";

export interface BOMCategorySummary {
  readonly category: string;
  readonly itemCount: number;
  readonly totalQuantity: number;
  readonly units: ReadonlyArray<string>;
}

export interface BOMOutput {
  readonly items: ReadonlyArray<BOMItem>;

  /**
   * Number of distinct BOM item entries.
   * This is not the sum of physical quantities.
   */
  readonly totalItemCount: number;

  readonly summaries: ReadonlyArray<BOMCategorySummary>;

  readonly assumptions: ReadonlyArray<EngineeringAssumption>;

  readonly issues: ReadonlyArray<EngineeringIssue>;

  readonly trace: CalculationTrace;
}