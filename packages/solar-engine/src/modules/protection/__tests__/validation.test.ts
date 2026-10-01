import { describe, expect, it } from "vitest";

import { validateProtection } from "../validation/index.js";

function validInput() {
  return {
    protection: {
      type: "AC_BREAKER" as const,
      mode: "AC" as const,
    },
    electrical: {
      operatingCurrentA: 10,
      systemVoltageV: 230,
    },
    design: {
      designMargin: 0.2,
    },
    device: {
      voltageRatingV: 400,
      currentRatingA: 16,
    },
  };
}

describe("protection validation", () => {
  it("accepts a valid protection input", () => {
    expect(validateProtection(validInput())).toEqual([]);
  });

  it("rejects a non-positive operating current", () => {
    const issues = validateProtection({
      ...validInput(),
      electrical: {
        operatingCurrentA: 0,
        systemVoltageV: 230,
      },
    });

    expect(
      issues.some(
        (x) => x.code === "INVALID_OPERATING_CURRENT",
      ),
    ).toBe(true);
  });

  it("rejects a non-positive system voltage", () => {
    const issues = validateProtection({
      ...validInput(),
      electrical: {
        operatingCurrentA: 10,
        systemVoltageV: 0,
      },
    });

    expect(
      issues.some(
        (x) => x.code === "INVALID_SYSTEM_VOLTAGE",
      ),
    ).toBe(true);
  });

  it("rejects a design margin outside 0..1", () => {
    const issues = validateProtection({
      ...validInput(),
      design: {
        designMargin: 1.2,
      },
    });

    expect(
      issues.some(
        (x) => x.code === "INVALID_DESIGN_MARGIN",
      ),
    ).toBe(true);
  });

  it("rejects a non-positive protection factor", () => {
    const issues = validateProtection({
      ...validInput(),
      design: {
        explicitProtectionFactor: 0,
      },
    });

    expect(
      issues.some(
        (x) => x.code === "INVALID_PROTECTION_FACTOR",
      ),
    ).toBe(true);
  });

  it("rejects design current below operating current", () => {
    const issues = validateProtection({
      ...validInput(),
      electrical: {
        operatingCurrentA: 10,
        designCurrentA: 8,
        systemVoltageV: 230,
      },
    });

    expect(
      issues.some(
        (x) =>
          x.code ===
          "DESIGN_CURRENT_BELOW_OPERATING_CURRENT",
      ),
    ).toBe(true);
  });

  it("enforces AC breaker / AC mode consistency", () => {
    const issues = validateProtection({
      ...validInput(),
      protection: {
        type: "AC_BREAKER",
        mode: "DC",
      },
    });

    expect(
      issues.some(
        (x) => x.code === "AC_BREAKER_REQUIRES_AC",
      ),
    ).toBe(true);
  });

  it("enforces DC fuse / DC mode consistency", () => {
    const issues = validateProtection({
      ...validInput(),
      protection: {
        type: "DC_FUSE",
        mode: "AC",
      },
    });

    expect(
      issues.some(
        (x) => x.code === "DC_FUSE_REQUIRES_DC",
      ),
    ).toBe(true);
  });

  it("enforces string-fuse / DC mode consistency", () => {
    const issues = validateProtection({
      ...validInput(),
      protection: {
        type: "STRING_FUSE",
        mode: "AC",
      },
    });

    expect(
      issues.some(
        (x) => x.code === "STRING_FUSE_REQUIRES_DC",
      ),
    ).toBe(true);
  });

  it("enforces string-fuse short-circuit current", () => {
    const issues = validateProtection({
      protection: {
        type: "STRING_FUSE",
        mode: "DC",
      },
      electrical: {
        operatingCurrentA: 10,
        systemVoltageV: 150,
      },
    });

    expect(
      issues.some(
        (x) =>
          x.code ===
          "STRING_FUSE_REQUIRES_SHORT_CIRCUIT_CURRENT",
      ),
    ).toBe(true);
  });

  it("rejects an invalid device current rating", () => {
    const issues = validateProtection({
      ...validInput(),
      device: {
        currentRatingA: 0,
        voltageRatingV: 400,
      },
    });

    expect(
      issues.some(
        (x) =>
          x.code ===
          "INVALID_DEVICE_CURRENT_RATING",
      ),
    ).toBe(true);
  });

  it("rejects an invalid device voltage rating", () => {
    const issues = validateProtection({
      ...validInput(),
      device: {
        currentRatingA: 16,
        voltageRatingV: 0,
      },
    });

    expect(
      issues.some(
        (x) =>
          x.code ===
          "INVALID_DEVICE_VOLTAGE_RATING",
      ),
    ).toBe(true);
  });

  it("requires fault current when interrupting rating is supplied", () => {
    const issues = validateProtection({
      ...validInput(),
      device: {
        currentRatingA: 16,
        voltageRatingV: 400,
        interruptingRatingA: 10000,
      },
    });

    expect(
      issues.some(
        (x) =>
          x.code ===
          "INTERRUPTING_CHECK_REQUIRES_FAULT_CURRENT",
      ),
    ).toBe(true);
  });
});