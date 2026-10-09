import type {
  ExecutionDetail,
  ModuleHealth,
  TelemetryActivity,
  TelemetryExecution,
  TelemetryMetric,
} from "../types/telemetry";

export interface TelemetryApi {
  getMetrics(): Promise<TelemetryMetric>;
  getExecutions(): Promise<TelemetryExecution[]>;
  getExecution(id: string): Promise<ExecutionDetail>;
  getActivity(): Promise<TelemetryActivity[]>;
  getModuleHealth(): Promise<ModuleHealth[]>;
}

const mockExecutions: TelemetryExecution[] = [
  {
    executionId: "exec-001",
    module: "solar-engine",
    operation: "pv-sizing",
    status: "SUCCESS",
    startedAt: new Date().toISOString(),
    durationMs: 4.2,
    errorCount: 0,
    warningCount: 0,
  },
  {
    executionId: "exec-002",
    module: "solar-engine",
    operation: "peak-demand",
    status: "WARNING",
    startedAt: new Date().toISOString(),
    durationMs: 2.8,
    errorCount: 0,
    warningCount: 1,
  },
  {
    executionId: "exec-003",
    module: "electrical-engine",
    operation: "load-audit",
    status: "ERROR",
    startedAt: new Date().toISOString(),
    durationMs: 1.9,
    errorCount: 1,
    warningCount: 0,
  },
  {
    executionId: "exec-004",
    module: "circuit-engine",
    operation: "circuit-analysis",
    status: "SUCCESS",
    startedAt: new Date().toISOString(),
    durationMs: 4.7,
    errorCount: 0,
    warningCount: 0,
  },
];

const mockApi: TelemetryApi = {
  async getMetrics() {
    return {
      executions: 12842,
      successRate: 99.4,
      warningRate: 0.55,
      errorRate: 0.05,
      averageDurationMs: 3.4,
    };
  },

  async getExecutions() {
    return mockExecutions;
  },

  async getExecution(id) {
    const execution =
      mockExecutions.find((item) => item.executionId === id) ??
      mockExecutions[0];

    return {
      ...execution,
      inputs: {
        example: "Replace with telemetry payload",
      },
      errors:
        execution.status === "ERROR"
          ? [
              {
                code: "EXAMPLE_ERROR",
                message: "Example telemetry error.",
                path: "input",
              },
            ]
          : [],
      warnings:
        execution.status === "WARNING"
          ? [
              {
                code: "EXAMPLE_WARNING",
                message: "Example telemetry warning.",
                path: "annualRate",
              },
            ]
          : [],
      trace: {
        executionId: execution.executionId,
        module: execution.module,
        operation: execution.operation,
      },
      result:
        execution.status === "ERROR"
          ? undefined
          : {
              status: execution.status,
            },
    };
  },

  async getActivity() {
    return mockExecutions.map((item) => ({
      id: item.executionId,
      timestamp: item.startedAt,
      module: item.module,
      operation: item.operation,
      status: item.status,
      message:
        item.status === "SUCCESS"
          ? "Execution completed successfully."
          : item.status === "WARNING"
            ? "Execution completed with warnings."
            : "Execution failed.",
    }));
  },

  async getModuleHealth() {
    return [
      {
        module: "solar-engine",
        executions: 7420,
        successRate: 99.7,
        averageDurationMs: 2.4,
        status: "HEALTHY",
      },
      {
        module: "electrical-engine",
        executions: 3210,
        successRate: 99.1,
        averageDurationMs: 3.1,
        status: "HEALTHY",
      },
      {
        module: "circuit-engine",
        executions: 2212,
        successRate: 98.8,
        averageDurationMs: 4.7,
        status: "DEGRADED",
      },
    ];
  },
};

export const telemetryApi: TelemetryApi = mockApi;
