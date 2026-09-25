
// ============================================================
// Solar Engine
// Load List Validation
// ============================================================

import type {
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  Load,
} from "../types/load.js";

import {
  validateLoad,
} from "./validate-load.js";

export function validateLoadList(
  loads: readonly Load[],
): EngineeringIssue[] {
  const issues: EngineeringIssue[] = [];

  // ----------------------------------------------------------
  // Empty List
  // ----------------------------------------------------------

  if (loads.length === 0) {
    issues.push({
      code: "EMPTY_LOAD_LIST",
      severity: "ERROR",
      message:
        "At least one electrical load is required.",
      path: "loads",
    });

    return issues;
  }

  // ----------------------------------------------------------
  // Load Validation + Duplicate IDs
  // ----------------------------------------------------------

  const ids = new Set<string>();

  loads.forEach(
    (load, index) => {
      const loadIssues =
        validateLoad(load);

      for (const issue of loadIssues) {
        issues.push({
          ...issue,
          path: issue.path
            ? `loads[${index}].${issue.path}`
            : `loads[${index}]`,
        });
      }

      // ------------------------------------------------------
      // Duplicate Load ID
      // ------------------------------------------------------

      if (ids.has(load.id)) {
        issues.push({
          code: "DUPLICATE_LOAD_ID",
          severity: "ERROR",
          message:
            `Duplicate load ID "${load.id}".`,
          path:
            `loads[${index}].id`,
          actual: load.id,
        });
      }

      ids.add(load.id);
    },
  );

  return issues;
}
