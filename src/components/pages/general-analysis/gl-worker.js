import { Workbook } from "exceljs";

self.onmessage = async (e) => {
  const { buffer } = e.data;

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
        const cell = row[index];
        acc[col] =
          cell && typeof cell === "object" && "result" in cell
            ? cell.result
            : cell ?? "";
        return acc;
      }, {})
    );

  self.postMessage({
    glData: rows,
    glHeaders: columnNames.filter(Boolean),
  });
};
