import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Stack,
  Checkbox,
  Tooltip,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import "react-virtualized/styles.css";
import { AutoSizer, MultiGrid } from "react-virtualized";

import {
  AnyType,
  exportBasicTableToExcel,
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
  styles,
} from "./style";
import { colors } from "../../../assets/colors";
import { TotalText } from "./style";
import { TableHeader } from "../../composed/basic-table/basic-table";

const COLUMN_WIDTH = 250;
const ROW_HEIGHT = 24;
const WIDTH_ADJUST = 2;
const HEIGHT_ADJUST = 73;
const MAX_CHARS = 35;

const TOTAL = "total";
const INCLUDE = "Include";
const SIDE_HEADER = "sideHeader";

interface Props {
  title: string;
  sortedDataDisplayHeader: Record<string, AnyType>[];
  mappingValue: string;
  overviewTableData: Record<string, AnyType>;
  valueKey: string;
  selectedRow?: string;
  id?: string;
  transitionFunc: React.TransitionStartFunction;
  selectedFilter: Filters;
  setDataDisplayHeader: React.Dispatch<
    React.SetStateAction<Record<string, AnyType>[]>
  >;
  basicTableHeader: TableHeader[];
  basicTableData: Record<string, string>[];
  dictionaryData: Record<string, any>[];
}

interface Filters {
  header: string;
  value: string;
}

export const DataTable: React.FC<Props> = ({
  title,
  sortedDataDisplayHeader,
  mappingValue,
  selectedRow,
  overviewTableData,
  valueKey,
  basicTableData,
  basicTableHeader,
  dictionaryData,
  transitionFunc,
  id,
  setDataDisplayHeader,
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
      setTableColumns(columns);
      setTableRows(rows);
    };
    worker.postMessage({
      sortedDataDisplayHeader,
      overviewTableData,
      mappingValue,
      valueKey,
      colors,
    });
  };

  useEffect(() => {
    generateTableData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedDataDisplayHeader, overviewTableData]);

  // Export table data to Excel
  const onExportClick = useCallback(
    () => exportTableToExcel(tableRows, sortedDataDisplayHeader, mappingValue),
    [tableRows, sortedDataDisplayHeader, mappingValue]
  );

  // Calculate number of fixed header rows
  const fixedRowCount = useMemo(
    () => Object.keys(sortedDataDisplayHeader[0])?.length || 1,
    [sortedDataDisplayHeader]
  );

  // Force update of grid when data changes
  useEffect(() => {
    if (multiGridRef.current) {
      multiGridRef.current.recomputeGridSize();
      multiGridRef.current.forceUpdateGrids();
    }
  }, [sortedDataDisplayHeader, tableRows]);

  // Renders the "Include" row with either custom text, total or checkbox
  const renderIncludeRow = (
    row: Record<string, AnyType>,
    column: string
  ) => {
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
      disableRipple
      disabled={!!selectedRow}
      checkedIcon={<CheckedIcon />}
      icon={<UncheckedIcon />}
      value={row[column]}
      checked={Boolean(row[column])}
      onChange={(_, checked) =>
        transitionFunc(() =>
          setDataDisplayHeader((prev) =>
            prev.map((header) => ({
              ...header,
              active: header[mappingValue] === column ? checked : header.active,
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

  const renderDictionaryCell = (val: string | undefined) => {
    const values = val?.split("/")

    // Find a dictionary item where item.inputs has all the same elements as values (regardless of order)
    const dictionaryItem = dictionaryData.find(item => {
      if (!Array.isArray(item.inputs) || !Array.isArray(values)) return false;
      if (item.inputs.length !== values.length) return false;
      // Check if every value is in item.inputs, and vice versa (set equality)
      const inputsSorted = [...item.inputs].sort();
      const valuesSorted = [...values].sort();
      return inputsSorted.find((v, i) => v === valuesSorted[i]);
    });

    return dictionaryItem?.result ?? val;
  };

  // Renders the content of a cell, including pin & download icons when appropriate
  const renderCellText = (
    row: Record<string, AnyType>,
    column: string
  ) => {
    const isHeader = row.header;
    const val =
      row[column] ?
        getElipsis(row[column] as string, MAX_CHARS - 5) :
        "";

    if (isHeader || column !== SIDE_HEADER) {
      return <Stack>{val}</Stack>;
    }

    return (
      <RowLabelWrapper>
        {renderDictionaryCell(val)}
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
        <ExcelDownloadButton
          onClick={onExportClick}
          variant="contained"
          endIcon={<DownloadIcon />}
        >
          Download
        </ExcelDownloadButton>
      </TableHeaderStyled>
      <AutoSizer
        style={{
          ...styles.autosizerWrapper,
          height: tableRows.length * 24 + 17,
        }}
      >
        {({ width, height }) => (
          <MultiGrid
            key={String(selectedRow)}
            ref={multiGridRef}
            fixedColumnCount={1}
            fixedRowCount={fixedRowCount}
            columnWidth={COLUMN_WIDTH}
            columnCount={tableColumns.length}
            rowHeight={ROW_HEIGHT}
            rowCount={tableRows.length}
            width={width - WIDTH_ADJUST}
            height={height - HEIGHT_ADJUST}
            cellRenderer={({ columnIndex, rowIndex, key, style }) => {
              const column = tableColumns[columnIndex];
              const row = tableRows[rowIndex];

              if (!row) return null;

              const tooltipTitle =
                typeof row[column] === "string" &&
                  (row[column] as string).length > MAX_CHARS
                  ? (row[column] as string)
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
                            selectedRow
                          ),
                          ...getStylesBasedOnHeader(
                            rowIndex,
                            sortedDataDisplayHeader
                          ),
                        } as React.CSSProperties
                      }
                    >
                      {row.sideHeader === INCLUDE
                        ? renderIncludeRow(row, column)
                        : renderCellText(row, column)}
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
