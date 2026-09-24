import type { Worksheet } from "exceljs";
import { createWorkbook } from "../../../utils/workbook";
import { saveAs } from "file-saver";
import type { Node } from "./process-modal-funcs";
import { ROW_COLORS } from "./process-modal-funcs";

const getRowColor = (level: number): string => {
  return ROW_COLORS[level % ROW_COLORS.length];
};

const hslToHex = (hslString: string): string => {
  const match = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return hslString;

  const h = parseInt(match[1]) / 360;
  const s = parseInt(match[2]) / 100;
  const l = parseInt(match[3]) / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

const getColorByIndex = (index: number): string => {
  const color = getRowColor(index);
  if (color.startsWith("hsl")) return hslToHex(color);
  return color;
};

const fillColumn = (
  ws: Worksheet,
  startRow: number,
  endRow: number,
  startCol: number,
  endCol: number,
  rows: { sideHeader: string; total: any }[] = [],
  bgColor: string = "#e6e6e6",
  title?: string
) => {
  if (title) {
    ws.mergeCells(startRow, startCol, startRow, endCol);
    const titleCell = ws.getCell(startRow, startCol);
    titleCell.value = title;
    titleCell.font = { bold: true };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };
  }

  for (let r = startRow; r <= endRow; r++) {
    for (let c = startCol; c <= endCol; c++) {
      ws.getCell(r, c).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: bgColor.replace("#", "") },
      };
    }
  }

  rows.forEach((row, i) => {
    const rowIdx = startRow + i + 1;
    if (rowIdx <= endRow) {
      ws.getCell(rowIdx, startCol).value = row.sideHeader;
      ws.getCell(rowIdx, startCol + 1).value = row.total;
    }
  });
};

const fillTree = (
  node: Node,
  worksheet: Worksheet,
  startRow: number,
  startCol: number,
  colorCounter: { value: number }
): number => {
  const bg = getColorByIndex(colorCounter.value);
  colorCounter.value++;

  fillColumn(
    worksheet,
    startRow,
    startRow + node.height - 1,
    startCol,
    startCol + 1,
    node.rows,
    bg,
    node.title
  );

  let rowCursor = startRow;
  for (const child of node.children) {
    fillTree(child, worksheet, rowCursor, startCol + 2, colorCounter);
    rowCursor += child.height;
  }

  return startRow + node.height;
};

export const exportTreeToExcel = async (root: Node, fileName = "tree.xlsx") => {
  const workbook = await createWorkbook();
  const worksheet = workbook.addWorksheet("Sheet 1");
  fillTree(root, worksheet, 1, 1, { value: 0 });

  const maxColumns = worksheet.columnCount;
  for (let i = 1; i <= maxColumns; i++) {
    worksheet.getColumn(i).width = 50;
  }

  const buf = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buf], { type: "application/octet-stream" }), fileName);
};
