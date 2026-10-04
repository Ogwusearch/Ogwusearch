import type { SolarAuditLoad } from "../../../domain/load.js";
import type { LoadRepository } from "../../../persistence/load-repository.js";

export class MemoryLoadRepository
  implements LoadRepository
{
  private readonly loads =
    new Map<string, SolarAuditLoad>();

  async create(
    load: SolarAuditLoad,
  ): Promise<SolarAuditLoad> {
    this.loads.set(load.id, load);

    return load;
  }

  async findById(
    loadId: string,
  ): Promise<SolarAuditLoad | undefined> {
    return this.loads.get(loadId);
  }

  async findByProjectId(
    projectId: string,
  ): Promise<readonly SolarAuditLoad[]> {
    return Array.from(this.loads.values()).filter(
      (load) => load.projectId === projectId,
    );
  }

  async save(
    load: SolarAuditLoad,
  ): Promise<SolarAuditLoad> {
    this.loads.set(load.id, load);

    return load;
  }
}
