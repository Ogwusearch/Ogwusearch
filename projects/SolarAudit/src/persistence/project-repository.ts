import type { SolarAuditProject } from "../domain/project.js";

export interface ProjectRepository {
  create(project: SolarAuditProject): Promise<SolarAuditProject>;

  findById(
    projectId: string,
  ): Promise<SolarAuditProject | undefined>;

  save(project: SolarAuditProject): Promise<SolarAuditProject>;
}
