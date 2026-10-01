import type { Load } from "../../src/modules/load/types/index.js";

export const hybridSystem = {
  systemVoltageV: 48,

  loads: [
    {
      id: "HYB-LGT-01",
      name: "LED Lighting",
      category: "LIGHTING",
      quantity: 12,
      ratedPowerW: 15,
      powerFactor: 1,
      efficiency: 1,
      operatingHoursPerDay: 6,
      operatingDaysPerMonth: 30,
      demandFactor: 0.9,
      phase: "SINGLE_PHASE",
    },
    {
      id: "HYB-FAN-01",
      name: "Ceiling Fans",
      category: "APPLIANCE",
      quantity: 4,
      ratedPowerW: 80,
      powerFactor: 0.9,
      efficiency: 0.9,
      operatingHoursPerDay: 8,
      operatingDaysPerMonth: 30,
      demandFactor: 0.8,
      phase: "SINGLE_PHASE",
    },
    {
      id: "HYB-FRIDGE-01",
      name: "Refrigerator",
      category: "APPLIANCE",
      quantity: 2,
      ratedPowerW: 250,
      powerFactor: 0.85,
      efficiency: 0.9,
      operatingHoursPerDay: 10,
      operatingDaysPerMonth: 30,
      demandFactor: 0.8,
      phase: "SINGLE_PHASE",
    },
    {
      id: "HYB-OFFICE-01",
      name: "Office Computers",
      category: "OFFICE",
      quantity: 6,
      ratedPowerW: 180,
      powerFactor: 0.95,
      efficiency: 0.95,
      operatingHoursPerDay: 8,
      operatingDaysPerMonth: 26,
      demandFactor: 0.8,
      phase: "SINGLE_PHASE",
    },
    {
      id: "HYB-TV-01",
      name: "Televisions",
      category: "APPLIANCE",
      quantity: 2,
      ratedPowerW: 150,
      powerFactor: 0.95,
      efficiency: 1,
      operatingHoursPerDay: 5,
      operatingDaysPerMonth: 30,
      demandFactor: 0.8,
      phase: "SINGLE_PHASE",
    },
    {
      id: "HYB-PUMP-01",
      name: "Water Pump",
      category: "PUMP",
      quantity: 1,
      ratedPowerW: 1100,
      powerFactor: 0.85,
      efficiency: 0.85,
      operatingHoursPerDay: 2,
      operatingDaysPerMonth: 20,
      demandFactor: 0.7,
      phase: "SINGLE_PHASE",
    },
    {
      id: "HYB-AC-01",
      name: "Small Air Conditioner",
      category: "HVAC",
      quantity: 2,
      ratedPowerW: 1000,
      powerFactor: 0.9,
      efficiency: 0.9,
      operatingHoursPerDay: 6,
      operatingDaysPerMonth: 26,
      demandFactor: 0.8,
      phase: "SINGLE_PHASE",
    },
  ] satisfies readonly Load[],

  pv: {
    modulePowerW: 550,
    moduleVmpV: 41.5,
    moduleImpA: 13.25,
    moduleVocV: 49.5,
    moduleIscA: 13.9,

    // 4 modules in series × 3 parallel strings.
    modulesPerString: 4,
    parallelStrings: 3,
  },

  battery: {
    autonomyDays: 1,
    systemVoltageV: 48,
    depthOfDischarge: 0.8,
    batteryEfficiency: 0.95,
    designMargin: 0.2,
    batteryUnitVoltageV: 12,
    batteryUnitCapacityAh: 250,
  },

  inverter: {
    systemVoltageV: 48,
    inverterEfficiency: 0.92,
    powerFactor: 0.9,
    inverterRatedPowerW: 10000,
    inverterSurgePowerW: 20000,
    inverterInputVoltageMinV: 40,
    inverterInputVoltageMaxV: 60,
    requiredOutputVoltageV: 230,
    inverterOutputVoltageV: 230,
    designMargin: 0.2,
  },

  chargeController: {
    batteryVoltageV: 48,
    controllerEfficiency: 0.98,
    safetyMargin: 0.25,

    controllerRatedCurrentA: 200,

    controllerMaxPVVoltageV: 250,

    controllerMPPTMinVoltageV: 120,
    controllerMPPTMaxVoltageV: 200,

    controllerMaxPVCurrentA: 50,
  },

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

  voltageDrop: {
    mode: "DC" as const,
    sourceVoltageV: 48,
    allowableVoltageDropPercent: 3,
    conductorLengthM: 25,
    conductorAreaMm2: 95,
    resistivityOhmMm2PerM: 0.0175,
  },

  protection: {
    protection: {
      type: "DC_FUSE" as const,
      mode: "DC" as const,
    },

    electrical: {
      systemVoltageV: 48,
      shortCircuitCurrentA: 41.7,
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

export type HybridSystemFixture =
  typeof hybridSystem;
