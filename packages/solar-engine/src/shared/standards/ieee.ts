/**
 * IEEE standards commonly referenced by solar PV and
 * distributed-energy-resource system engineering.
 *
 * This module contains reference metadata only.
 * It does not implement IEEE compliance requirements.
 */

export interface IeeeStandardReference {
  readonly code: string;
  readonly title: string;
  readonly edition: string;
  readonly scope: string;
  readonly category: "interconnection" | "testing" | "application";
}

export const IEEE_STANDARDS = Object.freeze({
  DER_INTERCONNECTION: {
    code: "IEEE 1547",
    title:
      "IEEE Standard for Interconnection and Interoperability of Distributed Energy Resources with Associated Electric Power Systems Interfaces",
    edition: "2018",
    scope:
      "Interconnection and interoperability requirements for distributed energy resources connected to electric power systems.",
    category: "interconnection",
  },

  DER_CONFORMANCE_TESTING: {
    code: "IEEE 1547.1",
    title:
      "IEEE Standard Conformance Test Procedures for Equipment Interconnecting Distributed Energy Resources with Electric Power Systems and Associated Interfaces",
    edition: "2020",
    scope:
      "Conformance testing and evaluation procedures for equipment interconnecting distributed energy resources with electric power systems.",
    category: "testing",
  },

  DER_APPLICATION_GUIDE: {
    code: "IEEE 1547.2",
    title:
      "IEEE Application Guide for IEEE Std 1547-2018",
    edition: "2023",
    scope:
      "Application guidance supporting implementation of IEEE 1547 interconnection requirements.",
    category: "application",
  },
} as const satisfies Record<string, IeeeStandardReference>);

export type IeeeStandardCode =
  (typeof IEEE_STANDARDS)[keyof typeof IEEE_STANDARDS]["code"];

export const IEEE_PRIMARY_DER_STANDARD_CODES = [
  IEEE_STANDARDS.DER_INTERCONNECTION.code,
  IEEE_STANDARDS.DER_CONFORMANCE_TESTING.code,
  IEEE_STANDARDS.DER_APPLICATION_GUIDE.code,
] as const;