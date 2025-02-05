import * as XLSX from "xlsx";
import {
  FunnelChart,
  Funnel,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import { exportToExcel } from "@/utils/exportToExcel";

export type PropsDashboard = {
  data?: {
    title: string;
    dataInfo: { name: string; value: number; fill?: string }[];
  };
  style?: React.CSSProperties;
  title?: string;
  dataExport?: any[];
  titlesTable?: { name: string; value: string };
};

export const FunnelCharCompo = ({
  data,
  style,
  title,
  dataExport,
  titlesTable,
}: PropsDashboard) => {
  const defaultData = [
    { name: "20:00 AS 24:00H", value: 125 },
    { name: "13:00 AS 19:00H", value: 282 },
    { name: "07:00 AS 12:00H", value: 230 },
    { name: "01:00 AS 06:00H", value: 113 },
  ];

  const chartData = data?.dataInfo || defaultData;

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(chartData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "chart_data.xlsx");
  };

  return (
    <div
      className="rounded-lg h-80 overflow-x-hidden text-center w-[400px] border bg-[#181818] shadow-sm flex flex-col  pt-4 pr-4 pl-4"
      style={style}
    >
      <h1 className="text-white mb-4">{title}</h1>

      {/* Gráfico e tabela alinhados */}
      <div className="flex flex-row  pb-0 w-full  ">
        {/* Funnel Chart */}
        <div className="w-1/2 h-auto mb-4 mr-2">
          <ResponsiveContainer width="100%" height={230}>
            <FunnelChart>
              <Tooltip />
              <Funnel
                dataKey="value"
                width={250}
                nameKey="name"
                data={chartData}
                isAnimationActive
                legendType="diamond"
              >
                <LabelList
                  position="right"
                  fill="#000"
                  stroke="#fff"
                  dataKey="name"
                  content={(props) => (
                    <text
                      x={Number(props.x) + Number(props.width || 0) / 2}
                      y={Number(props.y) + 30}
                      fill="#fff"
                      textAnchor="middle"
                      fontSize="16px"
                    >
                      {props.value}
                    </text>
                  )}
                />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>

        {/* Data Table */}
        <div className=" rounded-md shadow p-2 w-1/2 h-10 max-h-72 ">
          <div className="bg-white rounded-md shadow p-2 ">
            <h2 className="text-sm font-semibold mb-2">Dados</h2>
            <div className="overflow-y-auto overflow-x-hidden max-h-48 border">
              <table className="w-full h-auto table-auto border-collapse text-xs">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="py-1 px-2 text-left">{titlesTable?.name}</th>
                    <th className="py-1 px-2 text-left">
                      {" "}
                      {titlesTable?.value}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.dataInfo.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-1 px-2 text-left">{item.name}</td>
                      <td className="py-1 px-2">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={() => exportToExcel(dataExport, "myData.xlsx")}
              className="mt-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"
            >
              Exportar para Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
