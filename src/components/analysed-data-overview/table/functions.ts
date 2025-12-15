/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatDate } from "date-fns";
import { Workbook } from "exceljs";
import saveAs from "file-saver";
import { TableHeader } from "../../composed/basic-table/basic-table";
import { AnyType } from "../../../types";

/**
 * Truncates text to a maximum length and adds ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation (default: 53)
 * @returns Truncated text with ellipsis or original text if within limit
 */
export const getElipsis = (
  text: string,
  maxLength: number = 53
): string | undefined => {
  if (typeof text !== "string" || text.length < maxLength) {
    return text;
  }
  const sliceLength = maxLength - 3;
  return `${text.slice(0, sliceLength)}...`;
};

/**
 * Exports table data to Excel format
 * @param tableRows - Array of table row data
 * @param sortedDataDisplayHeader - Array of sorted display header data
 * @param mappingValue - The mapping value key for filtering headers
 */
export const exportTableToExcel = async (
  tableRows: Record<string, AnyType>[],
  sortedDataDisplayHeader: Record<string, AnyType>[],
  mappingValue: string
) => {
  const workbook = new Workbook();
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

  // Add data rows (skip index 0)
  tableRows.slice(1).forEach((row) => {
    if (row.sideHeader !== "Include") {
      const data = headers.map((item) => row[item]);
      worksheet.addRow([row.sideHeader, ...data, row.total]);
    }
  });

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
  title: string
) => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  // Prepare fullHeader by excluding 'coaData'
  const fullHeader = Object.keys(data[0]).filter((key) => key !== "coaData");
  const coaHeader = Object.keys(data[0].coaData);
  worksheet.addRow([...fullHeader, ...coaHeader, "reversal"]);

  data.forEach((row) => {
    const rowData = fullHeader.map((item) => {
      const val = row[item];

      // If it's the 'result' key and object, join by '/'
      if (item === "result" && typeof val === "object") {
        return (val as string[]).join("/");
      }

      // If matching key is column with key 'date', format date
      const dateHeader = header.find((h) => h.key === "date");
      if (dateHeader && item === dateHeader.title) {
        return formatDate(val, "dd-MM-yyyy");
      }

      // Ensure primitive, not object
      return typeof val === "object" ? "" : val;
    });

    // Fix typing issue: Use keyof typeof row.coaData to avoid implicit 'any'
    const coaData = coaHeader.map(
      (item) => row.coaData?.[item as keyof typeof row.coaData]
    );
    const reversal = (row as any).reversal;

    worksheet.addRow([...rowData, ...coaData, reversal]);
  });

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
  fileName: string = "multiple_tables.xlsx"
) => {
  const workbook = new Workbook();

  const formattedTitles = titles.map((title) =>
    // eslint-disable-next-line no-useless-escape
    title.replace(/[*?:\\/\[\]]/g, "-")
  );

  // Ensure dataArray and titles have the same length
  const minLength = Math.min(dataArray.length, titles.length);

  for (let i = 0; i < minLength; i++) {
    const data = dataArray[i];
    const title = formattedTitles[i];

    // Skip if data is empty
    if (!data || data.length === 0) continue;

    // Create a new worksheet with the title (Excel sheet names have a 31 character limit)
    const sheetName = title.length > 31 ? title.substring(0, 31) : title;
    const worksheet = workbook.addWorksheet(sheetName);

    // Prepare fullHeader by excluding 'coaData'
    const fullHeader = Object.keys(data[0]).filter((key) => key !== "coaData");
    const coaHeader = Object.keys(data[0].coaData);
    worksheet.addRow([...fullHeader, ...coaHeader, "reversal"]);

    data.forEach((row) => {
      const rowData = fullHeader.map((item) => {
        const val = row[item];

        // If it's the 'result' key and object, join by '/'
        if (item === "result" && typeof val === "object") {
          return (val as string[]).join("/");
        }

        // If matching key is column with key 'date', format date
        const dateHeader = header.find((h) => h.key === "date");
        if (dateHeader && item === dateHeader.title) {
          return formatDate(val, "dd-MM-yyyy");
        }

        // Ensure primitive, not object
        return typeof val === "object" ? "" : val;
      });

      const coaData = coaHeader.map(
        (item) => row.coaData?.[item as keyof typeof row.coaData]
      );
      const reversal = (row as any).reversal;
      worksheet.addRow([...rowData, ...coaData, reversal]);
    });

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

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, fileName);
};
