export const PV_STRING_CONSTANTS = {
  minModulesPerString: 1,

  minModulePowerW: 0,

  minModuleVoltageV: 0,

  minModuleCurrentA: 0,

  defaultPrecision: 3,
} as const;

export type PvStringConstants =
  typeof PV_STRING_CONSTANTS;