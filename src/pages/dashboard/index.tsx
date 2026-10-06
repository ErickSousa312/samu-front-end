import React, { useEffect, useState } from "react";
import {
  fetchChamadasDiaNoite,
  fetchDestinoPaciente,
  fetchTotalChamadasTelefonicas,
  fetchFaixaEtaria,
  fetchAtendimentosSexo,
  fetchAtendimentoTipoOcorrencia,
} from "@/shared/services/ApiRequests";

import {
  AtendimentoChamadasDiaNoite,
  TotalChamadasTelefonicas,
  FaixaEtaria,
  RecordSetProps,
  RecordGetProps,
  TipoAtendimentos,
} from "@/@types/types";
import { FunnelCharCompo } from "@/shared/components/charts/FunnelChart";
import { SexoAtendimentos } from "../../@types/types";
import { AreaChartCompo } from "@/shared/components/charts/AreaChart";
import { CardsDashboards } from "../cards/CardsDashboard";
import { BarChartCompo } from "@/shared/components/charts/BarChart";
import { CardsDashboardsFilter } from "../cards/CardsDashboardsFilter";
import { cities } from "@/constants/cities";
import { BerCharCompoVertical } from "@/shared/components/charts/BarCharVertical";
import { Activity, BarChart3, LoaderCircle } from "lucide-react";

