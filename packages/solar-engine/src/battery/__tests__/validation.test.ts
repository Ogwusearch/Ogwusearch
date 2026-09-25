
import { describe, expect, it } from "vitest";

import {
  validateBatterySizing,
} from "../validation/index.js";

import type {
  BatterySizingInput,
} from "../types/index.js";

describe("Battery validation", () => {
  const validInput: BatterySizingInput = {
    dailyEnergyKWh: 2.4,
    autonomyDays: 1,
    systemVoltageV: 24,
    depthOfDischarge: 0.5,
    batteryEfficiency: 0.9,
    designMargin: 0.1,
  };

  function hasIssue(
    input: BatterySizingInput,
    code: string,
  ) {
    return validateBatterySizing(input).some(
      (issue) => issue.code === code,
    );
  }

  describe("valid input", () => {
    it("accepts valid battery input without issues", () => {
      const issues =
        validateBatterySizing(validInput);

      expect(issues).toEqual([]);
    });
  });

  describe("required numeric inputs", () => {
    it("rejects zero daily energy", () => {
      const issues =
        validateBatterySizing({
          ...validInput,
          dailyEnergyKWh: 0,
        });

      expect(
        hasIssue(
          {
            ...validInput,
            dailyEnergyKWh: 0,
          },
          "INVALID_DAILY_ENERGY",
        ),
      ).toBe(true);

      expect(
        issues.find(
          (issue) =>
            issue.code === "INVALID_DAILY_ENERGY",
        ),
      ).toMatchObject({
        severity: "ERROR",
        path: "dailyEnergyKWh",
      });
    });

    it("rejects negative daily energy", () => {
      const input = {
        ...validInput,
        dailyEnergyKWh: -1,
      };

      expect(
        hasIssue(input, "INVALID_DAILY_ENERGY"),
      ).toBe(true);
    });

    it("rejects non-finite daily energy", () => {
      const input = {
        ...validInput,
        dailyEnergyKWh: Number.NaN,
      };

      expect(
        hasIssue(input, "INVALID_DAILY_ENERGY"),
      ).toBe(true);
    });

    it("rejects zero autonomy", () => {
      const input = {
        ...validInput,
        autonomyDays: 0,
      };

      expect(
        hasIssue(input, "INVALID_AUTONOMY"),
      ).toBe(true);
    });

    it("rejects zero system voltage", () => {
      const input = {
        ...validInput,
        systemVoltageV: 0,
      };

      expect(
        hasIssue(
          input,
          "INVALID_SYSTEM_VOLTAGE",
        ),
      ).toBe(true);
    });
  });

  describe("depth of discharge", () => {
    it("rejects zero depth of discharge", () => {
      const input = {
        ...validInput,
        depthOfDischarge: 0,
      };

      expect(
        hasIssue(
          input,
          "INVALID_DEPTH_OF_DISCHARGE",
        ),
      ).toBe(true);
    });

    it("rejects depth of discharge greater than one", () => {
      const input = {
        ...validInput,
        depthOfDischarge: 1.01,
      };

      expect(
        hasIssue(
          input,
          "INVALID_DEPTH_OF_DISCHARGE",
        ),
      ).toBe(true);
    });

    it("accepts depth of discharge equal to one", () => {
      const input = {
        ...validInput,
        depthOfDischarge: 1,
      };

      expect(
        hasIssue(
          input,
          "INVALID_DEPTH_OF_DISCHARGE",
        ),
      ).toBe(false);
    });

    it("warns when depth of discharge is above 80 percent", () => {
      const input = {
        ...validInput,
        depthOfDischarge: 0.81,
      };

      const issues =
        validateBatterySizing(input);

      expect(
        issues.find(
          (issue) =>
            issue.code ===
            "HIGH_DEPTH_OF_DISCHARGE",
        ),
      ).toMatchObject({
        severity: "WARNING",
        path: "depthOfDischarge",
      });
    });
  });

  describe("battery efficiency", () => {
    it("rejects zero battery efficiency", () => {
      const input = {
        ...validInput,
        batteryEfficiency: 0,
      };

      expect(
        hasIssue(
          input,
          "INVALID_BATTERY_EFFICIENCY",
        ),
      ).toBe(true);
    });

    it("rejects battery efficiency greater than one", () => {
      const input = {
        ...validInput,
        batteryEfficiency: 1.01,
      };

      expect(
        hasIssue(
          input,
          "INVALID_BATTERY_EFFICIENCY",
        ),
      ).toBe(true);
    });

    it("accepts battery efficiency equal to one", () => {
      const input = {
        ...validInput,
        batteryEfficiency: 1,
      };

      expect(
        hasIssue(
          input,
          "INVALID_BATTERY_EFFICIENCY",
        ),
      ).toBe(false);
    });
  });

  describe("design margin", () => {
    it("rejects negative design margin", () => {
      const input = {
        ...validInput,
        designMargin: -0.01,
      };

      expect(
        hasIssue(
          input,
          "INVALID_DESIGN_MARGIN",
        ),
      ).toBe(true);
    });

    it("accepts zero design margin but reports a warning", () => {
      const input = {
        ...validInput,
        designMargin: 0,
      };

      const issues =
        validateBatterySizing(input);

      expect(
        issues.some(
          (issue) =>
            issue.code ===
            "INVALID_DESIGN_MARGIN",
        ),
      ).toBe(false);

      expect(
        issues.find(
          (issue) =>
            issue.code === "NO_DESIGN_MARGIN",
        ),
      ).toMatchObject({
        severity: "WARNING",
        path: "designMargin",
      });
    });

    it("preserves the existing non-negative margin behavior", () => {
      const input = {
        ...validInput,
        designMargin: 1.5,
      };

      expect(
        hasIssue(
          input,
          "INVALID_DESIGN_MARGIN",
        ),
      ).toBe(false);
    });
  });

  describe("optional battery-unit inputs", () => {
    it("accepts omitted battery-unit voltage", () => {
      const input: BatterySizingInput = {
        ...validInput,
      };

      expect(
        hasIssue(
          input,
          "INVALID_BATTERY_UNIT_VOLTAGE",
        ),
      ).toBe(false);
    });

    it("rejects zero battery-unit voltage", () => {
      const input = {
        ...validInput,
        batteryUnitVoltageV: 0,
      };

      expect(
        hasIssue(
          input,
          "INVALID_BATTERY_UNIT_VOLTAGE",
        ),
      ).toBe(true);
    });

    it("rejects negative battery-unit capacity", () => {
      const input = {
        ...validInput,
        batteryUnitCapacityAh: -100,
      };

      expect(
        hasIssue(
          input,
          "INVALID_BATTERY_UNIT_CAPACITY",
        ),
      ).toBe(true);
    });

    it("accepts valid battery-unit configuration", () => {
      const input = {
        ...validInput,
        batteryUnitVoltageV: 12,
        batteryUnitCapacityAh: 200,
      };

      expect(
        hasIssue(
          input,
          "INVALID_BATTERY_UNIT_VOLTAGE",
        ),
      ).toBe(false);

      expect(
        hasIssue(
          input,
          "INVALID_BATTERY_UNIT_CAPACITY",
        ),
      ).toBe(false);
    });

    it("warns when battery-unit voltage does not divide evenly into system voltage", () => {
      const input = {
        ...validInput,
        batteryUnitVoltageV: 15,
        batteryUnitCapacityAh: 200,
      };

      const issues =
        validateBatterySizing(input);

      expect(
        issues.find(
          (issue) =>
            issue.code ===
            "NON_INTEGER_SERIES_CONFIGURATION",
        ),
      ).toMatchObject({
        severity: "WARNING",
        path: "batteryUnitVoltageV",
        actual: 15,
      });
    });
  });

  describe("issue contract", () => {
    it("returns foundation EngineeringIssue fields", () => {
      const input = {
        ...validInput,
        dailyEnergyKWh: 0,
      };

      const issue =
        validateBatterySizing(input)[0];

      expect(issue).toEqual(
        expect.objectContaining({
          code: "INVALID_DAILY_ENERGY",
          severity: "ERROR",
          message:
            "Daily energy must be greater than zero.",
          path: "dailyEnergyKWh",
          actual: 0,
        }),
      );
    });

    it("collects multiple validation issues", () => {
      const input: BatterySizingInput = {
        ...validInput,
        dailyEnergyKWh: 0,
        autonomyDays: 0,
        systemVoltageV: 0,
        depthOfDischarge: 0,
        batteryEfficiency: 0,
        designMargin: -0.1,
      };

      const issues =
        validateBatterySizing(input);

      expect(issues.length).toBeGreaterThanOrEqual(6);

      expect(
        issues.some(
          (issue) =>
            issue.code === "INVALID_DAILY_ENERGY",
        ),
      ).toBe(true);

      expect(
        issues.some(
          (issue) =>
            issue.code === "INVALID_AUTONOMY",
        ),
      ).toBe(true);

      expect(
        issues.some(
          (issue) =>
            issue.code ===
            "INVALID_SYSTEM_VOLTAGE",
        ),
      ).toBe(true);

      expect(
        issues.some(
          (issue) =>
            issue.code ===
            "INVALID_DEPTH_OF_DISCHARGE",
        ),
      ).toBe(true);

      expect(
        issues.some(
          (issue) =>
            issue.code ===
            "INVALID_BATTERY_EFFICIENCY",
        ),
      ).toBe(true);

      expect(
        issues.some(
          (issue) =>
            issue.code ===
            "INVALID_DESIGN_MARGIN",
        ),
      ).toBe(true);
    });
  });
});
