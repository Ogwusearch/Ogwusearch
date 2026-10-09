import { describe, expect, it } from "vitest";

import { runLoadAudit } from "../../src/modules/load/index.js";
import { runEnergyAnalysis } from "../../src/modules/energy/index.js";
import { runPeakDemand } from "../../src/modules/peak-demand/index.js";
import { runPVSizing } from "../../src/modules/pv-sizing/index.js";
import { runPvArray } from "../../src/modules/pv-array/index.js";
import { runPvString } from "../../src/modules/pv-string/index.js";
import { runBatterySizing } from "@ogwusearch/battery-engine";
import { runInverterSizing } from "../../src/modules/inverter/index.js";
import {
  runChargeControllerSizing,
} from "../../src/modules/charge-controller/index.js";
import { runCableSizing } from "../../src/modules/cable/index.js";
import { runVoltageDrop } from "../../src/modules/voltage-drop/index.js";
import {
  runProtectionSizing,
} from "../../src/modules/protection/index.js";
import {
  runSystemValidation,
} from "../../src/modules/system-validation/index.js";
import { runBOM } from "../../src/modules/bom/index.js";
import { runCosting } from "../../src/modules/costing/index.js";
import { runReports } from "../../src/modules/reports/index.js";

import { hybridSystem } from "../fixtures/hybrid-system.js";

