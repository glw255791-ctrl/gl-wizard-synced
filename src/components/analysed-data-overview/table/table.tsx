import { Stack, Typography, Checkbox, Button, Tooltip } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import "react-virtualized/styles.css";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelRounded from "@mui/icons-material/CancelRounded";
import { AnyType, exportTableToExcel, getElipsis } from "./functions";

import {
  getStylesBasedOnColumn,
  getStylesBasedOnHeader,
  styles,
} from "./table-style";
import { AutoSizer, MultiGrid } from "react-virtualized";
import { colors } from "../../../assets/colors";

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
  setSelectedRow?: React.Dispatch<React.SetStateAction<string>>;
  selectedFilter: Filters;
  setDataDisplayHeader: React.Dispatch<
    React.SetStateAction<Record<string, AnyType>[]>
  >;
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
      <AutoSizer style={styles.autosizerWrapper}>
        {({ width, height }) => (
          <MultiGrid
            key={selectedRow}
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
                      onDoubleClick={() => {
                        setSelectedRow?.(row.sideHeader as string);
                      }}
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
                      {row.sideHeader === INCLUDE ? (
                        column === TOTAL ? (
                          <Typography style={styles.totalText}>
                            Total
                          </Typography>
                        ) : column === SIDE_HEADER ? (
                          "-"
                        ) : (
                          <Checkbox
                            disabled={!!setSelectedRow}
                            checkedIcon={
                              <CheckCircleIcon style={{ color: "green" }} />
                            }
                            icon={<CancelRounded style={{ color: "red" }} />}
                            value={row[column]}
                            checked={Boolean(row[column])}
                            onChange={(_, checked) =>
                              setDataDisplayHeader((prev) =>
                                prev.map((header) => ({
                                  ...header,
                                  active:
                                    header[mappingValue] === column
                                      ? checked
                                      : header.active,
                                }))
                              )
                            }
                          />
                        )
                      ) : row[column] ? (
                        getElipsis(row[column] as string, MAX_CHARS)
                      ) : (
                        ""
                      )}
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
