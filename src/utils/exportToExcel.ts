import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export type ExcelRecord = Record<string, unknown>;

export interface ExcelSheet {
  name: string;
  data: object[];
}

const headerLabels: Record<string, string> = {
  _id: "Código",
  userName: "Usuário",
  role: "Perfil",
  OcorrenciaID: "Número da ocorrência",
  DtHr: "Data e hora",
  RegistroDT: "Data de registro",
  OcorrenciaFinalDT: "Data de finalização",
  Total_Ocorrencias: "Total de ocorrências",
  QuantidadeAtendimentos: "Quantidade de atendimentos",
  QuantidadeObito: "Quantidade de óbitos",
  TipoDS: "Tipo de ocorrência",
  MotivoDS: "Motivo",
  VeiculoDS: "Veículo",
  SexoDS: "Sexo",
  UnidadeDS: "Unidade de destino",
  CancelDS: "Motivo do cancelamento",
  PeriodoDia: "Período do dia",
  faixa_etaria: "Faixa etária",
};

const humanizeHeader = (key: string) =>
  headerLabels[key] ||
  key
    .replace(/_/g, " ")
    .replace(/([a-zá-ú])([A-Z])/g, "$1 $2")
    .replace(/^./, (letter) => letter.toUpperCase());

const normalizeValue = (value: unknown) => {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value) || typeof value === "object") {
    if (value instanceof Date) return value;
    return JSON.stringify(value);
  }
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(trimmed)) {
    const date = new Date(trimmed);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return trimmed;
};

const normalizeRows = (data: object[]) =>
  data.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => [
        humanizeHeader(key),
        normalizeValue(value),
      ]),
    ),
  );

const safeSheetName = (name: string, used: Set<string>) => {
  const base = name.replace(/[\\/?*\[\]:]/g, " ").trim().slice(0, 31) || "Dados";
  let candidate = base;
  let suffix = 2;
  while (used.has(candidate)) {
    const marker = ` ${suffix++}`;
    candidate = `${base.slice(0, 31 - marker.length)}${marker}`;
  }
  used.add(candidate);
  return candidate;
};

const createWorksheet = (data: object[]) => {
  const normalized = normalizeRows(data);
  const worksheet = XLSX.utils.json_to_sheet(
    normalized.length ? normalized : [{ Informação: "Nenhum registro encontrado" }],
    { cellDates: true, dateNF: "dd/mm/yyyy hh:mm" },
  );
  const headers = normalized.length
    ? Array.from(new Set(normalized.flatMap((row) => Object.keys(row))))
    : ["Informação"];
  worksheet["!cols"] = headers.map((header) => {
    const columnValues = normalized.map((row) => row[header]);
    if (columnValues.some((value) => value instanceof Date)) return { wch: 21 };
    const values = columnValues.map((value) => String(value ?? ""));
    return { wch: Math.min(55, Math.max(12, header.length + 2, ...values.map((value) => value.length + 2))) };
  });
  if (worksheet["!ref"]) {
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    worksheet["!autofilter"] = { ref: XLSX.utils.encode_range({ s: range.s, e: { r: range.s.r, c: range.e.c } }) };
  }
  return worksheet;
};

export function exportWorkbookToExcel(sheets: ExcelSheet[], fileName = "dados.xlsx") {
  const workbook = XLSX.utils.book_new();
  workbook.Props = {
    Title: fileName.replace(/\.xlsx$/i, ""),
    Subject: "Exportação de dados do SAMU",
    Author: "SAMU",
    CreatedDate: new Date(),
  };
  const usedNames = new Set<string>();
  sheets.forEach((sheet) => {
    XLSX.utils.book_append_sheet(
      workbook,
      createWorksheet(sheet.data),
      safeSheetName(sheet.name, usedNames),
    );
  });
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
    cellDates: true,
  });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`);
}

export function exportToExcel(
  data: object[],
  fileName = "dados.xlsx",
  sheetName = "Dados",
) {
  exportWorkbookToExcel([{ name: sheetName, data }], fileName);
}
