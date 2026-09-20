import { describe, expect, it } from "vitest";

import { validateLoadAudit } from "../validation";
import type { LoadAuditInput, LoadItemInput } from "../input";

const validLoad: LoadItemInput = {
  appliance: "LED Lamp",
  quantity: 1,
  ratedPowerW: 10,
  hoursPerDay: 5,
};

const validInput: LoadAuditInput = {
  loads: [validLoad],
  diversityFactor: 0.8,
  designMargin: 0.2,
};

describe("validateLoadAudit", () => {
  it("accepts valid input", () => {
    const result = validateLoadAudit(validInput);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects an empty load list", () => {
    const result = validateLoadAudit({
      ...validInput,
      loads: [],
    });

    expect(result.valid).toBe(false);
    expect(
      result.errors.some(
        (error) => error.code === "EMPTY_LOAD_LIST",
      ),
    ).toBe(true);
  });

  it("rejects zero or negative quantity", () => {
    const result = validateLoadAudit({
      ...validInput,
      loads: [
        {
          ...validLoad,
          quantity: 0,
        },
      ],
    });

    expect(result.valid).toBe(false);
  });

  it("rejects negative rated power", () => {
    const result = validateLoadAudit({
      ...validInput,
      loads: [
        {
          ...validLoad,
          ratedPowerW: -100,
        },
      ],
    });

    expect(result.valid).toBe(false);
  });

  it("rejects hours above 24", () => {
    const result = validateLoadAudit({
      ...validInput,
      loads: [
        {
          ...validLoad,
          hoursPerDay: 25,
        },
      ],
    });

    expect(result.valid).toBe(false);
  });

  it("rejects invalid power factor", () => {
    const result = validateLoadAudit({
      ...validInput,
      loads: [
        {
          ...validLoad,
          powerFactor: 1.5,
        },
      ],
    });

    expect(result.valid).toBe(false);
  });

  it("warns about low power factor", () => {
    const result = validateLoadAudit({
      ...validInput,
      loads: [
        {
          ...validLoad,
          powerFactor: 0.7,
        },
      ],
    });

    expect(result.valid).toBe(true);
    expect(
      result.warnings.some(
        (warning) => warning.code === "LOW_POWER_FACTOR",
      ),
    ).toBe(true);
  });

  it("warns when no diversity reduction is applied", () => {
    const result = validateLoadAudit({
      ...validInput,
      diversityFactor: 1,
    });

    expect(
      result.warnings.some(
        (warning) => warning.code === "NO_DIVERSITY_REDUCTION",
      ),
    ).toBe(true);
  });

  it("warns when no design margin is applied", () => {
    const result = validateLoadAudit({
      ...validInput,
      designMargin: 0,
    });

    expect(
      result.warnings.some(
        (warning) => warning.code === "NO_DESIGN_MARGIN",
      ),
    ).toBe(true);
  });
});
