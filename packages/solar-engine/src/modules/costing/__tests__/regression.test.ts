import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculateItemCost,
  calculateSubtotal,
  calculateContingency,
  calculateTotalCost,
} from "../calculation/index.js";

describe("Costing regression", () => {
  it("preserves item cost formula", () => {
    expect(
      calculateItemCost({
        id: "pv",
        name: "PV",
        category: "PV",
        quantity: 10,
        unitCost: 250_000,
      }),
    ).toBe(2_500_000);
  });

  it("preserves subtotal formula", () => {
    expect(
      calculateSubtotal([
        {
          id: "a",
          name: "A",
          category: "A",
          quantity: 1,
          unitCost: 100,
          itemCost: 100,
        },
        {
          id: "b",
          name: "B",
          category: "B",
          quantity: 2,
          unitCost: 200,
          itemCost: 400,
        },
      ]),
    ).toBe(500);
  });

  it("preserves contingency formula", () => {
    expect(
      calculateContingency(1_000, 0.1),
    ).toBe(100);
  });

  it("preserves total cost formula", () => {
    expect(
      calculateTotalCost(
        1_000,
        200,
        100,
      ),
    ).toBe(1_300);
  });

  it("does not apply hidden costs", () => {
    expect(
      calculateTotalCost(
        1_000,
        0,
        0,
      ),
    ).toBe(1_000);
  });

  it("does not round monetary calculations prematurely", () => {
    expect(
      calculateItemCost({
        id: "precision",
        name: "Precision Item",
        category: "Test",
        quantity: 3,
        unitCost: 12.345678,
      }),
    ).toBe(37.037034);
  });
});
