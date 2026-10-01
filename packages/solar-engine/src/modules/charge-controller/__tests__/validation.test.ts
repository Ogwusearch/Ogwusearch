
import {
  validateChargeControllerSizingInput,
  validateChargeControllerSizingIssues,
} from "../validation/index.js";

import {
  describe,
  expect,
  it,
} from "vitest";

describe("charge controller sizing validation", () => {
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

  it("accepts valid input", () => {
    const issues =
      validateChargeControllerSizingIssues(
        validInput,
      );

    expect(issues).toHaveLength(0);

    const result =
      validateChargeControllerSizingInput(
        validInput,
      );

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects zero PV array power", () => {
    const issues =
      validateChargeControllerSizingIssues({
        ...validInput,
        pvArrayPowerW: 0,
      });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_PV_ARRAY_POWER",
      ),
    ).toBe(true);
  });

  it("rejects zero battery voltage", () => {
    const issues =
      validateChargeControllerSizingIssues({
        ...validInput,
        batteryVoltageV: 0,
      });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_BATTERY_VOLTAGE",
      ),
    ).toBe(true);
  });

  it("rejects invalid controller efficiency", () => {
    const issues =
      validateChargeControllerSizingIssues({
        ...validInput,
        controllerEfficiency: 1.1,
      });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_CONTROLLER_EFFICIENCY",
      ),
    ).toBe(true);
  });

  it("rejects negative safety margin", () => {
    const issues =
      validateChargeControllerSizingIssues({
        ...validInput,
        safetyMargin: -0.1,
      });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_SAFETY_MARGIN",
      ),
    ).toBe(true);
  });

  it("rejects Vmp greater than Voc", () => {
    const issues =
      validateChargeControllerSizingIssues({
        ...validInput,
        pvArrayVmpV: 130,
        pvArrayVocV: 120,
      });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_PV_VOLTAGE_RELATIONSHIP",
      ),
    ).toBe(true);
  });

  it("rejects Imp greater than Isc", () => {
    const issues =
      validateChargeControllerSizingIssues({
        ...validInput,
        pvArrayImpA: 70,
        pvArrayIscA: 65,
      });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_PV_CURRENT_RELATIONSHIP",
      ),
    ).toBe(true);
  });

  it("rejects invalid MPPT voltage range", () => {
    const issues =
      validateChargeControllerSizingIssues({
        ...validInput,
        controllerMPPTMinVoltageV: 130,
        controllerMPPTMaxVoltageV: 120,
      });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_MPPT_VOLTAGE_RANGE",
      ),
    ).toBe(true);
  });

  it("does not mutate the input", () => {
    const input = structuredClone(validInput);

    validateChargeControllerSizingInput(
      input,
    );

    expect(input).toEqual(validInput);
  });
});
