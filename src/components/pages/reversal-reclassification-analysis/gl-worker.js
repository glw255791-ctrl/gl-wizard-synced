import { Workbook } from "exceljs";

function readSheet(sheet) {
  const headerRow = sheet.getRow(1).values;
  const columnNames = Array.isArray(headerRow) ? headerRow : [];

  const rows = sheet
    .getSheetValues()
    .slice(2)
    .filter((row) => Array.isArray(row))
    .map((row) =>
      columnNames.reduce((acc, col, index) => {
        if (!col) return acc;
        const cell = row[index];
        acc[col] =
          cell && typeof cell === "object" && "result" in cell
            ? cell.result
            : cell ?? "";
        return acc;
      }, {})
    );

  return {
    glData: rows,
    glHeaders: columnNames.filter(Boolean),
  };
}

self.onmessage = async (event) => {
  try {
    const { buffer } = event.data;
    const workbook = new Workbook();
    await workbook.xlsx.load(buffer);
    const sheet = workbook.worksheets[0];

    if (!sheet) {
      self.postMessage({ error: "No sheet found in that file." });
      return;
    }

    const result = readSheet(sheet);
    if (!result.glHeaders.length) {
      self.postMessage({ error: "No column names found in the first row." });
      return;
    }

    self.postMessage(result);
  } catch (error) {
    self.postMessage({
      error: error?.message || "Could not read that spreadsheet.",
    });
  }
};
