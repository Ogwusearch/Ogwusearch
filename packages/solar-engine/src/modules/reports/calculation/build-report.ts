import type {
  EngineeringError,
  EngineeringWarning,
  EngineeringMetadata,
} from "@ogwusearch/engineering-types";

import type {
  ReportsInput,
  ReportsOutput,
} from "../types/index.js";

import {
  createReportsAssumptions,
} from "../assumptions/index.js";

import {
  buildSections,
} from "./build-sections.js";

export function buildReport(
  input: ReportsInput,
): ReportsOutput {
  const sections = buildSections(input);

  const errors: EngineeringError[] = [];
  const warnings: EngineeringWarning[] = [];

  for (const section of sections) {
    errors.push(...section.result.errors);
    warnings.push(...section.result.warnings);
  }

  const assumptions = sections.flatMap(
    (section) => section.result.assumptions,
  );

  const metadata: EngineeringMetadata | undefined =
    sections.length > 0
      ? sections[0]?.result.metadata
      : undefined;

  return {
    ...(input.reportId !== undefined && {
      reportId: input.reportId,
    }),
    ...(input.title !== undefined && {
      title: input.title,
    }),
    sections,
    results: sections.map(
      (section) => section.result,
    ),
    assumptions,
    warnings,
    errors,
    ...(metadata !== undefined && {
      metadata,
    }),
  };
}
