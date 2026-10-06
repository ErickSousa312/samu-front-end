interface MetricsCardProps {
  title: string;
  value: number | string;
  change: { value: string; percentage?: string; isPositive: boolean };
  chart?: React.ReactNode;
  link?: string;
  linkTile?: string;
}
export const CardsDashboards = ({ title, value, change }: MetricsCardProps) => (
  <article className="metric-card">
    <div className="metric-header">
      <h2 className="metric-label">{title}</h2>
      {change.percentage && (
        <span
          className={`metric-trend ${
            change.isPositive ? "metric-trend-positive" : "metric-trend-negative"
          }`}
        >
          {change.percentage}
        </span>
      )}
    </div>
    <p className="metric-value">
      {typeof value === "number" ? value.toLocaleString("pt-BR") : value}
    </p>
    <p className="metric-note">{change.value}</p>
  </article>
);
