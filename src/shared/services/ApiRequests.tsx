import axios from "axios";
import {
  AtendimentoMotivo,
  AtendimentoChamadasDiaNoite,
  TempoResposta,
  DestinoPaciente,
  TotalChamadasTelefonicas,
  RegistroObito,
  FaixaEtaria,
  SexoAtendimentos,
} from "@/@types/types"; // Defina o caminho correto
import { baseURL } from "./api";

export type ApiResponse = {
  ano: string;
  mes: string;
  codMunicipio: string;
  nomeMunicipio: string;
};

const Query = (props: ApiResponse): string => {
  const queryprops = [];
  if (props.ano.length > 0) queryprops.push(`ano=${props.ano}`);
  if (props.mes.length > 0) queryprops.push(`mes=${props.mes}`);
  if (props.nomeMunicipio.length > 0)
    queryprops.push(`nomeMunicipio=${props.nomeMunicipio}`);
  if (props.codMunicipio.length > 0)
    queryprops.push(`codMunicipio=${props.codMunicipio}`);
  return queryprops.join("&");
};

export const fetchAtendimentoMotivo = async (
  props: ApiResponse,
): Promise<AtendimentoMotivo[]> => {
  const response = await axios.get(
    `${baseURL}atendimentoMotivo?mes=5&ano=2024&tipo=PEDIATRICO&nomeMunicipio=MARABA&codMunicipio=150420`,
  );
  return response.data;
};

export const fetchChamadasDiaNoite = async (): Promise<
  AtendimentoChamadasDiaNoite[]
> => {
  const response = await axios.get(
    `${baseURL}atendimentoChamadasDiaNoite?mes=5&ano=2024&nomeMunicipio=MARABA&codMunicipio=150420`,
  );
  return response.data;
};

export const fetchTempoResposta = async (): Promise<TempoResposta[]> => {
  const response = await axios.get(
    `${baseURL}tempoResposta?mes=5&ano=2024&nomeMunicipio=maraba`,
  );
  return response.data;
};

export const fetchDestinoPaciente = async (): Promise<DestinoPaciente[]> => {
  const response = await axios.get(
    `${baseURL}destinoPaciente?mes=5&ano=2024&nomeMunicipio=maraba`,
  );
  return response.data;
};

export const fetchTotalChamadasTelefonicas = async (
  props: ApiResponse,
): Promise<TotalChamadasTelefonicas[]> => {
  console.log(props);
  const response = await axios.get(
    `${baseURL}totalChamadasTelefonicas?${Query(props)}`,
  );
  return response.data;
};
export const fetchFaixaEtaria = async (
  props: ApiResponse,
): Promise<FaixaEtaria[]> => {
  console.log(props);
  const response = await axios.get(
    `${baseURL}atendimentoFaixaEtaria?${Query(props)}`,
  );
  return response.data;
};
export const fetchAtendimentosSexo = async (
  props: ApiResponse,
): Promise<SexoAtendimentos[]> => {
  console.log(props);
  const response = await axios.get(
    `${baseURL}atendimentosSexo?${Query(props)}`,
  );
  return response.data;
};

export const fetchObitos = async (): Promise<RegistroObito[]> => {
  const response = await axios.get(
    `${baseURL}obitos?mes=5&ano=2024&codMunicipio=150420&nomeMunicipio=maraba`,
  );
  return response.data;
};
