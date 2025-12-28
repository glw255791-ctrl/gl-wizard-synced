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
import { ProcessValue, SearchByObject } from "./types";

/* ============================================================================
 * Constants
 * ========================================================================== */

const COLUMN_WIDTH = 128;
const ROW_HEIGHT = 24;
const WIDTH_ADJUST = 2;
const MAX_CHARS = 30;
const SIDE_HEADER = "sideHeader";
const TOTAL = "Total";

/* ============================================================================
 * Types
 * ========================================================================== */

interface Filters {
  header: string;
  value: string;
}

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

/* ============================================================================
 * Component
 * ========================================================================== */

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
  /* ------------------------------------------------------------------------
   * State & refs
   * ---------------------------------------------------------------------- */

  const [tableRows, setTableRows] = useState<Record<string, AnyType>[]>(
    rows || []
  );
  const multiGridRef = useRef<MultiGrid>(null);

  /* ------------------------------------------------------------------------
   * Derived values
   * ---------------------------------------------------------------------- */

  const tableColumns = useMemo(() => ["sideHeader", "total"], []);

  /* ------------------------------------------------------------------------
   * Helpers
   * ---------------------------------------------------------------------- */

  /**
   * Stringifies a row without the `bg` property.
   * Used to compare rows while ignoring background color changes.
   */
  const stringifyWithoutBg = (row: Record<string, AnyType>) => {
    const copy = { ...row };
    delete copy.bg;
    return JSON.stringify(copy);
  };

  /**
   * Returns the highest level currently present in the process object.
   */
  const maxProcessLevel = overallProcessObject.reduce(
    (max, item) => Math.max(max, item.level),
    0
  );

  /* ------------------------------------------------------------------------
   * Sync table rows for top tables when `rows` prop changes
   * ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!isTopTable || !rows) return;

    setTableRows(rows);
    multiGridRef.current?.forceUpdateGrids();
  }, [rows, isTopTable]);

  /* ------------------------------------------------------------------------
   * Table data generation (Web Worker)
   * ---------------------------------------------------------------------- */

  const generateTableData = () => {
    const worker = new Worker(
      new URL("../table/generate-table-data.js", import.meta.url)
    );

    worker.onmessage = (e) => {
      const { rows: generatedRows } = e.data;

      const ignoreKeys = ["header", "sideHeader", "total", "bg"];

      const valueKeys = Object.keys(generatedRows[1]).filter(
        (key) => !ignoreKeys.includes(key)
      );

      // Rows already added to process for this table
      const omitRows = overallProcessObject
        .filter((item) => item.title === title)
        .flatMap((item) => item.rows)
        .map(stringifyWithoutBg);

      const filteredRows = generatedRows
        .slice(2, generatedRows.length - 1)
        .filter((row: Record<string, string>) =>
          valueKeys.some((key) => row[key] !== "0,00" && generatedRows[0][key])
        )
        .filter(
          (row: Record<string, AnyType>) =>
            !omitRows.includes(stringifyWithoutBg(row))
        );

      setTableRows([...filteredRows]);
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

  /* ------------------------------------------------------------------------
   * Main effect – decides between worker-based or direct filtering
   * ---------------------------------------------------------------------- */

  useEffect(() => {
    if (sortedDataDisplayHeader && overviewTableData) {
      generateTableData();
      return;
    }

    // Rows already added to process (top-level only)
    const omitRows = overallProcessObject
      .filter((item) => item.title === title && !item.parent)
      .flatMap((item) => item.rows)
      .map(stringifyWithoutBg);

    // Important: filter from original `rows` prop, not state
    if (!isTopTable) {
      setTableRows(
        rows.filter((row) => !omitRows.includes(stringifyWithoutBg(row)))
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedDataDisplayHeader, overviewTableData, overallProcessObject, rows]);

  /* ------------------------------------------------------------------------
   * Cell renderer
   * ---------------------------------------------------------------------- */

  const renderCellText = (row: Record<string, AnyType>, column: string) => {
    const isHeaderRow = row.header;
    const rawValue = row[column] as string | undefined;
    const displayValue = rawValue ? getElipsis(rawValue, 35) : "";

    // Non-side header cells or header rows
    if (isHeaderRow || column !== SIDE_HEADER) {
      return <Stack>{displayValue}</Stack>;
    }

    const tooltipTitle =
      typeof rawValue === "string" && rawValue.length > MAX_CHARS
        ? rawValue
        : "";

    return (
      <RowLabelWrapper>
        <Tooltip title={tooltipTitle}>
          <Typography component="span" style={{ fontSize: 12 }}>
            {displayValue}
          </Typography>
        </Tooltip>

        <RowLabelCell>
          {isTopTable ? (
            <>
              {row.sideHeader !== TOTAL && (
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
              )}

              {level === maxProcessLevel && row.sideHeader !== TOTAL && (
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

  /* ------------------------------------------------------------------------
   * Render
   * ---------------------------------------------------------------------- */

  return (
    <Stack>
      <TableScrollableWrapper id={id}>
        <TableHeaderStyled>
          <TableTitle>
            <Tooltip title={title}>
              <Stack>{getElipsis(title, 40)}</Stack>
            </Tooltip>
          </TableTitle>
        </TableHeaderStyled>

        <AutoSizer
          style={{
            ...styles.autosizerWrapper,
            ...(rows?.length ? { height: rows.length * ROW_HEIGHT } : {}),
          }}
        >
          {({ width, height }) =>
            tableRows.length > 0 ? (
              <MultiGrid
                ref={multiGridRef}
                fixedColumnCount={1}
                columnCount={tableColumns.length}
                rowCount={tableRows.length}
                rowHeight={ROW_HEIGHT}
                columnWidth={(params: Index) =>
                  params.index === 0 ? COLUMN_WIDTH * 2 : COLUMN_WIDTH
                }
                width={width - WIDTH_ADJUST}
                height={rows?.length ? rows.length * ROW_HEIGHT : height - 50}
                cellRenderer={({ columnIndex, rowIndex, key, style }) => {
                  const column = tableColumns[columnIndex];
                  const row = tableRows[rowIndex];
                  if (!row) return null;

                  return (
                    <div key={key} style={style}>
                      <Stack
                        sx={{
                          ...styles.cellBaseStyle,
                          ...getStylesBasedOnColumn(column, row, mappingValue),
                          ...getStylesBasedOnHeader(rowIndex, 0),
                        }}
                      >
                        {renderCellText(row, column)}
                      </Stack>
                    </div>
                  );
                }}
              />
            ) : (
              <Stack
                height="100%"
                width="100%"
                justifyContent="center"
                alignItems="center"
              >
                <Typography fontSize={14} fontWeight="bold">
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
