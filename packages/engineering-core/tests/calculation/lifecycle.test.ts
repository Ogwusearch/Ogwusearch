import { describe, expect, it } from "vitest";
import type {
  CalculationLifecycleStage,
} from "../../src/index.js";

describe("CalculationLifecycleStage", () => {
  it("documents lifecycle stages", () => {
    const stages: CalculationLifecycleStage[] = [
      "VALIDATE",
      "CALCULATE",
      "FINALIZE",
    ];

    expect(stages).toHaveLength(3);
  });
});
