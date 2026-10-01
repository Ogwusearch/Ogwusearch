import type {
  ProtectionInput,
  ProtectionOutput,
} from "../types/index.js";

import {
  buildProtectionOutput,
  calculateDesignCurrent,
} from "./common.js";

export function calculateACBreaker(
  input: ProtectionInput,
): ProtectionOutput {
  if (
    input.protection.type !== "AC_BREAKER" ||
    input.protection.mode !== "AC"
  ) {
    throw new Error(
      "calculateACBreaker() requires AC_BREAKER with AC mode.",
    );
  }

  return buildProtectionOutput(
    input,
    calculateDesignCurrent(input),
    input.electrical.systemVoltageV,
  );
}