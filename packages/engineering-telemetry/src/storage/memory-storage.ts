import type { TelemetryEvent } from "../events/event-types.js";

import type {
  TelemetryStorage,
} from "./telemetry-storage.js";

export class MemoryTelemetryStorage
  implements TelemetryStorage
{
  private readonly events: TelemetryEvent[] = [];

  async append(
    event: TelemetryEvent,
  ): Promise<void> {
    this.events.push(event);
  }

  async getAll(): Promise<
    readonly TelemetryEvent[]
  > {
    return [...this.events];
  }

  async clear(): Promise<void> {
    this.events.length = 0;
  }
}
