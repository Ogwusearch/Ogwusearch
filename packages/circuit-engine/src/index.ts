/**
 * @ogwusearch/circuit-engine
 *
 * Circuit-domain contracts and structural validation.
 * Numerical analysis and simulation are introduced in later phases.
 */

export type {
  CircuitComponent,
  CircuitComponentKind,
  CircuitDefinition,
  CircuitNode,
  CircuitParameterValue,
} from "./contracts/circuit.js";

export {
  validateCircuit,
} from "./validation/validate-circuit.js";

export type {
  CircuitValidationIssue,
  CircuitValidationIssueCode,
  CircuitValidationResult,
} from "./validation/validate-circuit.js";

export {
  solveLinearDcCircuit,
} from "./analysis/linear-dc-solver.js";

export type {
  CircuitBranchResult,
  LinearDcAnalysis,
  LinearDcSolverError,
  LinearDcSolverErrorCode,
  LinearDcSolverResult,
} from "./analysis/linear-dc-solver.js";
