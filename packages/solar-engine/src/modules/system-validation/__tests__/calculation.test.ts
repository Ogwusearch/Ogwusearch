import { describe, expect, it } from "vitest";

import {
  validateSystemConfiguration,
} from "../calculation/index.js";

import type {
  SystemValidationInput,
} from "../types/index.js";

function successfulResult<T extends object>(
  value: T,
) {
  return {
    status: "SUCCESS" as const,
    valid: true,
    value,
    errors: [],
    warnings: [],
    assumptions: [],
    trace: {
      steps: [],
    },
    metadata: {},
  };
}

describe("system-validation calculation", () => {
  it("evaluates inverter capacity against design peak demand", () => {
    const input: SystemValidationInput = {
      peakDemand: successfulResult({
        totalRunningPowerW: 4_000,
        totalIndividualDemandW: 4_000,
        diversityFactor: 1,
        normalCoincidentDemandW: 4_000,
        startingDemandW: 5_000,
        peakDemandW: 5_000,
        peakDemandKW: 5,
        demandMargin: 0.2,
        designPeakDemandW: 6_000,
        designPeakDemandKW: 6,
        loads: [],
      }),

      inverter: successfulResult({
        requiredContinuousOutputPowerW: 6_000,
        requiredSurgeOutputPowerW: 5_000,
        requiredContinuousInputPowerW: 6_500,
        requiredSurgeInputPowerW: 5_500,
        requiredContinuousDCInputCurrentA: 135.4166667,
        requiredSurgeDCInputCurrentA: 114.5833333,
        inverterRatedPowerW: 8_000,
        continuousMarginW: 2_000,
        continuousCompatible: true,
        inverterSurgePowerW: 10_000,
        surgeMarginW: 5_000,
        surgeCompatible: true,
        systemCompatible: true,
      }),
    };

    const output =
      validateSystemConfiguration(input);

    const check =
      output.checks.find(
        (item) =>
          item.code ===
          "INVERTER_LOAD_CAPACITY_COMPATIBLE",
      );

    expect(check).toBeDefined();
    expect(check?.status).toBe("PASS");
    expect(check?.actual).toBe(8_000);
    expect(check?.expected).toBe(6_000);
  });

  it("detects insufficient inverter continuous capacity", () => {
    const input: SystemValidationInput = {
      peakDemand: successfulResult({
        totalRunningPowerW: 4_000,
        totalIndividualDemandW: 4_000,
        diversityFactor: 1,
        normalCoincidentDemandW: 4_000,
        startingDemandW: 5_000,
        peakDemandW: 5_000,
        peakDemandKW: 5,
        demandMargin: 0.2,
        designPeakDemandW: 6_000,
        designPeakDemandKW: 6,
        loads: [],
      }),

      inverter: successfulResult({
        requiredContinuousOutputPowerW: 6_000,
        requiredSurgeOutputPowerW: 5_000,
        requiredContinuousInputPowerW: 6_500,
        requiredSurgeInputPowerW: 5_500,
        requiredContinuousDCInputCurrentA: 135,
        requiredSurgeDCInputCurrentA: 115,
        inverterRatedPowerW: 5_000,
        inverterSurgePowerW: 10_000,
        continuousCompatible: false,
        surgeCompatible: true,
        systemCompatible: false,
      }),
    };

    const output =
      validateSystemConfiguration(input);

    const check =
      output.checks.find(
        (item) =>
          item.code ===
          "INVERTER_LOAD_CAPACITY_COMPATIBLE",
      );

    expect(check?.status).toBe("FAIL");
    expect(output.valid).toBe(false);
    expect(output.failedCheckCount).toBeGreaterThan(0);

    expect(
      output.issues.some(
        (issue) =>
          issue.code ===
          "INVERTER_LOAD_CAPACITY_COMPATIBLE",
      ),
    ).toBe(true);
  });

  it("evaluates inverter surge capacity against starting demand", () => {
    const input: SystemValidationInput = {
      peakDemand: successfulResult({
        totalRunningPowerW: 4_000,
        totalIndividualDemandW: 4_000,
        diversityFactor: 1,
        normalCoincidentDemandW: 4_000,
        startingDemandW: 8_000,
        peakDemandW: 8_000,
        peakDemandKW: 8,
        demandMargin: 0,
        designPeakDemandW: 8_000,
        designPeakDemandKW: 8,
        loads: [],
      }),

      inverter: successfulResult({
        requiredContinuousOutputPowerW: 4_000,
        requiredSurgeOutputPowerW: 8_000,
        requiredContinuousInputPowerW: 4_400,
        requiredSurgeInputPowerW: 8_800,
        requiredContinuousDCInputCurrentA: 91.67,
        requiredSurgeDCInputCurrentA: 183.33,
        inverterRatedPowerW: 6_000,
        inverterSurgePowerW: 10_000,
      }),
    };

    const output =
      validateSystemConfiguration(input);

    const check =
      output.checks.find(
        (item) =>
          item.code ===
          "INVERTER_SURGE_CAPACITY_COMPATIBLE",
      );

    expect(check?.status).toBe("PASS");
    expect(check?.actual).toBe(10_000);
    expect(check?.expected).toBe(8_000);
  });

  it("evaluates cable current capacity", () => {
    const input: SystemValidationInput = {
      cable: successfulResult({
        mode: "DC",
        operatingCurrentA: 40,
        designCurrentA: 48,
        requiredAmpacityA: 48,
        selectedConductorAreaMm2: 10,
        selectedConductorAmpacityA: 60,
        conductorMaterial: "Copper",
        conductorCount: 2,
      }),
    };

    const output =
      validateSystemConfiguration(input);

    const check =
      output.checks.find(
        (item) =>
          item.code ===
          "CABLE_CURRENT_COMPATIBLE",
      );

    expect(check?.status).toBe("PASS");
    expect(check?.actual).toBe(60);
    expect(check?.expected).toBe(48);
  });

  it("evaluates cable and protection compatibility", () => {
    const input: SystemValidationInput = {
      cable: successfulResult({
        mode: "DC",
        operatingCurrentA: 40,
        designCurrentA: 48,
        requiredAmpacityA: 48,
        selectedConductorAreaMm2: 10,
        selectedConductorAmpacityA: 60,
        conductorMaterial: "Copper",
        conductorCount: 2,
      }),

      protection: successfulResult({
        protectionType: "DC_FUSE",
        electricalMode: "DC",
        operatingCurrentA: 40,
        designCurrentA: 48,
        requiredProtectiveCurrentA: 48,
        selectedProtectiveCurrentA: 50,
        requiredVoltageRatingV: 48,
        selectedDeviceVoltageRatingV: 100,
        compatibility: {
          currentCompatible: true,
          voltageCompatible: true,
          interruptingCompatible: true,
        },
      }),
    };

    const output =
      validateSystemConfiguration(input);

    const check =
      output.checks.find(
        (item) =>
          item.code ===
          "PROTECTION_CABLE_COMPATIBLE",
      );

    expect(check?.status).toBe("PASS");
    expect(check?.actual).toBe(50);
    expect(check?.expected).toBe(60);
  });

  it("evaluates voltage drop using the authoritative result", () => {
    const input: SystemValidationInput = {
      voltageDrop: successfulResult({
        mode: "DC",
        sourceVoltageV: 48,
        operatingCurrentA: 10,
        resistanceOhm: 0.1,
        voltageDropV: 1,
        voltageDropPercent: 2.0833333333,
        loadVoltageV: 47,
        allowableVoltageDropPercent: 3,
        withinAllowableLimit: true,
      }),
    };

    const output =
      validateSystemConfiguration(input);

    const check =
      output.checks.find(
        (item) =>
          item.code ===
          "VOLTAGE_DROP_WITHIN_LIMIT",
      );

    expect(check?.status).toBe("PASS");
    expect(check?.actual).toBeCloseTo(2.0833333333);
    expect(check?.expected).toBe(3);
  });

  it("detects voltage drop above the authoritative limit", () => {
    const input: SystemValidationInput = {
      voltageDrop: successfulResult({
        mode: "DC",
        sourceVoltageV: 48,
        operatingCurrentA: 10,
        resistanceOhm: 0.2,
        voltageDropV: 2,
        voltageDropPercent: 4.1666666667,
        loadVoltageV: 46,
        allowableVoltageDropPercent: 3,
        withinAllowableLimit: false,
      }),
    };

    const output =
      validateSystemConfiguration(input);

    const check =
      output.checks.find(
        (item) =>
          item.code ===
          "VOLTAGE_DROP_WITHIN_LIMIT",
      );

    expect(check?.status).toBe("FAIL");
    expect(output.valid).toBe(false);
  });

  it("preserves the authoritative charge-controller compatibility result", () => {
    const input: SystemValidationInput = {
      chargeController: successfulResult({
        pvChargingCurrentA: 100,
        controllerOutputCurrentA: 95,
        requiredControllerCurrentA: 114,
        requiredControllerPowerW: 5_472,
        controllerRatedCurrentA: 120,
        controllerCurrentMarginA: 6,
        currentCompatible: true,
        voltageCompatible: true,
        mpptCompatible: true,
        pvCurrentCompatible: true,
        systemCompatible: true,
      }),
    };

    const output =
      validateSystemConfiguration(input);

    const check =
      output.checks.find(
        (item) =>
          item.code ===
          "CHARGE_CONTROLLER_COMPATIBLE",
      );

    expect(check?.status).toBe("PASS");
    expect(check?.actual).toBe(true);
    expect(check?.expected).toBe(true);
  });
});