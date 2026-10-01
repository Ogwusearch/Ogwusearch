import {
  describe,
  expect,
  it,
} from "vitest";

import {
  runCosting,
} from "../run.js";

describe("Costing calculation", () => {
  it("calculates a single item cost", () => {
    const result = runCosting({
      currency: "NGN",
      items: [
        {
          id: "pv-1",
          name: "PV Module",
          category: "PV",
          quantity: 10,
          unitCost: 250_000,
        },
      ],
    });

    expect(result.valid).toBe(true);
    expect(result.status).toBe("SUCCESS");
    expect(result.value?.items[0]?.itemCost)
      .toBe(2_500_000);
    expect(result.value?.subtotal)
      .toBe(2_500_000);
    expect(result.value?.totalCost)
      .toBe(2_500_000);
  });

  it("calculates multiple item costs and category subtotals", () => {
    const result = runCosting({
      currency: "NGN",
      items: [
        {
          id: "pv-1",
          name: "PV Module",
          category: "PV",
          quantity: 10,
          unitCost: 250_000,
        },
        {
          id: "cable-1",
          name: "DC Cable",
          category: "Cable",
          quantity: 100,
          unitCost: 1_500,
          unit: "m",
        },
        {
          id: "pv-2",
          name: "Second PV Module",
          category: "PV",
          quantity: 2,
          unitCost: 250_000,
        },
      ],
    });

    expect(result.valid).toBe(true);

    expect(result.value?.categorySubtotals)
      .toEqual({
        PV: 3_000_000,
        Cable: 150_000,
      });

    expect(result.value?.subtotal)
      .toBe(3_150_000);

    expect(result.value?.totalCost)
      .toBe(3_150_000);
  });

  it("calculates additional costs", () => {
    const result = runCosting({
      currency: "NGN",
      additionalCosts: 100_000,
      items: [
        {
          id: "item-1",
          name: "Equipment",
          category: "Equipment",
          quantity: 2,
          unitCost: 50_000,
        },
      ],
    });

    expect(result.value?.subtotal)
      .toBe(100_000);

    expect(result.value?.additionalCosts)
      .toBe(100_000);

    expect(result.value?.totalCost)
      .toBe(200_000);
  });

  it("calculates contingency from subtotal", () => {
    const result = runCosting({
      currency: "NGN",
      contingencyRate: 0.1,
      items: [
        {
          id: "item-1",
          name: "Equipment",
          category: "Equipment",
          quantity: 2,
          unitCost: 50_000,
        },
      ],
    });

    expect(result.value?.subtotal)
      .toBe(100_000);

    expect(result.value?.contingency)
      .toBe(10_000);

    expect(result.value?.totalCost)
      .toBe(110_000);
  });

  it("calculates total from subtotal, additional costs, and contingency", () => {
    const result = runCosting({
      currency: "NGN",
      additionalCosts: 50_000,
      contingencyRate: 0.1,
      items: [
        {
          id: "item-1",
          name: "Equipment",
          category: "Equipment",
          quantity: 2,
          unitCost: 100_000,
        },
      ],
    });

    expect(result.value?.subtotal)
      .toBe(200_000);

    expect(result.value?.additionalCosts)
      .toBe(50_000);

    expect(result.value?.contingency)
      .toBe(20_000);

    expect(result.value?.totalCost)
      .toBe(270_000);
  });

  it("produces a deterministic result", () => {
    const input = {
      currency: "NGN",
      additionalCosts: 50_000,
      contingencyRate: 0.1,
      items: [
        {
          id: "item-1",
          name: "Equipment",
          category: "Equipment",
          quantity: 2,
          unitCost: 100_000,
        },
      ],
    };

    const first = runCosting(input);
    const second = runCosting(input);

    expect(first).toEqual(second);
  });

  it("records calculation trace steps", () => {
    const result = runCosting({
      currency: "NGN",
      contingencyRate: 0.1,
      items: [
        {
          id: "item-1",
          name: "Equipment",
          category: "Equipment",
          quantity: 2,
          unitCost: 100_000,
        },
      ],
    });

    expect(result.trace.steps.length)
      .toBeGreaterThanOrEqual(4);

    expect(
      result.trace.steps.some(
        (step) => step.id === "cost-item-item-1",
      ),
    ).toBe(true);

    expect(
      result.trace.steps.some(
        (step) => step.id === "cost-subtotal",
      ),
    ).toBe(true);

    expect(
      result.trace.steps.some(
        (step) => step.id === "cost-contingency",
      ),
    ).toBe(true);

    expect(
      result.trace.steps.some(
        (step) => step.id === "cost-total",
      ),
    ).toBe(true);
  });
});
