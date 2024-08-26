
import ReactECharts from 'echarts-for-react';

interface SalesChartProps {
    entregueCount: number, 
    pendenteCount: number, 
    canceladoCount: number
}

function SalesChart({ entregueCount, pendenteCount, canceladoCount }: SalesChartProps) {  
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      left: '75%',
      top: '38%',
      orient: "vertical",
      itemHeight: 16,
      itemWidth: 20,
      textStyle: {
        color: "rgba(255, 255, 255, 1)",
        fontSize: 14
      },
    },
    color: ['#22C55E', '#EAB308', '#dc4040'],
    series: [
      {
        name: 'Order Status',
        type: 'pie',
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,

          }
        },
        data: [
          { value: entregueCount, name: 'Entregue' },
          { value: pendenteCount, name: 'Pendente' },
          { value: canceladoCount, name: 'Cancelado' },
        ],
        height: "100%",
        width: "70%",
        top: "8%",
        left: "10%",
      }
    ]
  }; 

  return <ReactECharts option={option} className=" w-[80%] md:w-[50%] bottom-12 "/>;
}

export default SalesChart;
