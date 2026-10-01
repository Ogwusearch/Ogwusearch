export type {
  ReportsInput,
  ReportSection,
  ReportsOutput,
} from "./types/index.js";

export {
  validateReports,
  validateReportsInput,
} from "./validation/index.js";

export {
  createReportsAssumptions,
} from "./assumptions/index.js";

export {
  collectResults,
  buildSections,
  buildReport,
} from "./calculation/index.js";

export {
  createReportsTrace,
} from "./trace/index.js";

export {
  runReports,
} from "./run.js";

export type {
  CalculationResult,
} from "@ogwusearch/engineering-types";

export type ReportsResult =
  import("@ogwusearch/engineering-types").CalculationResult<
    import("./types/index.js").ReportsOutput
  >;
