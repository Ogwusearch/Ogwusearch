import type { ProjectRepository } from "../../persistence/index.js";
import type { SolarAuditProject } from "../../domain/project.js";

export interface CreateProjectInput {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
}

export interface CreateProjectDependencies {
  readonly projects: ProjectRepository;
  readonly now?: () => string;
}

export async function createProject(
  input: CreateProjectInput,
  dependencies: CreateProjectDependencies,
): Promise<SolarAuditProject> {
  const now = dependencies.now?.() ?? new Date().toISOString();

  const project: SolarAuditProject = {
    id: input.id,
    name: input.name,
    ...(input.description !== undefined
      ? { description: input.description }
      : {}),
    createdAt: now,
    updatedAt: now,
  };

  return dependencies.projects.create(project);
}
