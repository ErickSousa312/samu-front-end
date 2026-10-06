import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Ambulance,
  CalendarClock,
  ClipboardList,
  Eye,
  FileText,
  FilterX,
  LoaderCircle,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import api from "@/shared/services/api";
import { Dialog } from "@/shared/components/ui/Dialog";
import { Pagination } from "@/shared/components/ui/Pagination";

interface Ocorrencia {
  OcorrenciaID: string;
  DtHr: string;
  VitimasNM: number | null;
  QueixaDS: string | null;
  RISCOCOD: number | null;
  Logradouro: string | null;
  Numero: string | null;
  Bairro: string | null;
  ReferenciaDS: string | null;
  MunicipioID: string | null;
  OcorrenciaApelido: string | null;
  VitimaNome: string | null;
  OcorrenciaFinalDT: string | null;
  Regulado: number | null;
  [key: string]: unknown;
}

interface TableFilters {
  general: string;
  occurrence: string;
  patient: string;
  description: string;
  location: string;
  neighborhood: string;
  municipality: string;
  status: "all" | "open" | "finished";
  risk: string;
  regulated: "all" | "yes" | "no";
  victims: string;
}

const PAGE_SIZE = 20;
const emptyTableFilters: TableFilters = {
  general: "",
  occurrence: "",
  patient: "",
  description: "",
  location: "",
  neighborhood: "",
  municipality: "",
  status: "all",
  risk: "",
  regulated: "all",
  victims: "",
};

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const fieldLabels: Record<string, string> = {
  OcorrenciaID: "Número da ocorrência",
  FichaCenario: "Ficha de cenário",
  DtHr: "Data e hora",
  MotivoID: "Código do motivo",
  TipoID: "Código do tipo",
  VitimasNM: "Quantidade de vítimas",
  VitimaNome: "Nome do paciente",
  QueixaDS: "Queixa",
  RISCOCOD: "Classificação de risco",
  TelefoneDDD: "DDD",
  TelefoneNM: "Telefone",
  LogradouroTP: "Tipo de logradouro",
  Logradouro: "Logradouro",
  Numero: "Número",
  Bairro: "Bairro",
  Cod_Bairro: "Código do bairro",
  CEP: "CEP",
  ReferenciaDS: "Referência",
  MunicipioID: "Código do município",
  EstadoID: "Código do estado",
  LigacaoTPID: "Tipo de ligação",
  OrigemTP: "Tipo de origem",
  OcorrenciaApelido: "Descrição da ocorrência",
  OrigemOcoCOD: "Código da origem",
  OcorrenciaFinalDT: "Data de finalização",
  NaturezaID: "Código da natureza",
  CausaID: "Código da causa",
  OperadorID: "Código do operador",
  RegistroDT: "Data de registro",
  RegAtivo: "Registro ativo",
  Registro_Exportado_Relatorio: "Exportado para relatório",
  Complemento: "Complemento",
  Risco_Comprovado: "Risco comprovado",
  Regulado: "Regulado",
  EXPIRADO: "Expirado",
  RowNum: "Posição no resultado",
};

const dateFields = new Set(["DtHr", "OcorrenciaFinalDT", "RegistroDT"]);

const detailSections: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
  fields: string[];
}> = [
  {
    title: "Atendimento",
    description: "Identificação e informações principais da chamada",
    icon: Activity,
    fields: [
      "OcorrenciaID",
      "DtHr",
      "OcorrenciaApelido",
      "QueixaDS",
      "FichaCenario",
      "LigacaoTPID",
      "OrigemTP",
      "OrigemOcoCOD",
    ],
  },
  {
    title: "Paciente e contato",
    description: "Dados da vítima e telefone registrado",
    icon: UserRound,
    fields: ["VitimaNome", "VitimasNM", "TelefoneDDD", "TelefoneNM"],
  },
  {
    title: "Local da ocorrência",
    description: "Endereço e referências para localização",
    icon: MapPin,
    fields: [
      "LogradouroTP",
      "Logradouro",
      "Numero",
      "Bairro",
      "Cod_Bairro",
      "CEP",
      "ReferenciaDS",
      "Complemento",
      "MunicipioID",
      "EstadoID",
    ],
  },
  {
    title: "Classificação e regulação",
    description: "Risco, natureza e situação operacional",
    icon: ShieldAlert,
    fields: [
      "RISCOCOD",
      "Risco_Comprovado",
      "Regulado",
      "NaturezaID",
      "CausaID",
      "MotivoID",
      "TipoID",
      "EXPIRADO",
    ],
  },
  {
    title: "Registro do sistema",
    description: "Datas, operador e controles internos",
    icon: FileText,
    fields: [
      "RegistroDT",
      "OcorrenciaFinalDT",
      "OperadorID",
      "RegAtivo",
      "Registro_Exportado_Relatorio",
      "RowNum",
    ],
  },
];
const mappedDetailFields = new Set(
  detailSections.flatMap((section) => section.fields),
);

