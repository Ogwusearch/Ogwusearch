import {
  describe,
  expect,
  it,
} from "vitest";

import {
  MemoryAuditRepository,
} from "../../../../src/infrastructure/persistence/memory/memory-audit-repository.js";

import type {
  SolarAudit,
} from "../../../../src/domain/audit.js";

describe("MemoryAuditRepository", () => {
  function createAudit(
    id = "audit-001",
  ): SolarAudit {
    return {
      id,
      projectId: "project-001",
      name: "Residential Solar Audit",
      status: "DRAFT",
      createdAt:
        "2026-10-01T10:00:00.000Z",
      updatedAt:
        "2026-10-01T10:00:00.000Z",
    };
  }

  it("creates and retrieves an audit", async () => {
    const repository =
      new MemoryAuditRepository();

    const audit =
      createAudit();

    await repository.create(audit);

    await expect(
      repository.findById(audit.id),
    ).resolves.toEqual(audit);
  });

  it("returns undefined for an unknown audit", async () => {
    const repository =
      new MemoryAuditRepository();

    await expect(
      repository.findById("missing-audit"),
    ).resolves.toBeUndefined();
  });

  it("saves an updated audit", async () => {
    const repository =
      new MemoryAuditRepository();

    const audit =
      createAudit();

    await repository.create(audit);

    const updated = {
      ...audit,
      status: "COMPLETED" as const,
    };

    await repository.save(updated);

    await expect(
      repository.findById(audit.id),
    ).resolves.toEqual(updated);
  });
});
