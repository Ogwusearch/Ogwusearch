import type {
  LoadAuditInput,
  LoadAuditOutput,
} from "@ogwusearch/solar-engine";

import type { CalculationResult } from "@ogwusearch/engineering-types";

import type { SolarAuditLoad } from "../../domain/load.js";
import type { SolarAuditCalculationResults } from "../../domain/audit-result.js";
import type { SolarAuditEngine } from "./solar-engine.js";

export interface RunAuditInput {
  readonly loads: readonly SolarAuditLoad[];

  readonly diversityFactor?: number;
  readonly designMargin?: number;
}

export interface RunAuditDependencies {
  readonly engine: SolarAuditEngine;
}

export interface RunAuditOutput {
  readonly results: SolarAuditCalculationResults;
}

function toEngineLoad(
  load: SolarAuditLoad,
): LoadAuditInput["loads"][number] {
  const {
    projectId: _projectId,
    ...engineLoad
  } = load;

  return engineLoad;
}

function toEngineLoadAuditInput(
  input: RunAuditInput,
): LoadAuditInput {
  return {
    loads: input.loads.map(toEngineLoad),

    ...(input.diversityFactor !== undefined
      ? {
          diversityFactor:
            input.diversityFactor,
        }
      : {}),

    ...(input.designMargin !== undefined
      ? {
          designMargin:
            input.designMargin,
        }
      : {}),
  };
}

export function runAudit(
  input: RunAuditInput,
  dependencies: RunAuditDependencies,
): RunAuditOutput {
  const engineInput =
    toEngineLoadAuditInput(input);

  const loadAudit:
    CalculationResult<LoadAuditOutput> =
    dependencies.engine.runLoadAudit(
      engineInput,
    );

  return {
    results: {
      loadAudit,
    },
  };
}
