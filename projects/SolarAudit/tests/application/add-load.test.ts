import { describe, expect, it } from "vitest";

import {
  addLoad,
  type AddLoadInput,
} from "../../src/application/loads/add-load.js";

import type { SolarAuditLoad } from "../../src/domain/load.js";
import type { LoadRepository } from "../../src/persistence/load-repository.js";

function createLoadRepository(): {
  repository: LoadRepository;
  created: SolarAuditLoad[];
} {
  const created: SolarAuditLoad[] = [];

  const repository: LoadRepository = {
    async create(load) {
      created.push(load);
      return load;
    },

    async findById(loadId) {
      return created.find(
        (load) => load.id === loadId,
      );
    },

    async findByProjectId(projectId) {
      return created.filter(
        (load) => load.projectId === projectId,
      );
    },

    async save(load) {
      const index = created.findIndex(
        (item) => item.id === load.id,
      );

      if (index >= 0) {
        created[index] = load;
      } else {
        created.push(load);
      }

      return load;
    },
  };

  return {
    repository,
    created,
  };
}

function createInput(): AddLoadInput {
  return {
    id: "load-001",
    projectId: "project-001",
    name: "Living Room Lighting",
    category: "LIGHTING",
    quantity: 8,
    ratedPowerW: 12,
    powerFactor: 0.95,
    operatingHoursPerDay: 6,
    operatingDaysPerMonth: 30,
    demandFactor: 0.8,
    phase: "SINGLE_PHASE",
    description: "LED lighting load",
  };
}

describe("addLoad", () => {
  it("creates a project-owned SolarAuditLoad", async () => {
    const { repository, created } =
      createLoadRepository();

    const result = await addLoad(
      createInput(),
      {
        loads: repository,
      },
    );

    expect(result).toEqual({
      id: "load-001",
      projectId: "project-001",
      name: "Living Room Lighting",
      category: "LIGHTING",
      quantity: 8,
      ratedPowerW: 12,
      powerFactor: 0.95,
      operatingHoursPerDay: 6,
      operatingDaysPerMonth: 30,
      demandFactor: 0.8,
      phase: "SINGLE_PHASE",
      description: "LED lighting load",
    });

    expect(created).toHaveLength(1);
    expect(created[0]).toEqual(result);
  });

  it("preserves the Solar Engine Load fields", async () => {
    const { repository } =
      createLoadRepository();

    const result = await addLoad(
      createInput(),
      {
        loads: repository,
      },
    );

    expect(result.name).toBe(
      "Living Room Lighting",
    );
    expect(result.category).toBe("LIGHTING");
    expect(result.quantity).toBe(8);
    expect(result.ratedPowerW).toBe(12);
    expect(result.powerFactor).toBe(0.95);
    expect(result.operatingHoursPerDay).toBe(6);
    expect(result.operatingDaysPerMonth).toBe(30);
    expect(result.demandFactor).toBe(0.8);
    expect(result.phase).toBe("SINGLE_PHASE");
  });

  it("preserves optional engineering fields when supplied", async () => {
    const { repository } =
      createLoadRepository();

    const result = await addLoad(
      {
        ...createInput(),
        efficiency: 0.9,
      },
      {
        loads: repository,
      },
    );

    expect(result.efficiency).toBe(0.9);
  });

  it("does not add omitted optional fields", async () => {
    const { repository } =
      createLoadRepository();

    const result = await addLoad(
      {
        ...createInput(),
        efficiency: undefined,
        demandFactor: undefined,
        description: undefined,
      },
      {
        loads: repository,
      },
    );

    expect(
      Object.prototype.hasOwnProperty.call(
        result,
        "efficiency",
      ),
    ).toBe(false);

    expect(
      Object.prototype.hasOwnProperty.call(
        result,
        "demandFactor",
      ),
    ).toBe(false);

    expect(
      Object.prototype.hasOwnProperty.call(
        result,
        "description",
      ),
    ).toBe(false);
  });

  it("persists through the LoadRepository boundary", async () => {
    const { repository, created } =
      createLoadRepository();

    const result = await addLoad(
      createInput(),
      {
        loads: repository,
      },
    );

    expect(created).toContainEqual(result);
  });

  it("keeps project ownership separate from engineering load data", async () => {
    const { repository } =
      createLoadRepository();

    const result = await addLoad(
      createInput(),
      {
        loads: repository,
      },
    );

    expect(result.projectId).toBe(
      "project-001",
    );
  });
});
