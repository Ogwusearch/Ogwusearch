import type { TelemetryExecution } from "../../types/telemetry";

interface ExecutionTableProps {
  executions: TelemetryExecution[];
  onSelect: (executionId: string) => void;
}

export function ExecutionTable({
  executions,
  onSelect,
}: ExecutionTableProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Executions</h2>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Execution ID</th>
              <th>Module</th>
              <th>Operation</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Timestamp</th>
            </tr>
          </thead>

          <tbody>
            {executions.map((execution) => (
              <tr
                key={execution.executionId}
                onClick={() => onSelect(execution.executionId)}
              >
                <td>{execution.executionId}</td>
                <td>{execution.module}</td>
                <td>{execution.operation}</td>
                <td>
                  <span
                    className={`status status-${execution.status.toLowerCase()}`}
                  >
                    {execution.status}
                  </span>
                </td>
                <td>{execution.durationMs.toFixed(2)} ms</td>
                <td>
                  {new Date(
                    execution.startedAt,
                  ).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
