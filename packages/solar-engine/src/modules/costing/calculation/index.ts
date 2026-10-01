import type {
  CalculationExecutionContext,
} from "@ogwusearch/engineering-core";

import type {
  CostedItem,
  CostingInput,
  CostingOutput,
} from "../types/index.js";

import {
  calculateItemCost,
} from "./calculate-item-cost.js";

import {
  calculateSubtotal,
  calculateCategorySubtotals,
} from "./calculate-subtotal.js";

import {
  calculateContingency,
} from "./calculate-contingency.js";

import {
  calculateTotalCost,
} from "./calculate-total-cost.js";

export {
  calculateItemCost,
} from "./calculate-item-cost.js";

export {
  calculateSubtotal,
  calculateCategorySubtotals,
} from "./calculate-subtotal.js";

export {
  calculateContingency,
} from "./calculate-contingency.js";

export {
  calculateTotalCost,
} from "./calculate-total-cost.js";

export function calculateCosting(
  input: CostingInput,
  context: CalculationExecutionContext,
): CostingOutput {
  const items: CostedItem[] = input.items.map((item) => {
    const itemCost = calculateItemCost(item);

    context.trace.add({
      id: `cost-item-${item.id}`,
      name: "Item Cost",
      description:
        "Calculate extended cost from quantity and unit cost.",
      formula: "itemCost = quantity × unitCost",
      inputs: {
        itemId: item.id,
        quantity: item.quantity,
        unitCost: item.unitCost,
      },
      outputs: {
        itemCost,
      },
      unit: input.currency,
    });

    return {
      ...item,
      itemCost,
    };
  });

  const categorySubtotals =
    calculateCategorySubtotals(items);

  for (const [category, value] of Object.entries(
    categorySubtotals,
  )) {
    context.trace.add({
      id: `category-subtotal-${category}`,
      name: "Category Subtotal",
      description:
        "Aggregate extended item costs by category.",
      formula: "categorySubtotal = Σ itemCost",
      inputs: {
        category,
      },
      outputs: {
        categorySubtotal: value,
      },
      unit: input.currency,
    });
  }

  const subtotal = calculateSubtotal(items);

  context.trace.add({
    id: "cost-subtotal",
    name: "Subtotal",
    description:
      "Aggregate all extended item costs.",
    formula: "subtotal = Σ itemCost",
    inputs: {
      itemCount: items.length,
    },
    outputs: {
      subtotal,
    },
    unit: input.currency,
  });

  const additionalCosts =
    input.additionalCosts ?? 0;

  if (additionalCosts !== 0) {
    context.trace.add({
      id: "cost-additional-costs",
      name: "Additional Costs",
      description:
        "Include explicitly supplied additional costs.",
      inputs: {
        additionalCosts,
      },
      outputs: {
        additionalCosts,
      },
      unit: input.currency,
    });
  }

  const contingency =
    calculateContingency(
      subtotal,
      input.contingencyRate ?? 0,
    );

  if (contingency !== 0) {
    context.trace.add({
      id: "cost-contingency",
      name: "Contingency",
      description:
        "Calculate explicitly supplied contingency.",
      formula:
        "contingency = subtotal × contingencyRate",
      inputs: {
        subtotal,
        contingencyRate:
          input.contingencyRate ?? 0,
      },
      outputs: {
        contingency,
      },
      unit: input.currency,
    });
  }

  const totalCost = calculateTotalCost(
    subtotal,
    additionalCosts,
    contingency,
  );

  context.trace.add({
    id: "cost-total",
    name: "Total Cost",
    description:
      "Calculate total system cost.",
    formula:
      "totalCost = subtotal + additionalCosts + contingency",
    inputs: {
      subtotal,
      additionalCosts,
      contingency,
    },
    outputs: {
      totalCost,
    },
    unit: input.currency,
  });

  return {
    items,
    categorySubtotals,
    subtotal,
    additionalCosts,
    contingency,
    totalCost,
    currency: input.currency,
  };
}
