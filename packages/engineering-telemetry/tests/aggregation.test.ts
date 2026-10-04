import {
  describe,
  expect,
  it,
} from "vitest";

import {
  aggregateEvents,
} from "../src/index.js";

describe("aggregateEvents", () => {
  it("aggregates telemetry", () => {
    const result =
      aggregateEvents([
        {
          id: "1",
          type: "audit_created",
          timestamp:
            "2026-10-01T10:00:00.000Z",
          project: "SolarAudit",
          data: {},
        },
        {
          id: "2",
          type: "calculation_completed",
          timestamp:
            "2026-10-01T11:00:00.000Z",
          project: "SolarAudit",
          data: {},
        },
        {
          id: "3",
          type: "audit_created",
          timestamp:
            "2026-10-02T10:00:00.000Z",
          project: "SolarAudit",
          data: {},
        },
      ]);

    expect(result.totalEvents).toBe(3);

    expect(result.byType).toEqual({
      audit_created: 2,
      calculation_completed: 1,
    });

    expect(result.byProject).toEqual({
      SolarAudit: 3,
    });

    expect(result.byDay).toEqual({
      "2026-10-01": 2,
      "2026-10-02": 1,
    });
  });
});
