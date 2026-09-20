import type { DimensionName } from "./dimensions";
import type { Unit } from "./units";
import { UNITS } from "./units";

export class UnitRegistry {
  private readonly units: Record<string, Unit>;

  constructor(units: Record<string, Unit> = UNITS) {
    this.units = units;
  }

  get(symbol: string): Unit {
    const unit = this.units[symbol];

    if (!unit) {
      throw new Error(`Unknown unit: ${symbol}`);
    }

    return unit;
  }

  has(symbol: string): boolean {
    return Boolean(this.units[symbol]);
  }

  list(): Unit[] {
    return Object.values(this.units);
  }

  byDimension(dimension: DimensionName): Unit[] {
    return this.list().filter(
      (unit) => unit.dimension === dimension,
    );
  }
}

export const unitRegistry = new UnitRegistry();