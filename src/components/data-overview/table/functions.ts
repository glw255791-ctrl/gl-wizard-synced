/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatDate } from "date-fns";
import saveAs from "file-saver";
import { createWorkbook } from "../../../utils/workbook";
export { getElipsis } from "./ellipsis";
import type { TableHeader } from "../../../types";
import { AnyType } from "../../../types";

/**
 * Matches overviewTableData keys from the analysis workers:
 * array results are sorted then joined with "/".
 */
export function toResultPath(result: unknown): string {
  if (Array.isArray(result)) {
    return [...result]
      .map(String)
      .sort((a, b) => a.localeCompare(b))
      .join("/");
  }
  if (result == null) return "";
  return String(result);
}

/**
 * Exports table data to Excel format
 * @param tableRows - Array of table row data
 * @param sortedDataDisplayHeader - Array of sorted display header data
 * @param mappingValue - The mapping value key for filtering headers
 */
function dateCell(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return formatDate(value, "dd-MM-yyyy");
  }
  return typeof value === "object" && value != null ? "" : value;
}

export const exportTableToExcel = async (
  tableRows: Record<string, AnyType>[],
  sortedDataDisplayHeader: Record<string, AnyType>[],
  mappingValue: string,
  onProgress?: (done: number, total: number) => void
) => {
  const total = Math.max(tableRows.length, 1);
  onProgress?.(0, total);
  const workbook = await createWorkbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  const headers: string[] = [
    ...new Set(
      sortedDataDisplayHeader
        .filter((item) => item.active)
        .map((item) => item[mappingValue] as string)
    ),
  ].filter((header) => header !== "total");

  // Add first row (header row)
  worksheet.addRow([
    tableRows[0].sideHeader,
    ...headers.map((item) => tableRows[0][item] as string),
    "total",
  ]);

  for (let index = 1; index < tableRows.length; index += 1) {
    const row = tableRows[index];
    if (row.sideHeader !== "Include") {
      const data = headers.map((item) => row[item]);
      worksheet.addRow([row.sideHeader, ...data, row.total]);
    }
    if (index % 200 === 0) {
      onProgress?.(index, total);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }
  onProgress?.(total, total);

  // Set all column widths
  worksheet.columns.forEach((column) => {
    column.width = 40;
  });

  // Apply formatting to the worksheet
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      const isHeaderRow = rowNumber === 1;
      const isSideOrTotalCol =
        colNumber === 1 || colNumber === headers.length + 2;

      if (isHeaderRow) {
        cell.font = { bold: true };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "CCCCCC" },
        };
      }
      if (isSideOrTotalCol) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "CCCCCC" },
        };
      }
    });
  });

  // Save workbook to file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, "table_data.xlsx");
};

/**
 * Exports basic table data to Excel format
 * @param header - Array of table header definitions
 * @param data - Array of row data objects
 * @param title - Title for the exported file
 */
