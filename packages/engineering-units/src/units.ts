import type { DimensionName } from "./dimensions";

export interface Unit {
  id: string;
  symbol: string;
  name: string;
  dimension: DimensionName;

  /**
   * Converts a value from this unit to the base unit.
   */
  toBase(value: number): number;

  /**
   * Converts a value from the base unit to this unit.
   */
  fromBase(value: number): number;
}

const linear =
  (factor: number) => ({
    toBase: (value: number) => value * factor,
    fromBase: (value: number) => value / factor,
  });

export const UNITS: Record<string, Unit> = {
  // Length
  m: {
    id: "meter",
    symbol: "m",
    name: "meter",
    dimension: "length",
    ...linear(1),
  },

  mm: {
    id: "millimeter",
    symbol: "mm",
    name: "millimeter",
    dimension: "length",
    ...linear(0.001),
  },

  cm: {
    id: "centimeter",
    symbol: "cm",
    name: "centimeter",
    dimension: "length",
    ...linear(0.01),
  },

  km: {
    id: "kilometer",
    symbol: "km",
    name: "kilometer",
    dimension: "length",
    ...linear(1000),
  },

  // Area
  "mm2": {
    id: "square-millimeter",
    symbol: "mm²",
    name: "square millimeter",
    dimension: "area",
    ...linear(0.000001),
  },

  "cm2": {
    id: "square-centimeter",
    symbol: "cm²",
    name: "square centimeter",
    dimension: "area",
    ...linear(0.0001),
  },

  "m2": {
    id: "square-meter",
    symbol: "m²",
    name: "square meter",
    dimension: "area",
    ...linear(1),
  },

  // Time
  s: {
    id: "second",
    symbol: "s",
    name: "second",
    dimension: "time",
    ...linear(1),
  },

  min: {
    id: "minute",
    symbol: "min",
    name: "minute",
    dimension: "time",
    ...linear(60),
  },

  h: {
    id: "hour",
    symbol: "h",
    name: "hour",
    dimension: "time",
    ...linear(3600),
  },

  // Current
  A: {
    id: "ampere",
    symbol: "A",
    name: "ampere",
    dimension: "current",
    ...linear(1),
  },

  mA: {
    id: "milliampere",
    symbol: "mA",
    name: "milliampere",
    dimension: "current",
    ...linear(0.001),
  },

  // Voltage
  V: {
    id: "volt",
    symbol: "V",
    name: "volt",
    dimension: "voltage",
    ...linear(1),
  },

  kV: {
    id: "kilovolt",
    symbol: "kV",
    name: "kilovolt",
    dimension: "voltage",
    ...linear(1000),
  },

  // Power
  W: {
    id: "watt",
    symbol: "W",
    name: "watt",
    dimension: "power",
    ...linear(1),
  },

  kW: {
    id: "kilowatt",
    symbol: "kW",
    name: "kilowatt",
    dimension: "power",
    ...linear(1000),
  },

  MW: {
    id: "megawatt",
    symbol: "MW",
    name: "megawatt",
    dimension: "power",
    ...linear(1_000_000),
  },

  // Energy
  J: {
    id: "joule",
    symbol: "J",
    name: "joule",
    dimension: "energy",
    ...linear(1),
  },

  Wh: {
    id: "watt-hour",
    symbol: "Wh",
    name: "watt-hour",
    dimension: "energy",
    ...linear(3600),
  },

  kWh: {
    id: "kilowatt-hour",
    symbol: "kWh",
    name: "kilowatt-hour",
    dimension: "energy",
    ...linear(3_600_000),
  },

  // Charge
  C: {
    id: "coulomb",
    symbol: "C",
    name: "coulomb",
    dimension: "charge",
    ...linear(1),
  },

  Ah: {
    id: "ampere-hour",
    symbol: "Ah",
    name: "ampere-hour",
    dimension: "charge",
    ...linear(3600),
  },

  // Resistance
  ohm: {
    id: "ohm",
    symbol: "Ω",
    name: "ohm",
    dimension: "resistance",
    ...linear(1),
  },

  kohm: {
    id: "kilohm",
    symbol: "kΩ",
    name: "kilohm",
    dimension: "resistance",
    ...linear(1000),
  },

  // Conductance
  S: {
    id: "siemens",
    symbol: "S",
    name: "siemens",
    dimension: "conductance",
    ...linear(1),
  },

  // Frequency
  Hz: {
    id: "hertz",
    symbol: "Hz",
    name: "hertz",
    dimension: "frequency",
    ...linear(1),
  },

  kHz: {
    id: "kilohertz",
    symbol: "kHz",
    name: "kilohertz",
    dimension: "frequency",
    ...linear(1000),
  },

  // Temperature
  K: {
    id: "kelvin",
    symbol: "K",
    name: "kelvin",
    dimension: "temperature",
    ...linear(1),
  },
};