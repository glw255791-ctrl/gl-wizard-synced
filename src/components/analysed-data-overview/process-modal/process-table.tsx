import React, { useEffect, useMemo, useRef, useState } from "react";
import { Stack, Tooltip } from "@mui/material";
import "react-virtualized/styles.css";
import { AutoSizer, Index, MultiGrid } from "react-virtualized";
import { AnyType, getElipsis } from "../table/functions";
import {
  getStylesBasedOnColumn,
  getStylesBasedOnHeader,
  RowLabelWrapper,
  TableScrollableWrapper,
  TableHeaderStyled,
  TableTitle,
  styles,
  IconButtonStyled,
  RowLabelCell,
  QueryStatsIconStyled,
  DisabledSearchIconStyled,
  EnabledSearchIconStyled,
  DeleteIconStyled,
} from "./style";
import { colors } from "../../../assets/colors";
import { TableHeader } from "../../composed/basic-table/basic-table";
import { ProcessValue } from "../analysed-data-overview";

const COLUMN_WIDTH = 128;
const ROW_HEIGHT = 24;
const WIDTH_ADJUST = 2;
const MAX_CHARS = 30;

const SIDE_HEADER = "sideHeader";

interface Props {
  title: string;
  mappingValue: string;
  groupingValue: string;
  valueKey: string;
  selectedRows?: string[];
  id?: string;
  level?: number;
  selectedFilter: Filters;
  basicTableHeader: TableHeader[];
  basicTableData: Record<string, string>[];
  rows: Record<string, AnyType>[];
  onAddToProcess?: (processValue: ProcessValue) => void;
  onDeleteFromProcess?: (processValue: ProcessValue) => void;
  setCurrentProcessObject?: React.Dispatch<
    React.SetStateAction<ProcessValue | undefined>
  >;
  sortedDataDisplayHeader?: Record<string, AnyType>[];
  overviewTableData?: Record<string, AnyType>;
  currentProcessObject: ProcessValue | undefined;
  overallProcessObject?: ProcessValue | undefined;
}

interface Filters {
  header: string;
  value: string;
}

