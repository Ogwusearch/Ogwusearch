import { describe, expect, it } from "vitest";

import {
  runVoltageDrop,
  validateVoltageDropInput,
} from "../index.js";
import type { VoltageDropInput } from "../types/index.js";

describe("voltage-drop validation", () => {
  it("accepts a valid explicit-resistance input", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 48,
      operatingCurrentA: 10,
      resistanceOhm: 0.1,
    };

    const issues = validateVoltageDropInput(input);

    expect(issues).toHaveLength(0);
  });

  it("accepts a valid conductor resistance model", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 48,
      operatingCurrentA: 10,
      conductorLengthM: 20,
      conductorAreaMm2: 10,
      resistivityOhmMm2PerM: 0.01724,
    };

    const issues = validateVoltageDropInput(input);

    expect(issues).toHaveLength(0);
  });

  it("rejects an invalid operating mode", () => {
    const input = {
      mode: "INVALID",
      sourceVoltageV: 48,
      operatingCurrentA: 10,
      resistanceOhm: 0.1,
    } as unknown as VoltageDropInput;

    const issues = validateVoltageDropInput(input);

    expect(
      issues.some((issue) => issue.code === "INVALID_VOLTAGE_DROP_MODE"),
    ).toBe(true);
  });

  it("rejects a non-positive source voltage", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 0,
      operatingCurrentA: 10,
      resistanceOhm: 0.1,
    };

    const issues = validateVoltageDropInput(input);

    expect(
      issues.some(
        (issue) => issue.code === "INVALID_SOURCE_VOLTAGE",
      ),
    ).toBe(true);
  });

  it("rejects a negative source voltage", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: -48,
      operatingCurrentA: 10,
      resistanceOhm: 0.1,
    };

    const issues = validateVoltageDropInput(input);

    expect(
      issues.some(
        (issue) => issue.code === "INVALID_SOURCE_VOLTAGE",
      ),
    ).toBe(true);
  });

  it("rejects a non-positive operating current", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 48,
      operatingCurrentA: 0,
      resistanceOhm: 0.1,
    };

    const issues = validateVoltageDropInput(input);

    expect(
      issues.some(
        (issue) => issue.code === "INVALID_OPERATING_CURRENT",
      ),
    ).toBe(true);
  });

  it("rejects negative resistance", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 48,
      operatingCurrentA: 10,
      resistanceOhm: -0.1,
    };

    const issues = validateVoltageDropInput(input);

    expect(
      issues.some(
        (issue) => issue.code === "INVALID_RESISTANCE",
      ),
    ).toBe(true);
  });

  it("rejects a missing resistance model", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 48,
      operatingCurrentA: 10,
    };

    const issues = validateVoltageDropInput(input);

    expect(
      issues.some(
        (issue) => issue.code === "MISSING_RESISTANCE_MODEL",
      ),
    ).toBe(true);
  });

  it("rejects an incomplete conductor resistance model", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 48,
      operatingCurrentA: 10,
      conductorLengthM: 20,
      conductorAreaMm2: 10,
    };

    const issues = validateVoltageDropInput(input);

    expect(
      issues.some(
        (issue) => issue.code === "MISSING_RESISTIVITY",
      ),
    ).toBe(true);
  });

  it("rejects a non-positive conductor length", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 48,
      operatingCurrentA: 10,
      conductorLengthM: 0,
      conductorAreaMm2: 10,
      resistivityOhmMm2PerM: 0.01724,
    };

    const issues = validateVoltageDropInput(input);

    expect(
      issues.some(
        (issue) => issue.code === "INVALID_CONDUCTOR_LENGTH",
      ),
    ).toBe(true);
  });

  it("rejects a non-positive conductor area", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 48,
      operatingCurrentA: 10,
      conductorLengthM: 20,
      conductorAreaMm2: 0,
      resistivityOhmMm2PerM: 0.01724,
    };

    const issues = validateVoltageDropInput(input);

    expect(
      issues.some(
        (issue) => issue.code === "INVALID_CONDUCTOR_AREA",
      ),
    ).toBe(true);
  });

  it("rejects a non-positive resistivity", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 48,
      operatingCurrentA: 10,
      conductorLengthM: 20,
      conductorAreaMm2: 10,
      resistivityOhmMm2PerM: 0,
    };

    const issues = validateVoltageDropInput(input);

    expect(
      issues.some(
        (issue) => issue.code === "INVALID_RESISTIVITY",
      ),
    ).toBe(true);
  });

  it("rejects a negative allowable voltage-drop percentage", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 48,
      operatingCurrentA: 10,
      resistanceOhm: 0.1,
      allowableVoltageDropPercent: -1,
    };

    const issues = validateVoltageDropInput(input);

    expect(
      issues.some(
        (issue) =>
          issue.code === "INVALID_ALLOWABLE_VOLTAGE_DROP",
      ),
    ).toBe(true);
  });

  it("returns validation errors through runVoltageDrop", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 0,
      operatingCurrentA: 10,
      resistanceOhm: 0.1,
    };

    const result = runVoltageDrop(input);

    expect(result.valid).toBe(false);
    expect(result.status).toBe("ERROR");
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.value).toBeUndefined();
  });

  it("does not reject a zero allowable percentage as invalid input", () => {
    const input: VoltageDropInput = {
      mode: "DC",
      sourceVoltageV: 48,
      operatingCurrentA: 10,
      resistanceOhm: 0.1,
      allowableVoltageDropPercent: 0,
    };

    const issues = validateVoltageDropInput(input);

    expect(
      issues.some(
        (issue) =>
          issue.code === "INVALID_ALLOWABLE_VOLTAGE_DROP",
      ),
    ).toBe(false);
  });
});