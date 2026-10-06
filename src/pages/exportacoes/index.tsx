import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  Ambulance,
  Building2,
  CheckCircle2,
  Clock3,
  Database,
  Download,
  FileSpreadsheet,
  HeartPulse,
  LoaderCircle,
  MapPin,
  PackageOpen,
  RefreshCw,
  Search,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import api from "@/shared/services/api";
import { cities } from "@/constants/cities";
import { useAuth } from "@/shared/context/AuthContext/AuthProvider";
import { useToast } from "@/shared/context/ToastContext";
import {
  ExcelRecord,
  ExcelSheet,
  exportToExcel,
  exportWorkbookToExcel,
} from "@/utils/exportToExcel";

type DatasetGroup = "Atendimentos" | "Tempos operacionais" | "Desfechos" | "Cadastros";

interface DatasetDefinition {
  id: string;
  title: string;
  description: string;
  path: string;
  sheet: string;
  group: DatasetGroup;
  icon: LucideIcon;
  acceptsFilters?: boolean;
  rootEndpoint?: boolean;
  adminOnly?: boolean;
}

interface ExportProgress {
  completed: number;
  total: number;
  current: string;
}

const datasets: DatasetDefinition[] = [
  { id: "ocorrencias", title: "Ocorrências", description: "Registros completos de ocorrências e vítimas", path: "ocorrencia", sheet: "Ocorrencias", group: "Atendimentos", icon: Ambulance, acceptsFilters: true },
  { id: "tipos", title: "Tipos de ocorrência", description: "Total de atendimentos por classificação", path: "atendimentoTipoOcorrencia", sheet: "Tipos", group: "Atendimentos", icon: Activity, acceptsFilters: true },
  { id: "veiculos", title: "Veículos", description: "Ocorrências agrupadas por veículo", path: "atendimentoVeiculo", sheet: "Veiculos", group: "Atendimentos", icon: Ambulance, acceptsFilters: true },
  { id: "sexo", title: "Atendimentos por sexo", description: "Distribuição registrada por sexo", path: "atendimentosSexo", sheet: "Sexo", group: "Atendimentos", icon: Users, acceptsFilters: true },
  { id: "faixa-etaria", title: "Faixa etária", description: "Atendimentos agrupados por idade", path: "atendimentoFaixaEtaria", sheet: "Faixa etaria", group: "Atendimentos", icon: Users, acceptsFilters: true },
  { id: "motivos", title: "Motivos", description: "Tipos e motivos das chamadas", path: "atendimentoMotivo", sheet: "Motivos", group: "Atendimentos", icon: HeartPulse, acceptsFilters: true },
  { id: "periodo", title: "Período do dia", description: "Chamadas por faixa de horário", path: "atendimentoChamadasDiaNoite", sheet: "Periodo do dia", group: "Atendimentos", icon: Clock3, acceptsFilters: true },
  { id: "chamadas", title: "Total de chamadas", description: "Volume de chamadas telefônicas", path: "totalChamadasTelefonicas", sheet: "Total chamadas", group: "Atendimentos", icon: Activity, acceptsFilters: true },
  { id: "tempo-resposta", title: "Tempo de resposta", description: "Intervalo entre chamado e resposta", path: "tempoResposta", sheet: "Tempo resposta", group: "Tempos operacionais", icon: Clock3, acceptsFilters: true },
  { id: "tempo-local", title: "Tempo no local", description: "Permanência da equipe na ocorrência", path: "tempoDecorridoLocal", sheet: "Tempo no local", group: "Tempos operacionais", icon: Clock3, acceptsFilters: true },
  { id: "tempo-saida", title: "Tempo de saída", description: "Tempo até a saída para atendimento", path: "tempoSaidaLocal", sheet: "Tempo de saida", group: "Tempos operacionais", icon: Clock3, acceptsFilters: true },
  { id: "destinos", title: "Destino dos pacientes", description: "Unidades de destino dos atendimentos", path: "destinoPaciente", sheet: "Destinos", group: "Desfechos", icon: Building2, acceptsFilters: true },
  { id: "transferencias", title: "Transferências", description: "Atendimentos classificados como transferência", path: "transferencias", sheet: "Transferencias", group: "Desfechos", icon: RefreshCw, acceptsFilters: true },
  { id: "obitos", title: "Óbitos", description: "Registros agrupados por causa", path: "obitos", sheet: "Obitos", group: "Desfechos", icon: HeartPulse, acceptsFilters: true },
  { id: "bairros", title: "Atendimentos por bairro", description: "Distribuição territorial das ocorrências", path: "atendimentosPorBairro", sheet: "Bairros", group: "Desfechos", icon: MapPin, acceptsFilters: true },
  { id: "cancelamentos", title: "Cancelamentos", description: "Ocorrências por motivo de cancelamento", path: "cancelamentoAtendimento", sheet: "Cancelamentos", group: "Desfechos", icon: Activity, acceptsFilters: true },
  { id: "pacientes", title: "Pacientes", description: "Cadastro interno de pacientes", path: "/patient", sheet: "Pacientes", group: "Cadastros", icon: Stethoscope, rootEndpoint: true, adminOnly: true },
  { id: "processos", title: "Processos", description: "Processos vinculados aos pacientes", path: "/process", sheet: "Processos", group: "Cadastros", icon: FileSpreadsheet, rootEndpoint: true, adminOnly: true },
  { id: "funcionarios", title: "Funcionários", description: "Cadastro interno de profissionais", path: "/employee", sheet: "Funcionarios", group: "Cadastros", icon: Users, rootEndpoint: true, adminOnly: true },
  { id: "entidades", title: "Entidades", description: "Entidades cadastradas no sistema", path: "/entity", sheet: "Entidades", group: "Cadastros", icon: Building2, rootEndpoint: true, adminOnly: true },
  { id: "pareceres", title: "Pareceres sociais", description: "Pareceres registrados pela equipe", path: "/socialOpinion", sheet: "Pareceres sociais", group: "Cadastros", icon: FileSpreadsheet, rootEndpoint: true, adminOnly: true },
  { id: "usuarios", title: "Usuários", description: "Contas e perfis de acesso", path: "users", sheet: "Usuarios", group: "Cadastros", icon: ShieldCheck, adminOnly: true },
];

