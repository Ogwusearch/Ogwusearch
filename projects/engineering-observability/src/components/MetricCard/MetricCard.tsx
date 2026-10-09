interface MetricCardProps {
  label: string;
  value: string;
}

export function MetricCard({
  label,
  value,
}: MetricCardProps) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
    </div>
  );
}
