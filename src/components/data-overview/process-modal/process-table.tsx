import React, { useEffect, useMemo, useRef, useState } from "react";
import { Stack, Tooltip, Typography } from "@mui/material";
import "react-virtualized/styles.css";
import { AutoSizer, Index, MultiGrid } from "react-virtualized";

import { getElipsis } from "../table/ellipsis";
import { buildMovementTable } from "../table/build-movement-table";
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
const TOP_TABLE_WIDTH = 280;
const TOP_TABLE_MAX_HEIGHT = 148;

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
    const { rows: generatedRows } = buildMovementTable({
      sortedDataDisplayHeader,
      overviewTableData: overviewTableData ?? {},
      groupingValue,
      valueKey,
      selectedFilter,
    });
    if (!generatedRows[1]) {
      setTableRows([]);
      return;
    }

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

  const isCompact = Boolean(isTopTable);
  const gridHeight = isCompact
    ? Math.min(
        Math.max((tableRows.length || 2) * ROW_HEIGHT + 8, ROW_HEIGHT * 4),
        TOP_TABLE_MAX_HEIGHT
      )
    : Math.min(
        Math.max((tableRows.length || 4) * ROW_HEIGHT + 16, ROW_HEIGHT * 8),
        520
      );

  const renderGrid = (width: number, height: number) => {
    const gridWidth = Math.max(0, Math.floor(width) - WIDTH_ADJUST);
    const labelWidth = Math.floor(gridWidth * 0.68);
    const valueWidth = Math.max(gridWidth - labelWidth, 88);

    if (tableRows.length === 0) {
      return (
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
      );
    }

    return (
      <MultiGrid
        ref={multiGridRef}
        fixedColumnCount={1}
        columnCount={tableColumns.length}
        rowCount={tableRows.length}
        rowHeight={ROW_HEIGHT}
        columnWidth={(params: Index) =>
          params.index === 0 ? labelWidth : valueWidth
        }
        width={gridWidth}
        height={Math.max(0, Math.floor(height))}
        style={{ outline: "none" }}
        styleBottomLeftGrid={{ overflowX: "hidden" }}
        styleBottomRightGrid={{ overflowX: "hidden" }}
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
    );
  };

  return (
    <Stack
      sx={{
        width: isCompact ? TOP_TABLE_WIDTH : "min(100%, 520px)",
        minWidth: isCompact ? TOP_TABLE_WIDTH : 360,
        maxWidth: isCompact ? TOP_TABLE_WIDTH : 520,
        flex: "0 0 auto",
      }}
    >
      <TableScrollableWrapper id={id}>
        <TableHeaderStyled>
          <TableTitle>
            <Tooltip title={title}>
              <Stack>{getElipsis(title, isCompact ? 28 : 40)}</Stack>
            </Tooltip>
          </TableTitle>
        </TableHeaderStyled>

        {isCompact ? (
          <Stack
            style={{
              ...styles.autosizerWrapper,
              height: gridHeight,
              width: TOP_TABLE_WIDTH,
            }}
          >
            {renderGrid(TOP_TABLE_WIDTH, gridHeight)}
          </Stack>
        ) : (
          <AutoSizer
            style={{
              ...styles.autosizerWrapper,
              height: gridHeight,
            }}
          >
            {({ width, height }) => renderGrid(width, height)}
          </AutoSizer>
        )}
      </TableScrollableWrapper>
    </Stack>
  );
};
