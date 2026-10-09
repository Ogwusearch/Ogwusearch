import { describe, expect, it } from "vitest";
import type { CircuitDefinition } from "../contracts/circuit.js";
import { solveLinearDcCircuit } from "../analysis/linear-dc-solver.js";

function voltageDivider(): CircuitDefinition {
  return {
    id: "voltage-divider",
    nodes: [
      { id: "ground", isReference: true },
      { id: "input" },
      { id: "midpoint" },
    ],
    components: [
      {
        id: "v1",
        kind: "voltage-source",
        terminals: { positive: "input", negative: "ground" },
        parameters: { voltageVolts: 12 },
      },
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

describe("solveLinearDcCircuit", () => {
  it("solves a 12 V resistor divider", () => {
    const result = solveLinearDcCircuit(voltageDivider());

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.analysis.nodeVoltages.midpoint).toBeCloseTo(6, 10);
    expect(result.analysis.nodeVoltages.input).toBeCloseTo(12, 10);
    expect(result.analysis.branchResults.r1!.currentAmps).toBeCloseTo(0.006, 10);
    expect(result.analysis.branchResults.r2!.currentAmps).toBeCloseTo(0.006, 10);
    expect(result.analysis.branchResults.r1!.powerWatts).toBeCloseTo(0.036, 10);
  });

  it("solves a current-source circuit", () => {
    const circuit: CircuitDefinition = {
      id: "current-source",
      nodes: [
        { id: "ground", isReference: true },
        { id: "out" },
      ],
      components: [
        {
          id: "i1",
          kind: "current-source",
          terminals: { positive: "ground", negative: "out" },
          parameters: { currentAmps: 0.002 },
        },
        {
          id: "r1",
          kind: "resistor",
          terminals: { positive: "out", negative: "ground" },
          parameters: { resistanceOhms: 1000 },
        },
      ],
    };

    const result = solveLinearDcCircuit(circuit);

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.analysis.nodeVoltages.out).toBeCloseTo(2, 10);
    expect(result.analysis.branchResults.r1!.currentAmps).toBeCloseTo(0.002, 10);
  });

  it("rejects circuits without exactly one reference node", () => {
    const circuit: CircuitDefinition = {
      id: "no-ground",
      nodes: [{ id: "a" }, { id: "b" }],
      components: [
        {
          id: "r1",
          kind: "resistor",
          terminals: { positive: "a", negative: "b" },
          parameters: { resistanceOhms: 1000 },
        },
      ],
    };

    const result = solveLinearDcCircuit(circuit);

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors[0]!.code).toBe("REFERENCE_NODE_COUNT");
  });

  it("rejects non-positive resistor values", () => {
    const circuit: CircuitDefinition = {
      ...voltageDivider(),
      components: voltageDivider().components.map((component) =>
        component.id === "r1"
          ? { ...component, parameters: { resistanceOhms: 0 } }
          : component,
      ),
    };

    const result = solveLinearDcCircuit(circuit);

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors[0]!.code).toBe("INVALID_COMPONENT_PARAMETER");
  });

  it("rejects unsupported nonlinear components", () => {
    const circuit: CircuitDefinition = {
      ...voltageDivider(),
      components: [
        ...voltageDivider().components,
        {
          id: "d1",
          kind: "diode",
          terminals: { anode: "midpoint", cathode: "ground" },
          parameters: {},
        },
      ],
    };

    const result = solveLinearDcCircuit(circuit);

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors[0]!.code).toBe("UNSUPPORTED_COMPONENT");
  });

  it("rejects a floating, singular circuit", () => {
    const circuit: CircuitDefinition = {
      id: "floating-node",
      nodes: [
        { id: "ground", isReference: true },
        { id: "a" },
        { id: "floating" },
      ],
      components: [
        {
          id: "v1",
          kind: "voltage-source",
          terminals: { positive: "a", negative: "ground" },
          parameters: { voltageVolts: 5 },
        },
      ],
    };

    const result = solveLinearDcCircuit(circuit);

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors[0]!.code).toBe("SINGULAR_SYSTEM");
  });

  it("preserves voltage-source polarity and signed branch currents", () => {
    const base = voltageDivider();
    const circuit: CircuitDefinition = {
      ...base,
      components: base.components.map((component) =>
        component.id === "v1"
          ? { ...component, parameters: { voltageVolts: -12 } }
          : component,
      ),
    };

    const result = solveLinearDcCircuit(circuit);

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.analysis.nodeVoltages.input).toBeCloseTo(-12, 10);
    expect(result.analysis.nodeVoltages.midpoint).toBeCloseTo(-6, 10);
    expect(result.analysis.branchResults.r1!.currentAmps).toBeCloseTo(-0.006, 10);
    expect(result.analysis.branchResults.r2!.currentAmps).toBeCloseTo(-0.006, 10);
    expect(result.analysis.branchResults.v1!.voltageVolts).toBeCloseTo(-12, 10);
  });

  it("satisfies Kirchhoff's Current Law at the divider midpoint", () => {
    const result = solveLinearDcCircuit(voltageDivider());

    expect(result.success).toBe(true);
    if (!result.success) return;

    const incomingCurrent = result.analysis.branchResults.r1!.currentAmps;
    const outgoingCurrent = result.analysis.branchResults.r2!.currentAmps;

    expect(incomingCurrent).toBeCloseTo(outgoingCurrent, 10);
    expect(incomingCurrent - outgoingCurrent).toBeCloseTo(0, 10);
  });

  it("satisfies Kirchhoff's Voltage Law around the divider loop", () => {
    const result = solveLinearDcCircuit(voltageDivider());

    expect(result.success).toBe(true);
    if (!result.success) return;

    const sourceVoltage = result.analysis.branchResults.v1!.voltageVolts;
    const firstDrop = result.analysis.branchResults.r1!.voltageVolts;
    const secondDrop = result.analysis.branchResults.r2!.voltageVolts;

    expect(sourceVoltage).toBeCloseTo(12, 10);
    expect(firstDrop).toBeCloseTo(6, 10);
    expect(secondDrop).toBeCloseTo(6, 10);
    expect(sourceVoltage - firstDrop - secondDrop).toBeCloseTo(0, 10);
  });

  it("balances supplied and absorbed power in the divider", () => {
    const result = solveLinearDcCircuit(voltageDivider());

    expect(result.success).toBe(true);
    if (!result.success) return;

    const sourcePower = result.analysis.branchResults.v1!.powerWatts;
    const firstResistorPower = result.analysis.branchResults.r1!.powerWatts;
    const secondResistorPower = result.analysis.branchResults.r2!.powerWatts;

    expect(firstResistorPower).toBeCloseTo(0.036, 10);
    expect(secondResistorPower).toBeCloseTo(0.036, 10);
    expect(sourcePower).toBeCloseTo(-0.072, 10);
    expect(
      sourcePower + firstResistorPower + secondResistorPower,
    ).toBeCloseTo(0, 10);
  });


  it("rejects multiple reference nodes", () => {
    const base = voltageDivider();
    const circuit: CircuitDefinition = {
      ...base,
      nodes: base.nodes.map((node) =>
        node.id === "input" ? { ...node, isReference: true } : node,
      ),
    };

    const result = solveLinearDcCircuit(circuit);

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors[0]!.code).toBe("REFERENCE_NODE_COUNT");
  });

  it("rejects non-finite voltage-source values", () => {
    const base = voltageDivider();
    const circuit: CircuitDefinition = {
      ...base,
      components: base.components.map((component) =>
        component.id === "v1"
          ? { ...component, parameters: { voltageVolts: Number.NaN } }
          : component,
      ),
    };

    const result = solveLinearDcCircuit(circuit);

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors[0]!.code).toBe("INVALID_COMPONENT_PARAMETER");
  });

  it("rejects non-finite current-source values", () => {
    const circuit: CircuitDefinition = {
      id: "invalid-current-source",
      nodes: [
        { id: "ground", isReference: true },
        { id: "out" },
      ],
      components: [
        {
          id: "i1",
          kind: "current-source",
          terminals: { positive: "ground", negative: "out" },
          parameters: { currentAmps: Number.POSITIVE_INFINITY },
        },
        {
          id: "r1",
          kind: "resistor",
          terminals: { positive: "out", negative: "ground" },
          parameters: { resistanceOhms: 1000 },
        },
      ],
    };

    const result = solveLinearDcCircuit(circuit);

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors[0]!.code).toBe("INVALID_COMPONENT_PARAMETER");
  });

});
