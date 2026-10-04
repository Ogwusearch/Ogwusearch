import { describe, expect, it } from "vitest";

import {
  CreateAuditService,
  type CreateAuditInput,
} from "../../src/application/audits/create-audit.js";

import type { SolarAudit } from "../../src/domain/audit.js";
import type { SolarAuditProject } from "../../src/domain/project.js";
import type {
  AuditRepository,
  ProjectRepository,
} from "../../src/persistence/index.js";

function createProjectRepository(
  project: SolarAuditProject,
): ProjectRepository {
  return {
    async create(value) {
      return value;
    },

    async findById(projectId) {
      return projectId === project.id
        ? project
        : undefined;
    },

    async save(value) {
      return value;
    },
  };
}

function createAuditRepository(): {
  repository: AuditRepository;
  created: SolarAudit[];
} {
  const created: SolarAudit[] = [];

  const repository: AuditRepository = {
    async create(audit) {
      created.push(audit);
      return audit;
    },

    async findById(auditId) {
      return created.find(
        (audit) => audit.id === auditId,
      );
    },

    async save(audit) {
      const index = created.findIndex(
        (item) => item.id === audit.id,
      );

      if (index >= 0) {
        created[index] = audit;
      } else {
        created.push(audit);
      }

      return audit;
    },
  };

  return {
    repository,
    created,
  };
}

function createProject(): SolarAuditProject {
  return {
    id: "project-001",
    name: "Residential Solar Project",
    createdAt: "2026-10-01T08:00:00.000Z",
    updatedAt: "2026-10-01T08:00:00.000Z",
  };
}

describe("CreateAuditService", () => {
  it("creates a draft audit for an existing project", async () => {
    const project = createProject();
    const { repository, created } =
      createAuditRepository();

    const service = new CreateAuditService(
      createProjectRepository(project),
      repository,
      () => "2026-10-01T10:00:00.000Z",
    );

    const input: CreateAuditInput = {
      id: "audit-001",
      projectId: project.id,
      name: "Residential Solar Audit",
    };

    const result = await service.execute(input);

    expect(result).toEqual({
      id: "audit-001",
      projectId: "project-001",
      name: "Residential Solar Audit",
      status: "DRAFT",
      createdAt: "2026-10-01T10:00:00.000Z",
      updatedAt: "2026-10-01T10:00:00.000Z",
    });

    expect(created).toContainEqual(result);
  });

  it("uses the injected clock", async () => {
    const project = createProject();
    const { repository } =
      createAuditRepository();

    let calls = 0;

    const service = new CreateAuditService(
      createProjectRepository(project),
      repository,
      () => {
        calls += 1;
        return "2026-10-01T11:00:00.000Z";
      },
    );

    const result = await service.execute({
      id: "audit-002",
      projectId: project.id,
      name: "Commercial Solar Audit",
    });

    expect(calls).toBe(1);
    expect(result.createdAt).toBe(
      "2026-10-01T11:00:00.000Z",
    );
    expect(result.updatedAt).toBe(
      "2026-10-01T11:00:00.000Z",
    );
  });

  it("rejects an audit when the project does not exist", async () => {
    const { repository } =
      createAuditRepository();

    const projects: ProjectRepository = {
      async create(project) {
        return project;
      },

      async findById() {
        return undefined;
      },

      async save(project) {
        return project;
      },
    };

    const service = new CreateAuditService(
      projects,
      repository,
      () => "2026-10-01T12:00:00.000Z",
    );

    await expect(
      service.execute({
        id: "audit-003",
        projectId: "missing-project",
        name: "Invalid Audit",
      }),
    ).rejects.toThrow(
      "Project not found: missing-project",
    );
  });

  it("starts every new audit in DRAFT status", async () => {
    const project = createProject();
    const { repository } =
      createAuditRepository();

    const service = new CreateAuditService(
      createProjectRepository(project),
      repository,
      () => "2026-10-01T13:00:00.000Z",
    );

    const result = await service.execute({
      id: "audit-004",
      projectId: project.id,
      name: "Draft Audit",
    });

    expect(result.status).toBe("DRAFT");
  });
});
