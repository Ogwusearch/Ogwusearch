import {
  describe,
  expect,
  it,
} from "vitest";

import {
  MemoryTelemetryStorage,
} from "../src/index.js";

describe("MemoryTelemetryStorage", () => {
  it("stores events", async () => {
    const storage =
      new MemoryTelemetryStorage();

    const event = {
      id: "event-001",
      type: "page_view" as const,
      timestamp:
        "2026-10-01T12:00:00.000Z",
      data: {},
    };

    await storage.append(event);

    expect(
      await storage.getAll(),
    ).toEqual([event]);
  });

  it("clears events", async () => {
    const storage =
      new MemoryTelemetryStorage();

    await storage.append({
      id: "event-001",
      type: "page_view",
      timestamp:
        "2026-10-01T12:00:00.000Z",
      data: {},
    });

    await storage.clear();

    expect(
      await storage.getAll(),
    ).toEqual([]);
  });
});
