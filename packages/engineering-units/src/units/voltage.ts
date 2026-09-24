import type { Unit } from "./unit.js";
import { VOLTAGE } from "../dimensions/dimensions.js";

export interface VoltageUnit extends Unit {
  readonly toVolts: number;
}

function createVoltageUnit(
  symbol: string,
  name: string,
  toVolts: number,
): VoltageUnit {
  return {
    symbol,
    name,
    dimension: VOLTAGE,
    toVolts,
    toBase: (value) => value * toVolts,
    fromBase: (value) => value / toVolts,
  };
}

export const VOLT = createVoltageUnit(
  "V",
  "volt",
  1,
);

export const MILLIVOLT = createVoltageUnit(
  "mV",
  "millivolt",
  1e-3,
);

export const MICROVOLT = createVoltageUnit(
  "µV",
  "microvolt",
  1e-6,
);

export const KILOVOLT = createVoltageUnit(
  "kV",
  "kilovolt",
  1e3,
);

export const MEGAVOLT = createVoltageUnit(
  "MV",
  "megavolt",
  1e6,
);

export const VOLTAGE_UNITS = {
  V: VOLT,
  mV: MILLIVOLT,
  "µV": MICROVOLT,
  kV: KILOVOLT,
  MV: MEGAVOLT,
} as const;