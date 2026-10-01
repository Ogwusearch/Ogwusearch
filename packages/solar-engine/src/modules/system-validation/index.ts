export type {
  SystemValidationInput,
  SystemValidationOutput,
  SystemValidationCheck,
  SystemValidationCheckStatus,
} from "./types/index.js";

export {
  runSystemValidation,
} from "./run.js";

export {
  validateSystem,
  validateSystemInput,
} from "./validation/index.js";

export {
  createSystemValidationAssumptions,
} from "./assumptions/index.js";

export {
  validateSystemConfiguration,
  validateCompleteness,
  validateCompatibility,
} from "./calculation/index.js";

export {
  createSystemValidationTrace,
} from "./trace/index.js";

export {
  createSystemValidationWarnings,
} from "./warnings.js";

export type {
  CalculationResult,
} from "@ogwusearch/engineering-types";

export type SystemValidationResult =
  import("@ogwusearch/engineering-types").CalculationResult<
    import("./types/index.js").SystemValidationOutput
  >;