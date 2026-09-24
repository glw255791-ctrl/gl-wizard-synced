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

function parseAmount(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const text = String(value ?? "").trim();
  if (!text) return null;
  const normalized = text.replace(/\./g, "").replace(",", ".");
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : null;
}

function columnLetter(index: number) {
  let value = index;
  let letters = "";
  while (value > 0) {
    const remainder = (value - 1) % 26;
    letters = String.fromCharCode(65 + remainder) + letters;
    value = Math.floor((value - 1) / 26);
  }
  return letters;
}

const cellBorder = {
  top: { style: "thin" as const, color: { argb: "FFA9C8C9" } },
  left: { style: "thin" as const, color: { argb: "FFA9C8C9" } },
  bottom: { style: "thin" as const, color: { argb: "FFA9C8C9" } },
  right: { style: "thin" as const, color: { argb: "FFA9C8C9" } },
};

function sheetName(raw: string, used: Set<string>, index: number) {
  const cleaned = raw.replace(/[*?:\\/[\]]/g, " ").replace(/\s+/g, " ").trim();
  const base = (cleaned || `Sheet ${index + 1}`).slice(0, 31);
  let candidate = base;
  let attempt = 2;
  while (used.has(candidate.toLowerCase())) {
    const suffix = ` ${attempt}`;
    candidate = `${base.slice(0, 31 - suffix.length)}${suffix}`;
    attempt += 1;
  }
  used.add(candidate.toLowerCase());
  return candidate;
}

function collectLines(node: Node, lines: { process: string; path: string; amount: number }[]) {
  for (const row of node.rows) {
    const label = String(row.sideHeader ?? "");
    if (!label || label === "Total") continue;
    const amount = parseAmount(row.total);
    if (amount == null) continue;
    lines.push({ process: node.title, path: label, amount });
  }
  node.children.forEach((child) => collectLines(child, lines));
}

export async function exportProcessWorkbook({
  root,
  fileName,
  detailHeader,
  details,
}: {
  root: Node;
  fileName: string;
  detailHeader: { key: string; title: string }[];
  details: { title: string; rows: Record<string, unknown>[] }[];
}) {
  const workbook = await createWorkbook();
  const used = new Set<string>();
  const lines: { process: string; path: string; amount: number }[] = [];
  collectLines(root, lines);

  const pathWidth = Math.max(1, ...lines.map((line) => line.path.split("/").length));
  const pathHeaders = Array.from({ length: pathWidth }, (_, index) =>
    pathWidth === 1 ? "Account" : `Account ${index + 1}`
  );
  const summary = workbook.addWorksheet(sheetName(root.title || "Process", used, 0));
  const amountCol = 2 + pathWidth;
  const header = summary.addRow(["Process", ...pathHeaders, "Amount"]);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF356F73" } };
    cell.border = cellBorder;
    cell.alignment = { vertical: "middle" };
  });

  lines.forEach((line, index) => {
    const parts = line.path.split("/");
    const padded = Array.from({ length: pathWidth }, (_, part) => parts[part] ?? "");
    const added = summary.addRow([line.process, ...padded, line.amount]);
    added.eachCell({ includeEmpty: true }, (cell, col) => {
      cell.border = cellBorder;
      cell.alignment = { vertical: "middle", wrapText: col < amountCol };
      if (index % 2 === 1 && col < amountCol) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE4F0F0" } };
      }
    });
    added.getCell(amountCol).numFmt = "#,##0.00";
  });

  const firstData = 2;
  const lastData = Math.max(firstData, lines.length + 1);
  const amountLetter = columnLetter(amountCol);
  const total = lines.reduce((sum, line) => sum + line.amount, 0);
  const totalRow = summary.addRow([
    "Total",
    ...Array(pathWidth).fill(""),
    lines.length
      ? {
          formula: `SUM(${amountLetter}${firstData}:${amountLetter}${lastData})`,
          result: total,
        }
      : 0,
  ]);
  totalRow.font = { bold: true };
  totalRow.eachCell({ includeEmpty: true }, (cell) => {
    cell.border = cellBorder;
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE8EFCB" } };
  });
  summary.getCell(totalRow.number, amountCol).numFmt = "#,##0.00";
  summary.getColumn(1).width = 28;
  for (let col = 2; col < amountCol; col += 1) summary.getColumn(col).width = 36;
  summary.getColumn(amountCol).width = 18;
  summary.views = [{ state: "frozen", ySplit: 1 }];

  details.forEach((detail, index) => {
    if (!detail.rows.length) return;
    const worksheet = workbook.addWorksheet(
      sheetName(detail.title.split("/").at(-1) || detail.title, used, index + 1)
    );
    const sample = detail.rows[0];
    const keys = Object.keys(sample).filter((key) => key !== "coaData");
    const coaKeys = Object.keys((sample.coaData as Record<string, unknown>) ?? {});
    const head = worksheet.addRow([...keys, ...coaKeys]);
    head.font = { bold: true, color: { argb: "FFFFFFFF" } };
    head.eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF356F73" } };
    });
    const valueTitle = detailHeader.find((item) => item.key === "value")?.title;
    detail.rows.forEach((row) => {
      const values = keys.map((key) => {
        const value = row[key];
        if (key === "result" && Array.isArray(value)) return value.join("/");
        if (valueTitle && key === valueTitle) return parseAmount(value) ?? value;
        if (value instanceof Date) return value;
        return typeof value === "object" && value != null ? "" : value;
      });
      const coa = coaKeys.map(
        (key) => (row.coaData as Record<string, unknown> | undefined)?.[key] ?? ""
      );
      worksheet.addRow([...values, ...coa]);
    });
    worksheet.columns.forEach((column) => {
      column.width = 22;
    });
  });

  const buf = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    fileName
  );
}
