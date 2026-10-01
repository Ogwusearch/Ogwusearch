import type {
  ProtectionInput,
  ProtectionOutput,
} from "../types/index.js";

import {
  buildProtectionOutput,
  calculateDesignCurrent,
} from "./common.js";

export function calculateOvercurrentDevice(
  input: ProtectionInput,
): ProtectionOutput {
  if (
    input.protection.type !== "OVERCURRENT_DEVICE"
  ) {
    throw new Error(
      "calculateOvercurrentDevice() requires OVERCURRENT_DEVICE protection type.",
    );
  }

  return buildProtectionOutput(
    input,
    calculateDesignCurrent(input),
    input.electrical.systemVoltageV,
  );
}