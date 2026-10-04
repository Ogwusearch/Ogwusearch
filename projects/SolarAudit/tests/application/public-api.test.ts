import { describe, expect, it } from "vitest";

import {
  createProject,
  CreateAuditService,
  addLoad,
  runAudit,
  executeAudit,
  getAuditDetails,
  getAuditResults,
  saveResult,
  solarAuditEngine,
} from "../../src/index.js";

describe("SolarAudit public application API", () => {
  it("exports the intended application use cases", () => {
    expect(createProject).toBeTypeOf("function");

    expect(CreateAuditService).toBeTypeOf(
      "function",
    );

    expect(addLoad).toBeTypeOf("function");

    expect(runAudit).toBeTypeOf("function");

    expect(executeAudit).toBeTypeOf(
      "function",
    );

    expect(getAuditDetails).toBeTypeOf(
      "function",
    );

    expect(getAuditResults).toBeTypeOf(
      "function",
    );

    expect(saveResult).toBeTypeOf(
      "function",
    );

    expect(solarAuditEngine).toBeDefined();

    expect(
      solarAuditEngine.runLoadAudit,
    ).toBeTypeOf("function");

    expect(
      solarAuditEngine.runEnergyAnalysis,
    ).toBeTypeOf("function");

    expect(
      solarAuditEngine.runPeakDemand,
    ).toBeTypeOf("function");
  });
});
