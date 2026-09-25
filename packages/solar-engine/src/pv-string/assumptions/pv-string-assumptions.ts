import type { EngineeringAssumption } from "@ogwusearch/engineering-types";

export function createPvStringAssumptions(): EngineeringAssumption[] {
  return [
    {
      code: "PV_STRING_SERIES_CONFIGURATION",
      name: "PV string configuration",
      value: "series",
      description:
        "Modules in a PV string are connected in series.",
    },
    {
      code: "PV_STRING_VOLTAGE_ADDITIVE",
      name: "String voltage behavior",
      value: "additive",
      description:
        "Module voltages are summed across the series string.",
    },
    {
      code: "PV_STRING_CURRENT_CONSTANT",
      name: "String current behavior",
      value: "constant",
      description:
        "Module current remains constant through the series string.",
    },
    {
      code: "PV_STRING_POWER_FROM_VMP_IMP",
      name: "String power calculation",
      value: "stringVmpV × stringImpA",
      description:
        "String power is based on string Vmp and string Imp.",
    },
  ];
}
