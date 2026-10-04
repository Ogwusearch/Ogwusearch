import type { TelemetryEvent } from "../events/event-types.js";

export interface TelemetryStorage {
  append(event: TelemetryEvent): Promise<void>;

  getAll(): Promise<
    readonly TelemetryEvent[]
  >;

  clear(): Promise<void>;
}
