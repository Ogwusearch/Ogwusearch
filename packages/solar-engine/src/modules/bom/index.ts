export type {
  BOMInput,
  BOMItem,
  BOMItemCategory,
  BOMItemSource,
  BOMQuantityKind,
  BOMCategorySummary,
  BOMOutput,
} from "./types/index.js";

export {
  validateBOM,
  validateBOMItems,
  validateBOMOutput,
} from "./validation/index.js";

export {
  collectBOMItems,
  aggregateBOMItems,
  buildBOM,
} from "./calculation/index.js";

export {
  createBOMAssumptions,
} from "./assumptions/index.js";

export {
  createBOMTrace,
} from "./trace/index.js";

export {
  runBOM,
} from "./run.js";

export type {
  CalculationResult,
} from "@ogwusearch/engineering-types";

export type BOMResult =
  import("@ogwusearch/engineering-types").CalculationResult<
    import("./types/index.js").BOMOutput
  >;
