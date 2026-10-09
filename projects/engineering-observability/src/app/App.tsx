import { useEffect, useState } from "react";

import type {
  ExecutionDetail,
  ModuleHealth,
  TelemetryActivity,
  TelemetryExecution,
  TelemetryMetric,
} from "../types/telemetry";

import { telemetryApi } from "../services/telemetry-api";
import { Dashboard } from "../components/Dashboard/Dashboard";

export function App() {
  const [metrics, setMetrics] =
    useState<TelemetryMetric | null>(null);

  const [executions, setExecutions] =
    useState<TelemetryExecution[]>([]);

  const [activities, setActivities] =
    useState<TelemetryActivity[]>([]);

  const [modules, setModules] =
    useState<ModuleHealth[]>([]);

  const [selectedExecution, setSelectedExecution] =
    useState<ExecutionDetail | null>(null);

  useEffect(() => {
    void Promise.all([
      telemetryApi.getMetrics(),
      telemetryApi.getExecutions(),
      telemetryApi.getActivity(),
      telemetryApi.getModuleHealth(),
    ]).then(([metricsData, executionData, activityData, moduleData]) => {
      setMetrics(metricsData);
      setExecutions(executionData);
      setActivities(activityData);
      setModules(moduleData);
    });
  }, []);

  async function handleSelectExecution(
    executionId: string,
  ) {
    const detail =
      await telemetryApi.getExecution(executionId);

    setSelectedExecution(detail);
  }

  if (!metrics) {
    return (
      <div className="loading-screen">
        Loading engineering telemetry...
      </div>
    );
  }

  return (
    <Dashboard
      metrics={metrics}
      executions={executions}
      activities={activities}
      modules={modules}
      selectedExecution={selectedExecution}
      onSelectExecution={handleSelectExecution}
    />
  );
}
