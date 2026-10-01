import { describe, expect, it } from "vitest";

import {
  validateBOM,
  validateBOMItems,
  validateBOMOutput,
} from "../validation/index.js";

import type {
  BOMInput,
  BOMItem,
} from "../types/index.js";

describe("BOM validation", () => {
  const validItem: BOMItem = {
    id: "pv-array-modules",
    category: "SOLAR_PANEL",
    description: "PV modules",
    specification: "550 W array",
    quantity: 20,
    unit: "pcs",
    quantityKind: "COUNT",
    source: {
      module: "pv-array",
      reference: "totalModules",
    },
  };

  it("accepts an empty BOM input", () => {
    const issues = validateBOM({});

    expect(issues).toHaveLength(0);
  });

  it("accepts a valid source calculation result", () => {
    const input: BOMInput = {
      pv: {
        status: "SUCCESS",
        valid: true,
        value: {
          totalModules: 20,
        },
        errors: [],
        warnings: [],
        assumptions: [],
        trace: {
          steps: [],
        },
        metadata: {},
      },
    };

    const issues = validateBOM(input);

    expect(issues).toHaveLength(0);
  });

  it("rejects a valid source result without a value", () => {
    const input: BOMInput = {
      pv: {
        status: "SUCCESS",
        valid: true,
        errors: [],
        warnings: [],
        assumptions: [],
        trace: {
          steps: [],
        },
        metadata: {},
      },
    };

    const issues = validateBOM(input);

    expect(
      issues.some(
        (item) =>
          item.code === "INVALID_BOM_ITEM",
      ),
    ).toBe(true);
  });

  it("accepts a valid BOM item", () => {
    const issues =
      validateBOMItems([validItem]);

    expect(issues).toHaveLength(0);
  });

  it("rejects a missing item identifier", () => {
    const item = {
      ...validItem,
      id: "",
    };

    const issues =
      validateBOMItems([item]);

    expect(
      issues.some(
        (issue) =>
          issue.code === "INVALID_BOM_ITEM" &&
          issue.path === "items[0].id",
      ),
    ).toBe(true);
  });

  it("rejects a missing category", () => {
    const item = {
      ...validItem,
      category: "" as BOMItem["category"],
    };

    const issues =
      validateBOMItems([item]);

    expect(
      issues.some(
        (issue) =>
          issue.code === "INVALID_BOM_ITEM" &&
          issue.path === "items[0].category",
      ),
    ).toBe(true);
  });

  it("rejects a missing description", () => {
    const item = {
      ...validItem,
      description: "",
    };

    const issues =
      validateBOMItems([item]);

    expect(
      issues.some(
        (issue) =>
          issue.code === "INVALID_BOM_ITEM" &&
          issue.path === "items[0].description",
      ),
    ).toBe(true);
  });

  it("rejects zero quantity", () => {
    const item = {
      ...validItem,
      quantity: 0,
    };

    const issues =
      validateBOMItems([item]);

    expect(
      issues.some(
        (issue) =>
          issue.code === "INVALID_BOM_QUANTITY",
      ),
    ).toBe(true);
  });

  it("rejects negative quantity", () => {
    const item = {
      ...validItem,
      quantity: -1,
    };

    const issues =
      validateBOMItems([item]);

    expect(
      issues.some(
        (issue) =>
          issue.code === "INVALID_BOM_QUANTITY",
      ),
    ).toBe(true);
  });

  it("rejects NaN quantity", () => {
    const item = {
      ...validItem,
      quantity: Number.NaN,
    };

    const issues =
      validateBOMItems([item]);

    expect(
      issues.some(
        (issue) =>
          issue.code === "INVALID_BOM_QUANTITY",
      ),
    ).toBe(true);
  });

  it("rejects infinite quantity", () => {
    const item = {
      ...validItem,
      quantity: Number.POSITIVE_INFINITY,
    };

    const issues =
      validateBOMItems([item]);

    expect(
      issues.some(
        (issue) =>
          issue.code === "INVALID_BOM_QUANTITY",
      ),
    ).toBe(true);
  });

  it("rejects a missing unit", () => {
    const item = {
      ...validItem,
      unit: "",
    };

    const issues =
      validateBOMItems([item]);

    expect(
      issues.some(
        (issue) =>
          issue.code === "INVALID_BOM_UNIT",
      ),
    ).toBe(true);
  });

  it("rejects a missing source module", () => {
    const item = {
      ...validItem,
      source: {
        ...validItem.source,
        module: "",
      },
    };

    const issues =
      validateBOMItems([item]);

    expect(
      issues.some(
        (issue) =>
          issue.code === "INVALID_BOM_ITEM" &&
          issue.path === "items[0].source",
      ),
    ).toBe(true);
  });

  it("rejects a missing source reference", () => {
    const item = {
      ...validItem,
      source: {
        ...validItem.source,
        reference: "",
      },
    };

    const issues =
      validateBOMItems([item]);

    expect(
      issues.some(
        (issue) =>
          issue.code === "INVALID_BOM_ITEM" &&
          issue.path === "items[0].source",
      ),
    ).toBe(true);
  });

  it("detects duplicate BOM identities", () => {
    const duplicate: BOMItem = {
      ...validItem,
      id: "another-id",
    };

    const issues =
      validateBOMItems([
        validItem,
        duplicate,
      ]);

    expect(
      issues.some(
        (issue) =>
          issue.code === "DUPLICATE_BOM_ITEM",
      ),
    ).toBe(true);
  });

  it("uses category, description, specification and unit for duplicate identity", () => {
    const differentSpecification: BOMItem = {
      ...validItem,
      id: "different-spec",
      specification: "600 W array",
    };

    const issues =
      validateBOMItems([
        validItem,
        differentSpecification,
      ]);

    expect(
      issues.some(
        (issue) =>
          issue.code === "DUPLICATE_BOM_ITEM",
      ),
    ).toBe(false);
  });

  it("collects multiple validation issues", () => {
    const invalid: BOMItem = {
      id: "",
      category: "" as BOMItem["category"],
      description: "",
      specification: "",
      quantity: 0,
      unit: "",
      quantityKind: "COUNT",
      source: {
        module: "",
        reference: "",
      },
    };

    const issues =
      validateBOMItems([invalid]);

    expect(issues.length).toBeGreaterThan(1);
  });

  it("does not mutate the input", () => {
    const input: BOMItem[] = [
      {
        ...validItem,
        source: {
          ...validItem.source,
        },
      },
    ];

    const before = structuredClone(input);

    validateBOMItems(input);

    expect(input).toEqual(before);
  });

  it("validateBOMOutput delegates to BOM item validation", () => {
    const invalid = {
      ...validItem,
      quantity: -10,
    };

    const issues =
      validateBOMOutput([invalid]);

    expect(
      issues.some(
        (issue) =>
          issue.code === "INVALID_BOM_QUANTITY",
      ),
    ).toBe(true);
  });
});