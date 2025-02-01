import React from "react";
import ReactECharts from "echarts-for-react";

const BarChart = () => {
  const options = {
    title: {
      text: "Vendas Mensais",
    },
    xAxis: {
      type: "category",
      data: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147],
        type: "bar",
      },
    ],
  };

  return <ReactECharts option={options} style={{ height: "400px" }} />;
};

export default BarChart;
