import { Workbook } from "exceljs";
import saveAs from "file-saver";
import { RefObject } from "react";

export type AnyType = string | number | boolean | object;

export const getElipsis = (text: string, maxLength?: number) => {
  return text?.length < (maxLength ?? 53)
    ? text
    : `${text?.slice(0, maxLength ? maxLength - 3 : 48)}...`;
};

export const getValue = (value: string) =>
  value !== "0.00" && value !== "-0.00" ? value : "-";

export const getCellSingleValue = (
  items: Record<string, AnyType>[],
  header: AnyType,
  mappingValue: string,
  valueKey: string
) =>
  getValue(
    items
      .filter((subItem: AnyType) => {
        return (
          subItem["coaData" as keyof typeof subItem]?.[mappingValue] ===
          header[mappingValue as keyof typeof header]
        );
      })
      .reduce(
        (prev: number, acc: Record<string, AnyType>) =>
          prev + Number(acc[valueKey as keyof typeof acc]),
        0
      )
      .toFixed(2)
  );

export const getCellUniqueValues = (value: string) => value;
// String([...new Set(value.split("/"))].filter(Boolean).join("/"));

export const getCellTotalValue = (
  items: Record<string, AnyType>[],
  sortedDataDisplayHeader: Record<string, AnyType>[],
  mappingValue: string,
  valueKey: string
) => {
  return Math.abs(
    items
      .filter((subItem: AnyType) => {
        return sortedDataDisplayHeader
          .filter((item) => item.active)
          .map((item) => item[mappingValue])
          .includes(subItem["coaData" as keyof typeof subItem]?.[mappingValue]);
      })
      .reduce(
        (prev: number, acc: Record<string, AnyType>) =>
          prev + Number(acc[valueKey as keyof typeof acc]),
        0
      )
  ).toFixed(2);
};

export const exportTableToExcel = async (
  tableRef: RefObject<HTMLTableElement | null>,
  sortedDataDisplayHeader: Record<string, AnyType>[]
) => {
  const tableData = (tableRef as RefObject<HTMLTableElement | null>).current;

  if (!tableData) return;

  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  const rows = tableData.querySelectorAll("tr");

  const finalColumnIndex = Array.from(
    rows[Object.keys(sortedDataDisplayHeader[0]).length - 1].querySelectorAll(
      "td"
    )
  )
    .map((cell) => cell?.textContent?.trim())
    .indexOf("Total");

  rows.forEach((row) => {
    const data = Array.from(row.querySelectorAll("td"))
      .map((cell) => cell?.textContent?.trim())
      .slice(0, finalColumnIndex + 1);
    worksheet.addRow(data);
  });

  worksheet.columns.forEach((column, index) => {
    if (index === 0) column.width = 24;
    else column.width = 18;
  });

  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      if (rowNumber < Object.keys(sortedDataDisplayHeader[0]).length) {
        cell.font = { size: 10 };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "CCCCCC" },
        };
      }

      if (colNumber === 1) {
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
