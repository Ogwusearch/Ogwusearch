import type {
  AuditRepository,
  ProjectRepository,
} from "../../persistence/index.js";

import type { SolarAudit } from "../../domain/index.js";

export interface CreateAuditInput {
  readonly id: string;
  readonly projectId: string;
  readonly name: string;
}

export class CreateAuditService {
  constructor(
    private readonly projects: ProjectRepository,
    private readonly audits: AuditRepository,
    private readonly now: () => string = () =>
      new Date().toISOString(),
  ) {}

  async execute(
    input: CreateAuditInput,
  ): Promise<SolarAudit> {
    const project = await this.projects.findById(
      input.projectId,
    );

    if (!project) {
      throw new Error(
        `Project not found: ${input.projectId}`,
      );
    }

    const now = this.now();

    const audit: SolarAudit = {
      id: input.id,
      projectId: input.projectId,
      name: input.name,
      status: "DRAFT",
      createdAt: now,
      updatedAt: now,
    };

    return this.audits.create(audit);
  }
}