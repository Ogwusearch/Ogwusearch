
import { describe, expect, it } from "vitest";

import {
  validatePositiveNumber,
  validateNonNegativeNumber,
  validateRange,
} from "../index";

describe("engineering-validation", () => {
  it("accepts a positive number", () => {
    const result = validatePositiveNumber(
      "power",
      5000,
    );

    expect(result).toHaveLength(0);
  });

  it("rejects zero when a positive value is required", () => {
    const result = validatePositiveNumber(
      "power",
      0,
    );

    expect(result).toHaveLength(1);
    expect(result[0]!.code).toBe(
      "MUST_BE_POSITIVE",
    );
  });

  it("rejects negative values", () => {
    const result = validateNonNegativeNumber(
      "energy",
      -5,
    );

    expect(result).toHaveLength(1);
    expect(result[0]!.code).toBe(
      "MUST_BE_NON_NEGATIVE",
    );
  });

  it("rejects values outside a range", () => {
    const result = validateRange(
      "efficiency",
      120,
      0,
      100,
    );

    expect(result).toHaveLength(1);
    expect(result[0]!.code).toBe(
      "OUT_OF_RANGE",
    );
  });

  it("rejects a missing value", () => {
    const result = validatePositiveNumber(
      "power",
      undefined,
    );

    expect(result).toHaveLength(1);
    expect(result[0]!.code).toBe(
      "INVALID_NUMBER",
    );
  });

  it("rejects non-numeric values", () => {
    const result = validatePositiveNumber(
      "power",
      "5000",
    );

    expect(result).toHaveLength(1);
    expect(result[0]!.code).toBe(
      "INVALID_NUMBER",
    );
  });
});