import type {
  TelemetryEvent,
} from "../events/event-types.js";

export interface TelemetrySummary {
  readonly totalEvents: number;

  readonly byType: Readonly<
    Record<string, number>
  >;

  readonly byProject: Readonly<
    Record<string, number>
  >;

  readonly byDay: Readonly<
    Record<string, number>
  >;
}

export function aggregateEvents(
  events: readonly TelemetryEvent[],
): TelemetrySummary {
  const byType: Record<string, number> = {};
  const byProject: Record<string, number> = {};
  const byDay: Record<string, number> = {};

  for (const event of events) {
    byType[event.type] =
      (byType[event.type] ?? 0) + 1;

    if (event.project !== undefined) {
      byProject[event.project] =
        (byProject[event.project] ?? 0) + 1;
    }

    const day =
      event.timestamp.slice(0, 10);

    byDay[day] =
      (byDay[day] ?? 0) + 1;
  }

  return {
    totalEvents: events.length,
    byType,
    byProject,
    byDay,
  };
}
