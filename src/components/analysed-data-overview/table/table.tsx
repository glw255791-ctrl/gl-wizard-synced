import { Stack, Typography, Checkbox, Button, Tooltip } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import "react-virtualized/styles.css";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelRounded from "@mui/icons-material/CancelRounded";
import { AnyType, getElipsis } from "./functions";

import { styles } from "./table-style";
import { AutoSizer, Column, Table } from "react-virtualized";
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

  const [tableWidth, setTableWidth] = useState(1000);
  const [tableHeight, setTableHeight] = useState(600);

  const [tableRows, setTableRows] = useState<Record<string, AnyType>[]>([]);
  const [tableColumns, setTableColumns] = useState<string[]>([]);

  const generateTableData = () => {
    const columns: string[] = [
      "sideHeader",
      ...sortedDataDisplayHeader.map((item) => item[mappingValue] as string),
    ];

    const rows = [
      ...Object.keys(sortedDataDisplayHeader[0]).map((item) => ({
        sideHeader: item === "active" ? "Include" : item,
        ...Object.fromEntries(
          columns
            .filter((item) => item !== "sideHeader")
            .map((key, index) => [key, sortedDataDisplayHeader[index][item]])
        ),
        total: "",
        bg: colors.powderBlue,
        header: true,
      })),
      ...Object.keys(overviewTableData).map((item) => {
        const generatedRowObject = Object.fromEntries(
          columns
            .filter((item) => item !== "total" && item !== "sideHeader")
            .map((key) => [
              key,
              Number(
                (overviewTableData[item] as Record<string, AnyType>[])
                  .filter(
                    (it) =>
                      (it.coaData as Record<string, AnyType>)[mappingValue] ===
                      key
                  )
                  .reduce((prev, curr) => prev + (curr[valueKey] as number), 0)
              ).toFixed(2),
            ])
        );

        const total = sortedDataDisplayHeader
          .filter((item) => item.active)
          .map((item) => item[mappingValue])
          .reduce(
            (prev: number, curr) =>
              prev +
              Number(generatedRowObject[curr as string] as string | number),
            0
          );
        return {
          sideHeader: item,
          ...generatedRowObject,
          total: (total as number).toFixed(2),
          bg: "white",
          header: false,
        };
      }),
      {
        sideHeader: "Total",
        ...Object.fromEntries(
          columns
            .filter((item) => item !== "total" && item !== "sideHeader")
            .map((key) => [
              key,
              Number(
                Object.values(overviewTableData)
                  .flat()
                  .filter(
                    (item) =>
                      (
                        (item as Record<string, AnyType>).coaData as Record<
                          string,
                          AnyType
                        >
                      )[mappingValue] === key
                  )
                  .reduce(
                    (prev: number, curr) =>
                      prev +
                      Number(
                        (curr as Record<string, AnyType>)[
                          valueKey as string
                        ] as string | number
                      ),
                    0
                  )
              ).toFixed(2),
            ])
        ),
        bg: colors.powderBlue,
        header: true,
      },
    ];
    setTableColumns(columns);
    setTableWidth(250 * columns.length);
    setTableHeight(
      24 * rows.filter((item) => !item.header).length +
        36 * rows.filter((item) => item.header).length +
        24
    );
    setTableRows(rows);
  };

  useEffect(() => {
    generateTableData();
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
      <AutoSizer
        style={{ width: "100%", overflowX: "auto", height: tableHeight }}
      >
        {() => (
          <Table
            width={tableWidth}
            height={tableHeight - 24}
            rowCount={tableRows.length}
            rowStyle={{ width: tableWidth }}
            rowHeight={(params) => (tableRows[params.index].header ? 36 : 24)}
            headerHeight={0}
            rowGetter={({ index }) => tableRows[index]}
            onRowClick={(params) => {
              if (params.rowData.header) return;
              else {
                setSelectedRow?.((prev) =>
                  prev === "" ? params.rowData.sideHeader : ""
                );
              }
            }}
          >
            {tableColumns.map((item) => (
              <Column
                key={item}
                label={item}
                dataKey={item}
                width={250}
                minWidth={250}
                maxWidth={250}
                flexGrow={1}
                style={{ margin: 0 }}
                cellRenderer={(props) => {
                  const Wrapper =
                    props.rowData[item]?.length > 80 ? Tooltip : Fragment;
                  return (
                    <Wrapper title={props.rowData[item]}>
                      <Stack
                        style={{
                          padding: "0 5px",
                          backgroundColor:
                            item === "total"
                              ? colors.powderBlue
                              : selectedRow === props.rowData.sideHeader
                              ? colors.fairyTale
                              : props.rowData.bg,
                          borderRightWidth: 1,
                          borderRightStyle: "solid",
                          borderRightColor: colors.honeydew,
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                          whiteSpace: "normal",
                          height: props.rowData.header ? 35 : 23,
                          justifyContent: "center",
                          borderBottomWidth: 1,
                          borderBottomStyle: "solid",
                          borderBottomColor: colors.honeydew,
                          fontSize: 12,
                          fontWeight:
                            item === "total" ||
                            item === "sideHeader" ||
                            props.rowData.sideHeader === "Total" ||
                            props.rowData.sideHeader === mappingValue
                              ? "bold"
                              : "initial",
                          textAlign: item === "sideHeader" ? "left" : "center",
                        }}
                      >
                        {props.rowData.sideHeader === "Include" ? (
                          item === "total" ? (
                            <Typography
                              style={{ fontSize: 14, fontWeight: "bold" }}
                            >
                              Total
                            </Typography>
                          ) : item === "sideHeader" ? (
                            "-"
                          ) : (
                            <Checkbox
                              disabled={!!setSelectedRow}
                              checkedIcon={
                                <CheckCircleIcon style={{ color: "green" }} />
                              }
                              icon={<CancelRounded style={{ color: "red" }} />}
                              value={props.rowData[item]}
                              checked={Boolean(props.rowData[item])}
                              onChange={(_, checked) =>
                                setDataDisplayHeader((prev) =>
                                  prev.map((header) => ({
                                    ...header,
                                    active:
                                      header[mappingValue] === item
                                        ? checked
                                        : header.active,
                                  }))
                                )
                              }
                            />
                          )
                        ) : props.rowData[item] ? (
                          getElipsis(props.rowData[item], 80)
                        ) : (
                          ""
                        )}
                      </Stack>
                    </Wrapper>
                  );
                }}
                headerRenderer={() => <></>}
                cellDataGetter={(params) => params.rowData[item]}
              />
            ))}
          </Table>
        )}
      </AutoSizer>
    </Stack>
  );
};
