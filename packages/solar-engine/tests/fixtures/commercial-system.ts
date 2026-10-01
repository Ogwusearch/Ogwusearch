// ============================================================
// Solar Engine
// Commercial System Integration Fixture
// ============================================================

import type { Load } from "../../src/modules/load/index.js";

export const commercialSystem = {
  // ----------------------------------------------------------
  // System
  // ----------------------------------------------------------

  systemVoltageV: 48,

  // ----------------------------------------------------------
  // Loads
  //
  // Representative small-commercial load profile containing
  // lighting, refrigeration, office equipment, HVAC and pump
  // loads.
  // ----------------------------------------------------------

  loads: [
    {
      id: "COMM-LGT-001",
      name: "Commercial LED Lighting",
      category: "LIGHTING",
      quantity: 20,
      ratedPowerW: 40,
      powerFactor: 0.95,
      efficiency: 0.9,
      operatingHoursPerDay: 10,
      operatingDaysPerMonth: 26,
      demandFactor: 0.9,
      phase: "SINGLE_PHASE",
    },
    {
      id: "COMM-FAN-001",
      name: "Ceiling Fans",
      category: "HVAC",
      quantity: 8,
      ratedPowerW: 75,
      powerFactor: 0.9,
      efficiency: 0.85,
      operatingHoursPerDay: 10,
      operatingDaysPerMonth: 26,
      demandFactor: 0.8,
      phase: "SINGLE_PHASE",
    },
    {
      id: "COMM-FRIDGE-001",
      name: "Commercial Refrigerator",
      category: "APPLIANCE",
      quantity: 2,
      ratedPowerW: 500,
      powerFactor: 0.85,
      efficiency: 0.9,
      operatingHoursPerDay: 12,
      operatingDaysPerMonth: 26,
      demandFactor: 0.8,
      phase: "SINGLE_PHASE",
    },
    {
      id: "COMM-OFFICE-001",
      name: "Office Computers",
      category: "IT",
      quantity: 10,
      ratedPowerW: 150,
      powerFactor: 0.95,
      efficiency: 0.95,
      operatingHoursPerDay: 8,
      operatingDaysPerMonth: 26,
      demandFactor: 0.8,
      phase: "SINGLE_PHASE",
    },
    {
      id: "COMM-AC-001",
      name: "Split Air Conditioners",
      category: "HVAC",
      quantity: 3,
      ratedPowerW: 1200,
      powerFactor: 0.9,
      efficiency: 0.9,
      operatingHoursPerDay: 8,
      operatingDaysPerMonth: 26,
      demandFactor: 0.8,
      phase: "SINGLE_PHASE",
    },
    {
      id: "COMM-PUMP-001",
      name: "Water Pump",
      category: "PUMP",
      quantity: 1,
      ratedPowerW: 1500,
      powerFactor: 0.8,
      efficiency: 0.85,
      operatingHoursPerDay: 3,
      operatingDaysPerMonth: 26,
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

    modulesPerString: 5,
    parallelStrings: 4,
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
    batteryUnitCapacityAh: 250,
  },

  // ----------------------------------------------------------
  // Inverter
  // ----------------------------------------------------------

  inverter: {
    systemVoltageV: 48,
    inverterEfficiency: 0.92,
    powerFactor: 0.9,

    inverterRatedPowerW: 15000,
    inverterSurgePowerW: 30000,

    inverterInputVoltageMinV: 40,
    inverterInputVoltageMaxV: 60,

    requiredOutputVoltageV: 230,
    inverterOutputVoltageV: 230,

    designMargin: 0.2,
  },

  // ----------------------------------------------------------
  // Charge Controller
  // ----------------------------------------------------------

  chargeController: {
    batteryVoltageV: 48,
    controllerEfficiency: 0.98,
    safetyMargin: 0.25,

    controllerRatedCurrentA: 300,
    controllerMaxPVVoltageV: 300,
    controllerMPPTMinVoltageV: 120,
    controllerMPPTMaxVoltageV: 250,
    controllerMaxPVCurrentA: 100,
  },

  // ----------------------------------------------------------
  // DC Cable
  // ----------------------------------------------------------

  cable: {
    mode: "DC" as const,
    systemVoltageV: 48,
    designMargin: 0.25,
    conductorMaterial: "COPPER",
    conductorCount: 2,

    conductorOptions: [
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
      {
        areaMm2: 70,
        allowableAmpacityA: 200,
      },
      {
        areaMm2: 95,
        allowableAmpacityA: 250,
      },
      {
        areaMm2: 120,
        allowableAmpacityA: 400,
      },
    ],

    cableLengthM: 25,
    resistivityOhmMm2PerM: 0.0175,
  },

  // ----------------------------------------------------------
  // Voltage Drop
  // ----------------------------------------------------------

  voltageDrop: {
    mode: "DC" as const,
    sourceVoltageV: 48,
    allowableVoltageDropPercent: 3,

    conductorLengthM: 25,
    conductorAreaMm2: 70,
    resistivityOhmMm2PerM: 0.0175,
  },

  // ----------------------------------------------------------
  // Protection
  // ----------------------------------------------------------

  protection: {
    protection: {
      type: "DC_FUSE" as const,
      mode: "DC" as const,
    },

    electrical: {
      systemVoltageV: 48,
      shortCircuitCurrentA: 55.6,
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
        250,
        315,
        400,
      ],
      voltageRatingV: 100,
      interruptingRatingA: 1000,
    },
  },
} as const;

export type CommercialSystemFixture =
  typeof commercialSystem;