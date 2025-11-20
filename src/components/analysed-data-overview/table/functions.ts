import { formatDate } from "date-fns";
import { Workbook } from "exceljs";
import saveAs from "file-saver";
import { TableHeader } from "../../composed/basic-table/basic-table";

export type AnyType = string | number | boolean | object;

export const getElipsis = (text: string, maxLength: number = 53): string | undefined => {
  if (typeof text !== "string" || text.length < maxLength) {
    return text;
  }
  const sliceLength = maxLength - 3;
  return `${text.slice(0, sliceLength)}...`;
};

export const exportTableToExcel = async (
  tableRows: Record<string, AnyType>[],
  sortedDataDisplayHeader: Record<string, AnyType>[],
  mappingValue: string
) => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  const headers: string[] = sortedDataDisplayHeader
    .filter(item => item.active)
    .map(item => item[mappingValue] as string);

  // Add first row (header row)
  worksheet.addRow([
    tableRows[0].sideHeader,
    ...headers.map(item => tableRows[0][item] as string),
    "total"
  ]);

  // Add data rows (skip index 0)
  tableRows.slice(1).forEach(row => {
    if (row.sideHeader !== "Include") {
      const data = headers.map(item => row[item]);
      worksheet.addRow([row.sideHeader, ...data, row.total]);
    }
  });

  // Set all column widths
  worksheet.columns.forEach(column => {
    column.width = 40;
  });

  // Apply formatting to the worksheet
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      const isHeaderRow = rowNumber === 1;
      const isSideOrTotalCol = colNumber === 1 || colNumber === headers.length + 2;

      if (isHeaderRow) {
        cell.font = { bold: true };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "CCCCCC" }
        };
      }
      if (isSideOrTotalCol) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "CCCCCC" }
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

export const exportBasicTableToExcel = async (
  header: TableHeader[],
  data: Record<string, string>[],
  title: string
) => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  // Prepare fullHeader by excluding 'coaData'
  const fullHeader = Object.keys(data[0]).filter(key => key !== "coaData");
  worksheet.addRow([...fullHeader]);

  data.forEach(row => {
    const rowData = fullHeader.map(item => {
      const val = row[item];

      // If it's the 'result' key and object, join by '/'
      if (item === "result" && typeof val === "object") {
        return (val as string[]).join("/");
      }

      // If matching key is column with key 'date', format date
      const dateHeader = header.find(h => h.key === "date");
      if (dateHeader && item === dateHeader.title) {
        return formatDate(val, "dd-MM-yyyy");
      }

      // Ensure primitive, not object
      return typeof val === "object" ? "" : val;
    });

    worksheet.addRow(rowData);
  });

  worksheet.columns.forEach(column => {
    column.width = 24;
  });

  worksheet.eachRow((row, rowNumber) => {
    const isHeader = rowNumber === 1;
    row.eachCell(cell => {
      if (isHeader) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "CCCCCC" }
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
