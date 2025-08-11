import { formatDate } from "date-fns";
import { Workbook } from "exceljs";
import { TableHeader } from "./basic-table";
import saveAs from "file-saver";

export const exportTableToExcel = async (
  header: TableHeader[],
  data: Record<string, string>[]
) => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  const fullHeader = Object.keys(data[0]).filter((item) => item !== "coaData");
  worksheet.addRow(fullHeader.map((item) => item));

  data.forEach((row) => {
    const rowData = fullHeader.map((item) => {
      const val = row[item];

      const formattedVal =
        item === "result" && typeof val === "object"
          ? (val as string[]).join("/")
          : item === header.find((it) => it.key === "date")?.title
          ? formatDate(val, "dd-MM-yyyy")
          : val;

      return typeof formattedVal === "object" ? "" : formattedVal;
    });

    worksheet.addRow(rowData);
  });

  worksheet.columns.forEach((column) => {
    column.width = 24;
  });

  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      const isHeader = rowNumber === 1;

      if (isHeader) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "CCCCCC" },
        };
      }

      if (isHeader) {
        cell.font = { bold: true };
      }
    });
  });
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, "table_data.xlsx");
};
