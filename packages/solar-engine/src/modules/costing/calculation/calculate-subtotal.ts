import type {
  CostedItem,
} from "../types/index.js";

export function calculateSubtotal(
  items: readonly CostedItem[],
): number {
  return items.reduce(
    (subtotal, item) => subtotal + item.itemCost,
    0,
  );
}

export function calculateCategorySubtotals(
  items: readonly CostedItem[],
): Record<string, number> {
  const subtotals: Record<string, number> = {};

  for (const item of items) {
    subtotals[item.category] =
      (subtotals[item.category] ?? 0) + item.itemCost;
  }

  return subtotals;
}
