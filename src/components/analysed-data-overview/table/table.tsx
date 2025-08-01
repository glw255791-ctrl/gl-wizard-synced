import { Stack, Typography, Checkbox, Button, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import "react-virtualized/styles.css";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelRounded from "@mui/icons-material/CancelRounded";
import { AnyType, getElipsis } from "./functions";

import { styles } from "./table-style";
import { AutoSizer, MultiGrid } from "react-virtualized";
import { colors } from "../../../assets/colors";
import saveAs from "file-saver";
import { Workbook } from "exceljs";

interface Props {
  title: string;
  sortedDataDisplayHeader: Record<string, AnyType>[];
  mappingValue: string;
  overviewTableData: Record<string, AnyType>;
  valueKey: string;
  selectedRow?: string;
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
    setSelectedRow,
    setDataDisplayHeader,
  } = props;

  const [tableHeight, setTableHeight] = useState(600);

  const [tableRows, setTableRows] = useState<Record<string, AnyType>[]>([]);
  const [tableColumns, setTableColumns] = useState<string[]>([]);

  const generateTableData = () => {
    const worker = new Worker(
      new URL("./generate-table-data.js", import.meta.url)
    );

    worker.onmessage = (e) => {
      const { columns, rows, height } = e.data;
      setTableColumns(columns);
      setTableRows(rows);
      setTableHeight(height);
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

  const exportTableToExcel = async () => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const rows = tableRows;
    const headers: string[] = sortedDataDisplayHeader
      .filter((item) => item.active)
      .map((item) => item[mappingValue] as string);

    worksheet.addRow([
      rows[0].sideHeader,
      ...headers.map((item) => rows[0][item] as string),
      "total",
    ]);
    rows.slice(1).forEach((row) => {
      const data = headers.map((item) => {
        return row[item];
      });
      if (row.sideHeader !== "Include")
        worksheet.addRow([row.sideHeader, ...data, row.total]);
    });

    worksheet.columns.forEach((column) => {
      column.width = 40;
    });

    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        if (rowNumber === 1) {
          cell.font = { bold: true };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "CCCCCC" },
          };
        }

        if (colNumber === 1 || colNumber === headers.length + 2) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "CCCCCC" },
          };
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "table_data.xlsx");
  };

  return (
    <Stack style={styles.tableScrollableWrapper}>
      <Stack style={styles.tableHeader}>
        <Typography style={styles.tableTitle}>{title}</Typography>
        <Button
          onClick={exportTableToExcel}
          variant="contained"
          style={{
            ...styles.button,
            backgroundColor: "#1D6F42",
          }}
          endIcon={<DownloadIcon />}
        >
          Download
        </Button>
      </Stack>
      <AutoSizer style={{ width: "100%", overflow: "auto", height: 1000 }}>
        {({ width }) => (
          <MultiGrid
            fixedColumnCount={1}
            columnWidth={250}
            columnCount={tableColumns.length}
            rowHeight={({ index }) => {
              return tableRows[index]?.header ? 36 : 24;
            }}
            rowCount={tableRows.length}
            width={width - 20}
            height={tableHeight}
            cellRenderer={({ columnIndex, rowIndex, key, style }) => {
              const column = tableColumns[columnIndex];
              const row = tableRows[rowIndex];

              if (!row) return <></>;
              const isHeader = row.header;

              return (
                <div key={key} style={style}>
                  <Tooltip
                    title={
                      (row[column] as string)?.length > 35
                        ? (row[column] as string)
                        : ""
                    }
                  >
                    <Stack
                      style={{
                        padding: "0 5px",
                        backgroundColor:
                          column === "sideHeader"
                            ? colors.powderBlue
                            : ((column === "total"
                                ? colors.powderBlue
                                : selectedRow === row.sideHeader
                                ? colors.fairyTale
                                : row.bg) as string),
                        borderRightWidth: column === "sideHeader" ? 3 : 1,
                        borderRightStyle: "solid",
                        borderRightColor:
                          column === "sideHeader" ? "gray" : colors.honeydew,
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        whiteSpace: "normal",
                        justifyContent: "center",
                        borderBottomWidth: 1,
                        borderBottomStyle: "solid",
                        borderBottomColor: colors.honeydew,
                        fontSize: 12,
                        height: isHeader ? 35 : 23,
                        fontWeight:
                          column === "total" ||
                          column === "sideHeader" ||
                          row.sideHeader === "Total" ||
                          row.sideHeader === mappingValue
                            ? "bold"
                            : "initial",
                        textAlign: column === "sideHeader" ? "left" : "center",
                      }}
                    >
                      {row.sideHeader === "Include" ? (
                        column === "total" ? (
                          <Typography
                            style={{ fontSize: 14, fontWeight: "bold" }}
                          >
                            Total
                          </Typography>
                        ) : column === "sideHeader" ? (
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
                        getElipsis(row[column] as string, 35)
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
