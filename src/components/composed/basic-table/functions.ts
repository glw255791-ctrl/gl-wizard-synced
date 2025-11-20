import { formatDate } from "date-fns";
import { Workbook } from "exceljs";
import { TableHeader } from "./basic-table";
import saveAs from "file-saver";

/**
 * Exports the provided table data to an Excel (.xlsx) file.
 *
 * @param header - Array of table header definitions.
 * @param data - Array of row objects keyed by column.
 */
export const exportTableToExcel = async (
  header: TableHeader[],
  data: Record<string, string>[]
) => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  // Exclude "coaData" from exported columns
  const exportHeaders = Object.keys(data[0] || {}).filter(key => key !== "coaData");

  // Add header row
  worksheet.addRow(exportHeaders);

  // Add data rows
  data.forEach(row => {
    const rowData = exportHeaders.map(col => {
      const value = row[col];

      if (col === "result" && typeof value === "object") {
        // Array values for result-column, join with "/"
        return (value as string[]).join("/");
      }

      // Get corresponding header entry for "date" column
      const isDateColumn =
        col === header.find(h => h.key === "date")?.title;

      if (isDateColumn) {
        // Format date values
        return formatDate(value, "dd-MM-yyyy");
      }

      // Return primitive value or empty if object
      return typeof value === "object" ? "" : value;
    });

    worksheet.addRow(rowData);
  });

  // Set column widths
  worksheet.columns.forEach(column => {
    column.width = 24;
  });

  // Style header row (first row)
  worksheet.eachRow((row, rowNumber) => {
    const isHeaderRow = rowNumber === 1;
    if (isHeaderRow) {
      row.eachCell(cell => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "CCCCCC" },
        };
        cell.font = { bold: true };
      });
    }
  });

  // Write and download the Excel file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, "table_data.xlsx");
};