describe("Hybrid solar system integration", () => {
  it("executes the complete hybrid engineering pipeline", () => {
    const fixture = hybridSystem;

    // ----------------------------------------------------------
    // 1. Load audit
    // ----------------------------------------------------------

    const load = runLoadAudit({
      loads: fixture.loads,
      diversityFactor: 1,
      designMargin: 0.2,
    });

    expect(load.valid).toBe(true);
    expect(load.value).toBeDefined();

    const loadValue = load.value!;

    // ----------------------------------------------------------
    // 2. Energy analysis
    // ----------------------------------------------------------

    const energy = runEnergyAnalysis({
      loads: fixture.loads.map((item, index) => ({
        loadId: item.id,
        runningLoadW:
          loadValue.loads[index]!.runningLoadW,
        operatingHoursPerDay:
          item.operatingHoursPerDay,
        operatingDaysPerMonth:
          item.operatingDaysPerMonth,
      })),
      systemLossFactor: 0.1,
      designMargin: 0.2,
    });

    expect(energy.valid).toBe(true);
    expect(energy.value).toBeDefined();

    expect(
      energy.value!.totalDailyEnergyWh,
    ).toBeGreaterThan(0);

    // ----------------------------------------------------------
    // 3. Peak demand
    // ----------------------------------------------------------

    const peakDemand = runPeakDemand({
      loads: fixture.loads.map((item, index) => ({
        loadId: item.id,
        runningPowerW:
          loadValue.loads[index]!.runningLoadW,
        demandFactor: item.demandFactor,
      })),
      diversityFactor: 1,
      demandMargin: 0.2,
    });

    expect(peakDemand.valid).toBe(true);
    expect(peakDemand.value).toBeDefined();

    expect(
      peakDemand.value!.designPeakDemandW,
    ).toBe(
      loadValue.designPeakDemandW,
    );

    // ----------------------------------------------------------
    // 4. PV sizing
    // ----------------------------------------------------------

    const pvSizing = runPVSizing({
      dailyEnergyKWh:
        energy.value!.designDailyEnergyWh / 1000,
      peakSunHours: 5,
      systemEfficiency: 0.8,
      panelPowerW: fixture.pv.modulePowerW,
      designMargin: 0.2,
    });

    expect(pvSizing.valid).toBe(true);
    expect(pvSizing.value).toBeDefined();

    expect(
      pvSizing.value!.requiredPVPowerW,
    ).toBeGreaterThan(0);

    // ----------------------------------------------------------
    // 5. PV array
    // ----------------------------------------------------------

    const pvArray = runPvArray({
      ...fixture.pv,
    });

    expect(pvArray.valid).toBe(true);
    expect(pvArray.value).toBeDefined();

    expect(
      pvArray.value!.totalModules,
    ).toBe(
      fixture.pv.modulesPerString *
        fixture.pv.parallelStrings,
    );

    expect(
      pvArray.value!.arrayPowerW,
    ).toBe(
      fixture.pv.modulePowerW *
        fixture.pv.modulesPerString *
        fixture.pv.parallelStrings,
    );

    // ----------------------------------------------------------
    // 6. PV string
    // ----------------------------------------------------------

    const pvString = runPvString({
      modulePowerW:
        fixture.pv.modulePowerW,
      moduleVmpV:
        fixture.pv.moduleVmpV,
      moduleImpA:
        fixture.pv.moduleImpA,
      moduleVocV:
        fixture.pv.moduleVocV,
      moduleIscA:
        fixture.pv.moduleIscA,
      modulesPerString:
        fixture.pv.modulesPerString,
    });

    expect(pvString.valid).toBe(true);
    expect(pvString.value).toBeDefined();

    expect(
      pvString.value!.stringPowerW,
    ).toBe(
      fixture.pv.modulePowerW *
        fixture.pv.modulesPerString,
    );

    // ----------------------------------------------------------
    // 7. Battery
    // ----------------------------------------------------------

    const battery = runBatterySizing({
      dailyEnergyKWh:
        energy.value!.designDailyEnergyWh / 1000,
      ...fixture.battery,
    });

    expect(battery.valid).toBe(true);
    expect(battery.value).toBeDefined();

    expect(
      battery.value!.requiredBatteryCapacityAh,
    ).toBeGreaterThan(0);

    // ----------------------------------------------------------
    // 8. Inverter
    // ----------------------------------------------------------

    const continuousLoadW =
      peakDemand.value!.designPeakDemandW;

    const surgeLoadW = Math.max(
      peakDemand.value!.startingDemandW,
      continuousLoadW,
    );

    const inverter = runInverterSizing({
      continuousLoadW,
      surgeLoadW,
      ...fixture.inverter,
    });

    expect(inverter.valid).toBe(true);
    expect(inverter.value).toBeDefined();

    expect(
      inverter.value!.requiredContinuousOutputPowerW,
    ).toBeGreaterThan(0);

    expect(
      inverter.value!.requiredSurgeOutputPowerW,
    ).toBeGreaterThanOrEqual(
      inverter.value!.requiredContinuousOutputPowerW,
    );

    // ----------------------------------------------------------
    // 9. Charge controller
    // ----------------------------------------------------------

    const chargeController =
      runChargeControllerSizing({
        ...fixture.chargeController,

        pvArrayPowerW:
          pvArray.value!.arrayPowerW,

        pvArrayVmpV:
          pvArray.value!.arrayVmpV,

        pvArrayVocV:
          pvArray.value!.arrayVocV,

        pvArrayImpA:
          pvArray.value!.arrayImpA,

        pvArrayIscA:
          pvArray.value!.arrayIscA,

        batteryVoltageV:
          fixture.battery.systemVoltageV,
      });

    expect(chargeController.valid).toBe(true);
    expect(chargeController.value).toBeDefined();

    expect(
      chargeController.value!
        .requiredControllerCurrentA,
    ).toBeGreaterThan(0);

    expect(
      chargeController.value!
        .requiredControllerPowerW,
    ).toBeGreaterThan(0);

    expect(
      chargeController.value!.currentCompatible,
    ).toBe(true);

    expect(
      chargeController.value!.voltageCompatible,
    ).toBe(true);

    expect(
      chargeController.value!.mpptCompatible,
    ).toBe(true);

    expect(
      chargeController.value!.pvCurrentCompatible,
    ).toBe(true);

    expect(
      chargeController.value!.systemCompatible,
    ).toBe(true);

    // ----------------------------------------------------------
    // 10. Cable sizing
    // ----------------------------------------------------------

    const cable = runCableSizing({
      ...fixture.cable,

      operatingCurrentA:
        chargeController.value!
          .requiredControllerCurrentA,
    });

    if (!cable.valid) {
      console.error("HYBRID CABLE RESULT:", {
        valid: cable.valid,
        status: cable.status,
        errors: cable.errors,
        warnings: cable.warnings,
        value: cable.value,
      });
    }

    expect(cable.valid).toBe(true);
    expect(cable.value).toBeDefined();

    expect(
      cable.value!.selectedConductorAmpacityA,
    ).toBeGreaterThanOrEqual(
      cable.value!.requiredAmpacityA,
    );

    // ----------------------------------------------------------
    // 11. Voltage drop
    // ----------------------------------------------------------

    const voltageDrop = runVoltageDrop({
      ...fixture.voltageDrop,

      operatingCurrentA:
        cable.value!.operatingCurrentA,
    });

    expect(voltageDrop.valid).toBe(true);
    expect(voltageDrop.value).toBeDefined();

    expect(
      voltageDrop.value!.voltageDropPercent,
    ).toBeGreaterThanOrEqual(0);

    // ----------------------------------------------------------
    // 12. Protection
    // ----------------------------------------------------------

    const protection = runProtectionSizing({
      ...fixture.protection,

      electrical: {
        ...fixture.protection.electrical,

        operatingCurrentA:
          cable.value!.operatingCurrentA,

        designCurrentA:
          cable.value!.requiredAmpacityA,
      },
    });

    expect(protection.valid).toBe(true);
    expect(protection.value).toBeDefined();

    expect(
      protection.value!.requiredProtectiveCurrentA,
    ).toBeGreaterThan(0);

    // ----------------------------------------------------------
    // 13. System validation
    // ----------------------------------------------------------

    const systemValidation =
      runSystemValidation({
        peakDemand,
        pvArray,
        inverter,
        battery,
        chargeController,
        cable,
        voltageDrop,
        protection,
      });

    expect(systemValidation.valid).toBe(true);
    expect(systemValidation.value).toBeDefined();

    expect(
      systemValidation.value!.evaluatedResultCount,
    ).toBeGreaterThan(0);

    // ----------------------------------------------------------
    // 14. BOM
    // ----------------------------------------------------------

    const bom = runBOM({
      pv: pvArray,
      battery,
      inverter,
      chargeController,
      cable,
      protection,
    });

    expect(bom.valid).toBe(true);
    expect(bom.value).toBeDefined();

    expect(
      bom.value!.totalItemCount,
    ).toBeGreaterThan(0);

    // ----------------------------------------------------------
    // 15. Costing
    // ----------------------------------------------------------

    const costing = runCosting({
      currency: "NGN",

      items: [
        {
          id: "PV-ARRAY",
          name: "PV Array",
          category: "PV",
          quantity: 1,
          unitCost: 3_600_000,
          unit: "system",
        },
        {
          id: "BATTERY",
          name: "Battery Bank",
          category: "BATTERY",
          quantity: 1,
          unitCost: 1_800_000,
          unit: "bank",
        },
        {
          id: "INVERTER",
          name: "Hybrid Inverter",
          category: "INVERTER",
          quantity: 1,
          unitCost: 900_000,
          unit: "unit",
        },
        {
          id: "BALANCE-OF-SYSTEM",
          name: "Balance of System",
          category: "BOS",
          quantity: 1,
          unitCost: 600_000,
          unit: "lot",
        },
      ],

      additionalCosts: 0,
      contingencyRate: 0.05,
    });

    expect(costing.valid).toBe(true);
    expect(costing.value).toBeDefined();

    expect(
      costing.value!.subtotal,
    ).toBeGreaterThan(0);

    expect(
      costing.value!.totalCost,
    ).toBeGreaterThan(
      costing.value!.subtotal,
    );

    // ----------------------------------------------------------
    // 16. Reports
    // ----------------------------------------------------------

    const reports = runReports({
      reportId:
        "HYBRID-INTEGRATION-001",

      title:
        "Hybrid Solar System Engineering Integration",

      load,
      energy,
      peakDemand,
      pvSizing,
      pvArray,
      pvString,
      battery,
      inverter,
      chargeController,
      cable,
      voltageDrop,
      protection,
      bom,
      costing,
      systemValidation,
    });

    expect(reports.valid).toBe(true);
    expect(reports.value).toBeDefined();

    expect(
      reports.value!.results.length,
    ).toBeGreaterThan(0);

    expect(
      reports.value!.sections.length,
    ).toBeGreaterThan(0);
  });
});
