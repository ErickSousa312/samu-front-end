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
} from "recharts";
import { LayoutType } from "recharts/types/util/types";

export type PropsDashboard = {
  data?: { title: string; dataInfo: { name: string; value: number }[] };
  style?: React.CSSProperties;
  layout?: LayoutType;
};

export const BarChartCompo = ({ data, style, layout }: PropsDashboard) => {
  const defaultData = [
    { PeriodoDia: "20:00 AS 24:00H", Total_Ocorrencias: 125 },
    { PeriodoDia: "13:00 AS 19:00H", Total_Ocorrencias: 282 },
    { PeriodoDia: "07:00 AS 12:00H", Total_Ocorrencias: 230 },
    { PeriodoDia: "01:00 AS 06:00H", Total_Ocorrencias: 113 },
  ];

  return (
    <div
      className="rounded-lg h-80 w-[600px] border bg-background p-0 pt-2 bg-[#0a0a0a] shadow-sm"
      style={style}
    >
      <h1 className="text-white">nome tabela</h1>
      <ResponsiveContainer width="100%" height="93%">
        <BarChart
          width={500}
          height={300}
          layout={layout}
          data={data ? data.dataInfo : defaultData}
          margin={{
            top: 5,
            right: 10,
            left: 20,
            bottom: 15,
          }}
          //   onMouseEnter={(e) => console.log("entrando")}
          //   onClick={(e) => console.log("clicado")}
          //   onMouseLeave={(e) => console.log("saindo")}
          //   onMouseMove={(e) => console.log("movendo")}
          barCategoryGap={"30%"}
        >
          <CartesianGrid strokeDasharray="0 0" vertical={false} />

          <XAxis
            dataKey="name"
            width={1}
            orientation="bottom"
            reversed={true}
          />
          <YAxis
            // width={-100}
            label={{
              value: "Atendimentos",
              angle: -90,
              position: "insideBottomLeft",
            }}
          />
          <ReferenceLine y={0} stroke="#000" />
          <Brush dataKey="name" height={30} stroke="#f11919" />
          <Tooltip
            // itemStyle={{ backgroundColor: "#1f2429" }}
            // wrapperStyle={{ backgroundColor: "red" }}
            // contentStyle={{ backgroundColor: "#1f2429" }}
            cursor={false}
            animationEasing="linear"
            isAnimationActive={true}
          />
          {/* <Legend /> */}
          <Bar
            dataKey="value"
            fill="#f11919"
            minPointSize={5}
            activeBar={<Rectangle fill="#910b0b" />}
          ></Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
