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

    // Get column/header names from the first row
    const columnNames = sheet.getRow(1).values;

    // Build array of row objects using header names as keys
    const rows = sheet
      .getSheetValues()
      .slice(2) // Skip header and first data row (exceljs uses 1-based arrays)
      .map(row =>
        columnNames.reduce((acc, col, idx) => {
          acc[col] = row[idx] || "";
          return acc;
        }, {})
      );

    self.postMessage({
      glData: rows,
      glHeaders: columnNames.filter(Boolean),
    });
  } catch (error) {
    self.postMessage({ error: error.message || "Unknown error occurred." });
  }
};
