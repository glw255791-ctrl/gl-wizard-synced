import { readXlsxSheet } from "./read-xlsx";

export async function createWorkbook() {
  const { Workbook } = await import("exceljs");
  return new Workbook();
}

export function readFirstSheet(
  buffer: ArrayBuffer,
  onProgress?: (done: number, total: number) => void
) {
  return readXlsxSheet(buffer, onProgress);
}
