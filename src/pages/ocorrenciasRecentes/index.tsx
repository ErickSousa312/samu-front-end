import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Ambulance,
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MapPin,
  MonitorUp,
  Radio,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import api from "@/shared/services/api";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface OcorrenciaRecente {
  OcorrenciaID: string;
  DtHr: string;
  RegistroDT: string | null;
  VitimasNM: number | null;
  VitimaNome: string | null;
  QueixaDS: string | null;
  OcorrenciaApelido: string | null;
  RISCOCOD: number | null;
  Logradouro: string | null;
  Numero: string | null;
  Bairro: string | null;
  ReferenciaDS: string | null;
  MunicipioID: string | null;
  OcorrenciaFinalDT: string | null;
  Regulado: number | null;
}

type StatusFilter = "all" | "open" | "finished";

const PANEL_POLL_INTERVAL = 30000;

const cleanText = (value: string | null | undefined, fallback = "Não informado") =>
  value?.trim() || fallback;

const parseOccurrenceDate = (value: string) =>
  new Date(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}.*Z$/.test(value) ? value.slice(0, -1) : value);

const formatDate = (value: string | null | undefined) => {
  if (!value) return "Não informado";
  const date = parseOccurrenceDate(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatTimeAgo = (value: string) => {
  const date = parseOccurrenceDate(value);
  if (Number.isNaN(date.getTime())) return "Horário não informado";
  const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (minutes < 1) return "Agora";
  if (minutes < 60) return `Há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Há ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Há ${days} dia${days > 1 ? "s" : ""}`;
};

const normalize = (value: unknown) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");

const OcorrenciasRecentesPage = () => {
  const [records, setRecords] = useState<OcorrenciaRecente[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [panelMode, setPanelMode] = useState(false);
  const [panelClock, setPanelClock] = useState(new Date());
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    if (!hasLoadedRef.current) setLoading(true);
    setRefreshing(true);
    setError("");

    api
      .get<OcorrenciaRecente[]>("/ocorrencia", {
        params: {
          ultimasHoras: 24,
        },
        signal: controller.signal,
        timeout: 120000,
      })
      .then(({ data }) => {
        if (!Array.isArray(data)) throw new Error("Resposta inválida");
        const ordered = Array.from(
          new Map(data.map((record) => [record.OcorrenciaID, record])).values(),
        )
          .sort(
            (a, b) =>
              parseOccurrenceDate(b.DtHr).getTime() -
              parseOccurrenceDate(a.DtHr).getTime(),
          );
        if (!controller.signal.aborted) {
          hasLoadedRef.current = true;
          setRecords(ordered);
          setSelectedId((current) =>
            current && ordered.some((record) => record.OcorrenciaID === current)
              ? current
              : ordered[0]?.OcorrenciaID || null,
          );
          setUpdatedAt(new Date());
        }
      })
      .catch(() => {
        if (!controller.signal.aborted && !hasLoadedRef.current) {
          setError("Não foi possível carregar as ocorrências mais recentes.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      });

    return () => controller.abort();
  }, [refreshKey]);

  useEffect(() => {
    if (!panelMode || loading || refreshing) return;
    const timer = window.setTimeout(
      () => setRefreshKey((value) => value + 1),
      PANEL_POLL_INTERVAL,
    );
    return () => window.clearTimeout(timer);
  }, [loading, panelMode, refreshing, updatedAt]);

  useEffect(() => {
    if (!panelMode) return;
    const previousOverflow = document.body.style.overflow;
    const leavePanelMode = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPanelMode(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", leavePanelMode);
    setPanelClock(new Date());
    const clockTimer = window.setInterval(() => setPanelClock(new Date()), 1000);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", leavePanelMode);
      window.clearInterval(clockTimer);
    };
  }, [panelMode]);

  const enterPanelMode = () => {
    setPanelMode(true);
    setRefreshKey((value) => value + 1);
  };

  const filteredRecords = useMemo(() => {
    const normalizedQuery = normalize(query.trim());
    return records.filter((record) => {
      const finished = Boolean(record.OcorrenciaFinalDT);
      const matchesStatus =
        status === "all" || (status === "finished" ? finished : !finished);
      const searchable = normalize(
        [
          record.OcorrenciaID,
          record.OcorrenciaApelido,
          record.QueixaDS,
          record.VitimaNome,
          record.Logradouro,
          record.Bairro,
        ].join(" "),
      );
      return matchesStatus && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [query, records, status]);

  const selected =
    filteredRecords.find((record) => record.OcorrenciaID === selectedId) ||
    filteredRecords[0] ||
    null;
  const openCount = records.filter((record) => !record.OcorrenciaFinalDT).length;
  const regulatedCount = records.filter((record) => Number(record.Regulado) === 1).length;
  const victimCount = records.reduce(
    (total, record) => total + (Number(record.VitimasNM) || 0),
    0,
  );
  const panelRecords = records.slice(0, 8);
  const panelCharts = useMemo(() => {
    const end = updatedAt?.getTime() || Date.now();
    const bucketSize = 3 * 60 * 60 * 1000;
    const start = end - 24 * 60 * 60 * 1000;
    const timeline = Array.from({ length: 8 }, (_, index) => {
      const bucketStart = start + index * bucketSize;
      return {
        name: `${new Date(bucketStart).getHours().toString().padStart(2, "0")}h`,
        value: 0,
      };
    });
    const neighborhoods = new Map<string, number>();

    records.forEach((record) => {
      const occurredAt = parseOccurrenceDate(record.DtHr).getTime();
      const bucket = Math.floor((occurredAt - start) / bucketSize);
      if (bucket >= 0 && bucket < timeline.length) timeline[bucket].value += 1;
      const neighborhoodValue = cleanText(record.Bairro, "Não informado");
      const neighborhood =
        normalize(neighborhoodValue) === "selecione"
          ? "Não informado"
          : neighborhoodValue;
      neighborhoods.set(neighborhood, (neighborhoods.get(neighborhood) || 0) + 1);
    });

    return {
      timeline,
      statuses: [
        { name: "Em andamento", value: openCount, color: "#fbbf24" },
        { name: "Finalizadas", value: records.length - openCount, color: "#4ade80" },
      ],
      neighborhoods: Array.from(neighborhoods, ([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5),
    };
  }, [openCount, records, updatedAt]);
  const secondsUntilRefresh = updatedAt
    ? Math.max(
        0,
        Math.ceil(
          (PANEL_POLL_INTERVAL -
            (panelClock.getTime() - updatedAt.getTime())) /
            1000,
        ),
      )
    : 0;

  if (panelMode) {
    return (
      <section className="recent-live-panel" aria-label="Painel ao vivo de ocorrências recentes">
        <header className="recent-live-header">
          <div className="recent-live-brand">
            <span><Ambulance size={24} /></span>
            <div>
              <p><i aria-hidden="true" /> Central em tempo real</p>
              <h1>Ocorrências recentes</h1>
            </div>
          </div>

          <div className="recent-live-clock" aria-label="Horário atual">
            <strong>{panelClock.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</strong>
            <span>{panelClock.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}</span>
          </div>

          <div className="recent-live-actions">
            <div className="recent-live-sync">
              <span>{refreshing ? "Sincronizando dados" : `Próxima atualização em ${secondsUntilRefresh}s`}</span>
              <div><i className={refreshing ? "is-refreshing" : ""} style={{ width: `${refreshing ? 100 : ((PANEL_POLL_INTERVAL / 1000 - secondsUntilRefresh) / (PANEL_POLL_INTERVAL / 1000)) * 100}%` }} /></div>
            </div>
            <button type="button" className="recent-live-refresh" onClick={() => setRefreshKey((value) => value + 1)} disabled={refreshing} aria-label="Atualizar agora">
              <RefreshCw className={refreshing ? "consultation-spinner" : ""} size={18} />
            </button>
            <button type="button" className="button recent-live-exit" onClick={() => setPanelMode(false)}>
              <ArrowLeft size={17} /> Voltar ao modo normal
            </button>
          </div>
        </header>

        <div className="recent-live-metrics" aria-label="Indicadores em tempo real">
          <article><span className="metric-red"><Radio size={18} /></span><div><small>Últimas 24 horas</small><strong>{records.length}</strong></div></article>
          <article><span className="metric-amber"><Activity size={18} /></span><div><small>Em andamento</small><strong>{openCount}</strong></div></article>
          <article><span className="metric-blue"><ShieldCheck size={18} /></span><div><small>Reguladas</small><strong>{regulatedCount}</strong></div></article>
          <article><span className="metric-green"><UsersRound size={18} /></span><div><small>Vítimas registradas</small><strong>{victimCount}</strong></div></article>
        </div>

        <div className="recent-live-content">
          <section className="recent-live-feed">
            <div className="recent-live-section-heading">
              <div><p className="eyebrow">Fluxo operacional</p><h2>Últimos chamados</h2></div>
              <span>{panelRecords.length} mais recentes</span>
            </div>

            {loading && !panelRecords.length ? (
              <div className="recent-live-empty"><RefreshCw className="consultation-spinner" size={28} /><strong>Carregando ocorrências...</strong></div>
            ) : error && !panelRecords.length ? (
              <div className="recent-live-empty"><AlertTriangle size={28} /><strong>{error}</strong></div>
            ) : (
              <div className="recent-live-grid">
                {panelRecords.map((record) => {
                  const finished = Boolean(record.OcorrenciaFinalDT);
                  return (
                    <article className="recent-live-card" key={record.OcorrenciaID}>
                      <span className={`recent-live-card-icon ${finished ? "finished" : "open"}`}>{finished ? <CheckCircle2 size={17} /> : <Ambulance size={17} />}</span>
                      <span className="recent-live-card-copy">
                        <span className="recent-live-card-top"><strong>#{record.OcorrenciaID}</strong><time dateTime={record.DtHr}>{formatTimeAgo(record.DtHr)}</time></span>
                        <b>{cleanText(record.OcorrenciaApelido || record.QueixaDS)}</b>
                        <span><MapPin size={12} /> {cleanText(record.Bairro, "Bairro não informado")}</span>
                      </span>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="recent-live-insights" aria-label="Gráficos das últimas 24 horas">
            <section className="recent-live-chart recent-live-chart-timeline">
              <div><span>Volume por horário</span><strong>Ritmo das últimas 24h</strong></div>
              <div className="recent-live-chart-canvas">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={panelCharts.timeline} margin={{ top: 8, right: 5, bottom: 0, left: -28 }}>
                    <defs><linearGradient id="recentTimelineFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f87171" stopOpacity={0.38} /><stop offset="100%" stopColor="#f87171" stopOpacity={0.02} /></linearGradient></defs>
                    <CartesianGrid stroke="#263347" vertical={false} strokeDasharray="3 4" />
                    <XAxis dataKey="name" tick={{ fill: "#7f90a8", fontSize: 9 }} tickLine={false} axisLine={false} interval={1} />
                    <YAxis tick={{ fill: "#7f90a8", fontSize: 9 }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: "#111c2b", border: "1px solid #34445b", borderRadius: 8, fontSize: 11 }} labelStyle={{ color: "#a7b5c8" }} />
                    <Area type="monotone" dataKey="value" name="Ocorrências" stroke="#f87171" strokeWidth={2} fill="url(#recentTimelineFill)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="recent-live-chart recent-live-chart-status">
              <div><span>Situação</span><strong>Chamados no período</strong></div>
              <div className="recent-live-chart-canvas recent-live-pie-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={panelCharts.statuses} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="82%" paddingAngle={3} stroke="none" isAnimationActive={false}>
                      {panelCharts.statuses.map((item) => <Cell key={item.name} fill={item.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#111c2b", border: "1px solid #34445b", borderRadius: 8, fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
                <span><strong>{records.length}</strong><small>Total</small></span>
              </div>
              <div className="recent-live-chart-legend">{panelCharts.statuses.map((item) => <span key={item.name}><i style={{ background: item.color }} />{item.name} <strong>{item.value}</strong></span>)}</div>
            </section>

            <section className="recent-live-chart recent-live-chart-neighborhoods">
              <div><span>Distribuição territorial</span><strong>Bairros com mais chamados</strong></div>
              <div className="recent-live-chart-canvas">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={panelCharts.neighborhoods} layout="vertical" margin={{ top: 4, right: 8, bottom: 0, left: 4 }}>
                    <XAxis type="number" hide allowDecimals={false} />
                    <YAxis type="category" dataKey="name" width={76} tick={{ fill: "#91a0b5", fontSize: 9 }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "#111c2b", border: "1px solid #34445b", borderRadius: 8, fontSize: 11 }} cursor={{ fill: "#ffffff08" }} />
                    <Bar dataKey="value" name="Ocorrências" fill="#60a5fa" radius={[0, 5, 5, 0]} maxBarSize={16} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </aside>
        </div>
      </section>
    );
  }

  return (
    <div className="stack recent-page">
      <section className="recent-hero">
        <div className="recent-hero-copy">
          <span className="live-indicator">
            <i aria-hidden="true" /> Central em acompanhamento
          </span>
          <h2>Últimas ocorrências</h2>
          <p>
            Uma visão rápida dos registros mais novos, com situação, paciente e
            localização em destaque.
          </p>
        </div>
        <div className="recent-update">
          <span>
            <Clock3 size={15} aria-hidden="true" />
            {updatedAt
              ? `Atualizado às ${updatedAt.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "Aguardando atualização"}
          </span>
          <div className="recent-update-actions">
            <button
              type="button"
              className="button recent-refresh"
              onClick={() => setRefreshKey((value) => value + 1)}
              disabled={refreshing}
            >
              <RefreshCw className={refreshing ? "consultation-spinner" : ""} size={17} />
              Atualizar agora
            </button>
            <button
              type="button"
              className="button recent-panel-toggle"
              onClick={enterPanelMode}
            >
              <MonitorUp size={17} /> Modo painel
            </button>
          </div>
        </div>
      </section>

      <section className="recent-metrics" aria-label="Resumo das ocorrências recentes">
        <article>
          <span className="recent-metric-icon metric-red"><Radio size={19} /></span>
          <div><small>Últimas 24 horas</small><strong>{records.length}</strong></div>
          <p>ocorrências no período</p>
        </article>
        <article>
          <span className="recent-metric-icon metric-amber"><Activity size={19} /></span>
          <div><small>Em andamento</small><strong>{openCount}</strong></div>
          <p>aguardando finalização</p>
        </article>
        <article>
          <span className="recent-metric-icon metric-blue"><ShieldCheck size={19} /></span>
          <div><small>Reguladas</small><strong>{regulatedCount}</strong></div>
          <p>com regulação registrada</p>
        </article>
        <article>
          <span className="recent-metric-icon metric-green"><UsersRound size={19} /></span>
          <div><small>Vítimas</small><strong>{victimCount}</strong></div>
          <p>nos registros exibidos</p>
        </article>
      </section>

      <section className="recent-workspace">
        <div className="recent-feed-panel">
          <div className="recent-toolbar">
            <div>
              <p className="eyebrow">Linha do tempo</p>
              <h2>Registros mais novos</h2>
            </div>
            <span className="recent-result-count">{filteredRecords.length} exibidos</span>
          </div>

          <div className="recent-controls">
            <label className="recent-search" htmlFor="recent-search">
              <Search size={17} aria-hidden="true" />
              <input
                id="recent-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar ocorrência, paciente ou local"
              />
            </label>
            <div className="recent-segmented" aria-label="Filtrar por situação">
              {([
                ["all", "Todas"],
                ["open", "Em andamento"],
                ["finished", "Finalizadas"],
              ] as const).map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  className={status === value ? "active" : ""}
                  onClick={() => setStatus(value)}
                  aria-pressed={status === value}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="recent-state">
              <RefreshCw className="consultation-spinner" size={26} />
              <strong>Buscando os registros mais recentes...</strong>
            </div>
          ) : error ? (
            <div className="recent-state recent-state-error">
              <AlertTriangle size={28} />
              <strong>{error}</strong>
              <button className="button button-secondary" onClick={() => setRefreshKey((v) => v + 1)}>
                Tentar novamente
              </button>
            </div>
          ) : filteredRecords.length ? (
            <div className="recent-list">
              {filteredRecords.map((record) => {
                const finished = Boolean(record.OcorrenciaFinalDT);
                const active = selected?.OcorrenciaID === record.OcorrenciaID;
                return (
                  <button
                    type="button"
                    className={`recent-item ${active ? "active" : ""}`}
                    key={record.OcorrenciaID}
                    onClick={() => setSelectedId(record.OcorrenciaID)}
                  >
                    <span className={`recent-item-marker ${finished ? "finished" : "open"}`}>
                      {finished ? <CheckCircle2 size={18} /> : <Ambulance size={18} />}
                    </span>
                    <span className="recent-item-main">
                      <span className="recent-item-topline">
                        <strong>#{record.OcorrenciaID}</strong>
                        <time dateTime={record.DtHr}>{formatTimeAgo(record.DtHr)}</time>
                      </span>
                      <b>{cleanText(record.OcorrenciaApelido || record.QueixaDS)}</b>
                      <span className="recent-item-meta">
                        <span><UserRound size={13} /> {cleanText(record.VitimaNome, "Paciente não informado")}</span>
                        <span><MapPin size={13} /> {cleanText(record.Bairro, "Bairro não informado")}</span>
                      </span>
                    </span>
                    <ChevronRight className="recent-item-chevron" size={18} aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="recent-state">
              <Search size={28} />
              <strong>Nenhuma ocorrência corresponde aos filtros.</strong>
            </div>
          )}
        </div>

        <aside className="recent-detail-panel" aria-live="polite">
          {selected ? (
            <>
              <div className="recent-detail-cover">
                <div className="recent-detail-icon"><Ambulance size={27} /></div>
                <div>
                  <span>Ocorrência #{selected.OcorrenciaID}</span>
                  <h2>{cleanText(selected.OcorrenciaApelido || selected.QueixaDS)}</h2>
                </div>
              </div>
              <div className="recent-detail-status">
                <span className={`status-badge ${selected.OcorrenciaFinalDT ? "status-finished" : "status-open"}`}>
                  {selected.OcorrenciaFinalDT ? "Finalizada" : "Em andamento"}
                </span>
                <span className="risk-chip">Risco {selected.RISCOCOD ?? "não informado"}</span>
              </div>
              <dl className="recent-detail-list">
                <div><dt><UserRound size={16} /> Paciente</dt><dd>{cleanText(selected.VitimaNome)}</dd></div>
                <div><dt><CalendarClock size={16} /> Data e hora</dt><dd>{formatDate(selected.DtHr)}</dd></div>
                <div><dt><MapPin size={16} /> Endereço</dt><dd>{[selected.Logradouro?.trim(), selected.Numero?.trim()].filter(Boolean).join(", ") || "Não informado"}</dd></div>
                <div><dt><MapPin size={16} /> Bairro</dt><dd>{cleanText(selected.Bairro)}</dd></div>
                <div><dt><UsersRound size={16} /> Vítimas</dt><dd>{selected.VitimasNM ?? "Não informado"}</dd></div>
                <div><dt><ShieldCheck size={16} /> Regulação</dt><dd>{Number(selected.Regulado) === 1 ? "Regulada" : "Não regulada"}</dd></div>
              </dl>
              {selected.ReferenciaDS?.trim() && (
                <div className="recent-reference">
                  <small>Ponto de referência</small>
                  <p>{selected.ReferenciaDS.trim()}</p>
                </div>
              )}
              <div className="recent-detail-footer">
                <span><i aria-hidden="true" /> Registro sincronizado</span>
                <time>{formatDate(selected.RegistroDT || selected.DtHr)}</time>
              </div>
            </>
          ) : (
            <div className="recent-state"><Radio size={28} /><strong>Selecione uma ocorrência</strong></div>
          )}
        </aside>
      </section>
    </div>
  );
};

export default OcorrenciasRecentesPage;
