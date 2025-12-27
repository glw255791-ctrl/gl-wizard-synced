import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Stack, Checkbox, Tooltip, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import "react-virtualized/styles.css";
import { AutoSizer, Index, MultiGrid } from "react-virtualized";
import {
  exportBasicTableToExcel,
  exportMultipleTablesToExcel,
  exportTableToExcel,
  getElipsis,
} from "./functions";
import {
  CheckedIcon,
  UncheckedIcon,
  getStylesBasedOnColumn,
  getStylesBasedOnHeader,
  RowLabelWrapper,
  RowLabelCell,
  IconButtonStyled,
  DownloadIconStyled,
  TableScrollableWrapper,
  TableHeaderStyled,
  TableTitle,
  ExcelDownloadButton,
  ButtonsWrapper,
  styles,
  QueryStatsIconStyled,
} from "./style";
import { TotalText } from "./style";
import { TableHeader } from "../../composed/basic-table/basic-table";
import { ProcessValue } from "../analysed-data-overview";
import { theme } from "../../../constants/theme";
import { AnyType } from "../../../types";

const COLUMN_WIDTH = 250;
const ROW_HEIGHT = 24;
const WIDTH_ADJUST = 2;
const HEIGHT_ADJUST = 73;
const MAX_CHARS = 40;

const TOTAL = "total";
const INCLUDE = "Include";
const SIDE_HEADER = "sideHeader";

interface Props {
  title: string;
  sortedDataDisplayHeader: Record<string, AnyType>[];
  mappingValue: string;
  groupingValue: string;
  overviewTableData: Record<string, AnyType>;
  valueKey: string;
  selectedRows?: string[];
  id?: string;
  transitionFunc: React.TransitionStartFunction;
  selectedFilter: Filters;
  setDataDisplayHeader: React.Dispatch<
    React.SetStateAction<Record<string, AnyType>[]>
  >;
  basicTableHeader: TableHeader[];
  basicTableData: Record<string, string>[];
  setIsProcessModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTable: string;
  canProcess: boolean;
  setCurrentProcessObject: React.Dispatch<
    React.SetStateAction<ProcessValue | undefined>
  >;
}

interface Filters {
  header: string;
  value: string;
}

