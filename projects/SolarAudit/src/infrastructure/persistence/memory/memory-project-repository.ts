import type { SolarAuditProject } from "../../../domain/project.js";
import type { ProjectRepository } from "../../../persistence/project-repository.js";

export class MemoryProjectRepository
  implements ProjectRepository
{
  private readonly projects =
    new Map<string, SolarAuditProject>();

  async create(
    project: SolarAuditProject,
  ): Promise<SolarAuditProject> {
    this.projects.set(project.id, project);

    return project;
  }

  async findById(
    projectId: string,
  ): Promise<SolarAuditProject | undefined> {
    return this.projects.get(projectId);
  }

  async save(
    project: SolarAuditProject,
  ): Promise<SolarAuditProject> {
    this.projects.set(project.id, project);

    return project;
  }
}
