import { describe, expect, it } from "vitest";

import { PV_ARRAY_ERROR_CODES } from "../errors";
import { validatePvArrayInput } from "../validation";
import { PV_ARRAY_WARNING_CODES } from "../warnings";
import type { PvArrayInput } from "../types";

const validInput: PvArrayInput = {
  modulePowerW: 550,
  moduleVmpV: 41.5,
  moduleImpA: 13.25,
  moduleVocV: 49.5,
  moduleIscA: 14.1,
  modulesPerString: 10,
  parallelStrings: 4,
};

describe("validatePvArrayInput", () => {
  it("accepts a valid PV array input", () => {
    const result = validatePvArrayInput(validInput);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
  });

  it("rejects non-finite module power", () => {
    const input: PvArrayInput = {
      ...validInput,
      modulePowerW: Number.NaN,
    };

    const result = validatePvArrayInput(input);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_ARRAY_ERROR_CODES.INVALID_MODULE_POWER,
        field: "modulePowerW",
        severity: "error",
      }),
    );
  });

  it("rejects zero module power", () => {
    const input: PvArrayInput = {
      ...validInput,
      modulePowerW: 0,
    };

    const result = validatePvArrayInput(input);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_ARRAY_ERROR_CODES.INVALID_MODULE_POWER,
        field: "modulePowerW",
      }),
    );
  });

  it("rejects invalid module voltage", () => {
    const input: PvArrayInput = {
      ...validInput,
      moduleVmpV: 0,
      moduleVocV: 0,
    };

    const result = validatePvArrayInput(input);

    expect(result.valid).toBe(false);

    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_ARRAY_ERROR_CODES.INVALID_MODULE_VMP,
        field: "moduleVmpV",
      }),
    );

    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_ARRAY_ERROR_CODES.INVALID_MODULE_VOC,
        field: "moduleVocV",
      }),
    );
  });

  it("rejects invalid module current", () => {
    const input: PvArrayInput = {
      ...validInput,
      moduleImpA: 0,
      moduleIscA: 0,
    };

    const result = validatePvArrayInput(input);

    expect(result.valid).toBe(false);

    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_ARRAY_ERROR_CODES.INVALID_MODULE_IMP,
        field: "moduleImpA",
      }),
    );

    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_ARRAY_ERROR_CODES.INVALID_MODULE_ISC,
        field: "moduleIscA",
      }),
    );
  });

  it("rejects non-integer modules per string", () => {
    const input: PvArrayInput = {
      ...validInput,
      modulesPerString: 10.5,
    };

    const result = validatePvArrayInput(input);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_ARRAY_ERROR_CODES.INVALID_MODULES_PER_STRING,
        field: "modulesPerString",
      }),
    );
  });

  it("rejects zero modules per string", () => {
    const input: PvArrayInput = {
      ...validInput,
      modulesPerString: 0,
    };

    const result = validatePvArrayInput(input);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_ARRAY_ERROR_CODES.INVALID_MODULES_PER_STRING,
        field: "modulesPerString",
      }),
    );
  });

  it("rejects non-integer parallel strings", () => {
    const input: PvArrayInput = {
      ...validInput,
      parallelStrings: 2.5,
    };

    const result = validatePvArrayInput(input);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_ARRAY_ERROR_CODES.INVALID_PARALLEL_STRINGS,
        field: "parallelStrings",
      }),
    );
  });

  it("rejects zero parallel strings", () => {
    const input: PvArrayInput = {
      ...validInput,
      parallelStrings: 0,
    };

    const result = validatePvArrayInput(input);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_ARRAY_ERROR_CODES.INVALID_PARALLEL_STRINGS,
        field: "parallelStrings",
      }),
    );
  });

  it("rejects Vmp greater than Voc", () => {
    const input: PvArrayInput = {
      ...validInput,
      moduleVmpV: 52,
      moduleVocV: 49.5,
    };

    const result = validatePvArrayInput(input);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_ARRAY_ERROR_CODES.VMP_EXCEEDS_VOC,
        field: "moduleVmpV",
      }),
    );
  });

  it("rejects Imp greater than Isc", () => {
    const input: PvArrayInput = {
      ...validInput,
      moduleImpA: 15,
      moduleIscA: 14.1,
    };

    const result = validatePvArrayInput(input);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_ARRAY_ERROR_CODES.IMP_EXCEEDS_ISC,
        field: "moduleImpA",
      }),
    );
  });

  it("rejects array Voc above the configured limit", () => {
    const input: PvArrayInput = {
      ...validInput,
      modulesPerString: 10,
      maxArrayVoltageV: 400,
    };

    const result = validatePvArrayInput(input);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_ARRAY_ERROR_CODES.VOC_EXCEEDS_LIMIT,
        field: "maxArrayVoltageV",
      }),
    );
  });

  it("rejects array Isc above the configured limit", () => {
    const input: PvArrayInput = {
      ...validInput,
      parallelStrings: 4,
      maxArrayCurrentA: 50,
    };

    const result = validatePvArrayInput(input);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_ARRAY_ERROR_CODES.ISC_EXCEEDS_LIMIT,
        field: "maxArrayCurrentA",
      }),
    );
  });

  it("rejects array power above the configured limit", () => {
    const input: PvArrayInput = {
      ...validInput,
      maxArrayPowerW: 20000,
    };

    const result = validatePvArrayInput(input);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_ARRAY_ERROR_CODES.POWER_EXCEEDS_LIMIT,
        field: "maxArrayPowerW",
      }),
    );
  });

  it("rejects invalid optional maximum voltage", () => {
    const input: PvArrayInput = {
      ...validInput,
      maxArrayVoltageV: 0,
    };

    const result = validatePvArrayInput(input);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_ARRAY_ERROR_CODES.INVALID_MAX_VOLTAGE,
        field: "maxArrayVoltageV",
      }),
    );
  });

  it("rejects invalid optional maximum current", () => {
    const input: PvArrayInput = {
      ...validInput,
      maxArrayCurrentA: -1,
    };

    const result = validatePvArrayInput(input);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_ARRAY_ERROR_CODES.INVALID_MAX_CURRENT,
        field: "maxArrayCurrentA",
      }),
    );
  });

  it("rejects invalid optional maximum power", () => {
    const input: PvArrayInput = {
      ...validInput,
      maxArrayPowerW: Number.POSITIVE_INFINITY,
    };

    const result = validatePvArrayInput(input);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_ARRAY_ERROR_CODES.INVALID_MAX_POWER,
        field: "maxArrayPowerW",
      }),
    );
  });

  it("collects multiple validation errors", () => {
    const input: PvArrayInput = {
      ...validInput,
      modulePowerW: 0,
      moduleVmpV: 0,
      moduleImpA: 0,
      moduleVocV: 0,
      moduleIscA: 0,
      modulesPerString: 0,
      parallelStrings: 0,
    };

    const result = validatePvArrayInput(input);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(7);
  });

  it("returns a warning for a single-module series string", () => {
    const input: PvArrayInput = {
      ...validInput,
      modulesPerString: 1,
    };

    const result = validatePvArrayInput(input);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toContainEqual(
      expect.objectContaining({
        code: PV_ARRAY_WARNING_CODES.SINGLE_MODULE_STRING,
        field: "modulesPerString",
        severity: "warning",
      }),
    );
  });

  it("does not treat warnings as validation errors", () => {
    const input: PvArrayInput = {
      ...validInput,
      modulesPerString: 1,
    };

    const result = validatePvArrayInput(input);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("does not mutate the input", () => {
    const input: PvArrayInput = {
      ...validInput,
    };

    const original = { ...input };

    validatePvArrayInput(input);

    expect(input).toEqual(original);
  });
});