const DashboardLoading = ({ city, month, year }: { city: string; month: string; year: string }) => (
  <div className="dashboard-loading" role="status" aria-live="polite">
    <section className="dashboard-loading-status">
      <span className="dashboard-loading-icon"><LoaderCircle size={20} /></span>
      <div>
        <strong>Atualizando visão geral</strong>
        <p>Consolidando os indicadores de {city || "todos os municípios"} para {month || "todos os meses"}/{year || "todos os anos"}.</p>
      </div>
      <span className="dashboard-loading-dots" aria-hidden="true"><i /><i /><i /></span>
    </section>

    <section className="panel dashboard-skeleton-summary" aria-hidden="true">
      <div className="dashboard-skeleton-heading"><span className="dashboard-skeleton dashboard-skeleton-short" /><span className="dashboard-skeleton dashboard-skeleton-title" /></div>
      <div className="summary-grid">
        {[0, 1, 2].map((item) => <div className="summary-item dashboard-skeleton-card" key={item}><span className="dashboard-skeleton dashboard-skeleton-label" /><strong className="dashboard-skeleton dashboard-skeleton-value" /></div>)}
      </div>
    </section>

    <div className="metric-grid" aria-hidden="true">
      {[0, 1, 2].map((item) => <article className="metric-card dashboard-skeleton-metric" key={item}><span className="dashboard-skeleton dashboard-skeleton-label" /><span className="dashboard-skeleton dashboard-skeleton-number" /><span className="dashboard-skeleton dashboard-skeleton-note" /></article>)}
    </div>

    <section className="panel dashboard-skeleton-filter" aria-hidden="true">
      <div className="dashboard-skeleton-filter-title"><Activity size={17} /><span className="dashboard-skeleton dashboard-skeleton-short" /></div>
      <div className="filter-grid">{[0, 1, 2].map((item) => <span className="dashboard-skeleton dashboard-skeleton-input" key={item} />)}</div>
    </section>

    <div className="chart-grid" aria-hidden="true">
      {[0, 1, 2, 3].map((item) => (
        <section className="panel dashboard-skeleton-chart-card" key={item}>
          <div><span className="dashboard-skeleton dashboard-skeleton-chart-title" /><BarChart3 size={18} /></div>
          <div className="dashboard-skeleton-chart">
            {[42, 68, 51, 83, 62, 76, 48].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
          </div>
        </section>
      ))}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [ano, setAno] = useState<string>("2024");
  const [mes, setMes] = useState<string>("5");
  const [codMunicipio, setcodMunicipio] = useState<string>("");
  const [nomeMunicipio, setNomeMunicipio] = useState<string>("MARABA");

  const [chamadasDiaNoite, setChamadasDiaNoite] = useState<
    AtendimentoChamadasDiaNoite[]
  >([]);
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

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [retry, setRetry] = useState(0);

  const [atendimentoTipoOcorrencia, setAtendimentoTipoOcorrencia] = useState<
    TipoAtendimentos[]
  >([]);

  const colorsChart = [
    "#82ca9d",
    "#a4de6c",
    "#7F7FFF",
    "#A77FFF",
    "#D37FFF",
    "#FF7FCF",
    "#FF99B3",
    "#C77FFF",
    "#FF99FF",
  ];

  useEffect(() => {
    const controller = new AbortController();
    const props = { ano, mes, codMunicipio, nomeMunicipio };
    setIsLoading(true);
    setErrorMessage("");
    setChamadasDiaNoite([]);
    setTotalChamadas([]);
    setTotalChamadasMes([]);
    setFaixaEtaria([]);
    setAtendimentosSexo([]);
    setAtendimentoTipoOcorrencia([]);
    setDestinoPacientes(undefined);
    setDestinoPacientesQuantidade(undefined);

    const load = async <T,>(
      request: Promise<T>,
      update: (value: T) => void,
    ) => {
      try {
        const result = await request;
        if (!controller.signal.aborted) update(result);
      } catch {
        if (!controller.signal.aborted) {
          setErrorMessage(
            "Não foi possível carregar alguns indicadores. Tente novamente.",
          );
        }
      }
    };

    const fetchData = async () => {
      await Promise.all([
        load(
          fetchChamadasDiaNoite(props, controller.signal),
          setChamadasDiaNoite,
        ),
        load(fetchDestinoPaciente(props, controller.signal), (data) => {
          const mostFrequent = data.reduce(
            (best, item) =>
              !best || item.QuantidadeAtendimentos > best.QuantidadeAtendimentos
                ? item
                : best,
            undefined as (typeof data)[number] | undefined,
          );
          setDestinoPacientes(mostFrequent?.UnidadeDS);
          setDestinoPacientesQuantidade(mostFrequent?.QuantidadeAtendimentos);
        }),
        load(
          fetchTotalChamadasTelefonicas(
            { ...props, mes: "" },
            controller.signal,
          ),
          setTotalChamadas,
        ),
        load(
          fetchTotalChamadasTelefonicas(props, controller.signal),
          setTotalChamadasMes,
        ),
        load(fetchFaixaEtaria(props, controller.signal), setFaixaEtaria),
        load(
          fetchAtendimentosSexo(props, controller.signal),
          setAtendimentosSexo,
        ),
        load(
          fetchAtendimentoTipoOcorrencia(props, controller.signal),
          setAtendimentoTipoOcorrencia,
        ),
      ]);
      if (!controller.signal.aborted) setIsLoading(false);
    };

    fetchData();
    return () => controller.abort();
  }, [ano, mes, codMunicipio, nomeMunicipio, retry]);

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

  const summaryItems = [
    {
      label: "Ano",
      value: totalChamadas[0]
        ? totalChamadas[0].QuantidadeAtendimentos.toLocaleString("pt-BR")
        : "---",
    },
    {
      label: "Mês",
      value: totalChamadasMes[0]
        ? totalChamadasMes[0].QuantidadeAtendimentos.toLocaleString("pt-BR")
        : "---",
    },
    {
      label: "Destino principal",
      value: destinoPacientes ? destinoPacientes : "---",
    },
  ];

  return (
    <div className="stack" aria-busy={isLoading}>
      {isLoading ? (
        <DashboardLoading city={nomeMunicipio} month={mes} year={ano} />
      ) : (
        <>
      {errorMessage && (
        <div role="alert" className="notice notice-error">
          {errorMessage}
          <button
            className="button button-secondary ml-3"
            onClick={() => setRetry((value) => value + 1)}
          >
            Tentar novamente
          </button>
        </div>
      )}

      <section className="panel summary-panel">
        <div className="summary-header">
          <div>
            <p className="eyebrow">Resumo do período</p>
            <h1>
              {nomeMunicipio || "Município"} · {mes}/{ano}
            </h1>
          </div>
          <span className="summary-badge">Dados operacionais</span>
        </div>

        <div className="summary-grid">
          {summaryItems.map((item) => (
            <div key={item.label} className="summary-item">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <div className="metric-grid">
        <CardsDashboards
          title="Chamadas telefônicas no ano"
          value={
            totalChamadas[0] ? totalChamadas[0].QuantidadeAtendimentos : "---"
          }
          change={{
            value: "Total acumulado no período selecionado",
            percentage: "Ano",
            isPositive: true,
          }}
        ></CardsDashboards>
        <CardsDashboards
          title="Chamadas telefônicas no mês"
          value={
            totalChamadasMes[0]
              ? totalChamadasMes[0].QuantidadeAtendimentos
              : "---"
          }
          change={{
            value: "Total registrado no mês atual",
            percentage: "Mês",
            isPositive: true,
          }}
        ></CardsDashboards>
        <CardsDashboards
          title="Destino mais frequente"
          value={destinoPacientesQuantidade ?? "---"}
          change={{
            value: destinoPacientes ? destinoPacientes : "---",
            percentage: "Principal destino",
            isPositive: true,
          }}
        ></CardsDashboards>
      </div>
      <CardsDashboardsFilter
        recordSetProps={recordSetProps}
        recordGetProps={recordGetProps}
        title="Filtros"
        cities={cities}
      />
      <div className="chart-grid">
        <BarChartCompo
          dataExport={atendimentoTipoOcorrencia}
          title="Atendimentos por Tipo de Ocorrência"
          data={{
            title: "Período do Dia",
            dataInfo: atendimentoTipoOcorrencia.map((item, index) => ({
              name:
                item.TipoDS == "**não informado**"
                  ? "Sem dados"
                  : item.TipoDS || "Sem dados",
              value: item.Total_Ocorrencias,
              colors: colorsChart[index % colorsChart.length],
            })),
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
        />
        <BerCharCompoVertical
          title="Atendimentos por Faixa Etária"
          dataExport={faixaEtaria}
          data={{
            title: "Atendimentos por Faixa etária",
            dataInfo: faixaEtaria.map((item, index) => ({
              name:
                item.faixa_etaria == "NÃO IDENTIFICADAS"
                  ? "Sem dados"
                  : (item.faixa_etaria || "Sem dados")
                      .toLocaleLowerCase()
                      .replace("anos", ""),
              value: item.Total_Ocorrencias,
              fill: colorsChart[index % colorsChart.length],
            })),
          }}
        />
        <AreaChartCompo
          dataExport={chamadasDiaNoite}
          title="Atendimentos por período do dia"
          data={{
            title: "Período do Dia",
            dataInfo: chamadasDiaNoite.map((item, index) => ({
              name: (item.PeriodoDia || "Sem dados").toLocaleLowerCase(),
              value: item.Total_Ocorrencias,
              colors: colorsChart[index % colorsChart.length],
            })),
          }}
          layout="vertical"
        />
      </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
