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
} from "recharts";
import { LayoutType } from "recharts/types/util/types";

export type PropsDashboard = {
  data?: { title: string; dataInfo: { name: string; value: number }[] };
  style?: React.CSSProperties;
  layout?: LayoutType;
  title?: string;
  dataExport?: any[];
};

export const BerCharCompoVertical = ({
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
      className="rounded-lg h-96 w-[600px] bg-background p-2 pt-2 pb-0 bg-[#181818] shadow-sm"
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
      <ResponsiveContainer width="100%" height="93%">
        <BarChart
          width={500}
          height={300}
          layout={layout}
          data={data ? data.dataInfo : defaultData}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 40,
          }}
          barGap={"10%"}
          //   onMouseEnter={(e) => console.log("entrando")}
          //   onClick={(e) => console.log("clicado")}
          //   onMouseLeave={(e) => console.log("saindo")}
          //   onMouseMove={(e) => console.log("movendo")}
          barCategoryGap={"20%"}
        >
          <CartesianGrid
            vertical={false}
            stroke="white"
            strokeDasharray="8 5"
          />

          <XAxis
            dataKey="name"
            width={1}
            orientation="bottom"
            reversed={true}
            tick={{ fill: "white", fontSize: 12, dy: 18, dx: -15 }}
            angle={-45}
          />
          <YAxis
            label={{
              value: "Atendimentos",
              angle: -90,
              strock: "white",
              fill: "white",
              dx: -22,
              dy: -0,
            }}
            tickLine={{ stroke: "white", strokeWidth: 1 }}
            tick={{ fill: "white", fontSize: 12 }}
            tickSize={12}
          />
          <ReferenceLine y={0} stroke="#000" />

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
            activeBar={<Rectangle fill="#aaa" />}
          ></Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
