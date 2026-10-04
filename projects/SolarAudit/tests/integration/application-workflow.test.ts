import { describe, expect, it } from "vitest";

import {
  createProject,
  addLoad,
  executeAudit,
  getAuditDetails,
} from "../../src/application/index.js";

import {
  CreateAuditService,
} from "../../src/application/audits/create-audit.js";

import {
  MemoryProjectRepository,
  MemoryAuditRepository,
  MemoryLoadRepository,
  MemoryResultRepository,
} from "../../src/infrastructure/index.js";

import {
  solarAuditEngine,
} from "../../src/application/audits/solar-engine.js";

describe("SolarAudit application integration workflow", () => {
  it("creates, executes, persists, and reads a complete audit workflow", async () => {
    const projects =
      new MemoryProjectRepository();

    const audits =
      new MemoryAuditRepository();

    const loads =
      new MemoryLoadRepository();

    const results =
      new MemoryResultRepository();

    const project = await createProject(
      {
        id: "project-integration-001",
        name: "Integration Solar Project",
        description:
          "Phase 10 application integration test",
      },
      {
        projects,
        now: () => "2026-10-01T10:00:00.000Z",
      },
    );

    expect(project).toEqual({
      id: "project-integration-001",
      name: "Integration Solar Project",
      description:
        "Phase 10 application integration test",
      createdAt:
        "2026-10-01T10:00:00.000Z",
      updatedAt:
        "2026-10-01T10:00:00.000Z",
    });

    const createAuditService =
      new CreateAuditService(
        projects,
        audits,
        () => "2026-10-01T10:01:00.000Z",
      );

    const audit =
      await createAuditService.execute({
        id: "audit-integration-001",
        projectId: project.id,
        name: "Load Audit",
      });

    expect(audit).toEqual({
      id: "audit-integration-001",
      projectId:
        "project-integration-001",
      name: "Load Audit",
      status: "DRAFT",
      createdAt:
        "2026-10-01T10:01:00.000Z",
      updatedAt:
        "2026-10-01T10:01:00.000Z",
    });

    const load = await addLoad(
      {
        id: "load-integration-001",
        projectId: project.id,
        name: "Refrigerator",
        category: "APPLIANCE",
        quantity: 1,
        ratedPowerW: 500,
        powerFactor: 0.9,
        operatingHoursPerDay: 8,
        operatingDaysPerMonth: 30,
        phase: "SINGLE_PHASE",
      },
      {
        loads,
      },
    );

    expect(load).toEqual({
      id: "load-integration-001",
      projectId:
        "project-integration-001",
      name: "Refrigerator",
      category: "APPLIANCE",
      quantity: 1,
      ratedPowerW: 500,
      powerFactor: 0.9,
      operatingHoursPerDay: 8,
      operatingDaysPerMonth: 30,
      phase: "SINGLE_PHASE",
    });

    const savedResult =
      await executeAudit(
        {
          auditId: audit.id,
        },
        {
          audits,
          loads,
          results,
          engine: solarAuditEngine,
          now: () => "2026-10-01T10:02:00.000Z",
        },
      );

    expect(savedResult.auditId).toBe(
      audit.id,
    );

    expect(
      savedResult.calculationName,
    ).toBe("load-audit");

    expect(savedResult.result.valid).toBe(
      true,
    );

    expect(savedResult.result.status).toBe(
      "SUCCESS",
    );

    expect(
      savedResult.result.value,
    ).toBeDefined();

    const storedAudit =
      await audits.findById(audit.id);

    expect(storedAudit).toBeDefined();

    expect(storedAudit?.status).toBe(
      "COMPLETED",
    );

    expect(storedAudit?.projectId).toBe(
      project.id,
    );

    const storedResults =
      await results.findByAuditId(
        audit.id,
      );

    expect(storedResults).toHaveLength(1);

    expect(
      storedResults[0],
    ).toEqual(savedResult);

    const details =
      await getAuditDetails(
        audit.id,
        {
          projects,
          audits,
          loads,
          results,
        },
      );

    expect(details.project).toEqual(
      project,
    );

    expect(details.audit.status).toBe(
      "COMPLETED",
    );

    expect(details.loads).toHaveLength(1);

    expect(details.loads[0]).toEqual(
      load,
    );

    expect(details.results).toHaveLength(1);

    expect(
      details.results[0],
    ).toEqual(savedResult);
  });
});