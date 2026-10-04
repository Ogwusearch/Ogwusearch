import {
  describe,
  expect,
  it,
} from "vitest";

import {
  MemoryTelemetryStorage,
  TelemetryService,
} from "../src/index.js";

describe("TelemetryService", () => {
  it("tracks an event", async () => {
    const storage =
      new MemoryTelemetryStorage();

    const telemetry =
      new TelemetryService({
        storage,
        id: () => "event-001",
        now: () =>
          "2026-10-01T12:00:00.000Z",
      });

    const event =
      await telemetry.trackEvent({
        type: "project_created",
        project: "SolarAudit",
        data: {
          projectId: "project-001",
        },
      });

    expect(event).toEqual({
      id: "event-001",
      type: "project_created",
      timestamp:
        "2026-10-01T12:00:00.000Z",
      project: "SolarAudit",
      data: {
        projectId: "project-001",
      },
    });
  });

  it("returns stored events", async () => {
    const storage =
      new MemoryTelemetryStorage();

    const telemetry =
      new TelemetryService({
        storage,
        id: () => "event-001",
      });

    await telemetry.trackEvent({
      type: "audit_created",
      project: "SolarAudit",
    });

    const events =
      await telemetry.getEvents();

    expect(events).toHaveLength(1);
    expect(events[0]?.type).toBe(
      "audit_created",
    );
  });

  it("clears stored events", async () => {
    const storage =
      new MemoryTelemetryStorage();

    const telemetry =
      new TelemetryService({
        storage,
      });

    await telemetry.trackEvent({
      type: "page_view",
    });

    await telemetry.clear();

    expect(
      await telemetry.getEvents(),
    ).toHaveLength(0);
  });
});
