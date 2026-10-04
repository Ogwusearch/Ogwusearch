import type {
  TelemetrySummary,
} from "../aggregation/aggregate-events.js";

export interface DashboardSeries {
  readonly label: string;
  readonly data: readonly number[];
}

export interface DashboardChart {
  readonly labels: readonly string[];
  readonly series: readonly DashboardSeries[];
}

export interface TelemetryDashboardData {
  readonly totalEvents: number;
  readonly activity: DashboardChart;
  readonly eventTypes: DashboardChart;
  readonly projects: DashboardChart;
}

export function toDashboardData(
  summary: TelemetrySummary,
): TelemetryDashboardData {
  return {
    totalEvents: summary.totalEvents,

    activity: {
      labels: Object.keys(summary.byDay),
      series: [
        {
          label: "Events",
          data: Object.values(summary.byDay),
        },
      ],
    },

    eventTypes: {
      labels: Object.keys(summary.byType),
      series: [
        {
          label: "Events",
          data: Object.values(summary.byType),
        },
      ],
    },

    projects: {
      labels: Object.keys(summary.byProject),
      series: [
        {
          label: "Activity",
          data: Object.values(summary.byProject),
        },
      ],
    },
  };
}
