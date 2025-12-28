/* eslint-disable @typescript-eslint/no-explicit-any */

import { AnyType } from "@/types";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  SearchByObject,
  Filters,
  CommonTableProps,
  TableData,
  ProcessValue,
} from "./types";

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

export function getColorForIndex(index: number): string {
  if (index < ROW_COLORS.length) {
    return ROW_COLORS[index];
  }

  const hue = (index * 137.5) % 360;
  return `hsl(${hue}, 70%, 90%)`;
}

export function formatCurrency(value: number) {
  return Number(value.toFixed(2)).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  });
}

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

export const ROW_COLORS = [
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
  "#E0F2F1", // light teal
  "#FBE9E7", // light deep orange
  "#ECEFF1", // light blue grey
  "#F9FBE7", // light yellow green
  "#EDE7F6", // light deep purple
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

export function computeTableData(
  searchByObject: SearchByObject | undefined,
  initialProcessObject: ProcessValue | undefined,
  filterValueOptions: string[],
  overviewTableData: Record<string, AnyType>,
  sortedDataDisplayHeader: Record<string, AnyType>[],
  selectedFilter: Filters,
  commonTableProps: CommonTableProps
): { tablesData: TableData[]; processUpdates: ProcessValue[] } {
  /**
   * Remove "total" from filter options – handled separately later
   */
  const filteredValues = filterValueOptions.filter(
    (value) => value !== "total"
  );

  /**
   * Accumulators returned from this function
   */
  const tablesData: TableData[] = [];
  const processUpdates: ProcessValue[] = [];

  /**
   * CASE 1:
   * No search applied → return initial process table only
   */
  if (!searchByObject) {
    tablesData.push({
      key: initialProcessObject?.title || "initial",
      id: initialProcessObject?.title || "",
      title: initialProcessObject?.title || "",
      overviewTableData: undefined,
      sortedDataDisplayHeader: [],
      rows: initialProcessObject?.rows || [],
      level: initialProcessObject?.level || 0,
    });

    return { tablesData, processUpdates };
  }

  /**
   * CASE 2:
   * Search is applied → generate tables per filtered value
   */
  for (const value of filteredValues) {
    /**
     * Filter overviewTableData to only keys
     * where at least one entry matches current filter value
     */
    const filteredOverviewData: Record<string, AnyType> = {};

    for (const mainKey of Object.keys(overviewTableData)) {
      const subArray = overviewTableData[mainKey] as Record<string, AnyType>[];

      const hasMatchingSubItem = subArray.some(
        (subItem) =>
          (subItem.coaData as Record<string, AnyType>)?.[
            selectedFilter.header
          ] === value
      );

      if (hasMatchingSubItem) {
        filteredOverviewData[mainKey] = overviewTableData[mainKey];
      }
    }

    /**
     * Filter headers by current value OR total column
     */
    const filteredHeader = sortedDataDisplayHeader.filter(
      (header) =>
        header[selectedFilter.header] === value ||
        header[commonTableProps.mappingValue] === "total"
    );

    /**
     * Check if searched value exists in this table
     */
    const hasItemInTable = Object.keys(filteredOverviewData).some(
      (key) => key === searchByObject.value
    );

    /**
     * Build column list:
     * - sideHeader
     * - dynamic grouping columns
     */
    const columns = [
      "sideHeader",
      ...filteredHeader.map((header) => header[commonTableProps.groupingValue]),
    ];

    /**
     * Build table rows from overviewTableData
     */
    const dataRows = Object.keys(overviewTableData).map((rowKey) => {
      /**
       * Compute numeric values per column
       */
      const valueCells = Object.fromEntries(
        columns
          .filter((col) => col !== "sideHeader" && col !== "total")
          .map((colKey) => {
            const sum = (overviewTableData[rowKey] as Record<string, AnyType>[])
              .filter(
                (entry) =>
                  entry.coaData[
                    commonTableProps.groupingValue as keyof AnyType
                  ] === colKey
              )
              .reduce(
                (acc, entry) =>
                  acc + ((entry[commonTableProps.valueKey] as number) || 0),
                0
              );

            return [
              colKey,
              Number(sum.toFixed(2)).toLocaleString("de-DE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true,
              }),
            ];
          })
      );

      /**
       * Calculate total from active headers
       */
      const activeGroupingKeys = [
        ...new Set(
          sortedDataDisplayHeader
            .filter((header) => header.active)
            .map((header) => header[commonTableProps.groupingValue])
        ),
      ];

      const total = activeGroupingKeys.reduce<number>((acc, colKey) => {
        const rawValue = valueCells[colKey as keyof typeof valueCells];

        let numericValue: number;
        if (typeof rawValue === "string") {
          numericValue = Number(rawValue.replace(/\./g, "").replace(",", "."));
        } else {
          numericValue = Number(rawValue);
        }

        return acc + (isNaN(Number(numericValue)) ? 0 : Number(numericValue));
      }, 0) as number;

      /**
       * Final row object
       */
      return {
        sideHeader: rowKey,
        ...valueCells,
        total: Number(Number(total).toFixed(2)).toLocaleString("de-DE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          useGrouping: true,
        }),
        bg: "white",
        header: false,
      };
    });

    /**
     * Extract rows matching search value
     */
    const matchingRows = dataRows.filter(
      (row) => row.sideHeader === searchByObject.value
    );

    /**
     * Push process updates if applicable
     */
    if (
      matchingRows.length > 0 &&
      hasItemInTable &&
      value !== searchByObject.title
    ) {
      processUpdates.push({
        title: value,
        rows: matchingRows,
        level: searchByObject.level || 0,
      });
    }

    /**
     * Push table metadata
     */
    if (hasItemInTable && value !== searchByObject.title) {
      tablesData.push({
        key: value,
        id: value,
        title: value,
        overviewTableData: filteredOverviewData,
        sortedDataDisplayHeader: filteredHeader,
        rows: [],
        level: searchByObject.level || 0,
      });
    }
  }

  return { tablesData, processUpdates };
}
