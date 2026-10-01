import {
  describe,
  expect,
  it,
} from "vitest";

import {
  runCosting,
} from "../run.js";

describe("Costing validation", () => {
  const validItem = {
    id: "item-1",
    name: "Equipment",
    category: "Equipment",
    quantity: 1,
    unitCost: 100_000,
  };

  it("rejects empty items", () => {
    const result = runCosting({
      currency: "NGN",
      items: [],
    });

    expect(result.valid).toBe(false);
    expect(result.status).toBe("ERROR");
    expect(
      result.errors.some(
        (error) =>
          error.code === "COSTING_ITEMS_REQUIRED",
      ),
    ).toBe(true);
  });

  it("rejects missing currency", () => {
    const result = runCosting({
      currency: "",
      items: [validItem],
    });

    expect(result.valid).toBe(false);
    expect(
      result.errors.some(
        (error) =>
          error.code === "INVALID_CURRENCY",
      ),
    ).toBe(true);
  });

  it("rejects negative quantity", () => {
    const result = runCosting({
      currency: "NGN",
      items: [
        {
          ...validItem,
          quantity: -1,
        },
      ],
    });

    expect(result.valid).toBe(false);
    expect(
      result.errors.some(
        (error) =>
          error.code ===
          "INVALID_COST_ITEM_QUANTITY",
      ),
    ).toBe(true);
  });

  it("rejects negative unit cost", () => {
    const result = runCosting({
      currency: "NGN",
      items: [
        {
          ...validItem,
          unitCost: -1,
        },
      ],
    });

    expect(result.valid).toBe(false);
    expect(
      result.errors.some(
        (error) =>
          error.code ===
          "INVALID_COST_ITEM_UNIT_COST",
      ),
    ).toBe(true);
  });

  it("rejects invalid contingency rates", () => {
    const result = runCosting({
      currency: "NGN",
      contingencyRate: 1.1,
      items: [validItem],
    });

    expect(result.valid).toBe(false);
    expect(
      result.errors.some(
        (error) =>
          error.code ===
          "INVALID_CONTINGENCY_RATE",
      ),
    ).toBe(true);
  });

  it("rejects negative additional costs", () => {
    const result = runCosting({
      currency: "NGN",
      additionalCosts: -100,
      items: [validItem],
    });

    expect(result.valid).toBe(false);
    expect(
      result.errors.some(
        (error) =>
          error.code ===
          "INVALID_ADDITIONAL_COSTS",
      ),
    ).toBe(true);
  });

  it("rejects missing item fields", () => {
    const result = runCosting({
      currency: "NGN",
      items: [
        {
          id: "",
          name: "",
          category: "",
          quantity: 1,
          unitCost: 100,
        },
      ],
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(3);
  });

  it("rejects non-finite values", () => {
    const result = runCosting({
      currency: "NGN",
      items: [
        {
          ...validItem,
          quantity: Number.NaN,
        },
      ],
    });

    expect(result.valid).toBe(false);
    expect(
      result.errors.some(
        (error) =>
          error.code ===
          "INVALID_COST_ITEM_QUANTITY",
      ),
    ).toBe(true);
  });
});
