
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  validateInverterSizingInput,
} from "../validation";

describe("inverter validation", () => {
  const validInput = {
    continuousLoadW: 2000,
    surgeLoadW: 4000,
    systemVoltageV: 48,
    inverterEfficiency: 0.9,
    powerFactor: 0.8,
    inverterRatedPowerW: 2500,
    inverterSurgePowerW: 5000,
    inverterInputVoltageMinV: 40,
    inverterInputVoltageMaxV: 60,
    requiredOutputVoltageV: 230,
    inverterOutputVoltageV: 230,
  };

  describe("valid input", () => {
    it("accepts a fully specified valid input", () => {
      const errors =
        validateInverterSizingInput(validInput);

      expect(errors).toHaveLength(0);
    });

    it("accepts valid input when optional fields are omitted", () => {
      const errors =
        validateInverterSizingInput({
          continuousLoadW: 2000,
          surgeLoadW: 4000,
          systemVoltageV: 48,
          inverterEfficiency: 0.9,
        });

      expect(errors).toHaveLength(0);
    });
  });

  describe("continuous load", () => {
    it("rejects zero continuous load", () => {
      const errors =
        validateInverterSizingInput({
          ...validInput,
          continuousLoadW: 0,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_CONTINUOUS_LOAD",
        ),
      ).toBe(true);
    });

    it("rejects negative continuous load", () => {
      const errors =
        validateInverterSizingInput({
          ...validInput,
          continuousLoadW: -1,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_CONTINUOUS_LOAD",
        ),
      ).toBe(true);
    });

    it("rejects non-finite continuous load", () => {
      const errors =
        validateInverterSizingInput({
          ...validInput,
          continuousLoadW: Number.NaN,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_CONTINUOUS_LOAD",
        ),
      ).toBe(true);
    });
  });

  describe("surge load", () => {
    it("rejects zero surge load", () => {
      const errors =
        validateInverterSizingInput({
          ...validInput,
          surgeLoadW: 0,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_SURGE_LOAD",
        ),
      ).toBe(true);
    });

    it("rejects negative surge load", () => {
      const errors =
        validateInverterSizingInput({
          ...validInput,
          surgeLoadW: -1,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_SURGE_LOAD",
        ),
      ).toBe(true);
    });

    it("rejects surge load below continuous load", () => {
      const errors =
        validateInverterSizingInput({
          ...validInput,
          continuousLoadW: 4000,
          surgeLoadW: 3000,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_SURGE_LOAD_RELATIONSHIP",
        ),
      ).toBe(true);
    });

    it("accepts surge load equal to continuous load", () => {
      const errors =
        validateInverterSizingInput({
          ...validInput,
          continuousLoadW: 4000,
          surgeLoadW: 4000,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_SURGE_LOAD_RELATIONSHIP",
        ),
      ).toBe(false);
    });
  });

  describe("system voltage", () => {
    it("rejects zero system voltage", () => {
      const errors =
        validateInverterSizingInput({
          ...validInput,
          systemVoltageV: 0,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_SYSTEM_VOLTAGE",
        ),
      ).toBe(true);
    });

    it("rejects negative system voltage", () => {
      const errors =
        validateInverterSizingInput({
          ...validInput,
          systemVoltageV: -48,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_SYSTEM_VOLTAGE",
        ),
      ).toBe(true);
    });
  });

  describe("inverter efficiency", () => {
    it("rejects zero efficiency", () => {
      const errors =
        validateInverterSizingInput({
          ...validInput,
          inverterEfficiency: 0,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_INVERTER_EFFICIENCY",
        ),
      ).toBe(true);
    });

    it("rejects efficiency greater than 1", () => {
      const errors =
        validateInverterSizingInput({
          ...validInput,
          inverterEfficiency: 1.01,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_INVERTER_EFFICIENCY",
        ),
      ).toBe(true);
    });

    it("accepts efficiency of 1", () => {
      const errors =
        validateInverterSizingInput({
          ...validInput,
          inverterEfficiency: 1,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_INVERTER_EFFICIENCY",
        ),
      ).toBe(false);
    });
  });

  describe("power factor", () => {
    it("accepts omitted power factor", () => {
      const {
        powerFactor: _powerFactor,
        ...input
      } = validInput;

      const errors =
        validateInverterSizingInput(input);

      expect(errors).toHaveLength(0);
    });

    it("rejects zero power factor", () => {
      const errors =
        validateInverterSizingInput({
          ...validInput,
          powerFactor: 0,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_POWER_FACTOR",
        ),
      ).toBe(true);
    });

    it("rejects power factor greater than 1", () => {
      const errors =
        validateInverterSizingInput({
          ...validInput,
          powerFactor: 1.1,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_POWER_FACTOR",
        ),
      ).toBe(true);
    });

    it("accepts power factor of 1", () => {
      const errors =
        validateInverterSizingInput({
          ...validInput,
          powerFactor: 1,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_POWER_FACTOR",
        ),
      ).toBe(false);
    });
  });

  describe("inverter continuous rating", () => {
    it("accepts omitted continuous rating", () => {
      const {
        inverterRatedPowerW: _inverterRatedPowerW,
        ...input
      } = validInput;

      const errors =
        validateInverterSizingInput(input);

      expect(errors).toHaveLength(0);
    });

    it("rejects zero continuous rating", () => {
      const errors =
        validateInverterSizingInput({
          ...validInput,
          inverterRatedPowerW: 0,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_INVERTER_RATING",
        ),
      ).toBe(true);
    });

    it("rejects negative continuous rating", () => {
      const errors =
        validateInverterSizingInput({
          ...validInput,
          inverterRatedPowerW: -1,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_INVERTER_RATING",
        ),
      ).toBe(true);
    });
  });

  describe("inverter surge rating", () => {
    it("accepts omitted surge rating", () => {
      const {
        inverterSurgePowerW: _inverterSurgePowerW,
        ...input
      } = validInput;

      const errors =
        validateInverterSizingInput(input);

      expect(errors).toHaveLength(0);
    });

    it("rejects zero surge rating", () => {
      const errors =
        validateInverterSizingInput({
          ...validInput,
          inverterSurgePowerW: 0,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_INVERTER_SURGE_RATING",
        ),
      ).toBe(true);
    });

    it("rejects surge rating below continuous rating", () => {
      const errors =
        validateInverterSizingInput({
          ...validInput,
          inverterRatedPowerW: 5000,
          inverterSurgePowerW: 4000,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_INVERTER_SURGE_RELATIONSHIP",
        ),
      ).toBe(true);
    });

    it("accepts surge rating equal to continuous rating", () => {
      const errors =
        validateInverterSizingInput({
          ...validInput,
          inverterRatedPowerW: 5000,
          inverterSurgePowerW: 5000,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_INVERTER_SURGE_RELATIONSHIP",
        ),
      ).toBe(false);
    });
  });

  describe("inverter input voltage range", () => {
    it("accepts omitted input voltage limits", () => {
      const {
        inverterInputVoltageMinV:
          _inverterInputVoltageMinV,
        inverterInputVoltageMaxV:
          _inverterInputVoltageMaxV,
        ...input
      } = validInput;

      const errors =
        validateInverterSizingInput(input);

      expect(errors).toHaveLength(0);
    });

    it("rejects zero minimum input voltage", () => {
      const errors =
        validateInverterSizingInput({
          ...validInput,
          inverterInputVoltageMinV: 0,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_INPUT_VOLTAGE_MIN",
        ),
      ).toBe(true);
    });

    it("rejects zero maximum input voltage", () => {
      const errors =
        validateInverterSizingInput({
          ...validInput,
          inverterInputVoltageMaxV: 0,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_INPUT_VOLTAGE_MAX",
        ),
      ).toBe(true);
    });

    it("rejects a minimum voltage greater than the maximum", () => {
      const errors =
        validateInverterSizingInput({
          ...validInput,
          inverterInputVoltageMinV: 72,
          inverterInputVoltageMaxV: 48,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_INPUT_VOLTAGE_RANGE",
        ),
      ).toBe(true);
    });

    it("accepts equal minimum and maximum input voltage", () => {
      const errors =
        validateInverterSizingInput({
          ...validInput,
          inverterInputVoltageMinV: 48,
          inverterInputVoltageMaxV: 48,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_INPUT_VOLTAGE_RANGE",
        ),
      ).toBe(false);
    });
  });

  describe("AC output voltage", () => {
    it("accepts omitted output voltages", () => {
      const {
        requiredOutputVoltageV:
          _requiredOutputVoltageV,
        inverterOutputVoltageV:
          _inverterOutputVoltageV,
        ...input
      } = validInput;

      const errors =
        validateInverterSizingInput(input);

      expect(errors).toHaveLength(0);
    });

    it("rejects zero required output voltage", () => {
      const errors =
        validateInverterSizingInput({
          ...validInput,
          requiredOutputVoltageV: 0,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_REQUIRED_OUTPUT_VOLTAGE",
        ),
      ).toBe(true);
    });

    it("rejects zero inverter output voltage", () => {
      const errors =
        validateInverterSizingInput({
          ...validInput,
          inverterOutputVoltageV: 0,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_INVERTER_OUTPUT_VOLTAGE",
        ),
      ).toBe(true);
    });
  });

  describe("multiple validation errors", () => {
    it("returns all applicable validation errors", () => {
      const errors =
        validateInverterSizingInput({
          ...validInput,
          continuousLoadW: 0,
          surgeLoadW: 0,
          systemVoltageV: 0,
          inverterEfficiency: 0,
          powerFactor: 0,
        });

      expect(errors.length).toBeGreaterThanOrEqual(
        5,
      );

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_CONTINUOUS_LOAD",
        ),
      ).toBe(true);

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_SURGE_LOAD",
        ),
      ).toBe(true);

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_SYSTEM_VOLTAGE",
        ),
      ).toBe(true);

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_INVERTER_EFFICIENCY",
        ),
      ).toBe(true);

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_POWER_FACTOR",
        ),
      ).toBe(true);
    });
  });
});