export type TelemetryStatus =
  | "SUCCESS"
  | "WARNING"
  | "ERROR";

export interface TelemetryExecution {
  executionId: string;
  module: string;
  operation: string;
  status: TelemetryStatus;
  startedAt: string;
  durationMs: number;
  errorCount: number;
  warningCount: number;
}

export interface TelemetryMetric {
  executions: number;
  successRate: number;
  warningRate: number;
  errorRate: number;
  averageDurationMs: number;
}

export interface ModuleHealth {
  module: string;
  executions: number;
  successRate: number;
  averageDurationMs: number;
  status: "HEALTHY" | "DEGRADED" | "ERROR";
}

export interface TelemetryActivity {
  id: string;
  timestamp: string;
  module: string;
  operation: string;
  status: TelemetryStatus;
  message: string;
}

export interface ExecutionDetail extends TelemetryExecution {
  inputs?: Record<string, unknown>;
  errors: Array<{
    code: string;
    message: string;
    path?: string;
  }>;
  warnings: Array<{
    code: string;
    message: string;
    path?: string;
  }>;
  trace?: Record<string, unknown>;
  result?: unknown;
}
