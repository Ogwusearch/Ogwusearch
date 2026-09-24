import type { Unit } from "./unit.js";
import { CURRENT } from "../dimensions/dimensions.js";

export interface CurrentUnit extends Unit {
  readonly toAmperes: number;
}

function createCurrentUnit(
  symbol: string,
  name: string,
  toAmperes: number,
): CurrentUnit {
  return {
    symbol,
    name,
    dimension: CURRENT,
    toAmperes,
    toBase: (value) => value * toAmperes,
    fromBase: (value) => value / toAmperes,
  };
}

export const AMPERE = createCurrentUnit(
  "A",
  "ampere",
  1,
);

export const KILOAMPERE = createCurrentUnit(
  "kA",
  "kiloampere",
  1e3,
);

export const MILLIAMPERE = createCurrentUnit(
  "mA",
  "milliampere",
  1e-3,
);

export const MICROAMPERE = createCurrentUnit(
  "µA",
  "microampere",
  1e-6,
);

export const NANOAMPERE = createCurrentUnit(
  "nA",
  "nanoampere",
  1e-9,
);

export const CURRENT_UNITS = {
  A: AMPERE,
  kA: KILOAMPERE,
  mA: MILLIAMPERE,
  "µA": MICROAMPERE,
  nA: NANOAMPERE,
} as const;