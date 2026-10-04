
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  executeAudit,
} from "../../src/application/audits/execute-audit.js";

import type {
  SolarAuditEngine,
} from "../../src/application/audits/solar-engine.js";

import type {
  SolarAudit,
} from "../../src/domain/audit.js";

import type {
  SolarAuditLoad,
} from "../../src/domain/load.js";

import type {
  AuditCalculationResult,
} from "../../src/domain/result.js";

import type {
  AuditRepository,
  LoadRepository,
  ResultRepository,
} from "../../src/persistence/index.js";

import type {
  CalculationResult,
} from "@ogwusearch/engineering-types";

import type {
  LoadAuditOutput,
} from "@ogwusearch/solar-engine";

describe("executeAudit", () => {
  function createAuditRepository(
    audit?: SolarAudit,
  ): {
    repository: AuditRepository;
    saved: SolarAudit[];
  } {
    const saved: SolarAudit[] = [];

    const repository: AuditRepository = {
      async create(value) {
        return value;
      },

      async findById() {
        return audit;
      },

      async save(value) {
        saved.push(value);
        return value;
      },
    };

    return {
      repository,
      saved,
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
    saved: AuditCalculationResult,
  ): ResultRepository {
    return {
      async save() {
        return saved;
      },

      async findByAuditId() {
        return [saved];
      },
    };
  }

  function createEngine(
    result: CalculationResult<LoadAuditOutput>,
    calls: {
      runLoadAudit: number;
    },
  ): SolarAuditEngine {
    return {
      runLoadAudit() {
        calls.runLoadAudit += 1;
        return result;
      },

      runEnergyAnalysis() {
        throw new Error(
          "runEnergyAnalysis should not be called",
        );
      },

      runPeakDemand() {
        throw new Error(
          "runPeakDemand should not be called",
        );
      },
    };
  }

  function createAudit(): SolarAudit {
    return {
      id: "audit-001",
      projectId: "project-001",
      name: "Residential Solar Audit",
      status: "DRAFT",
      createdAt:
        "2026-10-01T10:00:00.000Z",
      updatedAt:
        "2026-10-01T10:00:00.000Z",
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

  it("loads the audit and project loads", async () => {
    const audit = createAudit();
    const load = createLoad();

    const auditRepository =
      createAuditRepository(audit);

    const loadRepository =
      createLoadRepository([load]);

    const calls = {
      runLoadAudit: 0,
    };

    const calculation =
      createCalculationResult();

    const engine =
      createEngine(
        calculation,
        calls,
      );

    const savedResult: AuditCalculationResult = {
      auditId: audit.id,
      calculationName: "load-audit",
      result: calculation,
      savedAt:
        "2026-10-01T10:01:00.000Z",
    };

    const resultRepository =
      createResultRepository(
        savedResult,
      );

    const result = await executeAudit(
      {
        auditId: audit.id,
      },
      {
        audits:
          auditRepository.repository,
        loads: loadRepository,
        results: resultRepository,
        engine,
      },
    );

    expect(result).toEqual(
      savedResult,
    );
  });

  it("runs the composed load audit through the Solar Engine", async () => {
    const audit = createAudit();
    const load = createLoad();

    const calls = {
      runLoadAudit: 0,
    };

    const calculation =
      createCalculationResult();

    const engine =
      createEngine(
        calculation,
        calls,
      );

    const savedResult: AuditCalculationResult = {
      auditId: audit.id,
      calculationName: "load-audit",
      result: calculation,
      savedAt:
        "2026-10-01T10:01:00.000Z",
    };

    const resultRepository =
      createResultRepository(
        savedResult,
      );

    await executeAudit(
      {
        auditId: audit.id,
      },
      {
        audits:
          createAuditRepository(
            audit,
          ).repository,
        loads:
          createLoadRepository([load]),
        results: resultRepository,
        engine,
      },
    );

    expect(calls.runLoadAudit)
      .toBe(1);
  });

  it("does not call individual energy or peak-demand calculations", async () => {
    const audit = createAudit();

    const calculation =
      createCalculationResult();

    const calls = {
      runLoadAudit: 0,
    };

    const engine =
      createEngine(
        calculation,
        calls,
      );

    const savedResult: AuditCalculationResult = {
      auditId: audit.id,
      calculationName: "load-audit",
      result: calculation,
      savedAt:
        "2026-10-01T10:01:00.000Z",
    };

    await executeAudit(
      {
        auditId: audit.id,
      },
      {
        audits:
          createAuditRepository(
            audit,
          ).repository,
        loads:
          createLoadRepository([]),
        results:
          createResultRepository(
            savedResult,
          ),
        engine,
      },
    );

    expect(calls.runLoadAudit)
      .toBe(1);
  });

  it("passes diversity factor and design margin to the audit flow", async () => {
    const audit = createAudit();

    const calculation =
      createCalculationResult();

    let receivedDiversityFactor:
      | number
      | undefined;

    let receivedDesignMargin:
      | number
      | undefined;

    const engine: SolarAuditEngine = {
      runLoadAudit(input) {
        receivedDiversityFactor =
          input.diversityFactor;

        receivedDesignMargin =
          input.designMargin;

        return calculation;
      },

      runEnergyAnalysis() {
        throw new Error(
          "runEnergyAnalysis should not be called",
        );
      },

      runPeakDemand() {
        throw new Error(
          "runPeakDemand should not be called",
        );
      },
    };

    const savedResult: AuditCalculationResult = {
      auditId: audit.id,
      calculationName: "load-audit",
      result: calculation,
      savedAt:
        "2026-10-01T10:01:00.000Z",
    };

    await executeAudit(
      {
        auditId: audit.id,
        diversityFactor: 1.25,
        designMargin: 0.2,
      },
      {
        audits:
          createAuditRepository(
            audit,
          ).repository,
        loads:
          createLoadRepository([]),
        results:
          createResultRepository(
            savedResult,
          ),
        engine,
      },
    );

    expect(
      receivedDiversityFactor,
    ).toBe(1.25);

    expect(
      receivedDesignMargin,
    ).toBe(0.2);
  });

  it("saves the load-audit result", async () => {
    const audit = createAudit();

    const calculation =
      createCalculationResult();

    let savedInput:
      | AuditCalculationResult
      | undefined;

    const resultRepository: ResultRepository = {
      async save(value) {
        savedInput = value;
        return value;
      },

      async findByAuditId() {
        return [];
      },
    };

    const saved = await executeAudit(
      {
        auditId: audit.id,
      },
      {
        audits:
          createAuditRepository(
            audit,
          ).repository,
        loads:
          createLoadRepository([]),
        results: resultRepository,
        engine: createEngine(
          calculation,
          {
            runLoadAudit: 0,
          },
        ),
      },
    );

    expect(savedInput).toMatchObject({
      auditId: audit.id,
      calculationName: "load-audit",
      result: calculation,
    });

    expect(savedInput?.savedAt)
      .toEqual(
        expect.any(String),
      );

    expect(saved).toEqual(
      savedInput,
    );
  });

  it("rejects an unknown audit", async () => {
    const engine = createEngine(
      createCalculationResult(),
      {
        runLoadAudit: 0,
      },
    );

    await expect(
      executeAudit(
        {
          auditId: "missing-audit",
        },
        {
          audits:
            createAuditRepository()
              .repository,
          loads:
            createLoadRepository([]),
          results:
            createResultRepository({
              auditId: "missing-audit",
              calculationName:
                "load-audit",
              result:
                createCalculationResult(),
              savedAt:
                "2026-10-01T10:01:00.000Z",
            }),
          engine,
        },
      ),
    ).rejects.toThrow(
      "Audit not found: missing-audit",
    );
  });

  it("transitions the audit from DRAFT to RUNNING to COMPLETED", async () => {
    const audit = createAudit();

    const auditRepository =
      createAuditRepository(audit);

    const calculation =
      createCalculationResult();

    const savedResult: AuditCalculationResult = {
      auditId: audit.id,
      calculationName: "load-audit",
      result: calculation,
      savedAt:
        "2026-10-01T10:01:00.000Z",
    };

    const result = await executeAudit(
      {
        auditId: audit.id,
      },
      {
        audits:
          auditRepository.repository,
        loads:
          createLoadRepository([]),
        results:
          createResultRepository(
            savedResult,
          ),
        engine: createEngine(
          calculation,
          {
            runLoadAudit: 0,
          },
        ),
        now: () =>
          "2026-10-01T11:00:00.000Z",
      },
    );

    expect(result).toEqual(
      savedResult,
    );

    expect(auditRepository.saved)
      .toHaveLength(2);

    expect(auditRepository.saved[0])
      .toMatchObject({
        id: audit.id,
        status: "RUNNING",
        updatedAt:
          "2026-10-01T11:00:00.000Z",
      });

    expect(auditRepository.saved[1])
      .toMatchObject({
        id: audit.id,
        status: "COMPLETED",
        updatedAt:
          "2026-10-01T11:00:00.000Z",
      });
  });

  it("transitions the audit to FAILED when engineering execution fails", async () => {
    const audit = createAudit();

    const auditRepository =
      createAuditRepository(audit);

    const calculationError =
      new Error("Calculation failed");

    const engine: SolarAuditEngine = {
      runLoadAudit() {
        throw calculationError;
      },

      runEnergyAnalysis() {
        throw new Error(
          "runEnergyAnalysis should not be called",
        );
      },

      runPeakDemand() {
        throw new Error(
          "runPeakDemand should not be called",
        );
      },
    };

    await expect(
      executeAudit(
        {
          auditId: audit.id,
        },
        {
          audits:
            auditRepository.repository,
          loads:
            createLoadRepository([]),
          results:
            createResultRepository({
              auditId: audit.id,
              calculationName:
                "load-audit",
              result:
                createCalculationResult(),
              savedAt:
                "2026-10-01T10:01:00.000Z",
            }),
          engine,
          now: () =>
            "2026-10-01T11:00:00.000Z",
        },
      ),
    ).rejects.toBe(
      calculationError,
    );

    expect(auditRepository.saved)
      .toHaveLength(2);

    expect(
      auditRepository.saved[0].status,
    ).toBe("RUNNING");

    expect(
      auditRepository.saved[1].status,
    ).toBe("FAILED");

    expect(
      auditRepository.saved[0].updatedAt,
    ).toBe(
      "2026-10-01T11:00:00.000Z",
    );

    expect(
      auditRepository.saved[1].updatedAt,
    ).toBe(
      "2026-10-01T11:00:00.000Z",
    );
  });

  it("transitions the audit to FAILED when result persistence fails", async () => {
    const audit = createAudit();

    const auditRepository =
      createAuditRepository(audit);

    const persistenceError =
      new Error(
        "Result persistence failed",
      );

    const resultRepository: ResultRepository = {
      async save() {
        throw persistenceError;
      },

      async findByAuditId() {
        return [];
      },
    };

    await expect(
      executeAudit(
        {
          auditId: audit.id,
        },
        {
          audits:
            auditRepository.repository,
          loads:
            createLoadRepository([]),
          results: resultRepository,
          engine: createEngine(
            createCalculationResult(),
            {
              runLoadAudit: 0,
            },
          ),
          now: () =>
            "2026-10-01T11:00:00.000Z",
        },
      ),
    ).rejects.toBe(
      persistenceError,
    );

    expect(auditRepository.saved)
      .toHaveLength(2);

    expect(
      auditRepository.saved[0].status,
    ).toBe("RUNNING");

    expect(
      auditRepository.saved[1].status,
    ).toBe("FAILED");

    expect(
      auditRepository.saved[0].updatedAt,
    ).toBe(
      "2026-10-01T11:00:00.000Z",
    );

    expect(
      auditRepository.saved[1].updatedAt,
    ).toBe(
      "2026-10-01T11:00:00.000Z",
    );
  });
});