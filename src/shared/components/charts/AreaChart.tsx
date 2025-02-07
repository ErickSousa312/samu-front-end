import { exportToExcel } from "@/utils/exportToExcel";
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
  Area,
  AreaChart,
} from "recharts";
import { LayoutType } from "recharts/types/util/types";

export type PropsDashboard = {
  data?: { title: string; dataInfo: { name: string; value: number }[] };
  style?: React.CSSProperties;
  layout?: LayoutType;
  title?: string;
  dataExport?: any[];
};

export const AreaChartCompo = ({
  data,
  style,
  layout,
  title,
  dataExport,
}: PropsDashboard) => {
  const defaultData = [
    { PeriodoDia: "20:00 AS 24:00H", Total_Ocorrencias: 125 },
    { PeriodoDia: "13:00 AS 19:00H", Total_Ocorrencias: 282 },
    { PeriodoDia: "07:00 AS 12:00H", Total_Ocorrencias: 230 },
    { PeriodoDia: "01:00 AS 06:00H", Total_Ocorrencias: 113 },
  ];

  return (
    <div
      className="rounded-lg h-96 w-[600px] bg-background p-0 pt-2 bg-[#181818] shadow-sm"
      style={style}
    >
      <h1 className="text-white mt-2 text-md text-center">{title}</h1>

      <div className="flex mt-[-28px] mb-2 justify-end">
        <button
          className="bg-white flex text-sm items-center pl-2 pr-2 pt-1 pb-1 rounded-md active:bg-gray-300"
          onClick={() => exportToExcel(dataExport, `${title}.xlsx`)}
        >
          <p>Exportar</p>
        </button>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart
          width={500}
          height={300}
          data={data ? data.dataInfo : defaultData}
          margin={{
            top: 10,
            right: 20,
            left: 0,
            bottom: 5,
          }}
          //   onMouseEnter={(e) => console.log("entrando")}
          //   onClick={(e) => console.log("clicado")}
          //   onMouseLeave={(e) => console.log("saindo")}
          //   onMouseMove={(e) => console.log("movendo")}
        >
          <CartesianGrid
            stroke="white"
            strokeDasharray="8 5"
            vertical={false}

            // horizontal={false}
          />

          <XAxis
            dataKey="name"
            tick={{ fill: "white", fontSize: 12 }}
            tickSize={12}
            tickLine={{ stroke: "white", strokeWidth: 1 }}
            // tickFormatter={(value) => {
            //   return value.slice(0, 3);
            // }}
          />
          <YAxis
            label={{
              value: "Atendimentos",
              angle: -90,
              strock: "white",
              fill: "white",
              dx: -17,
              dy: -10,
            }}
            tickLine={{ stroke: "white", strokeWidth: 1 }}
            tick={{ fill: "white", fontSize: 12 }}
            tickSize={12}
          />
          {/* <YAxis
            // width={-100}
            label={{
              value: "Atendimentos",
              angle: -90,
              position: "insideBottomLeft",
            }}
          /> */}
          {/* <ReferenceLine y={0} stroke="#000" /> */}
          {/* <Brush dataKey="name" height={30} stroke="#f11919" /> */}
          <Tooltip
          // itemStyle={{ backgroundColor: "#1f2429" }}
          // wrapperStyle={{ backgroundColor: "red" }}
          // contentStyle={{ backgroundColor: "#1f2429" }}
          // cursor={false}
          // animationEasing="linear"
          // isAnimationActive={true}
          />
          {/* <Legend /> */}

          <Area
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
