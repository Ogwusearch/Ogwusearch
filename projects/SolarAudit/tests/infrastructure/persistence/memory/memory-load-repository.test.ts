import {
  describe,
  expect,
  it,
} from "vitest";

import {
  MemoryLoadRepository,
} from "../../../../src/infrastructure/persistence/memory/memory-load-repository.js";

import type {
  SolarAuditLoad,
} from "../../../../src/domain/load.js";

describe("MemoryLoadRepository", () => {
  function createLoad(
    id: string,
    projectId: string,
  ): SolarAuditLoad {
    return {
      id,
      projectId,
      name: "Refrigerator",
      category: "APPLIANCE",
      quantity: 1,
      ratedPowerW: 500,
      powerFactor: 0.9,
      operatingHoursPerDay: 8,
      operatingDaysPerMonth: 30,
      phase: "SINGLE_PHASE",
    };
  }

  it("creates and retrieves a load", async () => {
    const repository =
      new MemoryLoadRepository();

    const load =
      createLoad(
        "load-001",
        "project-001",
      );

    await repository.create(load);

    await expect(
      repository.findById(load.id),
    ).resolves.toEqual(load);
  });

  it("returns undefined for an unknown load", async () => {
    const repository =
      new MemoryLoadRepository();

    await expect(
      repository.findById("missing-load"),
    ).resolves.toBeUndefined();
  });

  it("finds loads belonging to a project", async () => {
    const repository =
      new MemoryLoadRepository();

    const loadOne =
      createLoad(
        "load-001",
        "project-001",
      );

    const loadTwo =
      createLoad(
        "load-002",
        "project-001",
      );

    const otherLoad =
      createLoad(
        "load-003",
        "project-002",
      );

    await repository.create(loadOne);
    await repository.create(loadTwo);
    await repository.create(otherLoad);

    await expect(
      repository.findByProjectId("project-001"),
    ).resolves.toEqual([
      loadOne,
      loadTwo,
    ]);
  });

  it("returns an empty array for a project with no loads", async () => {
    const repository =
      new MemoryLoadRepository();

    await expect(
      repository.findByProjectId("project-001"),
    ).resolves.toEqual([]);
  });

  it("saves an updated load", async () => {
    const repository =
      new MemoryLoadRepository();

    const load =
      createLoad(
        "load-001",
        "project-001",
      );

    await repository.create(load);

    const updated = {
      ...load,
      ratedPowerW: 750,
    };

    await repository.save(updated);

    await expect(
      repository.findById(load.id),
    ).resolves.toEqual(updated);
  });
});
