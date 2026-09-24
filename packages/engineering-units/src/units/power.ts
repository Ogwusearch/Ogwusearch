import type { Unit } from "./unit.js";
import { POWER } from "../dimensions/dimensions.js";

export interface PowerUnit extends Unit {
  readonly toWatts: number;
}

function createPowerUnit(
  symbol: string,
  name: string,
  toWatts: number,
): PowerUnit {
  return {
    symbol,
    name,
    dimension: POWER,
    toWatts,
    toBase: (value) => value * toWatts,
    fromBase: (value) => value / toWatts,
  };
}

export const WATT = createPowerUnit(
  "W",
  "watt",
  1,
);

export const MILLIWATT = createPowerUnit(
  "mW",
  "milliwatt",
  1e-3,
);

export const KILOWATT = createPowerUnit(
  "kW",
  "kilowatt",
  1e3,
);

export const MEGAWATT = createPowerUnit(
  "MW",
  "megawatt",
  1e6,
);

export const GIGAWATT = createPowerUnit(
  "GW",
  "gigawatt",
  1e9,
);

export const HORSEPOWER = createPowerUnit(
  "hp",
  "horsepower",
  745.699872,
);

export const METRIC_HORSEPOWER = createPowerUnit(
  "PS",
  "metric horsepower",
  735.49875,
);

export const VOLT_AMPERE = createPowerUnit(
  "VA",
  "volt-ampere",
  1,
);

export const KILOVOLT_AMPERE = createPowerUnit(
  "kVA",
  "kilovolt-ampere",
  1e3,
);

export const MEGAVOLT_AMPERE = createPowerUnit(
  "MVA",
  "megavolt-ampere",
  1e6,
);

export const VAR = createPowerUnit(
  "var",
  "volt-ampere reactive",
  1,
);

export const KILOVAR = createPowerUnit(
  "kvar",
  "kilovolt-ampere reactive",
  1e3,
);

export const MEGAVAR = createPowerUnit(
  "Mvar",
  "megavolt-ampere reactive",
  1e6,
);

export const POWER_UNITS = {
  W: WATT,
  mW: MILLIWATT,
  kW: KILOWATT,
  MW: MEGAWATT,
  GW: GIGAWATT,
  hp: HORSEPOWER,
  PS: METRIC_HORSEPOWER,
  VA: VOLT_AMPERE,
  kVA: KILOVOLT_AMPERE,
  MVA: MEGAVOLT_AMPERE,
  var: VAR,
  kvar: KILOVAR,
  Mvar: MEGAVAR,
} as const;