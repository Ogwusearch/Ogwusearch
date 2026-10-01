import type {
  BOMItem,
} from "../types/index.js";

function identity(
  item: BOMItem,
): string {
  return [
    item.category,
    item.description,
    item.specification,
    item.unit,
    item.quantityKind,
  ].join("|");
}

export function aggregateBOMItems(
  items: ReadonlyArray<BOMItem>,
): BOMItem[] {
  const aggregated = new Map<string, BOMItem>();

  for (const item of items) {
    const key = identity(item);
    const existing = aggregated.get(key);

    if (existing === undefined) {
      aggregated.set(key, item);
      continue;
    }

    aggregated.set(
      key,
      {
        ...existing,
        quantity:
          existing.quantity +
          item.quantity,
      },
    );
  }

  return [...aggregated.values()];
}
