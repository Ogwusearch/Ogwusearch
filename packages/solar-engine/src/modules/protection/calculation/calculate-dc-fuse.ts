import type {
  ProtectionInput,
  ProtectionOutput,
} from "../types/index.js";

import {
  buildProtectionOutput,
  calculateDesignCurrent,
} from "./common.js";

export function calculateDCFUse(
  input: ProtectionInput,
): ProtectionOutput {
  if (
    input.protection.type !== "DC_FUSE" ||
    input.protection.mode !== "DC"
  ) {
    throw new Error(
      "calculateDCFUse() requires DC_FUSE with DC mode.",
    );
  }

  return buildProtectionOutput(
    input,
    calculateDesignCurrent(input),
    input.electrical.systemVoltageV,
  );
}