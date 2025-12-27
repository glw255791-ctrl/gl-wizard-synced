import React, { useEffect, useMemo, useRef, useState } from "react";
import { Stack, Tooltip, Typography } from "@mui/material";
import "react-virtualized/styles.css";
import { AutoSizer, Index, MultiGrid } from "react-virtualized";
import { getElipsis } from "../table/functions";
import { AnyType } from "../../../types";
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
  AddCircleOutlineIconStyled,
  RemoveCircleOutlineIconStyled,
} from "./style";
import { colors } from "../../../constants/theme";
import { ProcessValue } from "../analysed-data-overview";
import { SearchByObject } from "./process-modal";

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
  id?: string;
  selectedFilter: Filters;
  rows: Record<string, AnyType>[];
  onAddToProcess?: (processValue: ProcessValue) => void;
  sortedDataDisplayHeader?: Record<string, AnyType>[];
  overviewTableData?: Record<string, AnyType>;
  isTopTable?: boolean;
  level: number;
  setSearchByObject: (searchByObject: SearchByObject) => void;
  overallProcessObject: ProcessValue[];
  removeFromProcess?: (processValue: ProcessValue) => void;
}

interface Filters {
  header: string;
  value: string;
}

export const ProcessDataTable: React.FC<Props> = ({
  title,
  mappingValue,
  groupingValue,
  valueKey,
  selectedFilter,
  rows,
  level,
  id,
  sortedDataDisplayHeader,
  overviewTableData,
  onAddToProcess,
  removeFromProcess,
  overallProcessObject,
  isTopTable,
  setSearchByObject,
}) => {
  const [tableRows, setTableRows] = useState<Record<string, AnyType>[]>(
    rows || []
  );

  const tableColumns = useMemo(() => ["sideHeader", "total"], []);
  const multiGridRef = useRef<MultiGrid>(null);

  // Sync tableRows when rows prop changes (for isTopTable tables)
  useEffect(() => {
    if (isTopTable && rows) {
      setTableRows(rows);
      // Force MultiGrid to re-render with new data
      multiGridRef.current?.forceUpdateGrids();
    }
  }, [rows, isTopTable]);

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

      // Find rows that have been added to the process from this table
      // by looking for items whose parent matches this table's title and level
      // Exclude 'bg' from comparison since it can change
      const stringifyWithoutBg = (row: Record<string, AnyType>) => {
        const copy = { ...row };
        delete copy.bg;
        return JSON.stringify(copy);
      };
      const omitRows = overallProcessObject
        .filter((item) => item.title === title)
        .map((item) => item.rows)
        .flat()
        .map((item) => stringifyWithoutBg(item));

      setTableRows([
        ...rows
          .slice(2, rows.length - 1)
          .filter((row: { [x: string]: string }) => {
            return valueKeys.some(
              (key) => row[key] !== "0,00" && rows[1 - 1][key]
            );
          })
          .filter(
            (row: { [x: string]: string }) =>
              !omitRows.includes(stringifyWithoutBg(row))
          ),
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
    } else {
      // Find rows that have been added to the process from this table
      // by looking for items whose parent matches this table's title and level
      // Exclude 'bg' from comparison since it can change
      const stringifyWithoutBg = (row: Record<string, AnyType>) => {
        const copy = { ...row };
        delete copy.bg;
        return JSON.stringify(copy);
      };
      const omitRows = overallProcessObject
        .filter((item) => item.title === title && !item.parent)
        .map((item) => item.rows)
        .flat()
        .map((item) => stringifyWithoutBg(item));
      // Filter from original rows prop (not tableRows state) so removed rows can return
      if (!isTopTable)
        setTableRows(
          rows.filter((row) => !omitRows.includes(stringifyWithoutBg(row)))
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedDataDisplayHeader, overviewTableData, overallProcessObject, rows]);

  // Renders the content of a cell, including pin & download icons when appropriate
  const renderCellText = (row: Record<string, AnyType>, column: string) => {
    const isHeader = row.header;
    const val = row[column] ? getElipsis(row[column] as string, 35) : "";

    if (isHeader || column !== SIDE_HEADER) {
      return <Stack>{val}</Stack>;
    }

    const tooltipTitle =
      typeof row[column as keyof typeof row] === "string" &&
      (row[column as keyof typeof row] as string).length > MAX_CHARS
        ? (row[column as keyof typeof row] as string)
        : "";

    return (
      <RowLabelWrapper>
        <Tooltip title={tooltipTitle}>
          <Typography style={{ fontSize: 12 }} component={"div"}>
            {val}
          </Typography>
        </Tooltip>
        <RowLabelCell>
          {isTopTable ? (
            <>
              <IconButtonStyled
                onClick={() =>
                  setSearchByObject({
                    title,
                    level,
                    value: String(row.sideHeader),
                    bg: row.bg as string,
                  })
                }
              >
                <QueryStatsIconStyled />
              </IconButtonStyled>
              {level ===
                overallProcessObject.reduce(
                  (max, item) => Math.max(max, item.level),
                  0
                ) && (
                <IconButtonStyled
                  onClick={() =>
                    removeFromProcess?.({
                      title,
                      level,
                      rows: [row],
                    })
                  }
                >
                  <RemoveCircleOutlineIconStyled />
                </IconButtonStyled>
              )}
            </>
          ) : (
            <IconButtonStyled
              onClick={() =>
                onAddToProcess?.({
                  title,
                  rows: [row],
                  level,
                })
              }
            >
              <AddCircleOutlineIconStyled />
            </IconButtonStyled>
          )}
        </RowLabelCell>
      </RowLabelWrapper>
    );
  };

  return (
    <Stack>
      <TableScrollableWrapper id={id}>
        <TableHeaderStyled>
          <TableTitle>
            <Tooltip title={title}>
              <Typography component={"div"}>{getElipsis(title, 40)}</Typography>
            </Tooltip>
          </TableTitle>
        </TableHeaderStyled>
        <AutoSizer
          style={{
            ...styles.autosizerWrapper,
            ...(rows?.length > 0 ? { height: rows.length * ROW_HEIGHT } : {}),
          }}
        >
          {({ width, height }) =>
            tableRows.length > 0 ? (
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
                height={
                  rows?.length > 0 ? rows?.length * ROW_HEIGHT : height - 50
                }
                cellRenderer={({ columnIndex, rowIndex, key, style }) => {
                  const column = tableColumns[columnIndex];
                  const row = tableRows[rowIndex];

                  if (!row) return null;

                  return (
                    <div key={key} style={style}>
                      <Stack
                        style={
                          {
                            ...styles.cellBaseStyle,
                            ...getStylesBasedOnColumn(
                              column,
                              row,
                              mappingValue
                            ),
                            ...getStylesBasedOnHeader(rowIndex, 0),
                          } as React.CSSProperties
                        }
                      >
                        {renderCellText(row, column)}
                      </Stack>
                    </div>
                  );
                }}
              />
            ) : (
              <Stack
                style={{
                  height: "100%",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography style={{ fontSize: 14, fontWeight: "bold" }}>
                  No rows available
                </Typography>
              </Stack>
            )
          }
        </AutoSizer>
      </TableScrollableWrapper>
    </Stack>
  );
};
