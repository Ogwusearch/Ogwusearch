import type {
  SolarAudit,
} from "../../domain/audit.js";

import type {
  SolarAuditLoad,
} from "../../domain/load.js";

import type {
  AuditCalculationResult,
} from "../../domain/result.js";

import type {
  SolarAuditProject,
} from "../../domain/project.js";

import type {
  ProjectRepository,
  AuditRepository,
  LoadRepository,
  ResultRepository,
} from "../../persistence/index.js";

export interface SolarAuditDetails {
  readonly audit: SolarAudit;
  readonly project: SolarAuditProject;
  readonly loads: readonly SolarAuditLoad[];
  readonly results: readonly AuditCalculationResult[];
}

export interface GetAuditDetailsDependencies {
  readonly projects: ProjectRepository;
  readonly audits: AuditRepository;
  readonly loads: LoadRepository;
  readonly results: ResultRepository;
}

export async function getAuditDetails(
  auditId: string,
  dependencies: GetAuditDetailsDependencies,
): Promise<SolarAuditDetails> {
  const audit =
    await dependencies.audits.findById(
      auditId,
    );

  if (!audit) {
    throw new Error(
      `Audit not found: ${auditId}`,
    );
  }

  const project =
    await dependencies.projects.findById(
      audit.projectId,
    );

  if (!project) {
    throw new Error(
      `Project not found: ${audit.projectId}`,
    );
  }

  const loads =
    await dependencies.loads.findByProjectId(
      audit.projectId,
    );

  const results =
    await dependencies.results.findByAuditId(
      audit.id,
    );

  return {
    audit,
    project,
    loads,
    results,
  };
}