import axios from "axios";
import {
  AtendimentoMotivo,
  AtendimentoChamadasDiaNoite,
  TempoResposta,
  DestinoPaciente,
  TotalChamadasTelefonicas,
  RegistroObito,
} from "@/@types/types"; // Defina o caminho correto
import { baseURL } from "./api";

export type ApiResponse = {
  ano: string;
  mes: string;
  codMunicipio: string;
  nomeMunicipio: string;
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

export const fetchTotalChamadasTelefonicas = async (): Promise<
  TotalChamadasTelefonicas[]
> => {
  const response = await axios.get(
    `${baseURL}totalChamadasTelefonicas?ano=2024`,
  );
  return response.data;
};

export const fetchObitos = async (): Promise<RegistroObito[]> => {
  const response = await axios.get(
    `${baseURL}obitos?mes=5&ano=2024&codMunicipio=150420&nomeMunicipio=maraba`,
  );
  return response.data;
};
