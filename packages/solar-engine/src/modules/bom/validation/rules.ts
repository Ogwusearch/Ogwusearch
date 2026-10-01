import type {
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  BOMInput,
  BOMItem,
} from "../types/index.js";

function issue(
  code: string,
  message: string,
  path: string,
  actual?: unknown,
): EngineeringIssue {
  return {
    code,
    severity: "ERROR",
    message,
    path,
    ...(actual !== undefined && {
      metadata: {
        extras: {
          actual,
        },
      },
    }),
  };
}

function validateItem(
  item: BOMItem,
  index: number,
): EngineeringIssue[] {
  const issues: EngineeringIssue[] = [];
  const path = `items[${index}]`;

  if (
    typeof item.id !== "string" ||
    item.id.trim().length === 0
  ) {
    issues.push(
      issue(
        "INVALID_BOM_ITEM",
        "BOM item identifier is required.",
        `${path}.id`,
        item.id,
      ),
    );
  }

  if (
    typeof item.category !== "string" ||
    item.category.trim().length === 0
  ) {
    issues.push(
      issue(
        "INVALID_BOM_ITEM",
        "BOM item category is required.",
        `${path}.category`,
        item.category,
      ),
    );
  }

  if (
    typeof item.description !== "string" ||
    item.description.trim().length === 0
  ) {
    issues.push(
      issue(
        "INVALID_BOM_ITEM",
        "BOM item description is required.",
        `${path}.description`,
        item.description,
      ),
    );
  }

  if (
    !Number.isFinite(item.quantity) ||
    item.quantity <= 0
  ) {
    issues.push(
      issue(
        "INVALID_BOM_QUANTITY",
        "BOM quantity must be a finite value greater than zero.",
        `${path}.quantity`,
        item.quantity,
      ),
    );
  }

  if (
    typeof item.unit !== "string" ||
    item.unit.trim().length === 0
  ) {
    issues.push(
      issue(
        "INVALID_BOM_UNIT",
        "BOM item unit is required.",
        `${path}.unit`,
        item.unit,
      ),
    );
  }

  if (
    typeof item.source.module !== "string" ||
    item.source.module.trim().length === 0 ||
    typeof item.source.reference !== "string" ||
    item.source.reference.trim().length === 0
  ) {
    issues.push(
      issue(
        "INVALID_BOM_ITEM",
        "BOM item source module and reference are required.",
        `${path}.source`,
        item.source,
      ),
    );
  }

  return issues;
}

export function validateBOMItems(
  items: ReadonlyArray<BOMItem>,
): EngineeringIssue[] {
  const issues: EngineeringIssue[] = [];
  const identities = new Set<string>();

  items.forEach((item, index) => {
    issues.push(
      ...validateItem(item, index),
    );

    const identity = [
      item.category,
      item.description,
      item.specification,
      item.unit,
    ].join("|");

    if (identities.has(identity)) {
      issues.push(
        issue(
          "DUPLICATE_BOM_ITEM",
          "Equivalent BOM item identity appears more than once.",
          `items[${index}]`,
          identity,
        ),
      );
    }

    identities.add(identity);
  });

  return issues;
}

export function validateBOM(
  input: BOMInput,
): EngineeringIssue[] {
  /*
   * BOM inputs are optional by contract. The module validates
   * supplied source results and the generated BOM itself.
   */
  const issues: EngineeringIssue[] = [];

  const results = [
    input.pv,
    input.battery,
    input.inverter,
    input.chargeController,
    input.cable,
    input.protection,
    input.earthing,
    ...(input.additionalResults ?? []),
  ];

  for (const result of results) {
    if (
      result !== undefined &&
      result.valid &&
      result.value === undefined
    ) {
      issues.push(
        issue(
          "INVALID_BOM_ITEM",
          "A valid source calculation must expose a calculation value.",
          "sourceResult.value",
          result,
        ),
      );
    }
  }

  return issues;
}
