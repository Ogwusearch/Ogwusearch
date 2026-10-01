import { describe, expect, it } from "vitest";

import {
  calculateVoltageDrop,
  runVoltageDrop,
} from "../index.js";
import type { VoltageDropInput } from "../types/index.js";

describe("voltage-drop calculation", () => {
  it("calculates voltage drop from an explicit resistance", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 48,
      operatingCurrentA: 10,
      resistanceOhm: 0.2,
    };

    const output = calculateVoltageDrop(input);

    expect(output.resistanceOhm).toBeCloseTo(0.2);
    expect(output.voltageDropV).toBeCloseTo(2);
    expect(output.loadVoltageV).toBeCloseTo(46);
    expect(output.voltageDropPercent).toBeCloseTo(4.1666666667);
  });

  it("calculates resistance from resistivity, length, and conductor area", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 48,
      operatingCurrentA: 10,
      conductorLengthM: 20,
      conductorAreaMm2: 10,
      resistivityOhmMm2PerM: 0.01724,
    };

    const output = calculateVoltageDrop(input);

    expect(output.resistanceOhm).toBeCloseTo(0.03448);
    expect(output.voltageDropV).toBeCloseTo(0.3448);
    expect(output.loadVoltageV).toBeCloseTo(47.6552);
    expect(output.voltageDropPercent).toBeCloseTo(
      0.7183333333,
    );
  });

  it("evaluates an explicitly supplied allowable voltage-drop limit", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 48,
      operatingCurrentA: 10,
      resistanceOhm: 0.1,
      allowableVoltageDropPercent: 3,
    };

    const output = calculateVoltageDrop(input);

    expect(output.voltageDropV).toBeCloseTo(1);
    expect(output.voltageDropPercent).toBeCloseTo(
      2.0833333333,
    );
    expect(output.allowableVoltageDropPercent).toBe(3);
    expect(output.withinAllowableLimit).toBe(true);
  });

  it("identifies a voltage drop above the allowable limit", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 48,
      operatingCurrentA: 10,
      resistanceOhm: 0.2,
      allowableVoltageDropPercent: 3,
    };

    const output = calculateVoltageDrop(input);

    expect(output.voltageDropPercent).toBeCloseTo(
      4.1666666667,
    );
    expect(output.withinAllowableLimit).toBe(false);
  });

  it("does not expose an allowable-limit result when no limit is supplied", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 48,
      operatingCurrentA: 10,
      resistanceOhm: 0.1,
    };

    const output = calculateVoltageDrop(input);

    expect(output.allowableVoltageDropPercent).toBeUndefined();
    expect(output.withinAllowableLimit).toBeUndefined();
  });

  it("supports AC mode using the same explicit resistance model", () => {
    const input: VoltageDropInput = {
      mode: "AC",
      sourceVoltageV: 230,
      operatingCurrentA: 5,
      resistanceOhm: 0.4,
    };

    const output = calculateVoltageDrop(input);

    expect(output.mode).toBe("AC");
    expect(output.voltageDropV).toBeCloseTo(2);
    expect(output.loadVoltageV).toBeCloseTo(228);
    expect(output.voltageDropPercent).toBeCloseTo(
      0.8695652174,
    );
  });

  it("integrates successfully through runVoltageDrop", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 48,
      operatingCurrentA: 10,
      resistanceOhm: 0.1,
    };

    const result = runVoltageDrop(input);

    expect(result.valid).toBe(true);
    expect(result.status).toBe("SUCCESS");
    expect(result.errors).toHaveLength(0);
    expect(result.value).toBeDefined();

    expect(result.value?.voltageDropV).toBeCloseTo(1);
    expect(result.value?.loadVoltageV).toBeCloseTo(47);
    expect(result.value?.voltageDropPercent).toBeCloseTo(
      2.0833333333,
    );
  });

  it("produces trace information through the calculation lifecycle", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 48,
      operatingCurrentA: 10,
      resistanceOhm: 0.1,
    };

    const result = runVoltageDrop(input);

    expect(result.valid).toBe(true);
    expect(result.trace).toBeDefined();

    expect(result.trace.steps.length).toBeGreaterThan(0);
  });

  it("produces explicit assumptions through the calculation lifecycle", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 48,
      operatingCurrentA: 10,
      resistanceOhm: 0.1,
    };

    const result = runVoltageDrop(input);

    expect(result.valid).toBe(true);
    expect(result.assumptions.length).toBeGreaterThan(0);
  });
});