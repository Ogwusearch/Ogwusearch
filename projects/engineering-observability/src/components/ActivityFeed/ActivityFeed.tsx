import type { TelemetryActivity } from "../../types/telemetry";

interface ActivityFeedProps {
  activities: TelemetryActivity[];
}

export function ActivityFeed({
  activities,
}: ActivityFeedProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Live Activity</h2>
        <span className="live-indicator">LIVE</span>
      </div>

      <div className="activity-list">
        {activities.map((activity) => (
          <div className="activity-row" key={activity.id}>
            <div className="activity-time">
              {new Date(activity.timestamp).toLocaleTimeString()}
            </div>

            <div className="activity-main">
              <strong>
                {activity.module} / {activity.operation}
              </strong>
              <span>{activity.message}</span>
            </div>

            <span
              className={`status status-${activity.status.toLowerCase()}`}
            >
              {activity.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
