/* eslint-disable @typescript-eslint/no-explicit-any */

import { AnyType } from "@/types";
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
  return ROW_COLORS[index % ROW_COLORS.length];
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
      roots.push(node);
    } else {
      const parentNode = map.get(`${item.parent.title}_${item.parent.level}`);
      if (parentNode && item.level === parentNode.level + 1) {
        parentNode.children.push(node);
      }
    }
  });

  const computeHeight = (node: Node): number => {
    if (!node) return 1;
    if (node.children.length === 0) {
      node.height = node.rows.length + 1;
      return node.height;
    }

    let sum = 0;
    for (const child of node.children) {
      sum += computeHeight(child);
    }

    node.height = Math.max(sum, node.rows.length + 1);
    return node.height;
  };

  const adjustChildrenHeight = (node: Node): void => {
    if (!node || node.children.length === 0) return;

    const childrenSum = node.children.reduce((sum, c) => sum + c.height, 0);
    const extraHeight = node.height - childrenSum;

    if (extraHeight > 0) {
      node.children[node.children.length - 1].height += extraHeight;
    }

    for (const child of node.children) {
      adjustChildrenHeight(child);
    }
  };

  if (roots[0]) {
    computeHeight(roots[0]);
    adjustChildrenHeight(roots[0]);
  }

  return roots[0];
}

/** Soft row tints from the brand palette (lime / teal / yellow only). */
export const ROW_COLORS = [
  "#E8EFCB", // Lime Light
  "#F5EFAF", // Soft Yellow
  "#E4F0F0", // Pale Blue
  "#D6E3A0", // Lime Soft
  "#D7E6E7", // Soft Blue tint
  "#EEF3D8", // Lime wash
  "#F8F4C8", // Soft Yellow wash
  "#DCEBEB", // Pale Blue deep
  "#E3EBC0", // Lime Soft wash
  "#CFE0E1", // Soft Blue light
  "#F0F5D4", // Lime Light wash
  "#E5E9E8", // Light Gray
  "#EAF0D0", // Lime mix
  "#D2E3E4", // Soft Blue mid
  "#F3EFC0", // Soft Yellow mid
];

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
