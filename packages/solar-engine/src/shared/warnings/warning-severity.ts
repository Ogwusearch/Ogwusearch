 /**
  * Severity levels for solar-engineering warnings.
  *
  * Warnings are non-fatal by design. A higher severity indicates
  * increasing engineering attention, but does not automatically
  * invalidate a calculation.
  */
export type WarningSeverity =
  | "info"
  | "low"
  | "medium"
  | "high"
  | "critical";

/**
 * Numeric ordering useful for sorting or filtering warnings.
 */
export const WARNING_SEVERITY_LEVEL: Readonly<
  Record<WarningSeverity, number>
> = Object.freeze({
  info: 0,
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
});

/**
 * Compares two warning severities.
 *
 * Returns:
 *   < 0 when a < b
 *   = 0 when a = b
 *   > 0 when a > b
 */
export function compareWarningSeverity(
  a: WarningSeverity,
  b: WarningSeverity,
): number {
  return (
    WARNING_SEVERITY_LEVEL[a] -
    WARNING_SEVERITY_LEVEL[b]
  );
}

/**
 * Returns the more severe of two warning levels.
 */
export function maxWarningSeverity(
  a: WarningSeverity,
  b: WarningSeverity,
): WarningSeverity {
  return compareWarningSeverity(a, b) >= 0 ? a : b;
}