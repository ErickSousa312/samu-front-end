import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
  Brush,
  Rectangle,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";

export type PropsDashboard = {
  data?: {
    title: string;
    dataInfo: { name: string; value: number; fill?: string }[];
  };
  style?: React.CSSProperties;
  title?: string;
};

export const FunnelCharCompo = ({ data, style, title }: PropsDashboard) => {
  const defaultData = [
    { name: "20:00 AS 24:00H", value: 125 },
    { name: "13:00 AS 19:00H", value: 282 },
    { name: "07:00 AS 12:00H", value: 230 },
    { name: "01:00 AS 06:00H", value: 113 },
  ];

  return (
    <div
      className="rounded-lg h-80 text-center w-[600px] border bg-background p-0 pt-2 bg-[#0a0a0a] shadow-sm"
      style={style}
    >
      <h1 className="text-white">{title}</h1>
      <ResponsiveContainer width="100%" height="93%">
        <FunnelChart width={400} height={300}>
          <Tooltip />
          <Legend />
          <Funnel
            dataKey="value"
            nameKey={"name"}
            data={data ? data.dataInfo : defaultData}
            isAnimationActive
            legendType="diamond"
          >
            <LabelList
              position="right"
              fill="#000"
              stroke="#fff"
              dataKey="name"
              content={(props) => {
                return (
                  <text
                    x={Number(props.x) + Number(props.width || 0) / 2} // Centraliza na barra
                    y={Number(props.y) + 30}
                    fill="#fff"
                    textAnchor="middle" // Mantém a ancoragem ao centro
                    dominantBaseline="middle"
                    fontSize="18px"
                  >
                    {props.value}
                  </text>
                );
              }}
            />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
};
