import type {
  Load,
} from "@ogwusearch/solar-engine";

/**
 * Application-owned project load.
 *
 * The engineering load contract remains owned by
 * solar-engine. SolarAudit adds project ownership metadata.
 */
export interface SolarAuditLoad extends Load {
  readonly projectId: string;
}
