import {
  Stack,
  Typography,
  Checkbox,
  Button,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "react-virtualized/styles.css";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelRounded from "@mui/icons-material/CancelRounded";
import {
  AnyType,
  exportBasicTableToExcel,
  exportTableToExcel,
  getElipsis,
} from "./functions";
import PushPinIcon from "@mui/icons-material/PushPin";
import {
  getStylesBasedOnColumn,
  getStylesBasedOnHeader,
  styles,
} from "./table-style";
import { AutoSizer, MultiGrid } from "react-virtualized";
import { colors } from "../../../assets/colors";
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
  setSelectedRow?: React.Dispatch<React.SetStateAction<string>>;
  selectedFilter: Filters;
  setDataDisplayHeader: React.Dispatch<
    React.SetStateAction<Record<string, AnyType>[]>
  >;
  basicTableHeader: TableHeader[];
  basicTableData: Record<string, string>[];
}

interface Filters {
  header: string;
  value: string;
}

export const DataTable = (props: Props) => {
  const {
    title,
    sortedDataDisplayHeader,
    mappingValue,
    selectedRow,
    overviewTableData,
    valueKey,
    basicTableData,
    basicTableHeader,
    transitionFunc,
    id,
    setSelectedRow,
    setDataDisplayHeader,
  } = props;

  const [tableRows, setTableRows] = useState<Record<string, AnyType>[]>([]);
  const [tableColumns, setTableColumns] = useState<string[]>([]);

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

  const onExportClick = useCallback(
    () => exportTableToExcel(tableRows, sortedDataDisplayHeader, mappingValue),
    [tableRows, sortedDataDisplayHeader, mappingValue]
  );

  const fixedRowCount = useMemo(
    () => Object.keys(sortedDataDisplayHeader[0]).length,
    [sortedDataDisplayHeader]
  );

  const multiGridRef = useRef<MultiGrid>(null);

  // Force MultiGrid to repaint when data changes
  useEffect(() => {
    if (multiGridRef.current) {
      multiGridRef.current.recomputeGridSize();
      multiGridRef.current.forceUpdateGrids();
    }
  }, [sortedDataDisplayHeader, tableRows]);

  const renderIncludeRow = (row: Record<string, AnyType>, column: string) =>
    column === TOTAL ? (
      <Typography style={styles.totalText}>Total</Typography>
    ) : column === SIDE_HEADER ? (
      "Included in calculation"
    ) : (
      renderIncludeCheckbox(row, column)
    );

  const renderIncludeCheckbox = (
    row: Record<string, AnyType>,
    column: string
  ) => (
    <Checkbox
      disableRipple
      disabled={!!setSelectedRow}
      checkedIcon={<CheckCircleIcon style={styles.checkedIcon} />}
      icon={<CancelRounded style={styles.uncheckedIcon} />}
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

  const handleDownloadByRow = (value: string) => {
    const filteredValues = basicTableData.filter(
      (item) => (item.result as unknown as string[]).join("/") === value
    );
    exportBasicTableToExcel(basicTableHeader, filteredValues);
  };

  const renderCellText = (row: Record<string, AnyType>, column: string) => {
    const isHeader = row.header;
    const val = row[column]
      ? getElipsis(row[column] as string, MAX_CHARS - 5)
      : "";
    if (isHeader || column !== SIDE_HEADER) return <Stack>{val}</Stack>;
    else
      return (
        <Stack style={styles.rowLabelWrapper}>
          {val}
          <Stack style={styles.rowLabelCell}>
            {setSelectedRow && (
              <IconButton
                style={styles.iconBtn}
                onClick={() => {
                  const val = row.sideHeader as string;
                  if (!row.header)
                    setSelectedRow?.((prev) => (prev === val ? "" : val));
                }}
              >
                <PushPinIcon
                  style={{
                    color:
                      selectedRow === row.sideHeader
                        ? "gray"
                        : colors.fairyTale,
                    fontSize: 16,
                  }}
                />
              </IconButton>
            )}
            <IconButton
              style={styles.iconBtn}
              onClick={() => handleDownloadByRow(val)}
            >
              <DownloadIcon style={styles.cellDownloadBtn} />
            </IconButton>
          </Stack>
        </Stack>
      );
  };

  return (
    <Stack id={id} style={styles.tableScrollableWrapper}>
      <Stack style={styles.tableHeader}>
        <Typography style={styles.tableTitle}>{title}</Typography>
        <Button
          onClick={onExportClick}
          variant="contained"
          style={styles.excelBtn}
          endIcon={<DownloadIcon />}
        >
          Download
        </Button>
      </Stack>
      <AutoSizer
        style={{ ...styles.autosizerWrapper, height: tableRows.length * 25 }}
      >
        {({ width, height }) => (
          <MultiGrid
            key={`${selectedRow}`}
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

              if (!row) return <></>;

              return (
                <div key={key} style={style}>
                  <Tooltip
                    title={
                      (row[column] as string)?.length > MAX_CHARS
                        ? (row[column] as string)
                        : ""
                    }
                  >
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
    </Stack>
  );
};
