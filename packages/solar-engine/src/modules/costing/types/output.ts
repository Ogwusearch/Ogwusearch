import type { CostItem } from "./input.js";

export interface CostedItem extends CostItem {
  readonly itemCost: number;
}

export interface CostingOutput {
  readonly items: CostedItem[];
  readonly categorySubtotals: Record<string, number>;
  readonly subtotal: number;
  readonly additionalCosts: number;
  readonly contingency: number;
  readonly totalCost: number;
  readonly currency: string;
}
