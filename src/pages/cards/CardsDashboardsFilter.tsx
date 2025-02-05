interface MetricsCardProps {
  title: string;
  value: number | string;
  change: {
    value: string;
    percentage?: string;
    isPositive: boolean;
  };
  chart?: React.ReactNode;
}

export const CardsDashboardsFilter = ({
  title,
  value,
  change,
  chart,
}: MetricsCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-64">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm text-muted-foreground">{title}</h3>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-sm">
              {" "}
              {change.value.length > 20 ? "" : "+"}
              {change.value}
            </span>
            <span
              className={`text-sm ${change.isPositive ? "text-green-500" : "text-red-500"}`}
            >
              {change.percentage ? change.percentage : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
