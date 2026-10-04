import { describe, expect, it } from "vitest";

import {
  createProject,
  type CreateProjectDependencies,
} from "../../src/application/projects/create-project.js";

import type { SolarAuditProject } from "../../src/domain/project.js";
import type { ProjectRepository } from "../../src/persistence/project-repository.js";

function createRepository(): {
  repository: ProjectRepository;
  created: SolarAuditProject[];
} {
  const created: SolarAuditProject[] = [];

  const repository: ProjectRepository = {
    async create(project) {
      created.push(project);
      return project;
    },

    async findById(projectId) {
      return created.find(
        (project) => project.id === projectId,
      );
    },

    async save(project) {
      const index = created.findIndex(
        (item) => item.id === project.id,
      );

      if (index >= 0) {
        created[index] = project;
      } else {
        created.push(project);
      }

      return project;
    },
  };

  return {
    repository,
    created,
  };
}

describe("createProject", () => {
  it("creates a project with the required fields", async () => {
    const { repository, created } = createRepository();

    const dependencies: CreateProjectDependencies = {
      projects: repository,
      now: () => "2026-10-01T10:00:00.000Z",
    };

    const result = await createProject(
      {
        id: "project-001",
        name: "Solar Residential Project",
      },
      dependencies,
    );

    expect(result).toEqual({
      id: "project-001",
      name: "Solar Residential Project",
      createdAt: "2026-10-01T10:00:00.000Z",
      updatedAt: "2026-10-01T10:00:00.000Z",
    });

    expect(created).toHaveLength(1);
    expect(created[0]).toEqual(result);
  });

  it("preserves an optional description", async () => {
    const { repository } = createRepository();

    const result = await createProject(
      {
        id: "project-002",
        name: "Commercial Solar Project",
        description: "Commercial rooftop installation",
      },
      {
        projects: repository,
        now: () => "2026-10-01T11:00:00.000Z",
      },
    );

    expect(result.description).toBe(
      "Commercial rooftop installation",
    );
  });

  it("does not add a description when one is omitted", async () => {
    const { repository } = createRepository();

    const result = await createProject(
      {
        id: "project-003",
        name: "Off Grid Project",
      },
      {
        projects: repository,
        now: () => "2026-10-01T12:00:00.000Z",
      },
    );

    expect(
      Object.prototype.hasOwnProperty.call(
        result,
        "description",
      ),
    ).toBe(false);
  });

  it("uses the injected clock", async () => {
    const { repository } = createRepository();

    let calls = 0;

    const result = await createProject(
      {
        id: "project-004",
        name: "Test Project",
      },
      {
        projects: repository,
        now: () => {
          calls += 1;
          return "2026-10-01T13:00:00.000Z";
        },
      },
    );

    expect(calls).toBe(1);
    expect(result.createdAt).toBe(
      "2026-10-01T13:00:00.000Z",
    );
    expect(result.updatedAt).toBe(
      "2026-10-01T13:00:00.000Z",
    );
  });

  it("persists the constructed project through the repository", async () => {
    const { repository, created } = createRepository();

    const result = await createProject(
      {
        id: "project-005",
        name: "Persistence Boundary Test",
      },
      {
        projects: repository,
        now: () => "2026-10-01T14:00:00.000Z",
      },
    );

    expect(created).toContainEqual(result);
  });
});
