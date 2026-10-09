import { describe, expect, it } from "vitest";
import {
  validateCircuit,
  type CircuitDefinition,
} from "../index.js";

function createValidCircuit(): CircuitDefinition {
  return {
    id: "voltage-divider",
    name: "Voltage Divider",
    nodes: [
      { id: "ground", isReference: true },
      { id: "input" },
      { id: "midpoint" },
    ],
    components: [
      {
        id: "r1",
        kind: "resistor",
        terminals: { positive: "input", negative: "midpoint" },
        parameters: { resistanceOhms: 1000 },
      },
      {
        id: "r2",
        kind: "resistor",
        terminals: { positive: "midpoint", negative: "ground" },
        parameters: { resistanceOhms: 1000 },
      },
    ],
  };
}

describe("validateCircuit", () => {
  it("accepts a structurally valid circuit", () => {
    expect(validateCircuit(createValidCircuit())).toEqual({
      valid: true,
      errors: [],
      warnings: [],
      issues: [],
    });
  });

  it("returns the shared validation result shape", () => {
    const circuit = {
      ...createValidCircuit(),
      id: "",
    };

    const result = validateCircuit(circuit);

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.warnings).toEqual([]);
    expect(result.issues).toEqual(result.errors);
    expect(result.errors[0]).toMatchObject({
      code: "INVALID_CIRCUIT_ID",
      severity: "ERROR",
      path: "id",
    });
  });

  it("rejects an empty circuit ID", () => {
    const circuit = { ...createValidCircuit(), id: "  " };

    const result = validateCircuit(circuit);

    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.code))
      .toContain("INVALID_CIRCUIT_ID");
  });

  it("rejects duplicate node IDs", () => {
    const circuit = createValidCircuit();

    const result = validateCircuit({
      ...circuit,
      nodes: [...circuit.nodes, { id: "input" }],
    });

    expect(result.issues.map((issue) => issue.code))
      .toContain("DUPLICATE_NODE_ID");
  });

  it("rejects duplicate component IDs", () => {
    const circuit = createValidCircuit();

    const result = validateCircuit({
      ...circuit,
      components: [
        ...circuit.components,
        {
          id: "r1",
          kind: "resistor",
          terminals: { positive: "input", negative: "ground" },
          parameters: { resistanceOhms: 2000 },
        },
      ],
    });

    expect(result.issues.map((issue) => issue.code))
      .toContain("DUPLICATE_COMPONENT_ID");
  });

  it("rejects terminals connected to unknown nodes", () => {
    const circuit = createValidCircuit();

    const result = validateCircuit({
      ...circuit,
      components: [
        {
          id: "r3",
          kind: "resistor",
          terminals: { positive: "missing-node", negative: "ground" },
          parameters: { resistanceOhms: 100 },
        },
      ],
    });

    expect(result.issues.map((issue) => issue.code))
      .toContain("UNKNOWN_TERMINAL_NODE");
  });

  it("rejects components without terminals", () => {
    const circuit = createValidCircuit();

    const result = validateCircuit({
      ...circuit,
      components: [
        {
          id: "r3",
          kind: "resistor",
          terminals: {},
          parameters: {},
        },
      ],
    });

    expect(result.issues.map((issue) => issue.code))
      .toContain("MISSING_TERMINALS");
  });

  it("reports multiple structural issues in one pass", () => {
    const circuit = createValidCircuit();

    const result = validateCircuit({
      ...circuit,
      nodes: [...circuit.nodes, { id: "input" }],
      components: [
        {
          id: "bad",
          kind: "resistor",
          terminals: { positive: "unknown" },
          parameters: {},
        },
      ],
    });

    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        "DUPLICATE_NODE_ID",
        "UNKNOWN_TERMINAL_NODE",
      ]),
    );
  });
});
