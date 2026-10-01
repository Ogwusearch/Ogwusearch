import { describe, expect, it } from "vitest";

import {
  calculateDcPowerW,
  calculateDcCurrentA,
  calculateDcVoltageV,
  calculateSinglePhasePowerW,
  calculateThreePhasePowerW,
  calculateSinglePhaseApparentPowerVA,
  calculateThreePhaseApparentPowerVA,
  calculateRealPowerFromApparentPowerW,
  calculateApparentPowerVA,
  calculateReactivePowerVAR,
  calculatePowerFactor,
  calculateResistivePowerLossW,
  calculateOutputPowerW,
  calculateRequiredInputPowerW,
} from "../../src/formulas/power.js";

describe("power formulas", () => {
  it("calculates DC power", () => {
    expect(
      calculateDcPowerW(48, 10),
    ).toBe(480);
  });

  it("calculates DC current", () => {
    expect(
      calculateDcCurrentA(480, 48),
    ).toBe(10);
  });

  it("calculates DC voltage", () => {
    expect(
      calculateDcVoltageV(480, 10),
    ).toBe(48);
  });

  it("calculates single-phase real power", () => {
    expect(
      calculateSinglePhasePowerW(230, 10, 0.9),
    ).toBeCloseTo(2070);
  });

  it("calculates three-phase real power", () => {
    expect(
      calculateThreePhasePowerW(400, 10, 0.9),
    ).toBeCloseTo(
      Math.sqrt(3) * 400 * 10 * 0.9,
    );
  });

  it("calculates single-phase apparent power", () => {
    expect(
      calculateSinglePhaseApparentPowerVA(230, 10),
    ).toBe(2300);
  });

  it("calculates three-phase apparent power", () => {
    expect(
      calculateThreePhaseApparentPowerVA(400, 10),
    ).toBeCloseTo(
      Math.sqrt(3) * 400 * 10,
    );
  });

  it("calculates real power from apparent power", () => {
    expect(
      calculateRealPowerFromApparentPowerW(
        2300,
        0.9,
      ),
    ).toBe(2070);
  });

  it("calculates apparent power from real power", () => {
    expect(
      calculateApparentPowerVA(2070, 0.9),
    ).toBe(2300);
  });

  it("calculates reactive power", () => {
    expect(
      calculateReactivePowerVAR(800, 1000),
    ).toBe(600);
  });

  it("calculates power factor", () => {
    expect(
      calculatePowerFactor(800, 1000),
    ).toBe(0.8);
  });

  it("calculates resistive power loss", () => {
    expect(
      calculateResistivePowerLossW(10, 0.5),
    ).toBe(50);
  });

  it("calculates output power", () => {
    expect(
      calculateOutputPowerW(1000, 0.9),
    ).toBe(900);
  });

  it("calculates required input power", () => {
    expect(
      calculateRequiredInputPowerW(900, 0.9),
    ).toBe(1000);
  });
});