export const exportBasicTableToExcel = async (
  header: TableHeader[],
  data: Record<string, string>[],
  title: string,
  onProgress?: (done: number, total: number) => void
) => {
  if (!data?.length || !data[0]) {
    throw new Error("No ledger rows found for this line.");
  }

  const total = Math.max(data.length, 1);
  onProgress?.(0, total);
  const workbook = await createWorkbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  // Prepare fullHeader by excluding 'coaData'
  const fullHeader = Object.keys(data[0]).filter((key) => key !== "coaData");
  const coaHeader = Object.keys(data[0].coaData ?? {});
  worksheet.addRow([...fullHeader, ...coaHeader, "reversal"]);

  for (let index = 0; index < data.length; index += 1) {
    const row = data[index];
    const rowData = fullHeader.map((item) => {
      const val = row[item];

      if (item === "result" && typeof val === "object") {
        return (val as string[]).join("/");
      }

      const dateHeader = header.find((h) => h.key === "date");
      if (dateHeader && item === dateHeader.title) {
        return dateCell(val);
      }

      return typeof val === "object" ? "" : val;
    });

    const coaData = coaHeader.map(
      (item) => row.coaData?.[item as keyof typeof row.coaData]
    );
    const reversal = (row as any).reversal;

    worksheet.addRow([...rowData, ...coaData, reversal]);
    if (index % 400 === 0) {
      onProgress?.(index + 1, total);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }
  onProgress?.(total, total);

  worksheet.columns.forEach((column) => {
    column.width = 24;
  });

  worksheet.eachRow((row, rowNumber) => {
    const isHeader = rowNumber === 1;
    row.eachCell((cell) => {
      if (isHeader) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "CCCCCC" },
        };
        cell.font = { bold: true };
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `${title}.xlsx`);
};

/**
 * Excel sheet names must be unique, ≤31 chars, and cannot contain: * ? : \ / [ ]
 */
function toUniqueSheetName(rawTitle: string, used: Set<string>, index: number) {
  const cleaned =
    rawTitle.replace(/[*?:\\/[\]]/g, "-").trim() || `Sheet ${index + 1}`;
  const suffix = ` (${index + 1})`;
  const maxBase = Math.max(1, 31 - suffix.length);
  let candidate = `${cleaned.slice(0, maxBase)}${suffix}`;
  let attempt = 2;
  while (used.has(candidate.toLowerCase())) {
    const altSuffix = ` (${index + 1}-${attempt})`;
    candidate = `${cleaned.slice(0, Math.max(1, 31 - altSuffix.length))}${altSuffix}`;
    attempt += 1;
  }
  used.add(candidate.toLowerCase());
  return candidate;
}

/**
 * Exports multiple tables to a single Excel file with separate sheets
 * @param header - Array of table header definitions
 * @param dataArray - Array of data arrays, one per table
 * @param titles - Array of titles for each table/sheet
 * @param fileName - Name for the exported file (default: "multiple_tables.xlsx")
 */
export const exportMultipleTablesToExcel = async (
  header: TableHeader[],
  dataArray: Record<string, string>[][],
  titles: string[],
  fileName: string = "multiple_tables.xlsx",
  onProgress?: (done: number, total: number) => void
) => {
  const total = Math.max(
    dataArray.reduce((sum, rows) => sum + (rows?.length ?? 0), 0),
    1
  );
  onProgress?.(0, total);
  const workbook = await createWorkbook();
  const usedSheetNames = new Set<string>();

  // Ensure dataArray and titles have the same length
  const minLength = Math.min(dataArray.length, titles.length);
  let written = 0;

  for (let i = 0; i < minLength; i++) {
    const data = dataArray[i];
    const title = titles[i] ?? `Sheet ${i + 1}`;

    // Skip if data is empty
    if (!data || data.length === 0) continue;

    const worksheet = workbook.addWorksheet(
      toUniqueSheetName(title, usedSheetNames, i)
    );

    // Prepare fullHeader by excluding 'coaData'
    const fullHeader = Object.keys(data[0]).filter((key) => key !== "coaData");
    const coaHeader = Object.keys(data[0].coaData ?? {});
    worksheet.addRow([...fullHeader, ...coaHeader, "reversal"]);

    for (let rowIndex = 0; rowIndex < data.length; rowIndex += 1) {
      const row = data[rowIndex];
      const rowData = fullHeader.map((item) => {
        const val = row[item];

        if (item === "result" && typeof val === "object") {
          return (val as string[]).join("/");
        }

        const dateHeader = header.find((h) => h.key === "date");
        if (dateHeader && item === dateHeader.title) {
          return dateCell(val);
        }

        return typeof val === "object" ? "" : val;
      });

      const coaData = coaHeader.map(
        (item) => row.coaData?.[item as keyof typeof row.coaData]
      );
      const reversal = (row as any).reversal;
      worksheet.addRow([...rowData, ...coaData, reversal]);
      written += 1;
      if (written % 400 === 0) {
        onProgress?.(written, total);
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }

    // Set column widths
    worksheet.columns.forEach((column) => {
      column.width = 24;
    });

    // Apply formatting to the worksheet
    worksheet.eachRow((row, rowNumber) => {
      const isHeader = rowNumber === 1;
      row.eachCell((cell) => {
        if (isHeader) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "CCCCCC" },
          };
          cell.font = { bold: true };
        }
      });
    });
  }

  onProgress?.(total, total);
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, fileName);
};
