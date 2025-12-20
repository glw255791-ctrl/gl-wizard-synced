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

      node.height = sum;
      return sum;
    };

    computeHeight(roots[0]);
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

const randomGray = () => {
  const g = Math.floor(180 + Math.random() * 50); // light grays
  return `#${g.toString(16).padStart(2, "0").repeat(3)}`;
};

const fillTree = (
  node: Node,
  worksheet: ExcelJS.Worksheet,
  startRow: number,
  startCol: number
): number => {
  const bg = randomGray();

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
    fillTree(child, worksheet, rowCursor, startCol + 2);
    rowCursor += child.height;
  }

  // return where the next sibling should start
  return startRow + node.height;
};

export const exportTreeToExcel = async (root: Node, fileName = "tree.xlsx") => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");
  fillTree(root, worksheet, 1, 1);

  const maxColumns = worksheet.columnCount; // dynamic
  for (let i = 1; i <= maxColumns; i++) {
    worksheet.getColumn(i).width = 50; // wider, adjust as needed
  }

  const buf = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buf], { type: "application/octet-stream" }), fileName);
};
