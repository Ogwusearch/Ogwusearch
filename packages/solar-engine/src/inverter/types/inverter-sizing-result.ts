
import type {
  EngineeringMessage,
} from "./engineering-message";

import type {
  InverterSizingValue,
} from "./inverter-sizing-output";

import type {
  InverterSizingTrace,
} from "../trace";

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
