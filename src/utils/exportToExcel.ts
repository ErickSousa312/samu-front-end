import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportToExcel(data, fileName = "data.xlsx") {
  // Converte os dados para uma planilha
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  // Adiciona a planilha ao workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Gera o arquivo Excel
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  // Salva o arquivo
  const blob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(blob, fileName);
}
