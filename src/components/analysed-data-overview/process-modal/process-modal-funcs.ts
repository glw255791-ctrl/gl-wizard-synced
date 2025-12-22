/* eslint-disable @typescript-eslint/no-explicit-any */

import { ProcessValue } from "../analysed-data-overview";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export type InputItem = {
  title: string;
  level: number;
  rows: any[];
  parent?: {
    title: string;
    level: number;
    value: string;
  };
};

export type Node = {
  level: number;
  title: string;
  rows: any[];
  height: number;
  children: Node[];
};

export function buildTree(data: ProcessValue[]): Node {
  const map = new Map<string, Node>();
  const roots: Node[] = [];

  // 1️⃣ Create all nodes
  data.forEach((item) => {
    map.set(`${item.title}_${item.level}`, {
      level: item.level,
      title: item.title,
      rows: item.rows,
      children: [],
      height: 0,
    });
  });

  // 2️⃣ Link children to parents
  data.forEach((item) => {
    const node = map.get(`${item.title}_${item.level}`)!;

    if (!item.parent) {
      // root node
      roots.push(node);
    } else {
      const parentNode = map.get(`${item.parent.title}_${item.parent.level}`);
      if (parentNode && item.level === parentNode.level + 1) {
        parentNode.children.push(node);
      }
    }

    const computeHeight = (node: Node): number => {
      if (!node) return 1;
      if (node?.children?.length === 0) {
        // leaf node
        node.height = node.rows.length + 1;
        return node.height;
      }

      let sum = 0;
      for (const child of node?.children || []) {
        sum += computeHeight(child);
      }

      // Take the max of children's height and own rows + 1 (for title)
      node.height = Math.max(sum, node.rows.length + 1);
      return node.height;
    };

    // Adjust children to fill parent's height (last child takes remaining space)
    const adjustChildrenHeight = (node: Node): void => {
      if (!node || node.children.length === 0) return;

      const childrenSum = node.children.reduce((sum, c) => sum + c.height, 0);
      const extraHeight = node.height - childrenSum;

      if (extraHeight > 0 && node.children.length > 0) {
        // Last child takes the remaining height
        node.children[node.children.length - 1].height += extraHeight;
      }

      // Recurse into children
      for (const child of node.children) {
        adjustChildrenHeight(child);
      }
    };

    computeHeight(roots[0]);
    adjustChildrenHeight(roots[0]);
  });

  return roots[0];
}

const fillColumn = (
  ws: ExcelJS.Worksheet,
  startRow: number,
  endRow: number,
  startCol: number,
  endCol: number,
  rows: { sideHeader: string; total: any }[] = [],
  bgColor: string = "#e6e6e6",
  title?: string
) => {
  // 1️⃣ Merge first row (2×1) and populate with title if provided
  if (title) {
    ws.mergeCells(startRow, startCol, startRow, endCol);
    const titleCell = ws.getCell(startRow, startCol);
    titleCell.value = title;
    titleCell.font = { bold: true };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };
  }

  // 2️⃣ Fill the background for the entire block (including first row)
  for (let r = startRow; r <= endRow; r++) {
    for (let c = startCol; c <= endCol; c++) {
      ws.getCell(r, c).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: bgColor.replace("#", "") },
      };
    }
  }

  // 3️⃣ Fill the rows under the merged title
  rows.forEach((row, i) => {
    const rowIdx = startRow + i + 1; // +1 to skip merged title row
    if (rowIdx <= endRow) {
      ws.getCell(rowIdx, startCol).value = row.sideHeader;
      ws.getCell(rowIdx, startCol + 1).value = row.total;
    }
  });
};

const ROW_COLORS = [
  "#E3F2FD", // light blue
  "#FFF3E0", // light orange
  "#E8F5E9", // light green
  "#FCE4EC", // light pink
  "#F3E5F5", // light purple
  "#E0F7FA", // light cyan
  "#FFF8E1", // light amber
  "#E8EAF6", // light indigo
  "#EFEBE9", // light brown
  "#F1F8E9", // light lime
];

const getRowColor = (level: number): string => {
  if (level < ROW_COLORS.length) {
    return ROW_COLORS[level];
  }
  // Generate additional colors by adjusting hue
  const hue = (level * 137.5) % 360; // Golden angle for good distribution
  return `hsl(${hue}, 70%, 90%)`;
};

// Convert HSL to hex for ExcelJS compatibility
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
  // Convert HSL to hex if needed
  if (color.startsWith("hsl")) {
    return hslToHex(color);
  }
  return color;
};

const fillTree = (
  node: Node,
  worksheet: ExcelJS.Worksheet,
  startRow: number,
  startCol: number,
  colorCounter: { value: number }
): number => {
  const bg = getColorByIndex(colorCounter.value);
  colorCounter.value++;

  // draw current node
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

  // recurse into children
  for (const child of node.children) {
    fillTree(child, worksheet, rowCursor, startCol + 2, colorCounter);
    rowCursor += child.height;
  }

  // return where the next sibling should start
  return startRow + node.height;
};

export const exportTreeToExcel = async (root: Node, fileName = "tree.xlsx") => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");
  fillTree(root, worksheet, 1, 1, { value: 0 });

  const maxColumns = worksheet.columnCount; // dynamic
  for (let i = 1; i <= maxColumns; i++) {
    worksheet.getColumn(i).width = 50; // wider, adjust as needed
  }

  const buf = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buf], { type: "application/octet-stream" }), fileName);
};
