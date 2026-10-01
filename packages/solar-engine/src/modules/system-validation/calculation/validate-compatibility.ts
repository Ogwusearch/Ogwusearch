import type {
  CalculationResult,
} from "@ogwusearch/engineering-types";

import type {
  SystemValidationInput,
  SystemValidationCheck,
} from "../types/index.js";

import type {
  PeakDemandOutput,
} from "../../peak-demand/types/index.js";

import type {
  InverterOutput,
} from "../../inverter/types/index.js";

import type {
  ChargeControllerSizingValue,
} from "../../charge-controller/types/index.js";

import type {
  CableOutput,
} from "../../cable/types/index.js";

import type {
  VoltageDropOutput,
} from "../../voltage-drop/types/index.js";

import type {
  ProtectionOutput,
} from "../../protection/types/index.js";

function getValue<T>(
  result: CalculationResult | undefined,
): T | undefined {
  return result?.value as T | undefined;
}

export function validateCompatibility(
  input: SystemValidationInput,
): SystemValidationCheck[] {
  const checks: SystemValidationCheck[] = [];

  const peakDemand =
    getValue<PeakDemandOutput>(
      input.peakDemand,
    );

  const inverter =
    getValue<InverterOutput>(
      input.inverter,
    );

  const chargeController =
    getValue<ChargeControllerSizingValue>(
      input.chargeController,
    );

  const cable =
    getValue<CableOutput>(
      input.cable,
    );

  const protection =
    getValue<ProtectionOutput>(
      input.protection,
    );

  const voltageDrop =
    getValue<VoltageDropOutput>(
      input.voltageDrop,
    );

  // ----------------------------------------------------------
  // Inverter → Load
  // ----------------------------------------------------------

  if (
    peakDemand !== undefined &&
    inverter !== undefined
  ) {
    const selectedRating =
      inverter.inverterRatedPowerW;

    if (selectedRating !== undefined) {
      checks.push({
        code: "INVERTER_LOAD_CAPACITY_COMPATIBLE",
        name: "Inverter continuous capacity",
        status:
          selectedRating >=
          peakDemand.designPeakDemandW
            ? "PASS"
            : "FAIL",
        actual: selectedRating,
        expected:
          peakDemand.designPeakDemandW,
        message:
          selectedRating >=
          peakDemand.designPeakDemandW
            ? "Selected inverter continuous rating satisfies the design peak demand."
            : "Selected inverter continuous rating is below the design peak demand.",
      });
    } else {
      checks.push({
        code: "INVERTER_LOAD_CAPACITY_COMPATIBLE",
        name: "Inverter continuous capacity",
        status: "NOT_EVALUATED",
        actual:
          peakDemand.designPeakDemandW,
        message:
          "Inverter continuous rating is not available for system-level validation.",
      });
    }

    if (
      inverter.inverterSurgePowerW !== undefined
    ) {
      checks.push({
        code: "INVERTER_SURGE_CAPACITY_COMPATIBLE",
        name: "Inverter surge capacity",
        status:
          inverter.inverterSurgePowerW >=
          peakDemand.startingDemandW
            ? "PASS"
            : "FAIL",
        actual:
          inverter.inverterSurgePowerW,
        expected:
          peakDemand.startingDemandW,
        message:
          inverter.inverterSurgePowerW >=
          peakDemand.startingDemandW
            ? "Selected inverter surge rating satisfies the starting demand."
            : "Selected inverter surge rating is below the starting demand.",
      });
    }
  }

  // ----------------------------------------------------------
  // Inverter's own authoritative compatibility checks
  // ----------------------------------------------------------

  if (inverter !== undefined) {
    if (
      inverter.systemCompatible !== undefined
    ) {
      checks.push({
        code: "INVERTER_SYSTEM_COMPATIBLE",
        name: "Inverter compatibility",
        status:
          inverter.systemCompatible
            ? "PASS"
            : "FAIL",
        actual:
          inverter.systemCompatible,
        expected: true,
        message:
          inverter.systemCompatible
            ? "The inverter calculation reports compatible supplied configuration checks."
            : "The inverter calculation reports an incompatible supplied configuration.",
      });
    }
  }

  // ----------------------------------------------------------
  // Charge controller
  // ----------------------------------------------------------

  if (
    chargeController !== undefined &&
    chargeController.systemCompatible !== undefined
  ) {
    checks.push({
      code: "CHARGE_CONTROLLER_COMPATIBLE",
      name: "Charge controller compatibility",
      status:
        chargeController.systemCompatible
          ? "PASS"
          : "FAIL",
      actual:
        chargeController.systemCompatible,
      expected: true,
      message:
        chargeController.systemCompatible
          ? "The charge controller calculation reports compatible supplied checks."
          : "The charge controller calculation reports an incompatible supplied configuration.",
    });
  }

  // ----------------------------------------------------------
  // Cable current
  // ----------------------------------------------------------

  if (cable !== undefined) {
    checks.push({
      code: "CABLE_CURRENT_COMPATIBLE",
      name: "Cable current capacity",
      status:
        cable.selectedConductorAmpacityA >=
        cable.requiredAmpacityA
          ? "PASS"
          : "FAIL",
      actual:
        cable.selectedConductorAmpacityA,
      expected:
        cable.requiredAmpacityA,
      message:
        cable.selectedConductorAmpacityA >=
        cable.requiredAmpacityA
          ? "Selected conductor ampacity satisfies the required cable ampacity."
          : "Selected conductor ampacity is below the required cable ampacity.",
    });
  }

  // ----------------------------------------------------------
  // Cable → Protection
  // ----------------------------------------------------------

  if (
    cable !== undefined &&
    protection !== undefined
  ) {
    const selectedProtection =
      protection.selectedProtectiveCurrentA;

    if (
      selectedProtection !== undefined
    ) {
      checks.push({
        code: "PROTECTION_CABLE_COMPATIBLE",
        name: "Protection and cable compatibility",
        status:
          selectedProtection <=
          cable.selectedConductorAmpacityA
            ? "PASS"
            : "FAIL",
        actual:
          selectedProtection,
        expected:
          cable.selectedConductorAmpacityA,
        message:
          selectedProtection <=
          cable.selectedConductorAmpacityA
            ? "Selected protective current rating does not exceed the selected conductor ampacity."
            : "Selected protective current rating exceeds the selected conductor ampacity.",
      });
    }
  }

  // ----------------------------------------------------------
  // Voltage drop
  // ----------------------------------------------------------

  if (voltageDrop !== undefined) {
    if (
      voltageDrop.allowableVoltageDropPercent !==
      undefined
    ) {
      checks.push({
        code: "VOLTAGE_DROP_WITHIN_LIMIT",
        name: "Voltage drop limit",
        status:
          voltageDrop.voltageDropPercent <=
          voltageDrop.allowableVoltageDropPercent
            ? "PASS"
            : "FAIL",
        actual:
          voltageDrop.voltageDropPercent,
        expected:
          voltageDrop.allowableVoltageDropPercent,
        message:
          voltageDrop.voltageDropPercent <=
          voltageDrop.allowableVoltageDropPercent
            ? "Calculated voltage drop is within the allowable limit."
            : "Calculated voltage drop exceeds the allowable limit.",
      });
    } else if (
      voltageDrop.withinAllowableLimit !==
      undefined
    ) {
      checks.push({
        code: "VOLTAGE_DROP_WITHIN_LIMIT",
        name: "Voltage drop limit",
        status:
          voltageDrop.withinAllowableLimit
            ? "PASS"
            : "FAIL",
        actual:
          voltageDrop.withinAllowableLimit,
        expected: true,
        message:
          voltageDrop.withinAllowableLimit
            ? "Voltage drop satisfies the authoritative allowable-limit check."
            : "Voltage drop does not satisfy the authoritative allowable-limit check.",
      });
    } else {
      checks.push({
        code: "VOLTAGE_DROP_WITHIN_LIMIT",
        name: "Voltage drop limit",
        status: "NOT_EVALUATED",
        actual:
          voltageDrop.voltageDropPercent,
        message:
          "Voltage-drop result does not expose an allowable limit.",
      });
    }
  }

  // ----------------------------------------------------------
  // Protection compatibility
  // ----------------------------------------------------------

  if (protection !== undefined) {
    const compatibility =
      protection.compatibility;

    for (
      const [name, compatible] of [
        [
          "current",
          compatibility.currentCompatible,
        ],
        [
          "voltage",
          compatibility.voltageCompatible,
        ],
        [
          "interrupting",
          compatibility.interruptingCompatible,
        ],
      ] as const
    ) {
      if (compatible !== undefined) {
        checks.push({
          code:
            `PROTECTION_${name.toUpperCase()}_COMPATIBLE`,
          name:
            `Protection ${name} compatibility`,
          status:
            compatible
              ? "PASS"
              : "FAIL",
          actual: compatible,
          expected: true,
          message:
            compatible
              ? `Protection ${name} compatibility check passed.`
              : `Protection ${name} compatibility check failed.`,
        });
      }
    }
  }

  return checks;
}