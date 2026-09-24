import { describe, expect, it } from "vitest";
import {
  TraceBuilder,
} from "../../src/index.js";

describe("TraceBuilder", () => {
  it("collects trace steps", () => {
    const trace = new TraceBuilder();

    trace.add({
      id: "step-1",
      name: "test",
    });

    expect(trace.getSteps()).toHaveLength(1);
    expect(trace.getSteps()[0]?.name).toBe("test");
  });
});
