import { Workbook } from "exceljs";

self.onmessage = async (event) => {
  const { buffer } = event.data;

  try {
    const workbook = new Workbook();
    await workbook.xlsx.load(buffer);

    const sheet = workbook.worksheets[0];
    if (!sheet) {
      self.postMessage({ error: "No sheet found." });
      return;
    }

    // Get header/column names from the first row
    const columnNames = sheet.getRow(1).values;

    // Extract all data rows (skip header and use 1-based indexing)
    const rows = sheet
      .getSheetValues()
      .slice(2)
      .map((row) => {
        return columnNames.reduce((acc, col, idx) => {
          const cell = row[idx];
          acc[col] =
            cell && typeof cell === "object" && "result" in cell
              ? cell.result
              : cell ?? "";
          return acc;
        }, {});
      });

    self.postMessage({
      glData: rows,
      glHeaders: columnNames.filter(Boolean),
    });
  } catch (err) {
    console.error(err);
    self.postMessage({ error: err?.message || "Unknown error" });
  }
};
