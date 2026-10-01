import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculateBondingConductorArea,
  calculateEarthConductorArea,
  calculateEarthResistance,
} from "../calculation/index.js";

import type {
  EarthingInput,
} from "../types/index.js";

const validInput: EarthingInput = {
  mode: "AC",

  electrical: {
    faultCurrentA: 1000,
    faultClearingTimeS: 0.2,
    conductorConstantA_SqrtS_PerMm2: 115,
    resistivityOhmM: 100,
    electrodeLengthM: 3,
    electrodeDiameterM: 0.016,
  },

  design: {
    designMargin: 0.2,
    bondingConductorFactor: 1,
    earthResistanceTargetOhm: 10,
  },
};

describe("earthing calculations", () => {
  it("calculates earth conductor area", () => {
    const result =
      calculateEarthConductorArea(
        validInput,
      );

    expect(result).toBeCloseTo(
      4.6665766487,
      10,
    );
  });

  it("calculates bonding conductor area", () => {
    const earthArea =
      calculateEarthConductorArea(
        validInput,
      );

    const result =
      calculateBondingConductorArea(
        earthArea,
        validInput,
      );

    expect(result).toBeCloseTo(
      earthArea,
      10,
    );
  });

  it("calculates earth resistance when electrode data is supplied", () => {
    const result =
      calculateEarthResistance(
        validInput,
      );

    expect(result).toBeDefined();
    expect(result).toBeGreaterThan(0);
  });
});