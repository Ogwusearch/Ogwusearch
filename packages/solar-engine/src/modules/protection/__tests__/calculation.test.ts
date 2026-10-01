import { describe, expect, it } from "vitest";

import {
  calculateACBreaker,
  calculateDCFUse,
  calculateOvercurrentDevice,
  calculateStringFuse,
} from "../calculation/index.js";

const availableRatings = [
  16,
  20,
  25,
  32,
  40,
  50,
  63,
  80,
  100,
] as const;

describe("protection calculations", () => {
  it("sizes an AC breaker from operating current and design margin", () => {
    const result = calculateACBreaker({
      protection: {
        type: "AC_BREAKER",
        mode: "AC",
      },
      electrical: {
        operatingCurrentA: 18,
        systemVoltageV: 230,
      },
      design: {
        designMargin: 0.2,
      },
      device: {
        availableCurrentRatingsA: availableRatings,
      },
    });

    expect(result.designCurrentA).toBeCloseTo(21.6, 10);
    expect(result.requiredProtectiveCurrentA).toBeCloseTo(21.6, 10);
    expect(result.selectedProtectiveCurrentA).toBe(25);
    expect(result.requiredVoltageRatingV).toBe(230);
  });

  it("sizes a DC fuse from an explicit design current", () => {
    const result = calculateDCFUse({
      protection: {
        type: "DC_FUSE",
        mode: "DC",
      },
      electrical: {
        operatingCurrentA: 20,
        designCurrentA: 30,
        systemVoltageV: 48,
        shortCircuitCurrentA: 40,
      },
      device: {
        availableCurrentRatingsA: availableRatings,
      },
    });

    expect(result.designCurrentA).toBe(30);
    expect(result.requiredProtectiveCurrentA).toBe(30);
    expect(result.selectedProtectiveCurrentA).toBe(32);
    expect(result.interruptingRatingRequirementA).toBe(40);
  });

  it("uses the smallest available rating that satisfies the requirement", () => {
    const result = calculateOvercurrentDevice({
      protection: {
        type: "OVERCURRENT_DEVICE",
        mode: "DC",
      },
      electrical: {
        operatingCurrentA: 50,
        systemVoltageV: 48,
      },
      device: {
        availableCurrentRatingsA: availableRatings,
      },
    });

    expect(result.requiredProtectiveCurrentA).toBe(50);
    expect(result.selectedProtectiveCurrentA).toBe(50);
  });

  it("requires short-circuit current for string-fuse calculations", () => {
    const result = calculateStringFuse({
      protection: {
        type: "STRING_FUSE",
        mode: "DC",
      },
      electrical: {
        operatingCurrentA: 10,
        systemVoltageV: 150,
        shortCircuitCurrentA: 12,
      },
      device: {
        availableCurrentRatingsA: availableRatings,
      },
    });

    expect(result.requiredProtectiveCurrentA).toBe(10);
    expect(result.interruptingRatingRequirementA).toBe(12);
    expect(result.selectedProtectiveCurrentA).toBe(16);
  });

  it("uses an explicitly supplied device current rating", () => {
    const result = calculateACBreaker({
      protection: {
        type: "AC_BREAKER",
        mode: "AC",
      },
      electrical: {
        operatingCurrentA: 18,
        systemVoltageV: 230,
      },
      design: {
        designMargin: 0.2,
      },
      device: {
        currentRatingA: 32,
      },
    });

    expect(result.designCurrentA).toBeCloseTo(21.6, 10);
    expect(result.selectedProtectiveCurrentA).toBe(32);
    expect(result.compatibility.currentCompatible).toBe(true);
  });

  it("reports incompatible device ratings", () => {
    const result = calculateACBreaker({
      protection: {
        type: "AC_BREAKER",
        mode: "AC",
      },
      electrical: {
        operatingCurrentA: 18,
        systemVoltageV: 230,
      },
      design: {
        designMargin: 0.2,
      },
      device: {
        currentRatingA: 20,
        voltageRatingV: 220,
        interruptingRatingA: 10,
      },
    });

    expect(result.designCurrentA).toBeCloseTo(21.6, 10);
    expect(result.selectedProtectiveCurrentA).toBe(20);

    expect(result.compatibility.currentCompatible).toBe(false);
    expect(result.compatibility.voltageCompatible).toBe(false);
  });
});