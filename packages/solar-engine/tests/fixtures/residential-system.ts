// Solar Engine
// Residential Integration Fixture
//
// Inputs only.
// No calculated outputs are stored in this fixture.
//
// Purpose:
// - Provide deterministic residential-system inputs.
// - Keep downstream module inputs electrically compatible.
// - Preserve all production calculation formulas.
// ============================================================

import type { Load } from "../../src/modules/load/types/index.js";

export const residentialSystem = {
  // ----------------------------------------------------------
  // System
  // ----------------------------------------------------------

  systemVoltageV: 48,

  // ----------------------------------------------------------
  // Loads
  // ----------------------------------------------------------

  loads: [
    {
      id: "RES-LIGHT-01",
      name: "LED Lighting",
      category: "LIGHTING",
      quantity: 10,
      ratedPowerW: 12,
      powerFactor: 1,
      efficiency: 1,
      operatingHoursPerDay: 6,
      operatingDaysPerMonth: 30,
      demandFactor: 0.9,
      phase: "SINGLE_PHASE",
    },
    {
      id: "RES-FRIDGE-01",
      name: "Refrigerator",
      category: "APPLIANCE",
      quantity: 1,
      ratedPowerW: 180,
      powerFactor: 0.9,
      efficiency: 0.9,
      operatingHoursPerDay: 10,
      operatingDaysPerMonth: 30,
      demandFactor: 0.8,
      phase: "SINGLE_PHASE",
    },
    {
      id: "RES-TV-01",
      name: "Television",
      category: "APPLIANCE",
      quantity: 1,
      ratedPowerW: 120,
      powerFactor: 0.95,
      efficiency: 1,
      operatingHoursPerDay: 5,
      operatingDaysPerMonth: 30,
      demandFactor: 0.8,
      phase: "SINGLE_PHASE",
    },
    {
      id: "RES-FAN-01",
      name: "Ceiling Fans",
      category: "APPLIANCE",
      quantity: 3,
      ratedPowerW: 75,
      powerFactor: 0.9,
      efficiency: 0.9,
      operatingHoursPerDay: 8,
      operatingDaysPerMonth: 30,
      demandFactor: 0.8,
      phase: "SINGLE_PHASE",
    },
    {
      id: "RES-PUMP-01",
      name: "Water Pump",
      category: "PUMP",
      quantity: 1,
      ratedPowerW: 750,
      powerFactor: 0.85,
      efficiency: 0.85,
      operatingHoursPerDay: 2,
      operatingDaysPerMonth: 20,
      demandFactor: 0.7,
      phase: "SINGLE_PHASE",
    },
  ] satisfies readonly Load[],

  // ----------------------------------------------------------
  // PV Array
  // ----------------------------------------------------------

  pv: {
    modulePowerW: 550,
    moduleVmpV: 41.5,
    moduleImpA: 13.25,
    moduleVocV: 49.5,
    moduleIscA: 13.9,

    modulesPerString: 4,
    parallelStrings: 2,
  },

  // ----------------------------------------------------------
  // Battery
  // ----------------------------------------------------------

  battery: {
    autonomyDays: 1,
    systemVoltageV: 48,
    depthOfDischarge: 0.8,
    batteryEfficiency: 0.95,
    designMargin: 0.2,

    batteryUnitVoltageV: 12,
    batteryUnitCapacityAh: 200,
  },

  // ----------------------------------------------------------
  // Inverter
  //
  // Rated capacity is deliberately above the expected
  // residential design demand so compatibility can be
  // evaluated without introducing an artificial failure.
  // ----------------------------------------------------------

  inverter: {
    systemVoltageV: 48,
    inverterEfficiency: 0.92,
    powerFactor: 0.9,

    inverterRatedPowerW: 5000,
    inverterSurgePowerW: 10000,

    inverterInputVoltageMinV: 40,
    inverterInputVoltageMaxV: 60,

    requiredOutputVoltageV: 230,
    inverterOutputVoltageV: 230,

    designMargin: 0.2,
  },

  // ----------------------------------------------------------
  // Charge Controller
  //
  // The 4S2P PV array produces approximately:
  // - 4,400 W array power
  // - 166 Vmp
  // - 198 V Voc
  // - 26.5 A Imp
  // - 27.8 A Isc
  //
  // At 48 V, the controller output current requirement is
  // above 100 A, so a 60 A controller would intentionally
  // create an incompatibility.
  // ----------------------------------------------------------

  chargeController: {
    batteryVoltageV: 48,
    controllerEfficiency: 0.98,
    safetyMargin: 0.25,

    controllerRatedCurrentA: 150,
    controllerMaxPVVoltageV: 250,
    controllerMPPTMinVoltageV: 120,
    controllerMPPTMaxVoltageV: 200,
    controllerMaxPVCurrentA: 40,
  },

  // ----------------------------------------------------------
  // DC Cable
  //
  // The cable carries the charge-controller output current.
  // The available conductor options therefore include sizes
  // capable of carrying the resulting design current.
  // ----------------------------------------------------------

  cable: {
    mode: "DC" as const,
    systemVoltageV: 48,
    designMargin: 0.25,
    conductorMaterial: "COPPER",
    conductorCount: 2,

    conductorOptions: [
      {
        areaMm2: 16,
        allowableAmpacityA: 75,
      },
      {
        areaMm2: 25,
        allowableAmpacityA: 100,
      },
      {
        areaMm2: 35,
        allowableAmpacityA: 125,
      },
      {
        areaMm2: 50,
        allowableAmpacityA: 150,
      },
    ],

    cableLengthM: 20,
    resistivityOhmMm2PerM: 0.0175,
  },

  // ----------------------------------------------------------
  // Voltage Drop
  //
  // Use the same 35 mm² conductor class available to the
  // cable-sizing stage so the independent voltage-drop check
  // represents a compatible conductor selection.
  //
  // conductorLengthM represents the complete electrical path.
  // ----------------------------------------------------------

  voltageDrop: {
    mode: "DC" as const,
    sourceVoltageV: 48,
    allowableVoltageDropPercent: 3,

    conductorLengthM: 20,
    conductorAreaMm2: 35,
    resistivityOhmMm2PerM: 0.0175,
  },

  // ----------------------------------------------------------
  // Protection
  //
  // Ratings extend beyond the cable design current so the
  // protection-selection stage has valid selectable options.
  // ----------------------------------------------------------

  protection: {
    protection: {
      type: "DC_FUSE" as const,
      mode: "DC" as const,
    },

    electrical: {
      systemVoltageV: 48,
      shortCircuitCurrentA: 27.8,
    },

    design: {
      designMargin: 0.25,
    },

    device: {
      availableCurrentRatingsA: [
        63,
        80,
        100,
        125,
        160,
        200,
      ],
      voltageRatingV: 100,
      interruptingRatingA: 1000,
    },
  },
} as const;

export type ResidentialSystemFixture =
  typeof residentialSystem;
