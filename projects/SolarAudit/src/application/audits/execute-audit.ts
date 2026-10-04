import type {
  AuditCalculationResult,
} from "../../domain/result.js";

import type {
  SolarAudit,
} from "../../domain/audit.js";

import type {
  AuditRepository,
  LoadRepository,
  ResultRepository,
} from "../../persistence/index.js";

import { saveResult } from "../results/save-result.js";

import {
  runAudit,
} from "./run-audit.js";

import type {
  SolarAuditEngine,
} from "./solar-engine.js";

export interface ExecuteAuditInput {
  readonly auditId: string;
  readonly diversityFactor?: number;
  readonly designMargin?: number;
}

export interface ExecuteAuditDependencies {
  readonly audits: AuditRepository;
  readonly loads: LoadRepository;
  readonly results: ResultRepository;
  readonly engine: SolarAuditEngine;
  readonly now?: () => string;
}

function createStatusUpdate(
  audit: SolarAudit,
  status: SolarAudit["status"],
  now: () => string,
): SolarAudit {
  return {
    ...audit,
    status,
    updatedAt: now(),
  };
}

export async function executeAudit(
  input: ExecuteAuditInput,
  dependencies: ExecuteAuditDependencies,
): Promise<AuditCalculationResult> {
  const audit =
    await dependencies.audits.findById(
      input.auditId,
    );

  if (!audit) {
    throw new Error(
      `Audit not found: ${input.auditId}`,
    );
  }

  const now =
    dependencies.now ??
    (() => new Date().toISOString());

  const runningAudit =
    createStatusUpdate(
      audit,
      "RUNNING",
      now,
    );

  await dependencies.audits.save(
    runningAudit,
  );

  try {
    const loads =
      await dependencies.loads.findByProjectId(
        audit.projectId,
      );

    const auditResult = runAudit(
      {
        loads,
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
      },
      {
        engine: dependencies.engine,
      },
    );

    const savedResult =
      await saveResult(
        {
          auditId: audit.id,
          calculationName: "load-audit",
          result:
            auditResult.results.loadAudit,
        },
        {
          results:
            dependencies.results,
        },
      );

    const completedAudit =
      createStatusUpdate(
        runningAudit,
        "COMPLETED",
        now,
      );

    await dependencies.audits.save(
      completedAudit,
    );

    return savedResult;
  } catch (error) {
    const failedAudit =
      createStatusUpdate(
        runningAudit,
        "FAILED",
        now,
      );

    await dependencies.audits.save(
      failedAudit,
    );

    throw error;
  }
}