import {
  runCableSizing,
} from "../index.js";

import {
  calculateCableSize,
  calculateCurrent,
} from "../index.js";

import type {
  CableInput,
} from "../types/index.js";

import {
  describe,
  expect,
  it,
} from "vitest";

describe("Cable sizing regression", () => {
  const validInput: CableInput = {
    mode: "DC",
    loadPowerW: 2400,
    systemVoltageV: 48,
    designMargin: 0.2,
    conductorMaterial: "copper",
    conductorCount: 2,
    cableLengthM: 20,
    resistivityOhmMm2PerM: 0.0175,
    installationMethod:
      "conduit",
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

  it("preserves the established DC current calculation", () => {
    const current =
      calculateCurrent(
        validInput,
      );

    expect(
      current.operatingCurrentA,
    ).toBe(50);
  });

  it("preserves the established design current calculation", () => {
    const current =
      calculateCurrent(
        validInput,
      );

    const sizing =
      calculateCableSize(
        validInput,
        current.operatingCurrentA,
      );

    expect(
      sizing.designCurrentA,
    ).toBe(60);

    expect(
      sizing.requiredAmpacityA,
    ).toBe(60);
  });

  it("preserves the established conductor selection", () => {
    const current =
      calculateCurrent(
        validInput,
      );

    const sizing =
      calculateCableSize(
        validInput,
        current.operatingCurrentA,
      );

    expect(
      sizing.selectedConductorAreaMm2,
    ).toBe(10);

    expect(
      sizing.selectedConductorAmpacityA,
    ).toBe(70);
  });

  it("returns a successful engineering result", () => {
    const result =
      runCableSizing(
        validInput,
      );

    expect(
      result.valid,
    ).toBe(true);

    expect(
      result.status,
    ).toBe("SUCCESS");

    expect(
      result.value,
    ).toBeDefined();

    expect(
      result.errors,
    ).toHaveLength(0);

    expect(
      result.warnings,
    ).toHaveLength(0);
  });

  it("preserves the final engineering output", () => {
    const result =
      runCableSizing(
        validInput,
      );

    expect(
      result.value,
    ).toEqual({
      mode: "DC",
      operatingCurrentA: 50,
      designCurrentA: 60,
      requiredAmpacityA: 60,
      selectedConductorAreaMm2: 10,
      selectedConductorAmpacityA: 70,
      conductorMaterial: "copper",
      conductorCount: 2,
      cableLengthM: 20,
      resistivityOhmMm2PerM:
        0.0175,
      systemVoltageV: 48,
      loadPowerW: 2400,
    });
  });

  it("preserves metadata", () => {
    const result =
      runCableSizing(
        validInput,
      );

    expect(
      result.metadata.module,
    ).toBe(
      "@ogwusearch/solar-engine",
    );

    expect(
      result.metadata.version,
    ).toBe("1.0.0");

    expect(
      result.metadata.name,
    ).toBe("Cable Sizing");

    expect(
      result.metadata.extras?.engine,
    ).toBe("cable-sizing");

    expect(
      result.metadata.extras?.unitSystem,
    ).toBe("SI");
  });

  it("preserves assumptions", () => {
    const result =
      runCableSizing(
        validInput,
      );

    expect(
      result.assumptions.length,
    ).toBeGreaterThan(0);

    expect(
      result.assumptions.some(
        (assumption) =>
          assumption.code ===
          "CABLE_DESIGN_MARGIN",
      ),
    ).toBe(true);

    expect(
      result.assumptions.some(
        (assumption) =>
          assumption.code ===
          "CABLE_CONDUCTOR_MATERIAL",
      ),
    ).toBe(true);

    expect(
      result.assumptions.some(
        (assumption) =>
          assumption.code ===
          "CABLE_RESISTIVITY",
      ),
    ).toBe(true);

    expect(
      result.assumptions.some(
        (assumption) =>
          assumption.code ===
          "CABLE_INSTALLATION_METHOD",
      ),
    ).toBe(true);

    expect(
      result.assumptions.some(
        (assumption) =>
          assumption.code ===
          "CABLE_ALLOWABLE_AMPACITY",
      ),
    ).toBe(true);
  });

  it("preserves the calculation trace", () => {
    const result =
      runCableSizing(
        validInput,
      );

    expect(
      result.trace.steps.length,
    ).toBe(4);

    expect(
      result.trace.steps[0]?.id,
    ).toBe(
      "cable-operating-current",
    );

    expect(
      result.trace.steps[1]?.id,
    ).toBe(
      "cable-design-current",
    );

    expect(
      result.trace.steps[2]?.id,
    ).toBe(
      "cable-required-ampacity",
    );

    expect(
      result.trace.steps[3]?.id,
    ).toBe(
      "cable-selected-size",
    );
  });

  it("returns validation errors without calculating", () => {
    const result =
      runCableSizing({
        ...validInput,
        systemVoltageV: 0,
      });

    expect(
      result.valid,
    ).toBe(false);

    expect(
      result.status,
    ).toBe("ERROR");

    expect(
      result.value,
    ).toBeUndefined();

    expect(
      result.errors.length,
    ).toBeGreaterThan(0);

    expect(
      result.warnings,
    ).toHaveLength(0);

    expect(
      result.trace.steps,
    ).toEqual([]);
  });

  it("does not mutate input", () => {
    const input =
      structuredClone(
        validInput,
      );

    runCableSizing(
      input,
    );

    expect(
      input,
    ).toEqual(validInput);
  });

  it("produces deterministic results", () => {
    const first =
      runCableSizing(
        validInput,
      );

    const second =
      runCableSizing(
        validInput,
      );

    expect(
      second.valid,
    ).toBe(first.valid);

    expect(
      second.status,
    ).toBe(first.status);

    expect(
      second.value,
    ).toEqual(first.value);

    expect(
      second.errors,
    ).toEqual(first.errors);

    expect(
      second.warnings,
    ).toEqual(first.warnings);

    expect(
      second.assumptions,
    ).toEqual(first.assumptions);

    expect(
      second.trace.steps,
    ).toEqual(
      first.trace.steps,
    );
  });
});