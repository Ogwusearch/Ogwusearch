import type {
  EngineeringMessage,
} from "./engineering-message.js";

import type {
  InverterSizingValue,
} from "./inverter-sizing-output.js";

import type {
  InverterSizingTrace,
} from "../trace/index.js";

export interface InverterSizingResult {
  success: boolean;

  value?: InverterSizingValue;

  errors: EngineeringMessage[];

  warnings: EngineeringMessage[];

  trace?: InverterSizingTrace;

  metadata: {
    engine: "inverter-sizing";
    version: string;
    unitSystem: "SI";
  };
}
