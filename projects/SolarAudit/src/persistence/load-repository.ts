import type { SolarAuditLoad } from "../domain/load.js";

export interface LoadRepository {
  create(load: SolarAuditLoad): Promise<SolarAuditLoad>;

  findById(
    loadId: string,
  ): Promise<SolarAuditLoad | undefined>;

  findByProjectId(
    projectId: string,
  ): Promise<readonly SolarAuditLoad[]>;

  save(load: SolarAuditLoad): Promise<SolarAuditLoad>;
}
