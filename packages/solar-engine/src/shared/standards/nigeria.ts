/**
 * Nigerian electricity-sector standards and regulatory references.
 *
 * These references identify the principal Nigerian documents that may
 * affect solar/PV system engineering and interconnection.
 *
 * This module does not reproduce regulatory requirements.
 */

export interface NigeriaStandardReference {
  readonly code: string;
  readonly title: string;
  readonly authority: string;
  readonly edition: string;
  readonly scope: string;
  readonly category:
    | "installation"
    | "grid"
    | "distribution"
    | "health-safety";
}

export const NIGERIA_STANDARDS = Object.freeze({
  NESIS: {
    code: "NESIS",
    title:
      "Nigerian Electricity Supply and Installation Standards Regulations",
    authority: "Nigerian Electricity Regulatory Commission (NERC)",
    edition: "2015",
    scope:
      "Requirements and standards for design, construction and commissioning across the Nigerian Electricity Supply Industry.",
    category: "installation",
  },

  GRID_CODE: {
    code: "NERC-GRID-CODE",
    title: "Grid Code",
    authority: "Nigerian Electricity Regulatory Commission (NERC)",
    edition: "2018",
    scope:
      "Technical requirements and operating framework for the Nigerian electricity grid.",
    category: "grid",
  },

  DISTRIBUTION_CODE: {
    code: "NERC-DISTRIBUTION-CODE",
    title: "Distribution Code",
    authority: "Nigerian Electricity Regulatory Commission (NERC)",
    edition: "2018",
    scope:
      "Technical requirements associated with electricity distribution systems in Nigeria.",
    category: "distribution",
  },

  HEALTH_SAFETY_CODE: {
    code: "NERC-HEALTH-SAFETY-CODE",
    title:
      "Health & Safety Code for the Nigerian Electricity Supply Industry",
    authority: "Nigerian Electricity Regulatory Commission (NERC)",
    edition: "Second Edition, March 2026",
    scope:
      "Health and safety requirements applicable within the Nigerian Electricity Supply Industry.",
    category: "health-safety",
  },
} as const satisfies Record<string, NigeriaStandardReference>);

export type NigeriaStandardCode =
  (typeof NIGERIA_STANDARDS)[keyof typeof NIGERIA_STANDARDS]["code"];

export const NIGERIA_PRIMARY_STANDARD_CODES = [
  NIGERIA_STANDARDS.NESIS.code,
  NIGERIA_STANDARDS.GRID_CODE.code,
  NIGERIA_STANDARDS.DISTRIBUTION_CODE.code,
  NIGERIA_STANDARDS.HEALTH_SAFETY_CODE.code,
] as const;