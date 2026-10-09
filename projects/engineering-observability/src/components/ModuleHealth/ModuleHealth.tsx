import type { ModuleHealth as ModuleHealthType } from "../../types/telemetry";

interface ModuleHealthProps {
  modules: ModuleHealthType[];
}

export function ModuleHealth({
  modules,
}: ModuleHealthProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Module Health</h2>
      </div>

      <div className="health-list">
        {modules.map((module) => (
          <div className="health-row" key={module.module}>
            <div>
              <strong>{module.module}</strong>
              <span>
                {module.executions.toLocaleString()} executions
              </span>
            </div>

            <div className="health-metrics">
              <span>{module.successRate}% success</span>
              <span>{module.averageDurationMs} ms avg</span>
              <span
                className={`status status-${module.status.toLowerCase()}`}
              >
                {module.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
