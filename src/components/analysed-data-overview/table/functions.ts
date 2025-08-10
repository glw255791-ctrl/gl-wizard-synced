import { Workbook } from "exceljs";
import saveAs from "file-saver";

export type AnyType = string | number | boolean | object;

export const getElipsis = (text: string, maxLength?: number) => {
  return typeof text !== "string" || text?.length < (maxLength ?? 53)
    ? text
    : `${text?.slice(0, maxLength ? maxLength - 3 : 48)}...`;
};

export const exportTableToExcel = async (
  tableRows: Record<string, AnyType>[],
  sortedDataDisplayHeader: Record<string, AnyType>[],
  mappingValue: string
) => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  const rows = tableRows;
  const headers: string[] = sortedDataDisplayHeader
    .filter((item) => item.active)
    .map((item) => item[mappingValue] as string);

  worksheet.addRow([
    rows[0].sideHeader,
    ...headers.map((item) => rows[0][item] as string),
    "total",
  ]);
  rows.slice(1).forEach((row) => {
    const data = headers.map((item) => {
      return row[item];
    });
    if (row.sideHeader !== "Include")
      worksheet.addRow([row.sideHeader, ...data, row.total]);
  });

  worksheet.columns.forEach((column) => {
    column.width = 40;
  });

  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      if (rowNumber === 1) {
        cell.font = { bold: true };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "CCCCCC" },
        };
      }

      if (colNumber === 1 || colNumber === headers.length + 2) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "CCCCCC" },
        };
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, "table_data.xlsx");
};
