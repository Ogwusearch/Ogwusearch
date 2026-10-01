import type {
  CostItem,
} from "../types/index.js";

export function calculateItemCost(
  item: CostItem,
): number {
  return item.quantity * item.unitCost;
}
