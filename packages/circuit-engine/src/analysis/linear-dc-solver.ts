import type { CircuitDefinition } from "../contracts/circuit.js";
import { validateCircuit } from "../validation/validate-circuit.js";

export type LinearDcSolverErrorCode =
  | "INVALID_CIRCUIT"
  | "REFERENCE_NODE_COUNT"
  | "UNSUPPORTED_COMPONENT"
  | "INVALID_COMPONENT_PARAMETER"
  | "SINGULAR_SYSTEM";

export interface LinearDcSolverError {
  readonly code: LinearDcSolverErrorCode;
  readonly message: string;
  readonly path?: string;
}

export interface CircuitBranchResult {
  readonly voltageVolts: number;
  readonly currentAmps: number;
  readonly powerWatts: number;
}

export interface LinearDcAnalysis {
  readonly referenceNodeId: string;
  readonly nodeVoltages: Readonly<Record<string, number>>;
  readonly branchResults: Readonly<Record<string, CircuitBranchResult>>;
}

export type LinearDcSolverResult =
  | {
      readonly success: true;
      readonly analysis: LinearDcAnalysis;
      readonly errors: readonly [];
    }
  | {
      readonly success: false;
      readonly errors: readonly LinearDcSolverError[];
    };

interface ResistorModel {
  readonly id: string;
  readonly positive: string;
  readonly negative: string;
  readonly resistance: number;
}

interface CurrentSourceModel {
  readonly id: string;
  readonly positive: string;
  readonly negative: string;
  readonly current: number;
}

interface VoltageSourceModel {
  readonly id: string;
  readonly positive: string;
  readonly negative: string;
  readonly voltage: number;
}

function failure(
  code: LinearDcSolverErrorCode,
  message: string,
  path?: string,
): LinearDcSolverResult {
  const error: LinearDcSolverError = path === undefined
    ? { code, message }
    : { code, message, path };

  return { success: false, errors: [error] };
}

