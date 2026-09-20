export type DimensionName =
  | "dimensionless"
  | "length"
  | "area"
  | "volume"
  | "mass"
  | "time"
  | "current"
  | "voltage"
  | "power"
  | "energy"
  | "charge"
  | "resistance"
  | "conductance"
  | "frequency"
  | "temperature";

export interface Dimension {
  name: DimensionName;
  symbol: string;
}

export const DIMENSIONS: Record<DimensionName, Dimension> = {
  dimensionless: {
    name: "dimensionless",
    symbol: "1",
  },

  length: {
    name: "length",
    symbol: "L",
  },

  area: {
    name: "area",
    symbol: "L²",
  },

  volume: {
    name: "volume",
    symbol: "L³",
  },

  mass: {
    name: "mass",
    symbol: "M",
  },

  time: {
    name: "time",
    symbol: "T",
  },

  current: {
    name: "current",
    symbol: "I",
  },

  voltage: {
    name: "voltage",
    symbol: "V",
  },

  power: {
    name: "power",
    symbol: "P",
  },

  energy: {
    name: "energy",
    symbol: "E",
  },

  charge: {
    name: "charge",
    symbol: "Q",
  },

  resistance: {
    name: "resistance",
    symbol: "R",
  },

  conductance: {
    name: "conductance",
    symbol: "G",
  },

  frequency: {
    name: "frequency",
    symbol: "f",
  },

  temperature: {
    name: "temperature",
    symbol: "Θ",
  },
};