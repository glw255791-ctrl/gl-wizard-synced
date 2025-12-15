/**
 * Excel export utility functions
 */

import { excelStyles } from "../constants/theme";

/**
 * Applies standard header row styling to an Excel worksheet
 * @param worksheet - The Excel worksheet to style
 */
export const applyHeaderRowStyle = (worksheet: any): void => {
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell: any) => {
    cell.font = { bold: true };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: excelStyles.headerBg },
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  });
};

/**
 * Applies highlight styling to specific cells
 * @param row - The Excel row instance
 * @param cellIndices - Array of cell indices (1-based) to highlight
 */
export const applyHighlightStyle = (row: any, cellIndices: number[]): void => {
  cellIndices.forEach((index) => {
    row.getCell(index).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: excelStyles.highlightBg },
    };
  });
};

/**
 * Sets column widths for all columns in a worksheet
 * @param worksheet - The Excel worksheet
 * @param width - The width to apply (default: 20)
 */
export const setColumnWidths = (
  worksheet: any,
  width: number = excelStyles.columnWidth
): void => {
  worksheet.columns.forEach((column: any) => {
    column.width = width;
  });
};
