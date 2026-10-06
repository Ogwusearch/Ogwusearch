import type {
  Load,
} from "@ogwusearch/load-engine";

/**
 * Application-owned project load.
 *
 * The engineering load contract is owned by
 * load-engine. SolarAudit adds project ownership metadata.
 */
export interface SolarAuditLoad extends Load {
  readonly projectId: string;
}