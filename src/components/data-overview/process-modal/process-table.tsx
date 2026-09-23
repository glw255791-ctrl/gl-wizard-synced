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
  AmountCell,
  LabelText,
} from "./style";
import { ProcessValue, SearchByObject } from "./types";

/* ============================================================================
 * Constants
 * ========================================================================== */

const ROW_HEIGHT = 36;
const WIDTH_ADJUST = 2;
const MAX_CHARS = 42;
const SIDE_HEADER = "sideHeader";
const TOTAL = "Total";
const TOP_TABLE_WIDTH = 420;
const TOP_TABLE_MAX_HEIGHT = 200;
const AMOUNT_COL_WIDTH = 128;
const BOTTOM_TABLE_MIN = 460;
const BOTTOM_TABLE_MAX = 720;

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
  const [tableRows, setTableRows] = useState<Record<string, AnyType>[]>(
    rows || []
  );
  const multiGridRef = useRef<MultiGrid>(null);

  const tableColumns = useMemo(() => ["sideHeader", "total"], []);

  const stringifyWithoutBg = (row: Record<string, AnyType>) => {
    const copy = { ...row };
    delete copy.bg;
    return JSON.stringify(copy);
  };

  const maxProcessLevel = overallProcessObject.reduce(
    (max, item) => Math.max(max, item.level),
    0
  );

  useEffect(() => {
    if (!isTopTable || !rows) return;

    setTableRows(rows);
    multiGridRef.current?.forceUpdateGrids();
  }, [rows, isTopTable]);

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

  useEffect(() => {
    if (sortedDataDisplayHeader && overviewTableData) {
      generateTableData();
      return;
    }

    const omitRows = overallProcessObject
      .filter((item) => item.title === title && !item.parent)
      .flatMap((item) => item.rows)
      .map(stringifyWithoutBg);

    if (!isTopTable) {
      setTableRows(
        rows.filter((row) => !omitRows.includes(stringifyWithoutBg(row)))
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedDataDisplayHeader, overviewTableData, overallProcessObject, rows]);

  const renderCellText = (row: Record<string, AnyType>, column: string) => {
    const isHeaderRow = row.header;
    const rawValue = row[column] as string | undefined;
    const displayValue = rawValue ? getElipsis(rawValue, MAX_CHARS) : "";

    if (column === "total") {
      return <AmountCell>{displayValue}</AmountCell>;
    }

    if (isHeaderRow) {
      return <LabelText>{displayValue}</LabelText>;
    }

    const tooltipTitle =
      typeof rawValue === "string" && rawValue.length > MAX_CHARS
        ? rawValue
        : "";

    return (
      <RowLabelWrapper>
        <Tooltip title={tooltipTitle}>
          <LabelText>{displayValue}</LabelText>
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

  const isCompact = Boolean(isTopTable);
  const gridHeight = isCompact
    ? Math.min(
        Math.max((tableRows.length || 2) * ROW_HEIGHT + 8, ROW_HEIGHT * 3),
        TOP_TABLE_MAX_HEIGHT
      )
    : Math.min(
        Math.max((tableRows.length || 4) * ROW_HEIGHT + 16, ROW_HEIGHT * 6),
        480
      );

  const renderGrid = (width: number, height: number) => {
    const gridWidth = Math.max(0, Math.floor(width) - WIDTH_ADJUST);
    const valueWidth = Math.min(AMOUNT_COL_WIDTH, Math.floor(gridWidth * 0.38));
    const labelWidth = Math.max(gridWidth - valueWidth, 160);

    if (tableRows.length === 0) {
      return (
        <Stack
          height="100%"
          width="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Typography fontSize={14} fontWeight={600} color="text.secondary">
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
        styleBottomLeftGrid={{ overflowX: "hidden", overflowY: "auto" }}
        styleBottomRightGrid={{ overflowX: "hidden", overflowY: "auto" }}
        cellRenderer={({ columnIndex, rowIndex, key, style }) => {
          const column = tableColumns[columnIndex];
          const row = tableRows[rowIndex];
          if (!row) return null;

          return (
            <div
              key={key}
              style={{
                ...style,
                overflow: "hidden",
                boxSizing: "border-box",
              }}
            >
              <Stack
                sx={{
                  ...styles.cellBaseStyle,
                  ...getStylesBasedOnColumn(column, row, mappingValue),
                  ...getStylesBasedOnHeader(rowIndex, 0),
                  height: "100%",
                  width: "100%",
                  boxSizing: "border-box",
                  overflow: "hidden",
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
        width: isCompact ? TOP_TABLE_WIDTH : "min(100%, 640px)",
        minWidth: isCompact ? TOP_TABLE_WIDTH : BOTTOM_TABLE_MIN,
        maxWidth: isCompact ? TOP_TABLE_WIDTH : BOTTOM_TABLE_MAX,
        flex: "0 0 auto",
      }}
    >
      <TableScrollableWrapper id={id}>
        <TableHeaderStyled>
          <TableTitle>
            <Tooltip title={title}>
              <Stack>{getElipsis(title, isCompact ? 36 : 48)}</Stack>
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