export const DataTable: React.FC<Props> = ({
  title,
  sortedDataDisplayHeader,
  mappingValue,
  groupingValue,
  selectedRows,
  selectedTable,
  overviewTableData,
  valueKey,
  basicTableData,
  basicTableHeader,
  selectedFilter,
  transitionFunc,
  id,
  setDataDisplayHeader,
  setIsProcessModalOpen,
  setCurrentProcessObject,
  canProcess,
}) => {
  const [tableRows, setTableRows] = useState<Record<string, AnyType>[]>([]);
  const [tableColumns, setTableColumns] = useState<string[]>([]);
  const multiGridRef = useRef<MultiGrid>(null);

  // Generates table data using a Web Worker
  const generateTableData = () => {
    const worker = new Worker(
      new URL("./generate-table-data.js", import.meta.url)
    );
    worker.onmessage = (e) => {
      const { columns, rows } = e.data;
      setTableColumns([...new Set(columns as string[])]);
      setTableRows(rows);
    };
    worker.postMessage({
      sortedDataDisplayHeader,
      overviewTableData,
      mappingValue,
      groupingValue,
      valueKey,
      selectedFilter,
      colors: theme.colors,
    });
  };

  useEffect(() => {
    generateTableData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedDataDisplayHeader, overviewTableData]);

  // Calculate number of fixed header rows
  const fixedRowCount = useMemo(
    () =>
      title === "All items"
        ? Object.keys(sortedDataDisplayHeader[0])?.length || 1
        : 2,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sortedDataDisplayHeader]
  );

  const viewableRows = useMemo(() => {
    if (tableRows.length === 0 || tableRows[fixedRowCount] === undefined)
      return [];

    const valueKeys = Object.keys(tableRows[fixedRowCount]).filter(
      (key) =>
        key !== "header" &&
        key !== "sideHeader" &&
        key !== "total" &&
        key !== "bg"
    );

    return [
      ...tableRows.slice(0, fixedRowCount),
      ...tableRows.slice(fixedRowCount, tableRows.length).filter((row) => {
        return (
          valueKeys.some(
            (key) => row[key] !== "0,00" && tableRows[fixedRowCount - 1][key]
          ) ||
          row.sideHeader === "Total" ||
          row.sideHeader === "Include"
        );
      }),
    ];
  }, [tableRows, fixedRowCount]);

  // Export table data to Excel
  const onExportClick = useCallback(() => {
    exportTableToExcel(viewableRows, sortedDataDisplayHeader, groupingValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewableRows, sortedDataDisplayHeader, mappingValue]);

  // Force update of grid when data changes
  useEffect(() => {
    if (multiGridRef.current) {
      multiGridRef.current.recomputeGridSize();
      multiGridRef.current.forceUpdateGrids();
    }
  }, [sortedDataDisplayHeader, viewableRows]);

  // Renders the "Include" row with either custom text, total or checkbox
  const renderIncludeRow = (row: Record<string, AnyType>, column: string) => {
    if (column === TOTAL) return <TotalText>Total</TotalText>;
    if (column === SIDE_HEADER) return "Included in calculation";
    return renderIncludeCheckbox(row, column);
  };

  // Renders the checkbox for "Include" row
  const renderIncludeCheckbox = (
    row: Record<string, AnyType>,
    column: string
  ) => (
    <Checkbox
      style={{
        padding: 0,
      }}
      disableRipple
      checkedIcon={<CheckedIcon />}
      icon={<UncheckedIcon />}
      value={row[column]}
      checked={Boolean(row[column])}
      onChange={(_, checked) =>
        transitionFunc(() =>
          setDataDisplayHeader((prev) =>
            prev.map((header) => ({
              ...header,
              active:
                header[groupingValue] === column ? checked : header.active,
            }))
          )
        )
      }
    />
  );

  // Handles Excel export for a specific row
  const handleDownloadByRow = (value: string) => {
    const filteredValues = basicTableData.filter(
      (item) => (item.result as unknown as string[]).join("/") === value
    );
    exportBasicTableToExcel(basicTableHeader, filteredValues, value);
  };

  const downloadGroupedByRow = () => {
    const rows = viewableRows
      .filter((row) => !row.header)
      .map((item) => String(item.sideHeader));

    const tableDataByRows = rows.map((row) =>
      basicTableData.filter(
        (item) => (item.result as unknown as string[]).join("/") === row
      )
    );

    exportMultipleTablesToExcel(basicTableHeader, tableDataByRows, rows);
  };

  // Renders the content of a cell, including pin & download icons when appropriate
  const renderCellText = (row: Record<string, AnyType>, column: string) => {
    const isHeader = row.header;
    const val = row[column] ? String(row[column]) : "";
    if (isHeader || column !== SIDE_HEADER) {
      return <Stack>{getElipsis(val ?? "", MAX_CHARS)}</Stack>;
    }

    return (
      <RowLabelWrapper>
        {getElipsis(val, MAX_CHARS * 1.25)}
        <RowLabelCell>
          <IconButtonStyled
            onClick={() => handleDownloadByRow(String(row[column]))}
          >
            <DownloadIconStyled />
          </IconButtonStyled>
        </RowLabelCell>
      </RowLabelWrapper>
    );
  };

  return (
    <TableScrollableWrapper id={id}>
      <TableHeaderStyled>
        <TableTitle>{title}</TableTitle>
        <ButtonsWrapper>
          {selectedTable !== "all" && canProcess && (
            <ExcelDownloadButton
              variant="contained"
              onClick={() => {
                setIsProcessModalOpen(true);
                setCurrentProcessObject({
                  title,
                  rows: viewableRows.slice(
                    fixedRowCount,
                    viewableRows.length - 1
                  ),

                  level: 0,
                });
              }}
              endIcon={<QueryStatsIconStyled />}
            >
              Process Analysis
            </ExcelDownloadButton>
          )}
          <ExcelDownloadButton
            onClick={onExportClick}
            variant="contained"
            endIcon={<DownloadIcon />}
          >
            Download
          </ExcelDownloadButton>
          {title !== "All items" && (
            <ExcelDownloadButton
              onClick={downloadGroupedByRow}
              variant="contained"
              endIcon={<DownloadIcon />}
            >
              Grouped By Row
            </ExcelDownloadButton>
          )}
        </ButtonsWrapper>
      </TableHeaderStyled>
      <AutoSizer
        style={{
          ...styles.autosizerWrapper,
          height: viewableRows.length * 24 + 17,
        }}
      >
        {({ width, height }) => (
          <MultiGrid
            ref={multiGridRef}
            fixedColumnCount={1}
            fixedRowCount={fixedRowCount}
            columnWidth={(params: Index) =>
              params.index === 0 ? COLUMN_WIDTH * 1.5 : COLUMN_WIDTH
            }
            columnCount={tableColumns.length}
            rowHeight={ROW_HEIGHT}
            rowCount={viewableRows.length}
            width={width - WIDTH_ADJUST}
            height={height - HEIGHT_ADJUST}
            cellRenderer={({ columnIndex, rowIndex, key, style }) => {
              const column = tableColumns[columnIndex];
              const row = viewableRows[rowIndex];

              if (!row) return null;

              const tooltipTitle =
                typeof row[column] === "string" &&
                (row[column] as string).length > MAX_CHARS
                  ? (row[column] as string)
                  : "";

              return (
                <div key={key} style={style}>
                  <Tooltip title={tooltipTitle}>
                    <Typography
                      component={"div"}
                      style={
                        {
                          ...styles.cellBaseStyle,
                          ...getStylesBasedOnColumn(
                            column,
                            row,
                            mappingValue,
                            selectedRows
                          ),
                          ...getStylesBasedOnHeader(rowIndex, fixedRowCount),
                        } as React.CSSProperties
                      }
                    >
                      {row.sideHeader === INCLUDE
                        ? renderIncludeRow(row, column)
                        : renderCellText(row, column)}
                    </Typography>
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
