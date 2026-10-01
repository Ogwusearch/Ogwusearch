import type {
} from "@ogwusearch/engineering-types";

import type {
  ReportSection,
} from "../types/index.js";

import {
  collectResults,
} from "./collect-results.js";

import type {
  ReportsInput,
} from "../types/index.js";

export function buildSections(
  input: ReportsInput,
): ReadonlyArray<ReportSection> {
  return collectResults(input).map(
    ({ id, title, result }): ReportSection => ({
      id,
      title,
      result,
    }),
  );
}
