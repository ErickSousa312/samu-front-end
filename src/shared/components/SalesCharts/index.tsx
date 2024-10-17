import ReactECharts from "echarts-for-react";

interface SalesChartProps {
  entregueCount: number;
  pendenteCount: number;
  canceladoCount: number;
}

function SalesChart({
  entregueCount,
  pendenteCount,
  canceladoCount,
}: SalesChartProps) {
  const option = {
    tooltip: {
      trigger: "item",
    },
    toolbox: {
      show: true,
      feature: {
        dataZoom: {
          yAxisIndex: "none",
        },
        dataView: {
          readOnly: false,
        },
        magicType: {
          type: ["line", "bar"],
        },
        restore: {},
        saveAsImage: {},
      },
    },
    legend: {
      top: "0%", // Posiciona a legenda no topo, acima do gráfico
      left: "center", // Centraliza a legenda
      orient: "horizontal", // Deixa a legenda horizontal
      itemHeight: 16,
      itemWidth: 20,
      textStyle: {
        color: "rgba(255, 255, 255, 1)",
        fontSize: 14,
      },
    },
    color: ["#22C55E", "#EAB308", "#dc4040"],
    series: [
      {
        name: "Order Status",
        type: "pie",
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
          },
        },
        yAxis: {},
        xAxis: {
          data: ["cancelado", "pedente", "entrege"],
        },
        data: [canceladoCount, pendenteCount, entregueCount],
        height: "90%",
        width: "100%",
        top: "20%",
        left: "center",
      },
    ],
  };

  return (
    <div className="w-[90%] md:w-full max-w-xl flex pt-12 flex-col md:flex-row md:justify-center items-center">
      <ReactECharts option={option} className="w-full h-full" />
    </div>
  );
}

export default SalesChart;
