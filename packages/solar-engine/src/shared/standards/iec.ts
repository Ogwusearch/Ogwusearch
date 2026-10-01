/**
 * IEC standards commonly referenced by solar PV system engineering.
 *
 * This module contains reference metadata only.
 * It does not implement IEC compliance requirements.
 */

export interface IecStandardReference {
  readonly code: string;
  readonly title: string;
  readonly edition: string;
  readonly scope: string;
  readonly category: "installation" | "pv-array" | "documentation";
}

export const IEC_STANDARDS = Object.freeze({
  PV_INSTALLATION: {
    code: "IEC 60364-7-712",
    title:
      "Low-voltage electrical installations - Part 7-712: Requirements for special installations or locations - Solar photovoltaic (PV) power supply installations",
    edition: "2025",
    scope:
      "Electrical installation requirements for photovoltaic power supply installations.",
    category: "installation",
  },

  PV_ARRAY_DESIGN: {
    code: "IEC 62548-1",
    title: "Photovoltaic (PV) arrays - Part 1: Design requirements",
    edition: "2023 + AMD1:2025",
    scope:
      "Design requirements for PV arrays including DC wiring, electrical protection, switching and earthing provisions.",
    category: "pv-array",
  },

  PV_DOCUMENTATION: {
    code: "IEC 62446-1",
    title:
      "Photovoltaic (PV) systems - Requirements for testing, documentation and maintenance - Part 1: Grid connected systems - Documentation, commissioning tests and inspection",
    edition: "2016 + AMD1:2018",
    scope:
      "Documentation, commissioning tests and inspection requirements for grid-connected PV systems.",
    category: "documentation",
  },
} as const satisfies Record<string, IecStandardReference>);

export type IecStandardCode =
  (typeof IEC_STANDARDS)[keyof typeof IEC_STANDARDS]["code"];

export const IEC_PRIMARY_PV_STANDARD_CODES = [
  IEC_STANDARDS.PV_INSTALLATION.code,
  IEC_STANDARDS.PV_ARRAY_DESIGN.code,
  IEC_STANDARDS.PV_DOCUMENTATION.code,
] as const;