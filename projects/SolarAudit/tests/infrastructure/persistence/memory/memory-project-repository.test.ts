import {
  describe,
  expect,
  it,
} from "vitest";

import {
  MemoryProjectRepository,
} from "../../../../src/infrastructure/persistence/memory/memory-project-repository.js";

import type {
  SolarAuditProject,
} from "../../../../src/domain/project.js";

describe("MemoryProjectRepository", () => {
  function createProject(
    id = "project-001",
  ): SolarAuditProject {
    return {
      id,
      name: "Residential Solar Project",
      description:
        "Residential solar installation",
      createdAt:
        "2026-10-01T09:00:00.000Z",
      updatedAt:
        "2026-10-01T09:30:00.000Z",
    };
  }

  it("creates and retrieves a project", async () => {
    const repository =
      new MemoryProjectRepository();

    const project =
      createProject();

    await repository.create(project);

    await expect(
      repository.findById(project.id),
    ).resolves.toEqual(project);
  });

  it("returns undefined for an unknown project", async () => {
    const repository =
      new MemoryProjectRepository();

    await expect(
      repository.findById("missing-project"),
    ).resolves.toBeUndefined();
  });

  it("saves an updated project", async () => {
    const repository =
      new MemoryProjectRepository();

    const project =
      createProject();

    await repository.create(project);

    const updated = {
      ...project,
      name: "Updated Solar Project",
    };

    await repository.save(updated);

    await expect(
      repository.findById(project.id),
    ).resolves.toEqual(updated);
  });
});
