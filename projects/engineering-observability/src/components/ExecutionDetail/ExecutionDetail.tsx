import type { ExecutionDetail as ExecutionDetailType } from "../../types/telemetry";

interface ExecutionDetailProps {
  execution: ExecutionDetailType | null;
}

export function ExecutionDetail({
  execution,
}: ExecutionDetailProps) {
  if (!execution) {
    return (
      <section className="panel">
        <div className="panel-header">
          <h2>Execution Detail</h2>
        </div>

        <div className="empty-state">
          Select an execution to inspect its details.
        </div>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Execution Detail</h2>
        <span
          className={`status status-${execution.status.toLowerCase()}`}
        >
          {execution.status}
        </span>
      </div>

      <div className="detail-grid">
        <div>
          <span>Execution ID</span>
          <strong>{execution.executionId}</strong>
        </div>

        <div>
          <span>Module</span>
          <strong>{execution.module}</strong>
        </div>

        <div>
          <span>Operation</span>
          <strong>{execution.operation}</strong>
        </div>

        <div>
          <span>Duration</span>
          <strong>{execution.durationMs.toFixed(2)} ms</strong>
        </div>
      </div>

      <div className="detail-section">
        <h3>Inputs</h3>
        <pre>{JSON.stringify(execution.inputs, null, 2)}</pre>
      </div>

      {execution.errors.length > 0 && (
        <div className="detail-section">
          <h3>Errors</h3>
          <pre>{JSON.stringify(execution.errors, null, 2)}</pre>
        </div>
      )}

      {execution.warnings.length > 0 && (
        <div className="detail-section">
          <h3>Warnings</h3>
          <pre>{JSON.stringify(execution.warnings, null, 2)}</pre>
        </div>
      )}

      <div className="detail-section">
        <h3>Trace</h3>
        <pre>{JSON.stringify(execution.trace, null, 2)}</pre>
      </div>

      <div className="detail-section">
        <h3>Result</h3>
        <pre>{JSON.stringify(execution.result, null, 2)}</pre>
      </div>
    </section>
  );
}
