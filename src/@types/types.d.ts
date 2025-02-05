declare module "*.png";
declare module "*.jpg";
declare module "*.mp4";
declare module "*.svg";

// Atendimento por Motivo
export interface AtendimentoMotivo {
  TipoDS: string;
  MotivoDS: string;
  Total_Ocorrencias: number;
}

// Atendimento Chamadas por Período do Dia
export interface AtendimentoChamadasDiaNoite {
  PeriodoDia: string;
  Total_Ocorrencias: number;
}

// Tempo de Resposta
export interface TempoResposta {
  TempoResposta: string;
  Total_Ocorrencias: number;
}

// Destino do Paciente
export interface DestinoPaciente {
  UnidadeDS: string;
  QuantidadeAtendimentos: number;
}
export interface FaixaEtaria {
  faixa_etaria: string;
  Total_Ocorrencias: number;
}

// Total Chamadas Telefônicas
export interface TotalChamadasTelefonicas {
  QuantidadeAtendimentos: number;
}

// Registro de Óbitos
export interface RegistroObito {
  Obito: string;
  QuantidadeObito: number;
}
export interface SexoAtendimentos {
  SexoDS: string;
  Total_Ocorrencias: number;
}
