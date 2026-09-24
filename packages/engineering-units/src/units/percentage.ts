// ============================================================
// @ogwusearch/engineering-units
// Percentage Units
// ============================================================

/**
 * Percentage-based units.
 *
 * Percentage is dimensionless.
 *
 * 1% = 0.01
 * 100% = 1
 */

export interface PercentageUnit {
  readonly symbol: string;
  readonly name: string;
  readonly toRatio: number;
}

/**
 * Ratio.
 *
 * 1 ratio = 1
 */
export const RATIO: PercentageUnit = {
  symbol: "",
  name: "ratio",
  toRatio: 1,
};

/**
 * Percent (%).
 *
 * 1% = 0.01 ratio
 */
export const PERCENT: PercentageUnit = {
  symbol: "%",
  name: "percent",
  toRatio: 1e-2,
};

/**
 * Per mille (‰).
 *
 * 1‰ = 0.001 ratio
 */
export const PER_MILLE: PercentageUnit = {
  symbol: "‰",
  name: "per mille",
  toRatio: 1e-3,
};

/**
 * Per ten-thousand (‱).
 *
 * 1‱ = 0.0001 ratio
 */
export const PER_TEN_THOUSAND: PercentageUnit = {
  symbol: "‱",
  name: "per ten-thousand",
  toRatio: 1e-4,
};

/**
 * All supported percentage/ration units.
 */
export const PERCENTAGE_UNITS = {
  ratio: RATIO,
  "%": PERCENT,
  "‰": PER_MILLE,
  "‱": PER_TEN_THOUSAND,
} as const;