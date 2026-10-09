import type {
  EngineeringError,
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import {
  createError,
  createPath,
} from "@ogwusearch/engineering-validation";

import type {
  ValidationResult,
} from "@ogwusearch/engineering-validation";

import type {
  CircuitDefinition,
} from "../contracts/circuit.js";

export type CircuitValidationIssueCode =
  | "INVALID_CIRCUIT_ID"
  | "INVALID_NODE_ID"
  | "DUPLICATE_NODE_ID"
  | "INVALID_COMPONENT_ID"
  | "DUPLICATE_COMPONENT_ID"
  | "UNSUPPORTED_COMPONENT_KIND"
  | "MISSING_TERMINALS"
  | "INVALID_TERMINAL_NAME"
  | "INVALID_TERMINAL_NODE_ID"
  | "UNKNOWN_TERMINAL_NODE";

export interface CircuitValidationIssue extends EngineeringError {
  readonly code: CircuitValidationIssueCode;
  readonly path: string;
}

export interface CircuitValidationResult extends ValidationResult {
  readonly errors: CircuitValidationIssue[];
  readonly warnings: EngineeringIssue[];
  readonly issues: CircuitValidationIssue[];
}

const SUPPORTED_COMPONENT_KINDS: ReadonlySet<string> = new Set([
  "resistor",
  "capacitor",
  "inductor",
  "diode",
  "bjt",
  "mosfet",
  "op-amp",
  "transformer",
  "voltage-source",
  "current-source",
  "switch",
]);

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function circuitIssue(
  code: CircuitValidationIssueCode,
  message: string,
  path: string,
): CircuitValidationIssue {
  const error: EngineeringError = createError({
    code,
    message,
    path,
  });

  return {
    ...error,
    code,
    path,
  };
}

export function validateCircuit(
  circuit: CircuitDefinition,
): CircuitValidationResult {
  const issues: CircuitValidationIssue[] = [];
  const nodeIds = new Set<string>();
  const componentIds = new Set<string>();

  if (!isNonEmptyString(circuit.id)) {
    issues.push(
      circuitIssue(
        "INVALID_CIRCUIT_ID",
        "Circuit ID must be a non-empty string.",
        "id",
      ),
    );
  }

  circuit.nodes.forEach((node, index) => {
    const path = createPath("nodes", index, "id");

    if (!isNonEmptyString(node.id)) {
      issues.push(
        circuitIssue(
          "INVALID_NODE_ID",
          "Node ID must be a non-empty string.",
          path,
        ),
      );
      return;
    }

    if (nodeIds.has(node.id)) {
      issues.push(
        circuitIssue(
          "DUPLICATE_NODE_ID",
          `Node ID "${node.id}" is duplicated.`,
          path,
        ),
      );
      return;
    }

    nodeIds.add(node.id);
  });

  circuit.components.forEach((component, index) => {
    const basePath = createPath("components", index);

    if (!isNonEmptyString(component.id)) {
      issues.push(
        circuitIssue(
          "INVALID_COMPONENT_ID",
          "Component ID must be a non-empty string.",
          createPath(basePath, "id"),
        ),
      );
    } else if (componentIds.has(component.id)) {
      issues.push(
        circuitIssue(
          "DUPLICATE_COMPONENT_ID",
          `Component ID "${component.id}" is duplicated.`,
          createPath(basePath, "id"),
        ),
      );
    } else {
      componentIds.add(component.id);
    }

    if (!SUPPORTED_COMPONENT_KINDS.has(component.kind)) {
      issues.push(
        circuitIssue(
          "UNSUPPORTED_COMPONENT_KIND",
          `Component kind "${String(component.kind)}" is unsupported.`,
          createPath(basePath, "kind"),
        ),
      );
    }

    const terminalEntries = Object.entries(component.terminals);

    if (terminalEntries.length === 0) {
      issues.push(
        circuitIssue(
          "MISSING_TERMINALS",
          "A component must declare at least one terminal.",
          createPath(basePath, "terminals"),
        ),
      );
    }

    for (const [terminalName, nodeId] of terminalEntries) {
      if (!isNonEmptyString(terminalName)) {
        issues.push(
          circuitIssue(
            "INVALID_TERMINAL_NAME",
            "Terminal names must be non-empty strings.",
            createPath(basePath, "terminals"),
          ),
        );
      }

      const terminalPath = createPath(
        basePath,
        "terminals",
        terminalName,
      );

      if (!isNonEmptyString(nodeId)) {
        issues.push(
          circuitIssue(
            "INVALID_TERMINAL_NODE_ID",
            `Terminal "${terminalName}" must reference a non-empty node ID.`,
            terminalPath,
          ),
        );
      } else if (!nodeIds.has(nodeId)) {
        issues.push(
          circuitIssue(
            "UNKNOWN_TERMINAL_NODE",
            `Terminal "${terminalName}" references unknown node "${nodeId}".`,
            terminalPath,
          ),
        );
      }
    }
  });

  return {
    valid: issues.length === 0,
    errors: issues,
    warnings: [],
    issues,
  };
}