const normalize = (value: unknown) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("pt-BR");

const contains = (value: unknown, query: string) =>
  !query || normalize(value).includes(normalize(query));

const cleanText = (value: string | null | undefined) =>
  value?.trim() || "Não informado";

const formatDate = (value: unknown) => {
  if (!value) return "Não informado";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
};

const formatDetailValue = (key: string, value: unknown) => {
  if (value === null || value === undefined || String(value).trim() === "") {
    return "Não informado";
  }
  if (dateFields.has(key)) return formatDate(value);
  if (key === "Regulado" || key === "RegAtivo" || key === "EXPIRADO") {
    return Number(value) === 1 ? "Sim" : "Não";
  }
  return String(value).trim();
};

const ConsultasPage = () => {
  const currentYear = String(new Date().getFullYear());
  const [yearInput, setYearInput] = useState(currentYear);
  const [monthInput, setMonthInput] = useState("");
  const [period, setPeriod] = useState({ ano: currentYear, mes: "" });
  const [tableFilters, setTableFilters] =
    useState<TableFilters>(emptyTableFilters);
  const [records, setRecords] = useState<Ocorrencia[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<Ocorrencia | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setSelectedRecord(null);

    api
      .get<Ocorrencia[]>("/ocorrencia", {
        params: period,
        signal: controller.signal,
        timeout: 120000,
      })
      .then((response) => {
        if (!Array.isArray(response.data)) throw new Error("Invalid response");
        const uniqueRecords = Array.from(
          new Map(
            response.data.map((record) => [record.OcorrenciaID, record]),
          ).values(),
        );
        if (!controller.signal.aborted) {
          setRecords(uniqueRecords);
          setPage(1);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError(
            "Não foi possível carregar as ocorrências. Verifique a conexão e tente novamente.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [period, retry]);

  const riskOptions = useMemo(
    () =>
      Array.from(
        new Set(
          records
            .map((record) => record.RISCOCOD)
            .filter((value): value is number => value !== null),
        ),
      ).sort((a, b) => a - b),
    [records],
  );

  const filteredRecords = useMemo(
    () =>
      records.filter((record) => {
        const finished = Boolean(record.OcorrenciaFinalDT);
        const regulated = Number(record.Regulado) === 1;
        const description = `${record.OcorrenciaApelido ?? ""} ${record.QueixaDS ?? ""}`;
        const location = `${record.Logradouro ?? ""} ${record.Numero ?? ""} ${record.ReferenciaDS ?? ""}`;

        return (
          (!tableFilters.general ||
            Object.values(record).some((value) =>
              contains(value, tableFilters.general),
            )) &&
          contains(record.OcorrenciaID, tableFilters.occurrence) &&
          contains(record.VitimaNome, tableFilters.patient) &&
          contains(description, tableFilters.description) &&
          contains(location, tableFilters.location) &&
          contains(record.Bairro, tableFilters.neighborhood) &&
          contains(record.MunicipioID, tableFilters.municipality) &&
          (tableFilters.status === "all" ||
            (tableFilters.status === "finished" ? finished : !finished)) &&
          (!tableFilters.risk ||
            String(record.RISCOCOD ?? "") === tableFilters.risk) &&
          (tableFilters.regulated === "all" ||
            (tableFilters.regulated === "yes" ? regulated : !regulated)) &&
          (!tableFilters.victims ||
            String(record.VitimasNM ?? "") === tableFilters.victims)
        );
      }),
    [records, tableFilters],
  );

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleRecords = filteredRecords.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const activeFilterCount = Object.entries(tableFilters).filter(
    ([key, value]) => value && value !== "all" && !(key === "victims" && value === ""),
  ).length;

  const updateTableFilter = <K extends keyof TableFilters>(
    key: K,
    value: TableFilters[K],
  ) => {
    setTableFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  };

  const applyPeriod = (event: FormEvent) => {
    event.preventDefault();
    setPeriod({ ano: yearInput, mes: monthInput });
  };

  return (
    <div className="stack">
      <section className="panel consultation-heading">
        <div>
          <p className="eyebrow">Consulta geral</p>
          <h1>Ocorrências registradas</h1>
          <p className="muted">
            Consulte os atendimentos e abra uma ocorrência para visualizar todos
            os dados disponíveis.
          </p>
        </div>
        <div className="consultation-total" aria-live="polite">
          <ClipboardList size={21} aria-hidden="true" />
          <span>{filteredRecords.length.toLocaleString("pt-BR")}</span>
          <small>ocorrências</small>
        </div>
      </section>

      <section className="panel">
        <form className="consultation-filters" onSubmit={applyPeriod}>
          <div className="field">
            <label htmlFor="consultation-year">Ano</label>
            <input
              id="consultation-year"
              className="input"
              type="number"
              min="2000"
              max="2100"
              required
              value={yearInput}
              onChange={(event) => setYearInput(event.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="consultation-month">Mês</label>
            <select
              id="consultation-month"
              className="input"
              value={monthInput}
              onChange={(event) => setMonthInput(event.target.value)}
            >
              <option value="">Todos os meses</option>
              {months.map((month, index) => (
                <option key={month} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <button className="button button-primary" disabled={loading}>
            {loading ? (
              <LoaderCircle className="consultation-spinner" size={17} />
            ) : (
              <Search size={17} aria-hidden="true" />
            )}
            Consultar período
          </button>
        </form>

        <div className="advanced-filter-heading">
          <div>
            <h2>Filtros dos resultados</h2>
            <p className="muted">Combine quantos filtros precisar.</p>
          </div>
          <button
            type="button"
            className="button button-secondary"
            disabled={!activeFilterCount || loading}
            onClick={() => {
              setTableFilters(emptyTableFilters);
              setPage(1);
            }}
          >
            <FilterX size={17} aria-hidden="true" />
            Limpar filtros
          </button>
        </div>

        <div className="consultation-advanced-filters">
          <div className="field filter-span-2">
            <label htmlFor="filter-general">Busca em todos os campos</label>
            <div className="search-input-wrap">
              <Search size={18} aria-hidden="true" />
              <input
                id="filter-general"
                className="input"
                type="search"
                value={tableFilters.general}
                onChange={(event) =>
                  updateTableFilter("general", event.target.value)
                }
                placeholder="Pesquise qualquer informação da ocorrência"
                disabled={loading}
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="filter-occurrence">Número da ocorrência</label>
            <input
              id="filter-occurrence"
              className="input"
              value={tableFilters.occurrence}
              onChange={(event) =>
                updateTableFilter("occurrence", event.target.value)
              }
              placeholder="Ex.: 2610050148"
              disabled={loading}
            />
          </div>
          <div className="field">
            <label htmlFor="filter-patient">Nome do paciente</label>
            <input
              id="filter-patient"
              className="input"
              value={tableFilters.patient}
              onChange={(event) =>
                updateTableFilter("patient", event.target.value)
              }
              placeholder="Nome ou parte do nome"
              disabled={loading}
            />
          </div>
          <div className="field">
            <label htmlFor="filter-description">Descrição ou queixa</label>
            <input
              id="filter-description"
              className="input"
              value={tableFilters.description}
              onChange={(event) =>
                updateTableFilter("description", event.target.value)
              }
              placeholder="Motivo informado"
              disabled={loading}
            />
          </div>
          <div className="field">
            <label htmlFor="filter-location">Local ou referência</label>
            <input
              id="filter-location"
              className="input"
              value={tableFilters.location}
              onChange={(event) =>
                updateTableFilter("location", event.target.value)
              }
              placeholder="Rua, número ou referência"
              disabled={loading}
            />
          </div>
          <div className="field">
            <label htmlFor="filter-neighborhood">Bairro</label>
            <input
              id="filter-neighborhood"
              className="input"
              value={tableFilters.neighborhood}
              onChange={(event) =>
                updateTableFilter("neighborhood", event.target.value)
              }
              placeholder="Bairro"
              disabled={loading}
            />
          </div>
          <div className="field">
            <label htmlFor="filter-municipality">Código do município</label>
            <input
              id="filter-municipality"
              className="input"
              value={tableFilters.municipality}
              onChange={(event) =>
                updateTableFilter("municipality", event.target.value)
              }
              placeholder="Código IBGE"
              disabled={loading}
            />
          </div>
          <div className="field">
            <label htmlFor="filter-status">Situação</label>
            <select
              id="filter-status"
              className="input"
              value={tableFilters.status}
              onChange={(event) =>
                updateTableFilter(
                  "status",
                  event.target.value as TableFilters["status"],
                )
              }
              disabled={loading}
            >
              <option value="all">Todas</option>
              <option value="open">Em andamento</option>
              <option value="finished">Finalizada</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="filter-risk">Classificação de risco</label>
            <select
              id="filter-risk"
              className="input"
              value={tableFilters.risk}
              onChange={(event) => updateTableFilter("risk", event.target.value)}
              disabled={loading}
            >
              <option value="">Todas</option>
              {riskOptions.map((risk) => (
                <option key={risk} value={risk}>
                  Risco {risk}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="filter-regulated">Regulado</label>
            <select
              id="filter-regulated"
              className="input"
              value={tableFilters.regulated}
              onChange={(event) =>
                updateTableFilter(
                  "regulated",
                  event.target.value as TableFilters["regulated"],
                )
              }
              disabled={loading}
            >
              <option value="all">Todos</option>
              <option value="yes">Sim</option>
              <option value="no">Não</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="filter-victims">Quantidade de vítimas</label>
            <input
              id="filter-victims"
              className="input"
              type="number"
              min="0"
              value={tableFilters.victims}
              onChange={(event) =>
                updateTableFilter("victims", event.target.value)
              }
              placeholder="Qualquer quantidade"
              disabled={loading}
            />
          </div>
        </div>

        {loading ? (
          <div className="consultation-loading" role="status" aria-live="polite">
            <LoaderCircle
              className="consultation-spinner"
              size={38}
              aria-hidden="true"
            />
            <div>
              <strong>Carregando ocorrências...</strong>
              <p>Consultando e organizando os dados do período selecionado.</p>
            </div>
          </div>
        ) : error ? (
          <div className="notice notice-error consultation-error" role="alert">
            <span>{error}</span>
            <button
              className="button button-secondary"
              onClick={() => setRetry((value) => value + 1)}
            >
              <RefreshCw size={16} aria-hidden="true" />
              Tentar novamente
            </button>
          </div>
        ) : visibleRecords.length ? (
          <>
            <div className="table-summary">
              <span>Exibindo</span>
              <strong>{visibleRecords.length}</strong>
              <span>de {filteredRecords.length.toLocaleString("pt-BR")}</span>
              {activeFilterCount > 0 && (
                <span className="table-pill">
                  {activeFilterCount} filtro{activeFilterCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div className="table-scroll">
              <table className="data-table consultation-table">
                <caption className="sr-only">
                  Lista geral de ocorrências do SAMU
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Ocorrência</th>
                    <th scope="col">Data e hora</th>
                    <th scope="col">Descrição</th>
                    <th scope="col">Paciente</th>
                    <th scope="col">Vítimas</th>
                    <th scope="col">Local</th>
                    <th scope="col">Município</th>
                    <th scope="col">Situação</th>
                    <th scope="col">Detalhes</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRecords.map((record) => {
                    const finished = Boolean(record.OcorrenciaFinalDT);
                    return (
                      <tr key={record.OcorrenciaID}>
                        <td>
                          <strong>{record.OcorrenciaID}</strong>
                        </td>
                        <td>{formatDate(record.DtHr)}</td>
                        <td className="consultation-description">
                          {cleanText(
                            record.OcorrenciaApelido || record.QueixaDS,
                          )}
                        </td>
                        <td>{cleanText(record.VitimaNome)}</td>
                        <td>{record.VitimasNM ?? "—"}</td>
                        <td>
                          <span>{cleanText(record.Logradouro)}</span>
                          <small>
                            {[record.Numero?.trim(), record.Bairro?.trim()]
                              .filter(Boolean)
                              .join(" · ") || "Sem complemento"}
                          </small>
                        </td>
                        <td>{cleanText(record.MunicipioID)}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              finished ? "status-finished" : "status-open"
                            }`}
                          >
                            {finished ? "Finalizada" : "Em andamento"}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="button button-secondary details-button"
                            onClick={() => setSelectedRecord(record)}
                            aria-label={`Ver todos os dados da ocorrência ${record.OcorrenciaID}`}
                          >
                            <Eye size={16} aria-hidden="true" />
                            Ver detalhes
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onChange={setPage}
            />
          </>
        ) : (
          <div className="empty-state">
            <ClipboardList size={34} aria-hidden="true" />
            <h2>Nenhuma ocorrência encontrada</h2>
            <p className="muted">
              Ajuste o período ou limpe alguns dos filtros aplicados.
            </p>
          </div>
        )}
      </section>

      {selectedRecord && (
        <Dialog
          title="Detalhes da ocorrência"
          onClose={() => setSelectedRecord(null)}
        >
          <div className="occurrence-hero">
            <div className="occurrence-hero-icon" aria-hidden="true">
              <Ambulance size={28} />
            </div>
            <div className="occurrence-hero-copy">
              <div className="occurrence-hero-meta">
                <span className="occurrence-number">
                  #{selectedRecord.OcorrenciaID}
                </span>
                <span
                  className={`status-badge ${
                    selectedRecord.OcorrenciaFinalDT
                      ? "status-finished"
                      : "status-open"
                  }`}
                >
                  {selectedRecord.OcorrenciaFinalDT
                    ? "Finalizada"
                    : "Em andamento"}
                </span>
              </div>
              <h3>{cleanText(selectedRecord.VitimaNome)}</h3>
              <p>
                {cleanText(
                  selectedRecord.OcorrenciaApelido ||
                    selectedRecord.QueixaDS,
                )}
              </p>
            </div>
          </div>

          <div className="occurrence-quick-facts">
            <div>
              <CalendarClock size={18} aria-hidden="true" />
              <span>Data e hora</span>
              <strong>{formatDate(selectedRecord.DtHr)}</strong>
            </div>
            <div>
              <MapPin size={18} aria-hidden="true" />
              <span>Local</span>
              <strong>{cleanText(selectedRecord.Logradouro)}</strong>
            </div>
            <div>
              <UserRound size={18} aria-hidden="true" />
              <span>Vítimas</span>
              <strong>{selectedRecord.VitimasNM ?? "Não informado"}</strong>
            </div>
            <div>
              <ShieldAlert size={18} aria-hidden="true" />
              <span>Risco</span>
              <strong>{selectedRecord.RISCOCOD ?? "Não informado"}</strong>
            </div>
            <div>
              <Phone size={18} aria-hidden="true" />
              <span>Contato</span>
              <strong>
                {selectedRecord.TelefoneNM
                  ? `(${selectedRecord.TelefoneDDD || "—"}) ${selectedRecord.TelefoneNM}`
                  : "Não informado"}
              </strong>
            </div>
          </div>

          <div className="occurrence-sections">
            {detailSections.map(
              ({ title, description, icon: SectionIcon, fields }) => (
                <section className="occurrence-detail-section" key={title}>
                  <div className="occurrence-section-heading">
                    <span aria-hidden="true">
                      <SectionIcon size={18} />
                    </span>
                    <div>
                      <h3>{title}</h3>
                      <p>{description}</p>
                    </div>
                  </div>
                  <dl className="occurrence-detail-grid">
                    {fields
                      .filter((key) => key in selectedRecord)
                      .map((key) => (
                        <div key={key}>
                          <dt>{fieldLabels[key] || key}</dt>
                          <dd>
                            {formatDetailValue(key, selectedRecord[key])}
                          </dd>
                        </div>
                      ))}
                  </dl>
                </section>
              ),
            )}

            {Object.keys(selectedRecord).some(
              (key) => !mappedDetailFields.has(key),
            ) && (
              <section className="occurrence-detail-section">
                <div className="occurrence-section-heading">
                  <span aria-hidden="true">
                    <FileText size={18} />
                  </span>
                  <div>
                    <h3>Dados adicionais</h3>
                    <p>Outras informações disponíveis neste registro</p>
                  </div>
                </div>
                <dl className="occurrence-detail-grid">
                  {Object.entries(selectedRecord)
                    .filter(([key]) => !mappedDetailFields.has(key))
                    .map(([key, value]) => (
                      <div key={key}>
                        <dt>{fieldLabels[key] || key}</dt>
                        <dd>{formatDetailValue(key, value)}</dd>
                      </div>
                    ))}
                </dl>
              </section>
            )}
          </div>

          <div className="occurrence-modal-footer">
            <span>
              <Activity size={15} aria-hidden="true" /> Dados sincronizados com
              a ocorrência
            </span>
            <button
              type="button"
              className="button button-primary"
              onClick={() => setSelectedRecord(null)}
            >
              Fechar detalhes
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default ConsultasPage;
