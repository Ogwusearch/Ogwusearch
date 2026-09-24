// ============================================================
// @ogwusearch/engineering-units
// Time Units
// ============================================================

/**
 * Time units.
 *
 * SI base unit:
 *   second (s)
 */

export interface TimeUnit {
  readonly symbol: string;
  readonly name: string;
  readonly toSeconds: number;
}

/**
 * Second (s)
 *
 * SI base unit of time.
 */
export const SECOND: TimeUnit = {
  symbol: "s",
  name: "second",
  toSeconds: 1,
};

/**
 * Millisecond (ms)
 *
 * 1 ms = 0.001 s
 */
export const MILLISECOND: TimeUnit = {
  symbol: "ms",
  name: "millisecond",
  toSeconds: 1e-3,
};

/**
 * Microsecond (µs)
 *
 * 1 µs = 0.000001 s
 */
export const MICROSECOND: TimeUnit = {
  symbol: "µs",
  name: "microsecond",
  toSeconds: 1e-6,
};

/**
 * Nanosecond (ns)
 *
 * 1 ns = 0.000000001 s
 */
export const NANOSECOND: TimeUnit = {
  symbol: "ns",
  name: "nanosecond",
  toSeconds: 1e-9,
};

/**
 * Minute (min)
 *
 * 1 min = 60 s
 */
export const MINUTE: TimeUnit = {
  symbol: "min",
  name: "minute",
  toSeconds: 60,
};

/**
 * Hour (h)
 *
 * 1 h = 3,600 s
 */
export const HOUR: TimeUnit = {
  symbol: "h",
  name: "hour",
  toSeconds: 3600,
};

/**
 * Day (d)
 *
 * 1 d = 86,400 s
 */
export const DAY: TimeUnit = {
  symbol: "d",
  name: "day",
  toSeconds: 86400,
};

/**
 * Week (wk)
 *
 * 1 wk = 604,800 s
 */
export const WEEK: TimeUnit = {
  symbol: "wk",
  name: "week",
  toSeconds: 604800,
};

/**
 * All supported time units.
 */
export const TIME_UNITS = {
  s: SECOND,
  ms: MILLISECOND,
  "µs": MICROSECOND,
  ns: NANOSECOND,
  min: MINUTE,
  h: HOUR,
  d: DAY,
  wk: WEEK,
} as const;