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

const baseOptions = [
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
] as const;

describe("Cable calculations", () => {
  it("calculates DC operating current from power and voltage", () => {
    const input: CableInput = {
      mode: "DC",
      loadPowerW: 2400,
      systemVoltageV: 48,
      designMargin: 0.2,
      conductorMaterial: "copper",
      conductorCount: 2,
      conductorOptions: baseOptions,
    };

    const result =
      calculateCurrent(input);

    expect(
      result.operatingCurrentA,
    ).toBe(50);
  });

  it("calculates AC operating current from power, voltage, and power factor", () => {
    const input: CableInput = {
      mode: "AC",
      loadPowerW: 2300,
      systemVoltageV: 230,
      powerFactor: 1,
      designMargin: 0.1,
      conductorMaterial: "copper",
      conductorCount: 2,
      conductorOptions: baseOptions,
    };

    const result =
      calculateCurrent(input);

    expect(
      result.operatingCurrentA,
    ).toBe(10);
  });

  it("uses explicitly supplied operating current", () => {
    const input: CableInput = {
      mode: "DC",
      operatingCurrentA: 25,
      designMargin: 0.2,
      conductorMaterial: "copper",
      conductorCount: 2,
      conductorOptions: baseOptions,
    };

    const result =
      calculateCurrent(input);

    expect(
      result.operatingCurrentA,
    ).toBe(25);
  });

  it("applies the design margin to determine design current and required ampacity", () => {
    const input: CableInput = {
      mode: "DC",
      designMargin: 0.2,
      conductorMaterial: "copper",
      conductorCount: 2,
      conductorOptions: baseOptions,
    };

    const result =
      calculateCableSize(
        input,
        50,
      );

    expect(
      result.designCurrentA,
    ).toBe(60);

    expect(
      result.requiredAmpacityA,
    ).toBe(60);
  });

  it("selects the smallest conductor that satisfies the required ampacity", () => {
    const input: CableInput = {
      mode: "DC",
      designMargin: 0.2,
      conductorMaterial: "copper",
      conductorCount: 2,
      conductorOptions: baseOptions,
    };

    const result =
      calculateCableSize(
        input,
        50,
      );

    expect(
      result.selectedConductorAreaMm2,
    ).toBe(10);

    expect(
      result.selectedConductorAmpacityA,
    ).toBe(70);
  });

  it("selects the exact boundary conductor", () => {
    const input: CableInput = {
      mode: "DC",
      designMargin: 0,
      conductorMaterial: "copper",
      conductorCount: 1,
      conductorOptions: baseOptions,
    };

    const result =
      calculateCableSize(
        input,
        45,
      );

    expect(
      result.requiredAmpacityA,
    ).toBe(45);

    expect(
      result.selectedConductorAreaMm2,
    ).toBe(6);

    expect(
      result.selectedConductorAmpacityA,
    ).toBe(45);
  });

  it("supports zero design margin", () => {
    const input: CableInput = {
      mode: "DC",
      designMargin: 0,
      conductorMaterial: "copper",
      conductorCount: 1,
      conductorOptions: baseOptions,
    };

    const result =
      calculateCableSize(
        input,
        30,
      );

    expect(
      result.designCurrentA,
    ).toBe(30);
  });

  it("supports maximum design margin of one", () => {
    const input: CableInput = {
      mode: "DC",
      designMargin: 1,
      conductorMaterial: "copper",
      conductorCount: 1,
      conductorOptions: baseOptions,
    };

    const result =
      calculateCableSize(
        input,
        30,
      );

    expect(
      result.designCurrentA,
    ).toBe(60);
  });

  it("throws when no conductor option satisfies the required ampacity", () => {
    const input: CableInput = {
      mode: "DC",
      designMargin: 0,
      conductorMaterial: "copper",
      conductorCount: 1,
      conductorOptions: [
        {
          areaMm2: 4,
          allowableAmpacityA: 20,
        },
      ],
    };

    expect(() =>
      calculateCableSize(
        input,
        25,
      ),
    ).toThrow(
      /No conductor option satisfies/,
    );
  });

  it("does not mutate conductor options", () => {
    const conductorOptions = [
      {
        areaMm2: 10,
        allowableAmpacityA: 70,
      },
      {
        areaMm2: 4,
        allowableAmpacityA: 30,
      },
      {
        areaMm2: 6,
        allowableAmpacityA: 45,
      },
    ];

    const input: CableInput = {
      mode: "DC",
      designMargin: 0,
      conductorMaterial: "copper",
      conductorCount: 1,
      conductorOptions,
    };

    const before =
      structuredClone(
        conductorOptions,
      );

    calculateCableSize(
      input,
      40,
    );

    expect(
      conductorOptions,
    ).toEqual(before);
  });
});