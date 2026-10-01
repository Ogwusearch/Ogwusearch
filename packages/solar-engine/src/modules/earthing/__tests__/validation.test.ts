import {
  describe,
  expect,
  it,
} from "vitest";

import {
  validateEarthing,
} from "../validation/index.js";

import type {
  EarthingInput,
} from "../types/index.js";

const validInput: EarthingInput = {
  mode: "AC",

  electrical: {
    faultCurrentA: 1000,
    faultClearingTimeS: 0.2,
    conductorConstantA_SqrtS_PerMm2: 115,
  },
};

describe("earthing validation", () => {
  it("accepts valid input", () => {
    expect(
      validateEarthing(
        validInput,
      ),
    ).toHaveLength(0);
  });

  it("rejects non-positive fault current", () => {
    const issues =
      validateEarthing({
        ...validInput,
        electrical: {
          ...validInput.electrical,
          faultCurrentA: 0,
        },
      });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_FAULT_CURRENT",
      ),
    ).toBe(true);
  });

  it("rejects non-positive clearing time", () => {
    const issues =
      validateEarthing({
        ...validInput,
        electrical: {
          ...validInput.electrical,
          faultClearingTimeS: 0,
        },
      });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_FAULT_CLEARING_TIME",
      ),
    ).toBe(true);
  });

  it("rejects non-positive conductor constant", () => {
    const issues =
      validateEarthing({
        ...validInput,
        electrical: {
          ...validInput.electrical,
          conductorConstantA_SqrtS_PerMm2: 0,
        },
      });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_CONDUCTOR_CONSTANT",
      ),
    ).toBe(true);
  });

  it("rejects an invalid design margin", () => {
    const issues =
      validateEarthing({
        ...validInput,
        design: {
          designMargin: 1.5,
        },
      });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_DESIGN_MARGIN",
      ),
    ).toBe(true);
  });

  it("rejects invalid soil resistivity", () => {
    const issues =
      validateEarthing({
        ...validInput,
        electrical: {
          ...validInput.electrical,
          resistivityOhmM: 0,
        },
      });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_SOIL_RESISTIVITY",
      ),
    ).toBe(true);
  });
});