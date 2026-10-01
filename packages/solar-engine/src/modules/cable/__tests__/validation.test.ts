
import {
  validateCable,
} from "../index.js";

import type {
  CableInput,
} from "../types/index.js";

import {
  describe,
  expect,
  it,
} from "vitest";

const validInput: CableInput = {
  mode: "DC",
  loadPowerW: 2400,
  systemVoltageV: 48,
  designMargin: 0.2,
  conductorMaterial: "copper",
  conductorCount: 2,
  resistivityOhmMm2PerM: 0.0175,
  cableLengthM: 20,
  installationMethod: "conduit",
  conductorOptions: [
    {
      areaMm2: 4,
      allowableAmpacityA: 30,
    },
    {
      areaMm2: 6,
      allowableAmpacityA: 45,
    },
    {
      areaMm2: 10,
      allowableAmpacityA: 70,
    },
  ],
};

describe("Cable validation", () => {
  it("accepts valid input", () => {
    const issues =
      validateCable(validInput);

    expect(issues).toHaveLength(0);
  });

  it("rejects invalid mode", () => {
    const issues =
      validateCable({
        ...validInput,
        mode: "INVALID" as CableInput["mode"],
      });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_CABLE_MODE",
      ),
    ).toBe(true);
  });

  it("rejects non-positive design margin", () => {
    const issues =
      validateCable({
        ...validInput,
        designMargin: -0.1,
      });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_DESIGN_MARGIN",
      ),
    ).toBe(true);
  });

  it("rejects design margin above one", () => {
    const issues =
      validateCable({
        ...validInput,
        designMargin: 1.01,
      });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_DESIGN_MARGIN",
      ),
    ).toBe(true);
  });

  it("rejects invalid load power", () => {
    const issues =
      validateCable({
        ...validInput,
        loadPowerW: 0,
      });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_LOAD_POWER",
      ),
    ).toBe(true);
  });

  it("rejects invalid system voltage", () => {
    const issues =
      validateCable({
        ...validInput,
        systemVoltageV: 0,
      });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_SYSTEM_VOLTAGE",
      ),
    ).toBe(true);
  });

  it("rejects invalid operating current", () => {
    const issues =
      validateCable({
        ...validInput,
        operatingCurrentA: 0,
      });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_OPERATING_CURRENT",
      ),
    ).toBe(true);
  });

  it("rejects invalid power factor", () => {
    const input: CableInput = {
      ...validInput,
      mode: "AC",
      powerFactor: 0,
    };

    const issues =
      validateCable(input);

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_POWER_FACTOR",
      ),
    ).toBe(true);
  });

  it("requires power factor for AC power-based current calculation", () => {
    const {
      powerFactor: _powerFactor,
      ...inputWithoutPowerFactor
    } = validInput;

    const input: CableInput = {
      ...inputWithoutPowerFactor,
      mode: "AC",
    };

    const issues =
      validateCable(input);

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "MISSING_AC_POWER_FACTOR",
      ),
    ).toBe(true);
  });

  it("rejects power factor for DC calculation", () => {
    const input: CableInput = {
      ...validInput,
      powerFactor: 0.95,
    };

    const issues =
      validateCable(input);

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "POWER_FACTOR_NOT_APPLICABLE",
      ),
    ).toBe(true);
  });

  it("requires current or load power", () => {
    const input: CableInput = {
      mode: "DC",
      systemVoltageV: 48,
      designMargin: 0.2,
      conductorMaterial: "copper",
      conductorCount: 1,
      conductorOptions:
        validInput.conductorOptions,
    };

    const issues =
      validateCable(input);

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "MISSING_CURRENT_INPUT",
      ),
    ).toBe(true);
  });

  it("requires voltage when deriving current", () => {
    const input: CableInput = {
      mode: "DC",
      loadPowerW: 2400,
      designMargin: 0.2,
      conductorMaterial: "copper",
      conductorCount: 1,
      conductorOptions:
        validInput.conductorOptions,
    };

    const issues =
      validateCable(input);

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "MISSING_SYSTEM_VOLTAGE",
      ),
    ).toBe(true);
  });

  it("rejects invalid cable length", () => {
    const issues =
      validateCable({
        ...validInput,
        cableLengthM: 0,
      });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_CABLE_LENGTH",
      ),
    ).toBe(true);
  });

  it("rejects invalid resistivity", () => {
    const issues =
      validateCable({
        ...validInput,
        resistivityOhmMm2PerM: 0,
      });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_RESISTIVITY",
      ),
    ).toBe(true);
  });

  it("rejects invalid conductor count", () => {
    const issues =
      validateCable({
        ...validInput,
        conductorCount: 0,
      });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_CONDUCTOR_COUNT",
      ),
    ).toBe(true);
  });

  it("rejects empty conductor options", () => {
    const issues =
      validateCable({
        ...validInput,
        conductorOptions: [],
      });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "EMPTY_CONDUCTOR_OPTIONS",
      ),
    ).toBe(true);
  });

  it("rejects invalid conductor option area", () => {
    const issues =
      validateCable({
        ...validInput,
        conductorOptions: [
          {
            areaMm2: 0,
            allowableAmpacityA: 30,
          },
        ],
      });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_CONDUCTOR_OPTION_AREA",
      ),
    ).toBe(true);
  });

  it("rejects invalid conductor option ampacity", () => {
    const issues =
      validateCable({
        ...validInput,
        conductorOptions: [
          {
            areaMm2: 4,
            allowableAmpacityA: 0,
          },
        ],
      });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_CONDUCTOR_OPTION_AMPACITY",
      ),
    ).toBe(true);
  });

  it("does not mutate input", () => {
    const input =
      structuredClone(validInput);

    validateCable(input);

    expect(input).toEqual(validInput);
  });
});