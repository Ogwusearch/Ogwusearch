import type {
  EngineeringWarning,
} from "@ogwusearch/engineering-types";

import type {
  CostingInput,
  CostingOutput,
} from "./types/index.js";

/**
 * Costing does not independently determine whether a supplied
 * unit price is commercially high or low.
 *
 * No market-price threshold is therefore invented here.
 */
export function createCostingWarnings(
  _input: CostingInput,
  _output: CostingOutput,
): EngineeringWarning[] {
  return [];
}
