import type {
  ExecutionDetail,
  ModuleHealth,
  TelemetryActivity,
  TelemetryExecution,
  TelemetryMetric,
} from "../../types/telemetry";

import { MetricCard } from "../MetricCard/MetricCard";
import { ActivityFeed } from "../ActivityFeed/ActivityFeed";
import { ExecutionTable } from "../ExecutionTable/ExecutionTable";
import { ExecutionDetail as ExecutionDetailView } from "../ExecutionDetail/ExecutionDetail";
import { ModuleHealth as ModuleHealthView } from "../ModuleHealth/ModuleHealth";

interface DashboardProps {
  metrics: TelemetryMetric;
  executions: TelemetryExecution[];
  activities: TelemetryActivity[];
  modules: ModuleHealth[];
  selectedExecution: ExecutionDetail | null;
  onSelectExecution: (executionId: string) => void;
}

export function Dashboard({
  metrics,
  executions,
  activities,
  modules,
  selectedExecution,
  onSelectExecution,
}: DashboardProps) {
  return (
    <main className="dashboard">
      <div className="metrics-grid">
        <MetricCard
          label="Executions"
          value={metrics.executions.toLocaleString()}
        />

        <MetricCard
          label="Success Rate"
          value={`${metrics.successRate}%`}
        />

        <MetricCard
          label="Warning Rate"
          value={`${metrics.warningRate}%`}
        />

        <MetricCard
          label="Error Rate"
          value={`${metrics.errorRate}%`}
        />

        <MetricCard
          label="Average Duration"
          value={`${metrics.averageDurationMs} ms`}
        />
      </div>

      <ActivityFeed activities={activities} />

      <div className="two-column">
        <ModuleHealthView modules={modules} />
        <ExecutionDetailView execution={selectedExecution} />
      </div>

      <ExecutionTable
        executions={executions}
        onSelect={onSelectExecution}
      />
    </main>
  );
}
