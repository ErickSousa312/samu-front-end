import { Download } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { exportToExcel } from "@/utils/exportToExcel";
export type ChartProps = {
  data?: {
    title: string;
    dataInfo: { name: string; value: number; fill?: string; colors?: string }[];
  };
  style?: React.CSSProperties;
  layout?: string;
  title?: string;
  dataExport?: object[];
  titlesTable?: { name: string; value: string };
};
export const ChartPanel = ({
  data,
  title,
  dataExport,
  titlesTable,
  variant = "bar",
}: ChartProps & { variant?: "bar" | "area" }) => {
  const records = data?.dataInfo || [];
  const exportData =
    dataExport ||
    records.map(({ name, value }) => ({ Categoria: name, Quantidade: value }));
  const heading = title || data?.title || "Indicadores";
  const defaultColor = "#f87171";
  const axes = (
    <>
      <CartesianGrid stroke="#2c3a50" vertical={false} strokeDasharray="4 4" />
      <XAxis
        dataKey="name"
        tick={{ fill: "#a7b5c8", fontSize: 11 }}
        tickLine={false}
        axisLine={false}
        interval="preserveStartEnd"
      />
      <YAxis
        tick={{ fill: "#a7b5c8", fontSize: 11 }}
        tickLine={false}
        axisLine={false}
        allowDecimals={false}
        width={48}
      />
      <Tooltip
        contentStyle={{
          background: "#172337",
          border: "1px solid #41516a",
          borderRadius: 8,
          color: "#e8edf5",
        }}
        itemStyle={{ color: "#e8edf5" }}
        cursor={{ fill: "#ffffff08" }}
      />
    </>
  );
  return (
    <section className="panel chart-panel">
      <div className="chart-heading">
        <h2>{heading}</h2>
        <button
          className="button button-secondary"
          disabled={!exportData.length}
          onClick={() => exportToExcel(exportData, `${heading}.xlsx`)}
          aria-label={`Exportar ${heading} para Excel`}
        >
          <Download size={15} aria-hidden="true" />
          Exportar
        </button>
      </div>
      {records.length ? (
        <div className="chart-canvas" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            {variant === "area" ? (
              <AreaChart
                data={records}
                margin={{ top: 10, right: 12, bottom: 20, left: 0 }}
              >
                {axes}
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Atendimentos"
                  stroke={records[0]?.fill || records[0]?.colors || defaultColor}
                  fill={
                    records[0]?.fill || records[0]?.colors || `${defaultColor}33`
                  }
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              </AreaChart>
            ) : (
              <BarChart
                data={records}
                margin={{ top: 10, right: 12, bottom: 20, left: 0 }}
              >
                {axes}
                <Bar
                  dataKey="value"
                  name="Atendimentos"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={48}
                  isAnimationActive={false}
                >
                  {records.map((entry, index) => (
                    <Cell
                      key={`${entry.name}-${index}`}
                      fill={entry.fill || entry.colors || defaultColor}
                    />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="empty-state">
          <p className="muted">
            Nenhum dado disponível para os filtros selecionados. Ajuste os
            critérios e tente novamente.
          </p>
        </div>
      )}
      <details className="chart-data">
        <summary>Consultar dados em tabela</summary>
        <div className="table-scroll">
          <table className="data-table">
            <caption>{heading}</caption>
            <thead>
              <tr>
                <th scope="col">{titlesTable?.name || "Categoria"}</th>
                <th scope="col">{titlesTable?.value || "Atendimentos"}</th>
              </tr>
            </thead>
            <tbody>
              {records.map((item, i) => (
                <tr key={`${item.name}-${i}`}>
                  <td>{item.name}</td>
                  <td>{item.value.toLocaleString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
};
