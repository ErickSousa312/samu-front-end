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

const Dashboard: React.FC = () => {
  const [ano, setAno] = useState<string>("");
  const [mes, setMes] = useState<string>("");
  const [codMunicipio, setcodMunicipio] = useState<string>("");
  const [nomeMunicipio, setNomeMunicipio] = useState<string>("");

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
  const [obitos, setObitos] = useState<RegistroObito[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [
        atendimentoMotivoData,
        chamadasDiaNoiteData,
        tempoRespostaData,
        destinoPacienteData,
        totalChamadasData,
        obitosData,
      ] = await Promise.all([
        fetchAtendimentoMotivo(),
        fetchChamadasDiaNoite(),
        fetchTempoResposta(),
        fetchDestinoPaciente(),
        fetchTotalChamadasTelefonicas(),
        fetchObitos(),
      ]);

      setAtendimentoMotivo(atendimentoMotivoData);
      setChamadasDiaNoite(chamadasDiaNoiteData);
      setTempoResposta(tempoRespostaData);
      setDestinoPaciente(destinoPacienteData);
      setTotalChamadas(totalChamadasData);
      setObitos(obitosData);
    };

    fetchData();
  }, []);

  const chartOptions = [
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
      title: "Destino do Paciente",
      data: destinoPaciente.map((item) => ({
        name: item.UnidadeDS,
        value: item.QuantidadeAtendimentos,
      })),
    },
    {
      title: "Total Chamadas Telefônicas",
      data: [
        {
          name: "Total Chamadas",
          value: totalChamadas.reduce(
            (sum, item) => sum + item.QuantidadeAtendimentos,
            0,
          ),
        },
      ],
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
    <div className="grid grid-cols-2 gap-4 p-4">
      {chartOptions.map((chart, index) => (
        <ReactECharts
          key={index}
          option={{
            title: { text: chart.title },
            xAxis: {
              type: "category",
              data: chart.data.map((item) => item.name),
            },
            yAxis: { type: "value" },
            series: [
              {
                data: chart.data.map((item) => item.value),
                type: "bar",
              },
            ],
          }}
        />
      ))}
    </div>
  );
};

export default Dashboard;
