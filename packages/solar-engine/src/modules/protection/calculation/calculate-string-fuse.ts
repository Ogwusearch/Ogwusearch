import type {
  ProtectionInput,
  ProtectionOutput,
} from "../types/index.js";

import {
  buildProtectionOutput,
  calculateDesignCurrent,
} from "./common.js";

export function calculateStringFuse(
  input: ProtectionInput,
): ProtectionOutput {
  if (
    input.protection.type !== "STRING_FUSE" ||
    input.protection.mode !== "DC"
  ) {
    throw new Error(
      "calculateStringFuse() requires STRING_FUSE with DC mode.",
    );
  }

  if (input.electrical.shortCircuitCurrentA === undefined) {
    throw new Error(
      "calculateStringFuse() requires electrical.shortCircuitCurrentA.",
    );
  }

  return buildProtectionOutput(
    input,
    calculateDesignCurrent(input),
    input.electrical.systemVoltageV,
  );
}