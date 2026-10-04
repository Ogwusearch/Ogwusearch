
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getAuditDetails,
} from "../../src/application/audits/get-audit-details.js";

import type {
  SolarAudit,
} from "../../src/domain/audit.js";

import type {
  SolarAuditLoad,
} from "../../src/domain/load.js";

import type {
  SolarAuditProject,
} from "../../src/domain/project.js";

import type {
  AuditCalculationResult,
} from "../../src/domain/result.js";

import type {
  AuditRepository,
  LoadRepository,
  ProjectRepository,
  ResultRepository,
} from "../../src/persistence/index.js";

import type {
  CalculationResult,
} from "@ogwusearch/engineering-types";

import type {
  LoadAuditOutput,
} from "@ogwusearch/solar-engine";

describe("getAuditDetails", () => {
  function createProject(): SolarAuditProject {
    return {
      id: "project-001",
      name: "Residential Solar Project",
      description:
        "Residential solar installation",
      createdAt:
        "2026-10-01T09:00:00.000Z",
      updatedAt:
        "2026-10-01T09:30:00.000Z",
    };
  }

  function createAudit(): SolarAudit {
    return {
      id: "audit-001",
      projectId: "project-001",
      name: "Residential Solar Audit",
      status: "COMPLETED",
      createdAt:
        "2026-10-01T10:00:00.000Z",
      updatedAt:
        "2026-10-01T11:00:00.000Z",
    };
  }

  function createLoad(): SolarAuditLoad {
    return {
      id: "load-001",
      projectId: "project-001",
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

  function createCalculationResult(): CalculationResult<LoadAuditOutput> {
    return {
      valid: true,
      status: "SUCCESS",
      value: {
        loads: [],
        totalConnectedLoadW: 500,
        totalRunningLoadW: 500,
        totalDemandLoadW: 500,
        totalApparentPowerVA: 555.56,
        dailyEnergyWh: 4000,
        monthlyEnergyWh: 120000,
        peakDemandW: 500,
        designMargin: 0.2,
        designPeakDemandW: 600,
      },
      errors: [],
      warnings: [],
      assumptions: [],
      trace: {
        steps: [],
      },
      metadata: {},
    };
  }

  function createResult(): AuditCalculationResult {
    return {
      auditId: "audit-001",
      calculationName: "load-audit",
      result: createCalculationResult(),
      savedAt:
        "2026-10-01T11:01:00.000Z",
    };
  }

  function createProjectRepository(
    project?: SolarAuditProject,
  ): ProjectRepository {
    return {
      async create(value) {
        return value;
      },

      async findById() {
        return project;
      },

      async save(value) {
        return value;
      },
    };
  }

  function createAuditRepository(
    audit?: SolarAudit,
  ): AuditRepository {
    return {
      async create(value) {
        return value;
      },

      async findById() {
        return audit;
      },

      async save(value) {
        return value;
      },
    };
  }

  function createLoadRepository(
    loads: readonly SolarAuditLoad[],
  ): LoadRepository {
    return {
      async create(value) {
        return value;
      },

      async findById() {
        return undefined;
      },

      async findByProjectId() {
        return loads;
      },

      async save(value) {
        return value;
      },
    };
  }

  function createResultRepository(
    results: readonly AuditCalculationResult[],
  ): ResultRepository {
    return {
      async save(value) {
        return value;
      },

      async findByAuditId() {
        return results;
      },
    };
  }

  it("returns the complete audit details", async () => {
    const project =
      createProject();

    const audit =
      createAudit();

    const load =
      createLoad();

    const result =
      createResult();

    const details =
      await getAuditDetails(
        audit.id,
        {
          projects:
            createProjectRepository(
              project,
            ),

          audits:
            createAuditRepository(
              audit,
            ),

          loads:
            createLoadRepository(
              [load],
            ),

          results:
            createResultRepository(
              [result],
            ),
        },
      );

    expect(details).toEqual({
      audit,
      project,
      loads: [load],
      results: [result],
    });
  });

  it("rejects an unknown audit", async () => {
    await expect(
      getAuditDetails(
        "missing-audit",
        {
          projects:
            createProjectRepository(
              createProject(),
            ),

          audits:
            createAuditRepository(),

          loads:
            createLoadRepository([]),

          results:
            createResultRepository([]),
        },
      ),
    ).rejects.toThrow(
      "Audit not found: missing-audit",
    );
  });

  it("rejects when the audit project cannot be found", async () => {
    const audit =
      createAudit();

    await expect(
      getAuditDetails(
        audit.id,
        {
          projects:
            createProjectRepository(),

          audits:
            createAuditRepository(
              audit,
            ),

          loads:
            createLoadRepository([]),

          results:
            createResultRepository([]),
        },
      ),
    ).rejects.toThrow(
      "Project not found: project-001",
    );
  });

  it("returns empty loads and results when none exist", async () => {
    const project =
      createProject();

    const audit =
      createAudit();

    const details =
      await getAuditDetails(
        audit.id,
        {
          projects:
            createProjectRepository(
              project,
            ),

          audits:
            createAuditRepository(
              audit,
            ),

          loads:
            createLoadRepository([]),

          results:
            createResultRepository([]),
        },
      );

    expect(details).toEqual({
      audit,
      project,
      loads: [],
      results: [],
    });
  });
});
