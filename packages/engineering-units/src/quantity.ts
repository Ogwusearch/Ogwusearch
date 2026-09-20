import type { DimensionName } from "./dimensions";
import { UNITS } from "./units";

export interface Quantity {
  value: number;
  unit: string;
  dimension: DimensionName;
}

export function quantity(
  value: number,
  unit: string,
): Quantity {
  const definition = UNITS[unit];

  if (!definition) {
    throw new Error(`Unknown unit: ${unit}`);
  }

  return {
    value,
    unit,
    dimension: definition.dimension,
  };
}

export function convert(
  input: Quantity,
  targetUnit: string,
): Quantity {
  const source = UNITS[input.unit];
  const target = UNITS[targetUnit];

  if (!source) {
    throw new Error(`Unknown source unit: ${input.unit}`);
  }

  if (!target) {
    throw new Error(`Unknown target unit: ${targetUnit}`);
  }

  if (source.dimension !== target.dimension) {
    throw new Error(
      `Incompatible dimensions: ${source.dimension} → ${target.dimension}`,
    );
  }

  const baseValue = source.toBase(input.value);
  const convertedValue = target.fromBase(baseValue);

  return {
    value: convertedValue,
    unit: targetUnit,
    dimension: target.dimension,
  };
}