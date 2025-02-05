import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import {
  fetchAtendimentoMotivo,
  fetchChamadasDiaNoite,
  fetchTempoResposta,
  fetchDestinoPaciente,
  fetchTotalChamadasTelefonicas,
  fetchObitos,
  fetchFaixaEtaria,
  fetchAtendimentosSexo,
} from "@/shared/services/ApiRequests";

import {
  AtendimentoMotivo,
  AtendimentoChamadasDiaNoite,
  TempoResposta,
  DestinoPaciente,
  TotalChamadasTelefonicas,
  RegistroObito,
  FaixaEtaria,
} from "@/@types/types";
import { color } from "echarts";
import { FunnelCharCompo } from "@/shared/components/charts/FunnelChart";
import { SexoAtendimentos } from "../../@types/types";
import { AreaChartCompo } from "@/shared/components/charts/AreaChart";
import { CardsDashboards } from "../cards/CardsDashboard";
import { BarChartCompo } from "@/shared/components/charts/BarChart";

const Dashboard: React.FC = () => {
  const [ano, setAno] = useState<string>("2024");
  const [mes, setMes] = useState<string>("5");
  const [codMunicipio, setcodMunicipio] = useState<string>("");
  const [nomeMunicipio, setNomeMunicipio] = useState<string>("");

  function getAllProps() {
    return { ano, mes, codMunicipio, nomeMunicipio };
  }

  const [atendimentoMotivo, setAtendimentoMotivo] = useState<
    AtendimentoMotivo[]
  >([]);
  const [chamadasDiaNoite, setChamadasDiaNoite] = useState<
    AtendimentoChamadasDiaNoite[]
  >([]);
  const [tempoResposta, setTempoResposta] = useState<TempoResposta[]>([]);
  const [destinoPaciente, setDestinoPaciente] = useState<DestinoPaciente[]>([]);
  const [totalChamadas, setTotalChamadas] = useState<
    TotalChamadasTelefonicas[]
  >([]);
  const [totalChamadasMes, setTotalChamadasMes] = useState<
    TotalChamadasTelefonicas[]
  >([]);
  const [faixaEtaria, setFaixaEtaria] = useState<FaixaEtaria[]>([]);
  const [destinoPacientes, setDestinoPacientes] = useState<string>();
  const [destinoPacientesQuantidade, setDestinoPacientesQuantidade] =
    useState<number>();
  const [sexoAtendimentos, setAtendimentosSexo] =
    useState<SexoAtendimentos[]>();

  const [obitos, setObitos] = useState<RegistroObito[]>([]);

  // const colorsChart = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c"];
  const colorsChart = [
    "#82ca9d",
    "#a4de6c",
    "#7F7FFF", // Azul Lavanda
    "#A77FFF", // Roxo Médio
    "#D37FFF", // Magenta Médio
    "#FF7FCF", // Rosa Chiclete
    "#FF99B3", // Coral Pastel
    "#C77FFF", // Lilás Médio
    "#FF99FF", // Rosa Néon Suave
  ];

  useEffect(() => {
    const fetchData = async () => {
      const [
        atendimentoMotivoData,
        chamadasDiaNoiteData,
        tempoRespostaData,
        destinoPacienteData,
        totalChamadasData,
        totalChamadasMesData,
        obitosData,
        faixaEtariaData,
        SexoAtendimentosData,
      ] = await Promise.all([
        fetchAtendimentoMotivo(getAllProps()),
        fetchChamadasDiaNoite(),
        fetchTempoResposta(),
        fetchDestinoPaciente(),
        fetchTotalChamadasTelefonicas({
          ano: ano,
          mes: "",
          codMunicipio: "",
          nomeMunicipio: "",
        }),
        fetchTotalChamadasTelefonicas(getAllProps()),
        fetchObitos(),
        fetchFaixaEtaria(getAllProps()),
        fetchAtendimentosSexo(getAllProps()),
      ]);

      setAtendimentoMotivo(atendimentoMotivoData);
      setChamadasDiaNoite(chamadasDiaNoiteData);
      setTempoResposta(tempoRespostaData);
      setDestinoPaciente(destinoPacienteData);
      setTotalChamadas(totalChamadasData);
      console.log(totalChamadasMesData);
      setTotalChamadasMes(totalChamadasMesData);
      setObitos(obitosData);
      setFaixaEtaria(faixaEtariaData);
      setAtendimentosSexo(SexoAtendimentosData);

      setDestinoPacientes(destinoPacienteData[0].UnidadeDS);
      setDestinoPacientesQuantidade(
        destinoPacienteData[0].QuantidadeAtendimentos,
      );
    };

    fetchData();
  }, []);

  const chartOptions = [
    {
      title: "Destino do Paciente",
      data: destinoPaciente.map((item, index) => ({
        name: item.UnidadeDS,
        value: item.QuantidadeAtendimentos,
        colors: colorsChart[index % colorsChart.length],
      })),
    },
    {
      title: "Ocorrências por Motivo",
      data: atendimentoMotivo.map((item) => ({
        name: item.MotivoDS,
        value: item.Total_Ocorrencias,
      })),
    },
    {
      title: "Chamadas por Período do Dia",
      data: chamadasDiaNoite.map((item) => ({
        name: item.PeriodoDia,
        value: item.Total_Ocorrencias,
      })),
    },
    {
      title: "Tempo de Resposta",
      data: tempoResposta.map((item) => ({
        name: item.TempoResposta,
        value: item.Total_Ocorrencias,
      })),
    },
    {
      title: "Registro de Óbitos",
      data: obitos.map((item) => ({
        name: item.Obito,
        value: item.QuantidadeObito,
      })),
    },
  ];

  return (
    <div className="flex flex-col  h-[100%] w-[100%]">
      <div className="w-[100%] flex flex-row  justify-around mt-3 mb-3">
        <CardsDashboards
          title="Chamadas Telefônicas no ano"
          value={
            totalChamadas[0] ? totalChamadas[0].QuantidadeAtendimentos : "---"
          }
          change={{ value: "1350", percentage: "15%", isPositive: true }}
        ></CardsDashboards>
        <CardsDashboards
          title="Chamadas Telefônicas no mês"
          value={
            totalChamadasMes[0]
              ? totalChamadasMes[0].QuantidadeAtendimentos
              : "---"
          }
          change={{ value: "121", percentage: "5%", isPositive: true }}
        ></CardsDashboards>
        <CardsDashboards
          title="Destino mais frequente"
          value={
            destinoPacientesQuantidade ? destinoPacientesQuantidade : "---"
          }
          change={{
            value: destinoPacientes ? destinoPacientes : "---",
            isPositive: true,
          }}
        ></CardsDashboards>
        <CardsDashboards
          title="teste"
          value="teste"
          change={{ value: "100", percentage: "teste", isPositive: true }}
        ></CardsDashboards>
      </div>
      {/* ==================================================================================================================== */}
      <div className="flex flex-row flex-wrap h-[100%] w-[100%] ">
        {/* <BarChartCompo
          data={{
            title: "Período do Dia",
            dataInfo: chamadasDiaNoite.map((item, index) => ({
              name: item.PeriodoDia,
              value: item.Total_Ocorrencias,
              colors: colorsChart[index % colorsChart.length],
            })),
          }}
          style={{ width: "57%", margin: 5 }}
        /> */}
        <AreaChartCompo
          title="Atendimentos por período do dia"
          data={{
            title: "Período do Dia",
            dataInfo: chamadasDiaNoite.map((item, index) => ({
              name: item.PeriodoDia.toLocaleLowerCase(),
              value: item.Total_Ocorrencias,
              colors: colorsChart[index % colorsChart.length],
            })),
          }}
          layout="vertical"
          style={{ width: "57%", margin: 5, padding: 3, paddingRight: 7 }}
        />
        <BarChartCompo style={{ width: "41%", margin: 5 }} />
        <FunnelCharCompo
          title={"Atendimentos por Sexo"}
          data={{
            title: "Atendimentos por Sexo",
            dataInfo: (sexoAtendimentos || [])
              .slice()
              .reverse()
              .map((item, index) => ({
                name: item.SexoDS == null ? "Não informado" : item.SexoDS,
                value: item.Total_Ocorrencias,
                fill: colorsChart[index % colorsChart.length],
              })),
          }}
          style={{ width: "41%", marginLeft: 10, margin: 5, marginTop: "10px" }}
        />
        <FunnelCharCompo
          data={{
            title: "Atendimentos por Faixa etária",
            dataInfo: faixaEtaria.map((item, index) => ({
              name: item.faixa_etaria,
              value: item.Total_Ocorrencias,
              fill: colorsChart[index % colorsChart.length],
            })),
          }}
          style={{ width: "54%", marginLeft: 10, margin: 5, marginTop: "10px" }}
        />
        <BarChartCompo style={{ width: "99%", marginTop: "10px" }} />
      </div>
    </div>
  );
};

