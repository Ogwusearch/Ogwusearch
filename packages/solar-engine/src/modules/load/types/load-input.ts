// ============================================================
// Load Audit Input
// ============================================================

import type { Load } from "./load.js";

export interface LoadAuditInput {
  readonly loads: readonly Load[];

  /**
   * Aggregate diversity factor consumed by Peak Demand.
   */
  readonly diversityFactor?: number;

  /**
   * Design margin applied by Peak Demand.
   */
  readonly designMargin?: number;
}
