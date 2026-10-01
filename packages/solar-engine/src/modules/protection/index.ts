export type {
  ProtectionType,
  ElectricalMode,
  ProtectionSelectionInput,
  ProtectionElectricalInput,
  ProtectionDesignInput,
  ProtectionInput,
  ProtectionCompatibility,
  ProtectionOutput,
  ProtectionResultOutput,
} from "./types/index.js";

export { validateProtection } from "./validation/index.js";

export {
  calculateACBreaker,
  calculateDCFUse,
  calculateOvercurrentDevice,
  calculateStringFuse,
} from "./calculation/index.js";

export { createProtectionAssumptions } from "./assumptions/index.js";
export { createProtectionTrace } from "./trace/index.js";
export { runProtectionSizing } from "./run.js";

export {
  DEFAULT_PROTECTIVE_CURRENT_RATINGS_A,
  DEFAULT_DESIGN_MARGIN,
} from "./constants.js";

export type { CalculationResult } from "@ogwusearch/engineering-types";

export type ProtectionResult = import("@ogwusearch/engineering-types").CalculationResult<
  import("./types/index.js").ProtectionOutput
>;
