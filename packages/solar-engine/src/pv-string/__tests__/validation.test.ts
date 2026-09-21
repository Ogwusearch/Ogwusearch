import { describe, expect, it } from "vitest";

import { PV_STRING_ERROR_CODES } from "../errors";
import { validatePvStringInput } from "../validation";

describe("validatePvStringInput", () => {
  const validInput = {
    modulePowerW: 550,
    moduleVmpV: 41.5,
    moduleImpA: 13.25,
    moduleVocV: 49.5,
    moduleIscA: 14,
    modulesPerString: 10,
  };

  it("accepts valid PV string input", () => {
    const result = validatePvStringInput(validInput);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
  });

  it("rejects invalid module power", () => {
    const result = validatePvStringInput({
      ...validInput,
      modulePowerW: 0,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_STRING_ERROR_CODES.INVALID_MODULE_POWER,
        field: "modulePowerW",
        severity: "error",
      }),
    );
  });

  it("rejects invalid module Vmp", () => {
    const result = validatePvStringInput({
      ...validInput,
      moduleVmpV: 0,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_STRING_ERROR_CODES.INVALID_MODULE_VMP,
      }),
    );
  });

  it("rejects invalid module Imp", () => {
    const result = validatePvStringInput({
      ...validInput,
      moduleImpA: 0,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_STRING_ERROR_CODES.INVALID_MODULE_IMP,
      }),
    );
  });

  it("rejects invalid module Voc", () => {
    const result = validatePvStringInput({
      ...validInput,
      moduleVocV: 0,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_STRING_ERROR_CODES.INVALID_MODULE_VOC,
      }),
    );
  });

  it("rejects invalid module Isc", () => {
    const result = validatePvStringInput({
      ...validInput,
      moduleIscA: 0,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_STRING_ERROR_CODES.INVALID_MODULE_ISC,
      }),
    );
  });

  it("rejects invalid modules per string", () => {
    const result = validatePvStringInput({
      ...validInput,
      modulesPerString: 0,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_STRING_ERROR_CODES.INVALID_MODULES_PER_STRING,
      }),
    );
  });

  it("rejects non-integer modules per string", () => {
    const result = validatePvStringInput({
      ...validInput,
      modulesPerString: 2.5,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_STRING_ERROR_CODES.INVALID_MODULES_PER_STRING,
      }),
    );
  });

  it("rejects Vmp greater than Voc", () => {
    const result = validatePvStringInput({
      ...validInput,
      moduleVmpV: 50,
      moduleVocV: 49.5,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_STRING_ERROR_CODES.VMP_EXCEEDS_VOC,
      }),
    );
  });

  it("rejects Imp greater than Isc", () => {
    const result = validatePvStringInput({
      ...validInput,
      moduleImpA: 15,
      moduleIscA: 14,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_STRING_ERROR_CODES.IMP_EXCEEDS_ISC,
      }),
    );
  });

  it("collects multiple validation errors", () => {
    const result = validatePvStringInput({
      modulePowerW: 0,
      moduleVmpV: 0,
      moduleImpA: 0,
      moduleVocV: 0,
      moduleIscA: 0,
      modulesPerString: 0,
    });

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });

  it("does not mutate the input", () => {
    const input = { ...validInput };
    const original = { ...input };

    validatePvStringInput(input);

    expect(input).toEqual(original);
  });
});