function numericParameter(
  circuit: CircuitDefinition,
  componentId: string,
  parameter: string,
): number | undefined {
  const component = circuit.components.find(
    (item) => item.id === componentId,
  );
  const value = component?.parameters[parameter];

  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

function solveLinearSystem(
  input: readonly (readonly number[])[],
  inputRightHandSide: readonly number[],
): number[] | undefined {
  const size = input.length;
  if (size === 0) return [];

  const matrix = input.map((row, index) => [
    ...row,
    inputRightHandSide[index]!,
  ]);

  let scale = 0;
  for (const row of input) {
    for (const value of row) {
      scale = Math.max(scale, Math.abs(value));
    }
  }

  if (scale === 0 || !Number.isFinite(scale)) return undefined;

  const tolerance = scale * 1e-12;

  for (let column = 0; column < size; column += 1) {
    let pivotRow = column;

    for (let row = column + 1; row < size; row += 1) {
      if (
        Math.abs(matrix[row]![column]!) >
        Math.abs(matrix[pivotRow]![column]!)
      ) {
        pivotRow = row;
      }
    }

    if (Math.abs(matrix[pivotRow]![column]!) <= tolerance) {
      return undefined;
    }

    [matrix[column], matrix[pivotRow]] = [
      matrix[pivotRow]!,
      matrix[column]!,
    ];

    const pivot = matrix[column]![column]!;

    for (let entry = column; entry <= size; entry += 1) {
      const currentValue = matrix[column]![entry]!;
    matrix[column]![entry] = currentValue / pivot;
    }

    for (let row = 0; row < size; row += 1) {
      if (row === column) continue;

      const factor = matrix[row]![column]!;

      for (let entry = column; entry <= size; entry += 1) {
        const currentValue = matrix[row]![entry]!;
      const pivotValue = matrix[column]![entry]!;
      matrix[row]![entry] = currentValue - factor * pivotValue;
      }
    }
  }

  const solution = matrix.map((row) => row[size]!);
  return solution.every(Number.isFinite) ? solution : undefined;
}

/**
 * Solves linear DC circuits containing resistors and independent ideal
 * DC voltage/current sources.
 *
 * Current source direction is positive terminal -> negative terminal.
 * Voltage source polarity is V(positive) - V(negative) = voltageVolts.
 * Resistor resistance is provided through resistanceOhms.
 */
export function solveLinearDcCircuit(
  circuit: CircuitDefinition,
): LinearDcSolverResult {
  const validation = validateCircuit(circuit);

  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors.map((issue) => ({
        code: "INVALID_CIRCUIT" as const,
        message: issue.message,
        path: issue.path,
      })),
    };
  }

  const referenceNodes = circuit.nodes.filter(
    (node) => node.isReference === true,
  );

  if (referenceNodes.length !== 1) {
    return failure(
      "REFERENCE_NODE_COUNT",
      `Exactly one reference node is required; found ${referenceNodes.length}.`,
    );
  }

  const referenceNodeId = referenceNodes[0]!.id;
  const nodeIds = circuit.nodes
    .filter((node) => node.id !== referenceNodeId)
    .map((node) => node.id);

  const nodeIndexes = new Map(
    nodeIds.map((nodeId, index) => [nodeId, index]),
  );

  const resistors: ResistorModel[] = [];
  const currentSources: CurrentSourceModel[] = [];
  const voltageSources: VoltageSourceModel[] = [];

  for (let index = 0; index < circuit.components.length; index += 1) {
    const component = circuit.components[index]!;
    const path = `components.${index}`;

    if (
      component.kind !== "resistor" &&
      component.kind !== "voltage-source" &&
      component.kind !== "current-source"
    ) {
      return failure(
        "UNSUPPORTED_COMPONENT",
        `Component "${component.id}" of kind "${component.kind}" is not supported by the linear DC solver.`,
        `${path}.kind`,
      );
    }

    const positive = component.terminals.positive;
    const negative = component.terminals.negative;

    if (positive === undefined || negative === undefined) {
      return failure(
        "INVALID_COMPONENT_PARAMETER",
        `Component "${component.id}" must define positive and negative terminals.`,
        `${path}.terminals`,
      );
    }

    if (component.kind === "resistor") {
      const resistance = numericParameter(
        circuit,
        component.id,
        "resistanceOhms",
      );

      if (resistance === undefined || resistance <= 0) {
        return failure(
          "INVALID_COMPONENT_PARAMETER",
          `Resistor "${component.id}" requires a finite positive resistanceOhms value.`,
          `${path}.parameters.resistanceOhms`,
        );
      }

      resistors.push({
        id: component.id,
        positive,
        negative,
        resistance,
      });
    } else if (component.kind === "current-source") {
      const current = numericParameter(
        circuit,
        component.id,
        "currentAmps",
      );

      if (current === undefined) {
        return failure(
          "INVALID_COMPONENT_PARAMETER",
          `Current source "${component.id}" requires a finite currentAmps value.`,
          `${path}.parameters.currentAmps`,
        );
      }

      currentSources.push({ id: component.id, positive, negative, current });
    } else {
      const voltage = numericParameter(
        circuit,
        component.id,
        "voltageVolts",
      );

      if (voltage === undefined) {
        return failure(
          "INVALID_COMPONENT_PARAMETER",
          `Voltage source "${component.id}" requires a finite voltageVolts value.`,
          `${path}.parameters.voltageVolts`,
        );
      }

      voltageSources.push({ id: component.id, positive, negative, voltage });
    }
  }

  const nodeCount = nodeIds.length;
  const matrixSize = nodeCount + voltageSources.length;

  if (matrixSize === 0) {
    return failure(
      "SINGULAR_SYSTEM",
      "The circuit contains no unknowns to solve.",
    );
  }

  const matrix = Array.from(
    { length: matrixSize },
    () => Array<number>(matrixSize).fill(0),
  );
  const rhs = Array<number>(matrixSize).fill(0);

  const addConductance = (
    positive: string,
    negative: string,
    conductance: number,
  ): void => {
    const p = nodeIndexes.get(positive);
    const n = nodeIndexes.get(negative);

    if (p !== undefined) matrix[p]![p]! += conductance;
    if (n !== undefined) matrix[n]![n]! += conductance;
    if (p !== undefined && n !== undefined) {
      matrix[p]![n]! -= conductance;
      matrix[n]![p]! -= conductance;
    }
  };

  for (const resistor of resistors) {
    addConductance(
      resistor.positive,
      resistor.negative,
      1 / resistor.resistance,
    );
  }

  for (const source of currentSources) {
    const p = nodeIndexes.get(source.positive);
    const n = nodeIndexes.get(source.negative);

    // Positive current flows from the positive terminal to the negative.
    if (p !== undefined) rhs[p]! -= source.current;
    if (n !== undefined) rhs[n]! += source.current;
  }

  for (let index = 0; index < voltageSources.length; index += 1) {
    const source = voltageSources[index]!;
    const sourceRow = nodeCount + index;
    const p = nodeIndexes.get(source.positive);
    const n = nodeIndexes.get(source.negative);

    if (p !== undefined) {
      matrix[p]![sourceRow]! += 1;
      matrix[sourceRow]![p]! += 1;
    }

    if (n !== undefined) {
      matrix[n]![sourceRow]! -= 1;
      matrix[sourceRow]![n]! -= 1;
    }

    rhs[sourceRow] = source.voltage;
  }

  const solution = solveLinearSystem(matrix, rhs);

  if (solution === undefined) {
    return failure(
      "SINGULAR_SYSTEM",
      "The circuit equations are singular or numerically unsolvable. Check for floating nodes, contradictory ideal sources, or an underdetermined circuit.",
    );
  }

  const voltageAt = (nodeId: string): number =>
    nodeId === referenceNodeId
      ? 0
      : solution[nodeIndexes.get(nodeId)!]!;

  const nodeVoltages: Record<string, number> = {};
  nodeVoltages[referenceNodeId] = 0;

  for (const nodeId of nodeIds) {
    nodeVoltages[nodeId] = voltageAt(nodeId);
  }

  const branchResults: Record<string, CircuitBranchResult> = {};

  for (const resistor of resistors) {
    const voltageVolts =
      voltageAt(resistor.positive) - voltageAt(resistor.negative);
    const currentAmps = voltageVolts / resistor.resistance;

    branchResults[resistor.id] = {
      voltageVolts,
      currentAmps,
      powerWatts: voltageVolts * currentAmps,
    };
  }

  for (const source of currentSources) {
    const voltageVolts =
      voltageAt(source.positive) - voltageAt(source.negative);

    branchResults[source.id] = {
      voltageVolts,
      currentAmps: source.current,
      powerWatts: voltageVolts * source.current,
    };
  }

  for (let index = 0; index < voltageSources.length; index += 1) {
    const source = voltageSources[index]!;
    const voltageVolts =
      voltageAt(source.positive) - voltageAt(source.negative);

    branchResults[source.id] = {
      voltageVolts,
      currentAmps: solution[nodeCount + index]!,
      powerWatts: voltageVolts * solution[nodeCount + index]!,
    };
  }

  return {
    success: true,
    errors: [],
    analysis: {
      referenceNodeId,
      nodeVoltages,
      branchResults,
    },
  };
}
