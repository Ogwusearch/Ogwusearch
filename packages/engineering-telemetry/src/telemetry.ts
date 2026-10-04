import type {
  TelemetryEvent,
  TelemetryEventType,
} from "./events/event-types.js";

import type {
  TelemetryStorage,
} from "./storage/telemetry-storage.js";

export interface TrackEventInput<
  TData extends Record<string, unknown> =
    Record<string, unknown>,
> {
  readonly type: TelemetryEventType;
  readonly project?: string;
  readonly data?: TData;
}

export interface TelemetryServiceOptions {
  readonly storage: TelemetryStorage;
  readonly now?: () => string;
  readonly id?: () => string;
}

export class TelemetryService {
  constructor(
    private readonly options: TelemetryServiceOptions,
  ) {}

  async trackEvent<
    TData extends Record<string, unknown>,
  >(
    input: TrackEventInput<TData>,
  ): Promise<TelemetryEvent<TData>> {
    const event: TelemetryEvent<TData> = {
      id:
        this.options.id?.() ??
        crypto.randomUUID(),

      type: input.type,

      timestamp:
        this.options.now?.() ??
        new Date().toISOString(),

      ...(input.project !== undefined
        ? {
            project: input.project,
          }
        : {}),

      data:
        input.data ??
        ({} as TData),
    };

    await this.options.storage.append(
      event,
    );

    return event;
  }

  async getEvents(): Promise<
    readonly TelemetryEvent[]
  > {
    return this.options.storage.getAll();
  }

  async clear(): Promise<void> {
    await this.options.storage.clear();
  }
}
