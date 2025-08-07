import { Workbook } from "exceljs";

// Worker message handler
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

    const columnNames = sheet.getRow(1).values;

    const rows = sheet
      .getSheetValues()
      .slice(2)
      .map((row) =>
        columnNames.reduce((acc, col, index) => {
          acc[col] = row[index] || "";
          return acc;
        }, {})
      );

    self.postMessage({
      glData: rows,
      glHeaders: columnNames.filter(Boolean),
    });
  } catch (err) {
    self.postMessage({ error: err.message || "Unknown error occurred." });
  }
};
