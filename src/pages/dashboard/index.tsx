import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import {
  fetchAtendimentoMotivo,
  fetchChamadasDiaNoite,
  fetchTempoResposta,
  fetchDestinoPaciente,
  fetchTotalChamadasTelefonicas,
  fetchObitos,
} from "@/shared/services/ApiRequests";

import {
  AtendimentoMotivo,
  AtendimentoChamadasDiaNoite,
  TempoResposta,
  DestinoPaciente,
  TotalChamadasTelefonicas,
  RegistroObito,
} from "@/@types/types";
import { color } from "echarts";

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
  const [obitos, setObitos] = useState<RegistroObito[]>([]);

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
      ]);

      setAtendimentoMotivo(atendimentoMotivoData);
      setChamadasDiaNoite(chamadasDiaNoiteData);
      setTempoResposta(tempoRespostaData);
      setDestinoPaciente(destinoPacienteData);
      setTotalChamadas(totalChamadasData);
      console.log(totalChamadasMesData);
      setTotalChamadasMes(totalChamadasMesData);
      setObitos(obitosData);
    };

    fetchData();
  }, []);

  const chartOptions = [
    {
      title: "Destino do Paciente",
      data: destinoPaciente.map((item) => ({
        name: item.UnidadeDS,
        value: item.QuantidadeAtendimentos,
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
    <div className=" w-full justify-items-center">
      <div className="flex flex-row justify-center font-bold text-center pl-8 pr-8 w-[90%]">
        {" "}
        <div className="w-80 p-2 pt-1 h-32 bg-white flex flex-col rounded-md m-4">
          <h2>Chamadas Telefônicas Ano</h2>
          {/* <h3 className="bg-red-600 h-16 flex  " style={{}}>
            {totalChamadas[0].QuantidadeAtendimentos}
          </h3> */}
          <div className=" h-[80%] flex flex-col items-center justify-center">
            <div className="flex items-center h-full text-4xl">
              {totalChamadasMes.length > 0
                ? totalChamadas[0].QuantidadeAtendimentos
                : "---"}
            </div>
          </div>
        </div>
        <div className="w-80 p-2 pt-1 h-32 bg-white rounded-md m-4">
          Chamadas Telefônicas no Mês
          <div className=" h-[80%]  flex flex-col items-center rounded-md justify-center">
            <div className="flex items-center h-full text-4xl">
              {totalChamadasMes.length > 0
                ? totalChamadasMes[0].QuantidadeAtendimentos
                : "---"}
            </div>
          </div>
        </div>
        <div className="w-80 p-2 pt-1 h-32 bg-[#1f2429] text-white rounded-md m-4">
          Filtros
          <div>
            <button className="bg-white text-black pl-3 pr-3 ml-1 mr-1 rounded-md">
              Ano
            </button>
            <button className="bg-white text-black pl-3 pr-3 ml-1 mr-1 rounded-md">
              Mês
            </button>
            <button className="bg-white text-black pl-3 pr-3 ml-1 mr-1 rounded-md">
              Cidade
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-row flex-wrap justify-center">
        {chartOptions.map((chart, index) => (
          <div className=" p-4 " key={index}>
            <div className="text-white text-xl h-8  text-center ">
              {chart.title}
            </div>
            <div
              className={`${chart.title != "Destino do Paciente" ? "w-[350px]" : "w-[730px]"}`}
            >
              <ReactECharts
                style={{
                  backgroundColor: "#1f2429",
                  marginTop: 5,
                  borderRadius: 8,
                  height: chart.title != "Destino do Paciente" ? 300 : 400,
                }}
                option={{
                  // title: { text: chart.title },
                  tooltip: {
                    trigger: "item",
                  },
                  legend: {
                    bottom: "1%",
                    left: "center",
                    Data: chart.data.map((item) => item.name),
                  },
                  grid: {
                    top: "0%",
                    left: "0%",
                    right: "0%",
                    bottom: "0%",
                    containLabel: true,
                  },
                  series: [
                    {
                      label: {
                        formatter: "{d|{d}%}",
                        show: true,
                        size: 40,
                        lineHeight: 56,
                        rich: {
                          d: {
                            color: "white",
                            fontSize: 14,
                            fontWeight: "bold",
                            lineHeight: 33,
                            marginLeft: 0,
                          },
                        },
                      },
                      labelLine: {
                        show: true,
                        length: 10,
                        length2: 10,
                      },
                      radius: [
                        "25%",
                        chart.title != "Destino do Paciente" ? "45%" : "48%",
                      ],
                      avoidLabelOverlap: false,
                      type: "pie",
                      itemStyle: {
                        borderRadius: 5,
                      },
                      data: chart.data.map((item: any) => ({
                        name: item.value !== null ? item.name : "Não informado",
                        value: item.value,
                      })),
                      emphasis: {
                        itemStyle: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: "rgba(0, 0, 0, 0.7)",
                        },
                      },
                      top: chart.title != "Destino do Paciente" ? -80 : -80,
                      bottom: chart.title != "Destino do Paciente" ? 0 : 48,
                    },
                  ],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

// <ReactECharts
//           key={index}
//           option={{
//             title: { text: chart.title },
//             xAxis: {
//               type: "category",
//               data: chart.data.map((item) => item.name),
//             },
//             yAxis: { type: "value" },
//             series: [
//               {
//                 data: chart.data.map((item) => item.value),
//                 type: "bar",
//               },
//             ],
//           }}
//         />
