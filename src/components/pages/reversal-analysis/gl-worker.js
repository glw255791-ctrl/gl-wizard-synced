import { Workbook } from "exceljs";

console.log("[GL Worker] Worker script loaded");

self.onmessage = async (event) => {
  console.log("[GL Worker] Message received", {
    hasBuffer: !!event.data?.buffer,
    bufferType: event.data?.buffer?.constructor?.name,
    bufferSize: event.data?.buffer?.byteLength,
  });

  try {
    const { buffer } = event.data;

    if (!buffer) {
      console.error("[GL Worker] No buffer provided in event data");
      self.postMessage({ error: "No buffer provided." });
      return;
    }

    console.log("[GL Worker] Creating workbook...");
    const workbook = new Workbook();
    
    console.log("[GL Worker] Loading Excel file from buffer...");
    await workbook.xlsx.load(buffer);
    console.log("[GL Worker] Excel file loaded successfully");

    const sheet = workbook.worksheets[0];
    console.log("[GL Worker] Sheet info", {
      hasSheet: !!sheet,
      sheetName: sheet?.name,
      totalSheets: workbook.worksheets.length,
    });

    if (!sheet) {
      console.error("[GL Worker] No sheet found in workbook");
      self.postMessage({ error: "No sheet found." });
      return;
    }

    console.log("[GL Worker] Getting column names from first row...");
    const columnNames = sheet.getRow(1).values;
    console.log("[GL Worker] Column names", {
      count: columnNames?.length,
      names: columnNames?.filter(Boolean),
    });

    console.log("[GL Worker] Processing rows...");
    const allValues = sheet.getSheetValues();
    console.log("[GL Worker] Total rows in sheet", allValues?.length);

    const rows = sheet
      .getSheetValues()
      .slice(2) // Skip header and first data row (exceljs uses 1-based arrays)
      .map((row) => {
        return columnNames.reduce((acc, col, index) => {
          const cell = row[index];
          acc[col] =
            cell && typeof cell === "object" && "result" in cell
              ? cell.result
              : cell ?? "";
          return acc;
        }, {});
      });

    console.log("[GL Worker] Processing complete", {
      rowsProcessed: rows.length,
      headersCount: columnNames.filter(Boolean).length,
    });

    console.log("[GL Worker] Sending response...");
    self.postMessage({
      glData: rows,
      glHeaders: columnNames.filter(Boolean),
    });
    console.log("[GL Worker] Response sent successfully");
  } catch (error) {
    console.error("[GL Worker] Error occurred:", error);
    console.error("[GL Worker] Error details:", {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    });
    self.postMessage({ 
      error: error?.message || "Unknown error occurred while processing file." 
    });
  }
};

console.log("[GL Worker] Worker setup complete, waiting for messages...");
