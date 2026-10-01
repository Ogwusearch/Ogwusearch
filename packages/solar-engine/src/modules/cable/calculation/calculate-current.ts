import type {
  CableInput,
  CableOutput,
} from "../types/index.js";

export function calculateCurrent(
  input: CableInput,
): Pick<
  CableOutput,
  "operatingCurrentA"
> {
  if (
    input.operatingCurrentA !==
    undefined
  ) {
    return {
      operatingCurrentA:
        input.operatingCurrentA,
    };
  }

  if (
    input.loadPowerW === undefined ||
    input.systemVoltageV === undefined
  ) {
    throw new Error(
      "Load power and system voltage are required when operating current is not supplied.",
    );
  }

  if (input.mode === "DC") {
    return {
      operatingCurrentA:
        input.loadPowerW /
        input.systemVoltageV,
    };
  }

  if (input.powerFactor === undefined) {
    throw new Error(
      "Power factor is required for AC current calculation.",
    );
  }

  return {
    operatingCurrentA:
      input.loadPowerW /
      (
        input.systemVoltageV *
        input.powerFactor
      ),
  };
}