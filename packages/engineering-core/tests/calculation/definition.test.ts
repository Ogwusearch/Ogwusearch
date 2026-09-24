import { describe, expect, it } from "vitest";
import {
  defineCalculation,
} from "../../src/index.js";

describe("defineCalculation", () => {
  it("accepts a valid definition", () => {
    const definition = defineCalculation({
      name: "test",
      calculate: () => 1,
    });

    expect(definition.name).toBe("test");
  });

  it("rejects an empty calculation name", () => {
    expect(() =>
      defineCalculation({
        name: "",
        calculate: () => 1,
      }),
    ).toThrow();
  });
});
