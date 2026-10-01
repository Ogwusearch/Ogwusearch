import type {
  CalculationResult,
} from "@ogwusearch/engineering-types";

import type {
  ReportsInput,
} from "../types/index.js";

interface NamedResult {
  readonly id: string;
  readonly title: string;
  readonly result: CalculationResult;
}

const SOURCE_RESULTS = [
  ["load", "Load Analysis"],
  ["energy", "Energy Analysis"],
  ["peakDemand", "Peak Demand"],
  ["pvSizing", "PV Sizing"],
  ["pvArray", "PV Array"],
  ["pvString", "PV String"],
  ["battery", "Battery"],
  ["inverter", "Inverter"],
  ["chargeController", "Charge Controller"],
  ["cable", "Cable"],
  ["voltageDrop", "Voltage Drop"],
  ["protection", "Protection"],
  ["earthing", "Earthing"],
  ["generator", "Generator"],
  ["bom", "Bill of Materials"],
  ["costing", "Costing"],
  ["systemValidation", "System Validation"],
] as const;

export function collectResults(
  input: ReportsInput,
): ReadonlyArray<NamedResult> {
  const results: NamedResult[] = [];

  for (const [id, title] of SOURCE_RESULTS) {
    const result = input[id];

    if (result !== undefined) {
      results.push({
        id,
        title,
        result,
      });
    }
  }

  for (
    let index = 0;
    index < (input.additionalResults?.length ?? 0);
    index += 1
  ) {
    const result = input.additionalResults?.[index];

    if (result !== undefined) {
      results.push({
        id: `additional-${index + 1}`,
        title: `Additional Result ${index + 1}`,
        result,
      });
    }
  }

  return results;
}