const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const groupOrder: DatasetGroup[] = ["Atendimentos", "Tempos operacionais", "Desfechos", "Cadastros"];

const safeFilePart = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase();

const normalizeSearch = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

const ExportacoesPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const currentDate = new Date();
  const [year, setYear] = useState(String(currentDate.getFullYear()));
  const [month, setMonth] = useState(String(currentDate.getMonth() + 1));
  const [selectedCities, setSelectedCities] = useState<string[]>(["MARABA"]);
  const [citySearch, setCitySearch] = useState("");
  const [datasetSearch, setDatasetSearch] = useState("");
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [exportingAll, setExportingAll] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [lastExport, setLastExport] = useState<{ name: string; records: number; at: Date } | null>(null);

  const visibleDatasets = useMemo(
    () => datasets.filter((dataset) => !dataset.adminOnly || user?.role === "admin"),
    [user?.role],
  );
  const filteredDatasets = useMemo(() => {
    const search = normalizeSearch(datasetSearch);
    if (!search) return visibleDatasets;
    return visibleDatasets.filter((dataset) =>
      normalizeSearch([dataset.title, dataset.description, dataset.group, dataset.path].join(" ")).includes(search),
    );
  }, [datasetSearch, visibleDatasets]);
  const years = Array.from({ length: currentDate.getFullYear() - 2012 + 1 }, (_, index) => currentDate.getFullYear() - index);
  const cityParam = selectedCities.join(",");
  const filteredCities = cities.filter((item) => item.includes(citySearch.trim().toUpperCase()));

  const toggleCity = (city: string) => {
    setSelectedCities((current) =>
      current.includes(city)
        ? current.filter((item) => item !== city)
        : [...current, city],
    );
  };

  const fetchDataset = async (dataset: DatasetDefinition) => {
    const params = dataset.acceptsFilters
      ? Object.fromEntries(Object.entries({ ano: year, mes: month, nomeMunicipio: cityParam }).filter(([, value]) => value))
      : undefined;
    const response = await api.get<ExcelRecord[]>(dataset.path, {
      params,
      timeout: dataset.rootEndpoint ? 60000 : 180000,
      ...(dataset.rootEndpoint ? { baseURL: "http://localhost:3000" } : {}),
    });
    if (!Array.isArray(response.data)) throw new Error("Resposta inválida");
    return response.data;
  };

  const exportDataset = async (dataset: DatasetDefinition) => {
    setLoadingIds((current) => new Set(current).add(dataset.id));
    try {
      const data = await fetchDataset(dataset);
      const citiesFilePart = selectedCities.length === 1 ? safeFilePart(selectedCities[0]) : `${selectedCities.length}-municipios`;
      const period = [year, month && month.padStart(2, "0"), selectedCities.length && citiesFilePart].filter(Boolean).join("-");
      exportToExcel(data, `${safeFilePart(dataset.title)}-${period || "todos"}.xlsx`, dataset.sheet);
      setLastExport({ name: dataset.title, records: data.length, at: new Date() });
      addToast({ type: "success", message: `${dataset.title}: ${data.length.toLocaleString("pt-BR")} registros exportados.` });
    } catch (error) {
      const detail = error instanceof Error ? ` ${error.message}` : "";
      addToast({ type: "error", message: `Não foi possível exportar ${dataset.title}.${detail}` });
    } finally {
      setLoadingIds((current) => {
        const next = new Set(current);
        next.delete(dataset.id);
        return next;
      });
    }
  };

  const exportAll = async () => {
    if (!filteredDatasets.length) {
      addToast({ type: "error", message: "Nenhum tipo de dado corresponde à pesquisa." });
      return;
    }
    const targetDatasets = filteredDatasets;
    setExportingAll(true);
    setExportProgress({ completed: 0, total: targetDatasets.length, current: "Preparando consultas" });
    try {
      const results: PromiseSettledResult<{ dataset: DatasetDefinition; data: ExcelRecord[] }>[] = [];
      let completedQueries = 0;
      for (let index = 0; index < targetDatasets.length; index += 3) {
        const batch = targetDatasets.slice(index, index + 3);
        setExportProgress({
          completed: completedQueries,
          total: targetDatasets.length,
          current: batch.map((dataset) => dataset.title).join(", "),
        });
        const batchResults = await Promise.allSettled(
          batch.map(async (dataset) => ({ dataset, data: await fetchDataset(dataset) })),
        );
        results.push(...batchResults);
        completedQueries += batch.length;
        setExportProgress({ completed: completedQueries, total: targetDatasets.length, current: "Montando o arquivo Excel" });
      }

      const sheets: ExcelSheet[] = [];
      const summary: ExcelRecord[] = results.map((result, index) => {
        const dataset = targetDatasets[index];
        if (result.status === "fulfilled") {
          sheets.push({ name: dataset.sheet, data: result.value.data });
          return {
            Conjunto: dataset.title,
            Grupo: dataset.group,
            Endpoint: dataset.path,
            Status: "Exportado",
            Registros: result.value.data.length,
            Detalhes: "",
          };
        }
        return {
          Conjunto: dataset.title,
          Grupo: dataset.group,
          Endpoint: dataset.path,
          Status: "Falha na consulta",
          Registros: 0,
          Detalhes: result.reason instanceof Error ? result.reason.message : "Erro não identificado",
        };
      });
      const completed = results.filter((result) => result.status === "fulfilled").length;
      if (sheets.length) {
        const filters: ExcelRecord[] = [{
          "Ano selecionado": year || "Todos",
          "Mês selecionado": month ? months[Number(month) - 1] : "Todos",
          "Municípios selecionados": selectedCities.length ? selectedCities.join(", ") : "Todos",
          "Tipo de dado pesquisado": datasetSearch.trim() || "Todos",
          "Gerado em": new Date(),
        }];
        exportWorkbookToExcel(
          [{ name: "Filtros", data: filters }, { name: "Resumo", data: summary }, ...sheets],
          `samu-exportacao-completa-${year || "todos"}-${month || "todos"}-${selectedCities.length === 1 ? safeFilePart(selectedCities[0]) : `${selectedCities.length || "todos"}-municipios`}.xlsx`,
        );
        const records = results.reduce((total, result) => total + (result.status === "fulfilled" ? result.value.data.length : 0), 0);
        setLastExport({ name: datasetSearch.trim() ? "Resultados filtrados" : "Pacote completo", records, at: new Date() });
        addToast({ type: completed === targetDatasets.length ? "success" : "error", message: `${completed} de ${targetDatasets.length} conjuntos incluídos no arquivo.` });
      } else {
        addToast({ type: "error", message: "Nenhum endpoint respondeu. O arquivo não foi gerado." });
      }
    } catch (error) {
      const detail = error instanceof Error ? ` ${error.message}` : "";
      addToast({ type: "error", message: `Não foi possível montar o pacote completo.${detail}` });
    } finally {
      setExportingAll(false);
      setExportProgress(null);
    }
  };

  return (
    <div className="stack exports-page">
      <section className="exports-hero">
        <div className="exports-hero-copy">
          <span className="exports-hero-icon"><FileSpreadsheet size={27} /></span>
          <div><p className="eyebrow">Dados e relatórios</p><h2>Central de exportações</h2><p>Baixe cada conjunto separadamente ou gere um arquivo Excel consolidado, com uma aba para cada endpoint.</p></div>
        </div>
        <button type="button" className="button exports-all-button" onClick={exportAll} disabled={exportingAll || !filteredDatasets.length}>
          {exportingAll ? <LoaderCircle className="consultation-spinner" size={18} /> : <PackageOpen size={18} />}
          {exportingAll ? "Consultando endpoints..." : datasetSearch.trim() ? `Exportar resultados (${filteredDatasets.length})` : "Exportar pacote completo"}
        </button>
      </section>

      {exportProgress && (
        <section className="exports-progress" role="status" aria-live="polite">
          <div className="exports-progress-copy">
            <LoaderCircle className="consultation-spinner" size={18} />
            <div>
              <strong>{exportProgress.completed} de {exportProgress.total} consultas concluídas</strong>
              <span>{exportProgress.current}</span>
            </div>
          </div>
          <div
            className="exports-progress-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={exportProgress.total}
            aria-valuenow={exportProgress.completed}
          >
            <i style={{ width: `${(exportProgress.completed / exportProgress.total) * 100}%` }} />
          </div>
          <p><AlertCircle size={14} /> Consultas operacionais podem levar alguns minutos. Não feche esta página.</p>
        </section>
      )}

      <section className="panel exports-filter-panel">
        <div className="exports-filter-heading"><div><p className="eyebrow">Período dos dados</p><h2>Filtros da exportação</h2></div><span><Database size={15} /> Aplicados aos indicadores e ocorrências</span></div>
        <div className="exports-filters">
          <label className="field">
            <span>Tipo de dado</span>
            <div className="export-dataset-search">
              <Search size={16} />
              <input
                className="input"
                type="search"
                value={datasetSearch}
                disabled={exportingAll}
                onChange={(event) => setDatasetSearch(event.target.value)}
                placeholder="Ex.: ocorrências, veículos, pacientes"
                aria-label="Pesquisar tipo de dado para exportar"
              />
            </div>
          </label>
          <label className="field export-city-field">
            <span>Municípios</span>
            <details className="export-city-select">
              <summary aria-disabled={exportingAll} onClick={(event) => exportingAll && event.preventDefault()}>
                <span>{selectedCities.length ? `${selectedCities.length} selecionado${selectedCities.length === 1 ? "" : "s"}` : "Todos os municípios"}</span>
                <small>{selectedCities.length ? selectedCities.join(", ") : "Sem restrição"}</small>
              </summary>
              <div className="export-city-popover">
                <div className="export-city-search"><Search size={15} /><input value={citySearch} disabled={exportingAll} onChange={(event) => setCitySearch(event.target.value)} placeholder="Buscar município" /></div>
                <div className="export-city-actions">
                  <button type="button" disabled={exportingAll} onClick={() => setSelectedCities([...cities])}>Selecionar todos</button>
                  <button type="button" disabled={exportingAll} onClick={() => setSelectedCities([])}>Limpar</button>
                </div>
                <div className="export-city-options">
                  {filteredCities.map((item) => <label key={item}>
                    <input type="checkbox" checked={selectedCities.includes(item)} disabled={exportingAll} onChange={() => toggleCity(item)} />
                    <span>{item}</span>
                  </label>)}
                </div>
              </div>
            </details>
          </label>
          <label className="field"><span>Ano</span><select className="input" value={year} disabled={exportingAll} onChange={(event) => setYear(event.target.value)}><option value="">Todos os anos</option>{years.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
          <label className="field"><span>Mês</span><select className="input" value={month} disabled={exportingAll} onChange={(event) => setMonth(event.target.value)}><option value="">Todos os meses</option>{months.map((item, index) => <option value={index + 1} key={item}>{item}</option>)}</select></label>
        </div>
      </section>

      {lastExport && <section className="exports-last" role="status"><CheckCircle2 size={18} /><span><strong>{lastExport.name}</strong> exportado com {lastExport.records.toLocaleString("pt-BR")} registros</span><time>{lastExport.at.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</time></section>}

      {datasetSearch.trim() && <p className="exports-search-summary" role="status">{filteredDatasets.length} de {visibleDatasets.length} tipos de dados encontrados para “{datasetSearch.trim()}”.</p>}

      {!filteredDatasets.length && <section className="exports-empty"><Search size={24} /><h2>Nenhum tipo de dado encontrado</h2><p>Tente pesquisar por outro nome, descrição ou categoria.</p><button type="button" onClick={() => setDatasetSearch("")}>Limpar pesquisa</button></section>}

      {groupOrder.map((group) => {
        const groupDatasets = filteredDatasets.filter((dataset) => dataset.group === group);
        if (!groupDatasets.length) return null;
        return <section className="exports-group" key={group}>
          <div className="exports-group-heading"><div><h2>{group}</h2><p>{group === "Cadastros" ? "Dados administrativos disponíveis para o perfil atual." : "Os filtros de período e município serão aplicados a estes dados."}</p></div><span>{groupDatasets.length} conjunto{groupDatasets.length === 1 ? "" : "s"}</span></div>
          <div className="exports-grid">{groupDatasets.map((dataset) => {
            const Icon = dataset.icon;
            const loading = loadingIds.has(dataset.id);
            return <article className="export-card" key={dataset.id}>
              <div className="export-card-top"><span className="export-card-icon"><Icon size={20} /></span><span className="export-format">XLSX</span></div>
              <div><h3>{dataset.title}</h3><p>{dataset.description}</p></div>
              <div className="export-card-footer"><span><Database size={13} /> {dataset.path}</span><button type="button" onClick={() => exportDataset(dataset)} disabled={loading || exportingAll} aria-label={`Exportar ${dataset.title}`}>
                {loading ? <LoaderCircle className="consultation-spinner" size={16} /> : <Download size={16} />} Exportar
              </button></div>
            </article>;
          })}</div>
        </section>;
      })}
    </div>
  );
};

export default ExportacoesPage;
