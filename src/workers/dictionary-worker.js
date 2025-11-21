import { Workbook } from "exceljs";

// The "result" should be the value from the last non-empty column for each row,
// and all previous columns should become inputs.

self.onmessage = async (e) => {
    const { buffer } = e.data;

    try {
        const workbook = new Workbook();
        await workbook.xlsx.load(buffer);
        const sheet = workbook.worksheets[0];

        if (!sheet) {
            self.postMessage({ error: "No sheet found." });
            return;
        }

        // Get all rows starting from row 2 (skip header)
        const allRows = sheet.getSheetValues();
        const dataRows = allRows.slice(2);

        const processedData = dataRows.map((row) => {
            if (!Array.isArray(row)) row = [];
            // ExcelJS sheet.getSheetValues() is 1-based, row[0] is undefined.
            // We'll work from 1 upwards.

            // Find last populated column index
            let lastPopulatedIdx = row.length - 1;
            while (lastPopulatedIdx > 0 && (row[lastPopulatedIdx] === undefined || row[lastPopulatedIdx] === null || row[lastPopulatedIdx] === "")) {
                lastPopulatedIdx--;
            }
            if (lastPopulatedIdx < 2) {
                // Not enough columns to form inputs and result
                return { inputs: [], result: "" };
            }

            // All columns from 1 up to lastPopulatedIdx-1 as inputs
            const inputs = [];
            for (let i = 1; i < lastPopulatedIdx; i++) {
                const cell = row[i];
                const value =
                    cell && typeof cell === "object" && "result" in cell
                        ? cell.result
                        : cell ?? "";
                inputs.push(value);
            }

            // The lastPopulatedIdx column is result
            const lastCell = row[lastPopulatedIdx];
            const result =
                lastCell && typeof lastCell === "object" && "result" in lastCell
                    ? String(lastCell.result)
                    : String(lastCell ?? "");

            return {
                inputs,
                result,
            };
        });

        self.postMessage({
            data: processedData,
        });
    } catch (error) {
        self.postMessage({ error: error.message || "Unknown error occurred." });
    }
};
