import { describe, expect, it } from "vitest";

import {
  calculateVoltageDrop,
  runVoltageDrop,
} from "../index.js";
import type { VoltageDropInput } from "../types/index.js";

describe("voltage-drop regression", () => {
  it("preserves Vdrop = I × R", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 24,
      operatingCurrentA: 25,
      resistanceOhm: 0.08,
    };

    const output = calculateVoltageDrop(input);

    expect(output.voltageDropV).toBeCloseTo(2);
  });

  it("preserves Vload = Vsource - Vdrop", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 24,
      operatingCurrentA: 25,
      resistanceOhm: 0.08,
    };

    const output = calculateVoltageDrop(input);

    expect(output.loadVoltageV).toBeCloseTo(
      output.sourceVoltageV - output.voltageDropV,
    );
  });

  it("preserves voltage-drop percentage calculation", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 24,
      operatingCurrentA: 25,
      resistanceOhm: 0.08,
    };

    const output = calculateVoltageDrop(input);

    expect(output.voltageDropPercent).toBeCloseTo(
      (output.voltageDropV / output.sourceVoltageV) * 100,
    );
  });

  it("preserves R = ρL/A", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 24,
      operatingCurrentA: 25,
      conductorLengthM: 30,
      conductorAreaMm2: 6,
      resistivityOhmMm2PerM: 0.01724,
    };

    const output = calculateVoltageDrop(input);

    const expectedResistance =
      (0.01724 * 30) / 6;

    expect(output.resistanceOhm).toBeCloseTo(
      expectedResistance,
    );
  });

  it("does not silently double conductor length", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 48,
      operatingCurrentA: 10,
      conductorLengthM: 20,
      conductorAreaMm2: 10,
      resistivityOhmMm2PerM: 0.01724,
    };

    const output = calculateVoltageDrop(input);

    expect(output.resistanceOhm).toBeCloseTo(
      (0.01724 * 20) / 10,
    );
  });

  it("uses explicit resistance instead of silently replacing it with a conductor model", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 48,
      operatingCurrentA: 10,
      resistanceOhm: 0.2,
      conductorLengthM: 100,
      conductorAreaMm2: 1.5,
      resistivityOhmMm2PerM: 0.01724,
    };

    const output = calculateVoltageDrop(input);

    expect(output.resistanceOhm).toBeCloseTo(0.2);
    expect(output.voltageDropV).toBeCloseTo(2);
  });

  it("preserves allowable-limit evaluation", () => {
    const withinLimit: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 230,
      operatingCurrentA: 10,
      resistanceOhm: 0.1,
      allowableVoltageDropPercent: 5,
    };

    const exceededLimit: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 230,
      operatingCurrentA: 10,
      resistanceOhm: 2,
      allowableVoltageDropPercent: 5,
    };

    expect(
      calculateVoltageDrop(withinLimit).withinAllowableLimit,
    ).toBe(true);

    expect(
      calculateVoltageDrop(exceededLimit).withinAllowableLimit,
    ).toBe(false);
  });

  it("keeps the public calculation lifecycle deterministic", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 48,
      operatingCurrentA: 10,
      resistanceOhm: 0.1,
      allowableVoltageDropPercent: 3,
    };

    const first = runVoltageDrop(input);
    const second = runVoltageDrop(input);

    expect(first.status).toBe(second.status);
    expect(first.valid).toBe(second.valid);
    expect(first.value).toEqual(second.value);
    expect(first.errors).toEqual(second.errors);
    expect(first.warnings).toEqual(second.warnings);
    expect(first.assumptions).toEqual(second.assumptions);
  });

  it("produces a warning when an explicit allowable limit is exceeded", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 48,
      operatingCurrentA: 10,
      resistanceOhm: 0.2,
      allowableVoltageDropPercent: 3,
    };

    const result = runVoltageDrop(input);

    expect(result.valid).toBe(true);
    expect(result.status).toBe("WARNING");

    expect(
      result.warnings.some(
        (warning) =>
          warning.code ===
          "VOLTAGE_DROP_EXCEEDS_ALLOWABLE_LIMIT",
      ),
    ).toBe(true);
  });

  it("does not create an allowable-limit warning when the limit is satisfied", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 48,
      operatingCurrentA: 10,
      resistanceOhm: 0.1,
      allowableVoltageDropPercent: 3,
    };

    const result = runVoltageDrop(input);

    expect(
      result.warnings.some(
        (warning) =>
          warning.code ===
          "VOLTAGE_DROP_EXCEEDS_ALLOWABLE_LIMIT",
      ),
    ).toBe(false);
  });
});