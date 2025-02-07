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
  fetchAtendimentoTipoOcorrencia,
} from "@/shared/services/ApiRequests";

import {
  AtendimentoMotivo,
  AtendimentoChamadasDiaNoite,
  TempoResposta,
  DestinoPaciente,
  TotalChamadasTelefonicas,
  RegistroObito,
  FaixaEtaria,
  RecordSetProps,
  RecordGetProps,
  TipoAtendimentos,
} from "@/@types/types";
import { color } from "echarts";
import { FunnelCharCompo } from "@/shared/components/charts/FunnelChart";
import { SexoAtendimentos } from "../../@types/types";
import { AreaChartCompo } from "@/shared/components/charts/AreaChart";
import { CardsDashboards } from "../cards/CardsDashboard";
import { BarChartCompo } from "@/shared/components/charts/BarChart";
import { CardsDashboardsFilter } from "../cards/CardsDashboardsFilter";
import { cities } from "@/constants/cities";

const Dashboard: React.FC = () => {
  const [ano, setAno] = useState<string>("2024");
  const [mes, setMes] = useState<string>("5");
  const [codMunicipio, setcodMunicipio] = useState<string>("");
  const [nomeMunicipio, setNomeMunicipio] = useState<string>("MARABA");

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

  const [atendimentoTipoOcorrencia, setAtendimentoTipoOcorrencia] = useState<
    TipoAtendimentos[]
  >([]);

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
        atendimentoTipoOcorrenciaData,
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
        fetchAtendimentoTipoOcorrencia(getAllProps()),
      ]);

      setAtendimentoMotivo(atendimentoMotivoData);
      setChamadasDiaNoite(chamadasDiaNoiteData);
      setTempoResposta(tempoRespostaData);
      setDestinoPaciente(destinoPacienteData);
      setTotalChamadas(totalChamadasData);
      setTotalChamadasMes(totalChamadasMesData);
      setObitos(obitosData);
      setFaixaEtaria(faixaEtariaData);
      setAtendimentosSexo(SexoAtendimentosData);

      setDestinoPacientes(destinoPacienteData[0].UnidadeDS);
      setDestinoPacientesQuantidade(
        destinoPacienteData[0].QuantidadeAtendimentos,
      );
      setAtendimentoTipoOcorrencia(atendimentoTipoOcorrenciaData);
    };

    fetchData();
  }, [ano, mes, codMunicipio, nomeMunicipio]);

  const recordSetProps: RecordSetProps = {
    year: (value: string) => setAno(value),
    month: (value: string) => setMes(value),
    city: (value: string) => setNomeMunicipio(value),
    codCity: (value: string) => setcodMunicipio(value),
  };

  const recordGetProps: RecordGetProps = {
    year: () => ano,
    month: () => mes,
    city: () => nomeMunicipio,
    codCity: () => codMunicipio,
  };

  return (
    <div className="flex flex-col  h-[60%] w-[100%]">
      <div className="w-[100%] flex flex-row gap-3  justify-around mt-3 mb-3 ">
        <CardsDashboards
          link="/dashboard/atendimentos"
          linkTile="Ocorrencias"
          title="Chamadas Telefônicas no ano"
          value={
            totalChamadas[0] ? totalChamadas[0].QuantidadeAtendimentos : "---"
          }
          change={{ value: "1350", percentage: "15%", isPositive: true }}
        ></CardsDashboards>
        <CardsDashboards
          link="/dashboard/atendimentos"
          linkTile="Consultas"
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
        <CardsDashboardsFilter
          recordSetProps={recordSetProps}
          recordGetProps={recordGetProps}
          title="Filtros"
          value="1000"
          change={{
            value: "50",
            percentage: "5%",
            isPositive: true,
          }}
          cities={cities}
        />
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
          dataExport={chamadasDiaNoite}
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
          style={{
            width: "56%",
            marginLeft: 13,
            margin: 8,
            padding: 3,
            paddingRight: 7,
          }}
        />
        <FunnelCharCompo
          dataExport={(sexoAtendimentos || []).map((item) => ({
            Sexo: item.SexoDS == null ? "Não informado" : item.SexoDS,
            Quantidade: item.Total_Ocorrencias,
          }))}
          titlesTable={{
            name: "Sexo",
            value: "Quantidade",
          }}
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
          style={{ width: "41%", marginLeft: 10, margin: 5, marginTop: "8px" }}
        />
        <FunnelCharCompo
          titlesTable={{
            name: "faixa etária",
            value: "Quantidade",
          }}
          dataExport={faixaEtaria}
          data={{
            title: "Atendimentos por Faixa etária",
            dataInfo: faixaEtaria.map((item, index) => ({
              name: item.faixa_etaria,
              value: item.Total_Ocorrencias,
              fill: colorsChart[index % colorsChart.length],
            })),
          }}
          style={{ width: "47%", marginLeft: 9, margin: 5, marginTop: "5px" }}
        />
        <BarChartCompo
          dataExport={atendimentoTipoOcorrencia}
          title="Atendimentos por período do dia"
          data={{
            title: "Período do Dia",
            dataInfo: atendimentoTipoOcorrencia.map((item, index) => ({
              name:
                item.TipoDS == "**não informado**" ? "Sem dados" : item.TipoDS,
              value: item.Total_Ocorrencias,
              colors: colorsChart[index % colorsChart.length],
            })),
          }}
          style={{ width: "50%", margin: 5, marginLeft: 10, marginTop: "5px" }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
