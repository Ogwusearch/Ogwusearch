import { describe, expect, it } from "vitest";

import { calculateLoadAudit } from "../calculation";
import type { LoadAuditInput } from "../input";

describe("calculateLoadAudit", () => {
  it("calculates total connected load", () => {
    const input: LoadAuditInput = {
      loads: [
        {
          appliance: "LED Lamp",
          quantity: 4,
          ratedPowerW: 10,
          hoursPerDay: 5,
        },
      ],
      diversityFactor: 1,
      designMargin: 0,
    };

    const result = calculateLoadAudit(input);

    expect(result.value.totalConnectedLoadW).toBe(40);
    expect(result.value.totalConnectedLoadKW).toBe(0.04);
  });

  it("calculates daily energy", () => {
    const input: LoadAuditInput = {
      loads: [
        {
          appliance: "LED Lamp",
          quantity: 4,
          ratedPowerW: 10,
          hoursPerDay: 5,
        },
      ],
      diversityFactor: 1,
      designMargin: 0,
    };

    const result = calculateLoadAudit(input);

    expect(result.value.totalDailyEnergyWh).toBe(200);
    expect(result.value.totalDailyEnergyKWh).toBe(0.2);
  });

  it("calculates weekly energy using the default 7 days", () => {
    const input: LoadAuditInput = {
      loads: [
        {
          appliance: "LED Lamp",
          quantity: 4,
          ratedPowerW: 10,
          hoursPerDay: 5,
        },
      ],
      diversityFactor: 1,
      designMargin: 0,
    };

    const result = calculateLoadAudit(input);

    expect(result.value.totalWeeklyEnergyWh).toBe(1400);
    expect(result.value.totalWeeklyEnergyKWh).toBe(1.4);
  });

  it("uses explicitly supplied days per week", () => {
    const input: LoadAuditInput = {
      loads: [
        {
          appliance: "Water Pump",
          quantity: 1,
          ratedPowerW: 500,
          hoursPerDay: 2,
          daysPerWeek: 5,
        },
      ],
      diversityFactor: 1,
      designMargin: 0,
    };

    const result = calculateLoadAudit(input);

    expect(result.value.totalWeeklyEnergyWh).toBe(5000);
    expect(result.value.totalWeeklyEnergyKWh).toBe(5);
  });

  it("applies diversity factor", () => {
    const input: LoadAuditInput = {
      loads: [
        {
          appliance: "Load A",
          quantity: 1,
          ratedPowerW: 1000,
          hoursPerDay: 1,
        },
        {
          appliance: "Load B",
          quantity: 1,
          ratedPowerW: 500,
          hoursPerDay: 1,
        },
      ],
      diversityFactor: 0.8,
      designMargin: 0,
    };

    const result = calculateLoadAudit(input);

    expect(result.value.totalConnectedLoadW).toBe(1500);
    expect(result.value.diversifiedLoadW).toBe(1200);
  });

  it("applies design margin", () => {
    const input: LoadAuditInput = {
      loads: [
        {
          appliance: "Load",
          quantity: 1,
          ratedPowerW: 1000,
          hoursPerDay: 1,
        },
      ],
      diversityFactor: 0.8,
      designMargin: 0.25,
    };

    const result = calculateLoadAudit(input);

    expect(result.value.diversifiedLoadW).toBe(800);
    expect(result.value.designLoadW).toBe(1000);
  });

  it("calculates apparent power when power factor is provided", () => {
    const input: LoadAuditInput = {
      loads: [
        {
          appliance: "Motor",
          quantity: 1,
          ratedPowerW: 1000,
          hoursPerDay: 2,
          powerFactor: 0.8,
        },
      ],
      diversityFactor: 1,
      designMargin: 0,
    };

    const result = calculateLoadAudit(input);
expect(result.value.loads[0]?.apparentPowerVA).toBe(1250);
  });

  it("calculates multiple loads independently", () => {
    const input: LoadAuditInput = {
      loads: [
        {
          appliance: "Lamp",
          quantity: 4,
          ratedPowerW: 20,
          hoursPerDay: 5,
        },
        {
          appliance: "TV",
          quantity: 1,
          ratedPowerW: 120,
          hoursPerDay: 6,
        },
      ],
      diversityFactor: 0.75,
      designMargin: 0.2,
    };

    const result = calculateLoadAudit(input);

    expect(result.value.totalConnectedLoadW).toBe(200);
    expect(result.value.totalDailyEnergyWh).toBe(1120);
    expect(result.value.diversifiedLoadW).toBe(150);
    expect(result.value.designLoadW).toBe(180);
  });
});