export default Dashboard;

// return (
//   <div className=" w-full justify-items-center">
//     <div className="flex flex-row justify-center font-bold text-center pl-8 pr-8 w-[90%]">
//       {" "}
//       <div className="w-80 p-2 pt-1 h-32 bg-white flex flex-col rounded-md m-4">
//         <h2>Chamadas Telefônicas Ano</h2>
//         {/* <h3 className="bg-red-600 h-16 flex  " style={{}}>
//           {totalChamadas[0].QuantidadeAtendimentos}
//         </h3> */}
//         <div className=" h-[80%] flex flex-col items-center justify-center">
//           <div className="flex items-center h-full text-4xl">
//             {totalChamadasMes.length > 0
//               ? totalChamadas[0].QuantidadeAtendimentos
//               : "---"}
//           </div>
//         </div>
//       </div>
//       <div className="w-80 p-2 pt-1 h-32 bg-white rounded-md m-4">
//         Chamadas Telefônicas no Mês
//         <div className=" h-[80%]  flex flex-col items-center rounded-md justify-center">
//           <div className="flex items-center h-full text-4xl">
//             {totalChamadasMes.length > 0
//               ? totalChamadasMes[0].QuantidadeAtendimentos
//               : "---"}
//           </div>
//         </div>
//       </div>
//       <div className="w-80 p-2 pt-1 h-32 bg-[#1f2429] text-white rounded-md m-4">
//         Filtros
//         <div>
//           <button className="bg-white text-black pl-3 pr-3 ml-1 mr-1 rounded-md">
//             Ano
//           </button>
//           <button className="bg-white text-black pl-3 pr-3 ml-1 mr-1 rounded-md">
//             Mês
//           </button>
//           <button className="bg-white text-black pl-3 pr-3 ml-1 mr-1 rounded-md">
//             Cidade
//           </button>
//         </div>
//       </div>
//     </div>
//     <div className="flex flex-row flex-wrap justify-center">
//       {chartOptions.map((chart, index) => (
//         <div className=" p-4 " key={index}>
//           <div className="text-white text-xl h-8  text-center ">
//             {chart.title}
//           </div>
//           <div
//             className={`${chart.title != "Destino do Paciente" ? "w-[330px]" : "w-[730px]"}`}
//           >
//             <ReactECharts
//               style={{
//                 backgroundColor: "#1f2429",
//                 marginTop: 5,
//                 borderRadius: 8,
//                 height: chart.title != "Destino do Paciente" ? 300 : 400,
//               }}
//               option={{
//                 // title: { text: chart.title },
//                 tooltip: {
//                   trigger: "item",
//                 },
//                 legend: {
//                   bottom: "5%",
//                   left: "center",
//                   style: {
//                     left: 30,
//                   },
//                   textStyle: {
//                     color: "rgba(251, 251, 251, 1)",
//                   },
//                   Data: chart.data.map((item) => item.name),
//                 },
//                 grid: {
//                   top: "0%",
//                   left: "0%",
//                   right: "0%",
//                   bottom: "0%",
//                   containLabel: true,
//                 },
//                 series: [
//                   {
//                     label: {
//                       formatter: "{d|{d}%}",
//                       show: true,
//                       size: 40,
//                       lineHeight: 56,
//                       rich: {
//                         d: {
//                           color: "white",
//                           fontSize: 14,
//                           fontWeight: "bold",
//                           lineHeight: 33,
//                           marginLeft: 0,
//                         },
//                       },
//                     },
//                     labelLine: {
//                       show: true,
//                       length: 10,
//                       length2: 10,
//                     },
//                     radius: [
//                       chart.title != "Destino do Paciente" ? "25%" : "30%",
//                       chart.title != "Destino do Paciente" ? "45%" : "58%",
//                     ],
//                     avoidLabelOverlap: false,
//                     type: "pie",
//                     itemStyle: {
//                       borderRadius: 5,
//                     },
//                     data: chart.data.map((item: any) => ({
//                       name: item.value !== null ? item.name : "Não informado",
//                       value: item.value,
//                     })),
//                     emphasis: {
//                       itemStyle: {
//                         shadowBlur: 10,
//                         shadowOffsetX: 0,
//                         shadowColor: "rgba(0, 0, 0, 0.7)",
//                       },
//                     },
//                     top: chart.title != "Destino do Paciente" ? -80 : -57,
//                     bottom: chart.title != "Destino do Paciente" ? 0 : 48,
//                   },
//                 ],
//               }}
//             />
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// return (
//   <div>
//     {chartOptions.map((chart, index) => (
//       <ReactECharts
//         key={index}
//         option={{
//           title: { text: chart.title },
//           xAxis: {
//             type: "category",
//             data: chart.data.map((item) => item.name),
//           },
//           yAxis: { type: "value" },
//           series: [
//             {
//               data: chart.data.map((item) => item.value),
//               type: "bar",
//             },
//           ],
//         }}
//       />
//     ))}
//   </div>
// );
