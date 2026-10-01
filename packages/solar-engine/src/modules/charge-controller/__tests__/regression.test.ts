import {
  calculateChargeControllerSizing,
  generateChargeControllerSizingWarnings,
  runChargeControllerSizing,
} from "../index.js";

import {
  describe,
  expect,
  it,
} from "vitest";

describe("charge controller sizing regression", () => {
  const validInput = {
    pvArrayPowerW: 6000,
    batteryVoltageV: 48,
    controllerEfficiency: 0.98,
    safetyMargin: 0.25,

    pvArrayVmpV: 100,
    pvArrayVocV: 120,
    pvArrayImpA: 60,
    pvArrayIscA: 65,

    controllerRatedCurrentA: 160,
    controllerMaxPVVoltageV: 150,
    controllerMPPTMinVoltageV: 60,
    controllerMPPTMaxVoltageV: 120,
    controllerMaxPVCurrentA: 70,
  };

  it("preserves the established sizing formulas", () => {
    const result =
      calculateChargeControllerSizing(validInput);

    expect(result.pvChargingCurrentA).toBe(125);
    expect(result.controllerOutputCurrentA).toBeCloseTo(122.5, 5);
    expect(result.requiredControllerCurrentA).toBeCloseTo(153.125, 5);
    expect(result.requiredControllerPowerW).toBeCloseTo(7350, 5);
  });

  it("preserves controller compatibility results", () => {
    const result =
      calculateChargeControllerSizing(validInput);

    expect(result.controllerRatedCurrentA).toBe(160);
    expect(result.controllerCurrentMarginA).toBeCloseTo(6.875, 5);
    expect(result.currentCompatible).toBe(true);
    expect(result.voltageCompatible).toBe(true);
    expect(result.mpptCompatible).toBe(true);
    expect(result.pvCurrentCompatible).toBe(true);
    expect(result.systemCompatible).toBe(true);
  });

  it("preserves warning generation", () => {
    const input = {
      ...validInput,
      controllerEfficiency: 0.85,
      safetyMargin: 0,
    };

    const value =
      calculateChargeControllerSizing(input);

    const warnings =
      generateChargeControllerSizingWarnings(
        input,
        value,
      );

    expect(
      warnings.some(
        (warning) =>
          warning.code === "LOW_CONTROLLER_EFFICIENCY",
      ),
    ).toBe(true);

    expect(
      warnings.some(
        (warning) =>
          warning.code === "NO_SAFETY_MARGIN",
      ),
    ).toBe(true);
  });

  it("preserves the core execution result", () => {
    const result =
      runChargeControllerSizing(validInput);

    expect(result.valid).toBe(true);
    expect(result.status).toBe("WARNING");
    expect(result.value).toBeDefined();
    expect(result.errors).toHaveLength(0);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("preserves metadata and assumptions", () => {
    const result =
      runChargeControllerSizing(validInput);

    expect(result.metadata.module).toBe(
      "@ogwusearch/solar-engine",
    );

    expect(result.metadata.version).toBe("1.0.0");

    expect(result.metadata.name).toBe(
      "Charge Controller Sizing",
    );

    expect(result.metadata.extras?.engine).toBe(
      "charge-controller-sizing",
    );

    expect(result.metadata.extras?.unitSystem).toBe("SI");

    expect(result.assumptions.length).toBeGreaterThan(0);
  });

  it("preserves the calculation trace", () => {
    const result =
      runChargeControllerSizing(validInput);

    expect(result.trace.steps.length).toBeGreaterThan(0);

    const traceText = result.trace.steps
      .map(
        (step) =>
          `${step.id} ${step.name} ${step.description ?? ""}`,
      )
      .join(" ");

    expect(traceText).toContain(
      "current-requirements",
    );

    expect(traceText).toContain(
      "current-compatibility",
    );

    expect(traceText).toContain(
      "mppt-compatibility",
    );

    expect(traceText).toContain(
      "system-compatibility",
    );
  });

  it("does not mutate the input", () => {
    const input = structuredClone(validInput);

    runChargeControllerSizing(input);

    expect(input).toEqual(validInput);
  });

  it("returns an error result for invalid input", () => {
    const result =
      runChargeControllerSizing({
        ...validInput,
        batteryVoltageV: 0,
      });

    expect(result.valid).toBe(false);
    expect(result.status).toBe("ERROR");
    expect(result.value).toBeUndefined();
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.warnings).toHaveLength(0);
    expect(result.trace.steps).toEqual([]);
  });

  it("produces deterministic results", () => {
    const first =
      runChargeControllerSizing(validInput);

    const second =
      runChargeControllerSizing(validInput);

    expect(second.valid).toBe(first.valid);
    expect(second.status).toBe(first.status);
    expect(second.value).toEqual(first.value);
    expect(second.errors).toEqual(first.errors);
    expect(second.warnings).toEqual(first.warnings);
    expect(second.assumptions).toEqual(first.assumptions);
    expect(second.trace.steps).toEqual(first.trace.steps);
  });
});
