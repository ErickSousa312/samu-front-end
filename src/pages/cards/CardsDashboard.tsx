import { Link } from "react-router-dom";

interface MetricsCardProps {
  title: string;
  value: number | string;
  change: {
    value: string;
    percentage?: string;
    isPositive: boolean;
  };
  chart?: React.ReactNode;
  link?: string;
  linkTile?: string;
}

export const CardsDashboards = ({
  title,
  value,
  change,
  chart,
  link,
  linkTile,
}: MetricsCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:bg-gray-300 duration-200 p-3 w-64">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-md text-muted-foreground">{title}</h3>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl ml-1 font-bold">{value}</p>
          <div className="flex items-center gap-1 mt-1">
            {change.value.length > 20 ? (
              <span className="text-sm">
                {" "}
                {change.value.length > 20 ? "" : ""}
                {change.value}
              </span>
            ) : (
              <div className="pt-0 text-base font-semibold leading-7">
                <p className="hover:translate-x-1 duration-200 items-center mt-1">
                  <Link
                    to={link}
                    className="text-red-500 transition-all duration-300 group-hover:text-white"
                  >
                    {linkTile}
                    &rarr;
                  </Link>
                </p>
              </div>
            )}
            {/* <span className="text-sm">
              {" "}
              {change.value.length > 20 ? "" : ""}
              {change.value}
            </span> */}
            {/* <span
              className={`text-sm ${change.isPositive ? "text-green-500" : "text-red-500"}`}
            >
              {change.percentage ? change.percentage : ""}
            </span> */}
          </div>
        </div>
      </div>
    </div>
  );
};
