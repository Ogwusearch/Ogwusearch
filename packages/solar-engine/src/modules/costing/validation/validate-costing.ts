import type {
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  CostingInput,
} from "../types/index.js";

function isFiniteNumber(
  value: unknown,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

function requiredString(
  value: unknown,
  path: string,
  code: string,
): EngineeringIssue[] {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    return [
      {
        code,
        severity: "ERROR",
        message: `${path} is required.`,
        path,
        actual: value,
      },
    ];
  }

  return [];
}

export function validateCostingInput(
  input: CostingInput,
): EngineeringIssue[] {
  const issues: EngineeringIssue[] = [];

  if (
    !Array.isArray(input.items) ||
    input.items.length === 0
  ) {
    issues.push({
      code: "COSTING_ITEMS_REQUIRED",
      severity: "ERROR",
      message: "At least one cost item is required.",
      path: "items",
      actual: input.items,
    });

    return issues;
  }

  issues.push(
    ...requiredString(
      input.currency,
      "currency",
      "INVALID_CURRENCY",
    ),
  );

  if (
    input.additionalCosts !== undefined &&
    (
      !isFiniteNumber(input.additionalCosts) ||
      input.additionalCosts < 0
    )
  ) {
    issues.push({
      code: "INVALID_ADDITIONAL_COSTS",
      severity: "ERROR",
      message:
        "Additional costs must be a finite non-negative number.",
      path: "additionalCosts",
      actual: input.additionalCosts,
    });
  }

  if (
    input.contingencyRate !== undefined &&
    (
      !isFiniteNumber(input.contingencyRate) ||
      input.contingencyRate < 0 ||
      input.contingencyRate > 1
    )
  ) {
    issues.push({
      code: "INVALID_CONTINGENCY_RATE",
      severity: "ERROR",
      message:
        "Contingency rate must be between 0 and 1.",
      path: "contingencyRate",
      actual: input.contingencyRate,
    });
  }

  for (
    let index = 0;
    index < input.items.length;
    index += 1
  ) {
    const item = input.items[index];
    const path = `items[${index}]`;

    if (item === undefined) {
      issues.push({
        code: "INVALID_COST_ITEM",
        severity: "ERROR",
        message: "Cost item is required.",
        path,
      });

      continue;
    }

    issues.push(
      ...requiredString(
        item.id,
        `${path}.id`,
        "COST_ITEM_ID_REQUIRED",
      ),
    );

    issues.push(
      ...requiredString(
        item.name,
        `${path}.name`,
        "COST_ITEM_NAME_REQUIRED",
      ),
    );

    issues.push(
      ...requiredString(
        item.category,
        `${path}.category`,
        "COST_ITEM_CATEGORY_REQUIRED",
      ),
    );

    if (
      !isFiniteNumber(item.quantity) ||
      item.quantity < 0
    ) {
      issues.push({
        code: "INVALID_COST_ITEM_QUANTITY",
        severity: "ERROR",
        message:
          "Cost item quantity must be a finite non-negative number.",
        path: `${path}.quantity`,
        actual: item.quantity,
      });
    }

    if (
      !isFiniteNumber(item.unitCost) ||
      item.unitCost < 0
    ) {
      issues.push({
        code: "INVALID_COST_ITEM_UNIT_COST",
        severity: "ERROR",
        message:
          "Cost item unit cost must be a finite non-negative number.",
        path: `${path}.unitCost`,
        actual: item.unitCost,
      });
    }

    if (
      item.unit !== undefined &&
      (
        typeof item.unit !== "string" ||
        item.unit.trim().length === 0
      )
    ) {
      issues.push({
        code: "INVALID_COST_ITEM_UNIT",
        severity: "ERROR",
        message:
          "Cost item unit must be a non-empty string when supplied.",
        path: `${path}.unit`,
        actual: item.unit,
      });
    }
  }

  return issues;
}
