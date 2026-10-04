import { describe, expect, it } from "vitest";

import type { CalculationResult } from "@ogwusearch/engineering-types";
import type { LoadAuditOutput } from "@ogwusearch/solar-engine";

import {
  runAudit,
  type RunAuditInput,
} from "../../src/application/audits/run-audit.js";

import type {
  SolarAuditEngine,
} from "../../src/application/audits/solar-engine.js";

function createResult(): CalculationResult<LoadAuditOutput> {
  return {
    status: "SUCCESS",
    valid: true,
    value: {
      loads: [],
      totalConnectedLoadW: 0,
      totalRunningLoadW: 0,
      totalDemandLoadW: 0,
      totalApparentPowerVA: 0,
      dailyEnergyWh: 0,
      monthlyEnergyWh: 0,
      peakDemandW: 0,
      designMargin: 0,
      designPeakDemandW: 0,
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

function createInput(): RunAuditInput {
  return {
    loads: [
      {
        id: "load-001",
        projectId: "project-001",
        name: "Lighting",
        category: "LIGHTING",
        quantity: 10,
        ratedPowerW: 20,
        powerFactor: 0.95,
        operatingHoursPerDay: 8,
        operatingDaysPerMonth: 26,
        phase: "SINGLE_PHASE",
      },
    ],
    diversityFactor: 1.2,
    designMargin: 0.2,
  };
}

function createEngine(
  result: CalculationResult<LoadAuditOutput>,
  onRunLoadAudit?: (
    input: Parameters<
      SolarAuditEngine["runLoadAudit"]
    >[0],
  ) => void,
): SolarAuditEngine {
  return {
    runLoadAudit: (input) => {
      onRunLoadAudit?.(input);
      return result;
    },

    runEnergyAnalysis: () => {
      throw new Error(
        "runEnergyAnalysis should not be called by runAudit",
      );
    },

    runPeakDemand: () => {
      throw new Error(
        "runPeakDemand should not be called by runAudit",
      );
    },
  };
}

describe("runAudit", () => {
  it("runs the composed Solar Engine Load Audit", () => {
    const result = createResult();
    const input = createInput();

    let receivedInput:
      | Parameters<SolarAuditEngine["runLoadAudit"]>[0]
      | undefined;

    const engine = createEngine(
      result,
      (engineInput) => {
        receivedInput = engineInput;
      },
    );

    const output = runAudit(input, {
      engine,
    });

    expect(output.results.loadAudit).toBe(result);

    expect(receivedInput).toEqual({
      loads: [
        {
          id: "load-001",
          name: "Lighting",
          category: "LIGHTING",
          quantity: 10,
          ratedPowerW: 20,
          powerFactor: 0.95,
          operatingHoursPerDay: 8,
          operatingDaysPerMonth: 26,
          phase: "SINGLE_PHASE",
        },
      ],
      diversityFactor: 1.2,
      designMargin: 0.2,
    });
  });

  it("does not leak SolarAudit project ownership into the engineering Load contract", () => {
    const result = createResult();
    const input = createInput();

    let receivedInput:
      | Parameters<SolarAuditEngine["runLoadAudit"]>[0]
      | undefined;

    const engine = createEngine(
      result,
      (engineInput) => {
        receivedInput = engineInput;
      },
    );

    runAudit(input, {
      engine,
    });

    expect(receivedInput).toBeDefined();

    const firstLoad = receivedInput?.loads[0];

    expect(firstLoad).toBeDefined();

    expect(firstLoad).not.toHaveProperty(
      "projectId",
    );

    expect(firstLoad).toEqual({
      id: "load-001",
      name: "Lighting",
      category: "LIGHTING",
      quantity: 10,
      ratedPowerW: 20,
      powerFactor: 0.95,
      operatingHoursPerDay: 8,
      operatingDaysPerMonth: 26,
      phase: "SINGLE_PHASE",
    });
  });

  it("preserves optional diversity factor and design margin", () => {
    const result = createResult();
    const input = createInput();

    let receivedInput:
      | Parameters<SolarAuditEngine["runLoadAudit"]>[0]
      | undefined;

    const engine = createEngine(
      result,
      (engineInput) => {
        receivedInput = engineInput;
      },
    );

    runAudit(input, {
      engine,
    });

    expect(receivedInput?.diversityFactor).toBe(
      1.2,
    );

    expect(receivedInput?.designMargin).toBe(0.2);
  });

  it("returns the authoritative CalculationResult unchanged", () => {
    const result = createResult();
    const input = createInput();

    const engine = createEngine(result);

    const output = runAudit(input, {
      engine,
    });

    expect(output.results.loadAudit).toBe(
      result,
    );

    expect(output.results.loadAudit.status).toBe(
      "SUCCESS",
    );

    expect(output.results.loadAudit.valid).toBe(
      true,
    );

    expect(output.results.loadAudit.value).toEqual(
      result.value,
    );

    expect(output.results.loadAudit.errors).toEqual(
      result.errors,
    );

    expect(output.results.loadAudit.warnings).toEqual(
      result.warnings,
    );

    expect(
      output.results.loadAudit.assumptions,
    ).toEqual(result.assumptions);

    expect(output.results.loadAudit.trace).toEqual(
      result.trace,
    );

    expect(
      output.results.loadAudit.metadata,
    ).toEqual(result.metadata);
  });
});