export const ProcessDataTable: React.FC<Props> = ({
  title,
  mappingValue,
  groupingValue,
  selectedRows,
  valueKey,
  selectedFilter,
  rows,
  id,
  level,
  sortedDataDisplayHeader,
  overviewTableData,
  onAddToProcess,
  currentProcessObject,
  setCurrentProcessObject,
  overallProcessObject,
  onDeleteFromProcess,
}) => {
  const [tableRows, setTableRows] = useState<Record<string, AnyType>[]>(
    rows || []
  );

  const tableColumns = useMemo(() => ["sideHeader", "total"], []);
  const multiGridRef = useRef<MultiGrid>(null);

  // Generates table data using a Web Worker
  const generateTableData = () => {
    const worker = new Worker(
      new URL("../table/generate-table-data.js", import.meta.url)
    );
    worker.onmessage = (e) => {
      const { rows } = e.data;

      const valueKeys = Object.keys(rows[1]).filter(
        (key) =>
          key !== "header" &&
          key !== "sideHeader" &&
          key !== "total" &&
          key !== "bg"
      );

      setTableRows([
        ...rows
          .slice(2, rows.length - 1)
          .filter((row: { [x: string]: string }) => {
            return valueKeys.some(
              (key) => row[key] !== "0.00" && rows[1 - 1][key]
            );
          }),
      ]);
    };
    worker.postMessage({
      sortedDataDisplayHeader,
      overviewTableData,
      mappingValue,
      groupingValue,
      valueKey,
      selectedFilter,
      colors,
    });
  };

  useEffect(() => {
    if (sortedDataDisplayHeader && overviewTableData) {
      generateTableData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedDataDisplayHeader, overviewTableData]);

  // Renders the content of a cell, including pin & download icons when appropriate
  const renderCellText = (row: Record<string, AnyType>, column: string) => {
    const isHeader = row.header;
    const val = row[column] ? getElipsis(row[column] as string, 38) : "";

    if (isHeader || column !== SIDE_HEADER) {
      return <Stack>{val}</Stack>;
    }

    return (
      <RowLabelWrapper>
        {val}
        <RowLabelCell>
          {rows.length === 0 && (
            <IconButtonStyled
              onClick={() =>
                onAddToProcess?.({
                  title,
                  rows: [row],
                  level: (currentProcessObject?.level || 0) + 1,
                })
              }
            >
              <QueryStatsIconStyled />
            </IconButtonStyled>
          )}
        </RowLabelCell>
      </RowLabelWrapper>
    );
  };

  return (
    <TableScrollableWrapper id={id}>
      <TableHeaderStyled>
        <TableTitle>
          <Tooltip title={title}>
            <Stack>{getElipsis(title, 40)}</Stack>
          </Tooltip>
        </TableTitle>
        {rows?.length !== 0 && (
          <Stack style={{ flexDirection: "row", gap: 5 }}>
            <IconButtonStyled
              onClick={() =>
                setCurrentProcessObject?.({
                  title,
                  rows,
                  level: level || 0,
                })
              }
            >
              {title === currentProcessObject?.title &&
              level === currentProcessObject?.level ? (
                <EnabledSearchIconStyled />
              ) : (
                <DisabledSearchIconStyled />
              )}
            </IconButtonStyled>

            {(() => {
              // Helper to recursively find node at same level and title in overallProcessObject
              const findNodeAtLevel = (
                node: any,
                targetTitle: string,
                targetLevel: number
              ): any => {
                if (!node) return undefined;
                if (node.title === targetTitle && node.level === targetLevel) {
                  return node;
                }
                if (node.children && Array.isArray(node.children)) {
                  for (const child of node.children) {
                    const result = findNodeAtLevel(
                      child,
                      targetTitle,
                      targetLevel
                    );
                    if (result) return result;
                  }
                }
                return undefined;
              };

              // If overallProcessObject is not defined, do not render
              if (!overallProcessObject) return null;
              // Find the node in the overallProcessObject tree that matches this table's title and level
              const node = findNodeAtLevel(
                overallProcessObject,
                title,
                level || 0
              );
              // Only render if node exists and its children is empty array (or undefined)
              if (
                node &&
                (!node.children || node.children.length === 0) &&
                level !== 0
              ) {
                return (
                  <IconButtonStyled
                    onClick={() =>
                      onDeleteFromProcess?.({
                        title,
                        level: level || 0,
                        rows: [],
                        children: [],
                      })
                    }
                  >
                    <DeleteIconStyled />
                  </IconButtonStyled>
                );
              }
              return null;
            })()}
          </Stack>
        )}
      </TableHeaderStyled>
      <AutoSizer
        style={{
          ...styles.autosizerWrapper,
          ...(rows?.length > 0 ? { height: rows.length * ROW_HEIGHT } : {}),
        }}
      >
        {({ width, height }) => (
          <MultiGrid
            ref={multiGridRef}
            fixedColumnCount={1}
            columnWidth={(params: Index) =>
              params.index === 0 ? COLUMN_WIDTH * 2 : COLUMN_WIDTH
            }
            columnCount={tableColumns.length}
            rowHeight={ROW_HEIGHT}
            rowCount={tableRows.length}
            width={width - WIDTH_ADJUST}
            height={rows?.length > 0 ? rows?.length * ROW_HEIGHT : height - 50}
            cellRenderer={({ columnIndex, rowIndex, key, style }) => {
              const column = tableColumns[columnIndex];
              const row = tableRows[rowIndex];

              if (!row) return null;

              const tooltipTitle =
                typeof row[column as keyof typeof row] === "string" &&
                (row[column as keyof typeof row] as string).length > MAX_CHARS
                  ? (row[column as keyof typeof row] as string)
                  : "";

              return (
                <div key={key} style={style}>
                  <Tooltip title={tooltipTitle}>
                    <Stack
                      style={
                        {
                          ...styles.cellBaseStyle,
                          ...getStylesBasedOnColumn(
                            column,
                            row,
                            mappingValue,
                            selectedRows
                          ),
                          ...getStylesBasedOnHeader(rowIndex, 0),
                        } as React.CSSProperties
                      }
                    >
                      {renderCellText(row, column)}
                    </Stack>
                  </Tooltip>
                </div>
              );
            }}
          />
        )}
      </AutoSizer>
    </TableScrollableWrapper>
  );
};
