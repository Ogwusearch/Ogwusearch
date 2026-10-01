import type {
  CalculationTrace,
  CalculationTraceStep,
} from "@ogwusearch/engineering-types";

import type {
  BOMInput,
  BOMItem,
} from "../types/index.js";

export function createBOMTrace(
  input: BOMInput,
  items: ReadonlyArray<BOMItem>,
): CalculationTrace {
  const steps: CalculationTraceStep[] = [];

  steps.push({
    id: "bom-collect-results",
    name: "Collect source results",
    description:
      "Collect authoritative upstream engineering calculation results.",
    inputs: {
      pv: input.pv !== undefined,
      battery: input.battery !== undefined,
      inverter: input.inverter !== undefined,
      chargeController:
        input.chargeController !== undefined,
      cable: input.cable !== undefined,
      protection: input.protection !== undefined,
      earthing: input.earthing !== undefined,
      additionalResults:
        input.additionalResults?.length ?? 0,
    },
    sequence: 1,
  });

  steps.push({
    id: "bom-extract-components",
    name: "Extract BOM components",
    description:
      "Extract only component quantities explicitly exposed by authoritative source results.",
    outputs: {
      itemCount: items.length,
    },
    sequence: 2,
  });

  steps.push({
    id: "bom-aggregate-items",
    name: "Aggregate equivalent items",
    description:
      "Merge equivalent BOM items while preserving their engineering quantity.",
    outputs: {
      itemCount: items.length,
    },
    sequence: 3,
  });

  return {
    steps,
  };
}
