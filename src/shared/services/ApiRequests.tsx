import api from "./api";
import {
  AtendimentoMotivo,
  AtendimentoChamadasDiaNoite,
  TempoResposta,
  DestinoPaciente,
  TotalChamadasTelefonicas,
  RegistroObito,
  FaixaEtaria,
  SexoAtendimentos,
  TipoAtendimentos,
} from "@/@types/types"; // Defina o caminho correto

export type ApiResponse = {
  ano: string;
  mes: string;
  codMunicipio: string;
  nomeMunicipio: string;
};

const fetchRecords = async <T,>(
  endpoint: string,
  props: ApiResponse,
  signal?: AbortSignal,
): Promise<T[]> => {
  const params = Object.fromEntries(
    Object.entries(props).filter(([, value]) => value.length > 0),
  );
  const response = await api.get<T[]>(endpoint, { params, signal });
  if (!Array.isArray(response.data))
    throw new Error("Resposta da API inválida.");
  return response.data;
};

export const fetchAtendimentoMotivo = (
  props: ApiResponse,
  signal?: AbortSignal,
) => fetchRecords<AtendimentoMotivo>("atendimentoMotivo", props, signal);

export const fetchChamadasDiaNoite = (
  props: ApiResponse,
  signal?: AbortSignal,
) =>
  fetchRecords<AtendimentoChamadasDiaNoite>(
    "atendimentoChamadasDiaNoite",
    props,
    signal,
  );

export const fetchTempoResposta = (props: ApiResponse, signal?: AbortSignal) =>
  fetchRecords<TempoResposta>("tempoResposta", props, signal);

export const fetchDestinoPaciente = (
  props: ApiResponse,
  signal?: AbortSignal,
) => fetchRecords<DestinoPaciente>("destinoPaciente", props, signal);

export const fetchTotalChamadasTelefonicas = (
  props: ApiResponse,
  signal?: AbortSignal,
) =>
  fetchRecords<TotalChamadasTelefonicas>(
    "totalChamadasTelefonicas",
    props,
    signal,
  );

export const fetchFaixaEtaria = (props: ApiResponse, signal?: AbortSignal) =>
  fetchRecords<FaixaEtaria>("atendimentoFaixaEtaria", props, signal);

export const fetchAtendimentosSexo = (
  props: ApiResponse,
  signal?: AbortSignal,
) => fetchRecords<SexoAtendimentos>("atendimentosSexo", props, signal);

export const fetchAtendimentoTipoOcorrencia = (
  props: ApiResponse,
  signal?: AbortSignal,
) => fetchRecords<TipoAtendimentos>("atendimentoTipoOcorrencia", props, signal);

export const fetchObitos = (props: ApiResponse, signal?: AbortSignal) =>
  fetchRecords<RegistroObito>("obitos", props, signal);
