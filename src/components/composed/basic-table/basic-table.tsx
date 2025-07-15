import { Button, Stack, Tooltip, Typography } from "@mui/material";
import { formatDate } from "date-fns";
import { styles } from "./basic-table.style";
import DownloadIcon from "@mui/icons-material/Download";
import { Workbook } from "exceljs";
import saveAs from "file-saver";
import { Table, Column, AutoSizer } from "react-virtualized";
import "react-virtualized/styles.css";
import { getElipsis } from "../../analysed-data-overview/table/functions";

interface Props {
  header: TableHeader[];
  data: Record<string, string>[];
  reversalReclassification?: boolean;
}

export interface TableHeader {
  key: string;
  title: string;
}

export const BasicTable = (props: Props) => {
  const { header, data, reversalReclassification } = props;

  const exportTableToExcel = async () => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const rows = data;

    worksheet.addRow(header.map((item) => item.title));
    rows.forEach((row) => {
      const data = header.map((item) => {
        const val = row[item.title];

        const formatedVal =
          item.key === "result" && typeof val === "object"
            ? (val as string[]).join("/")
            : item.key === "date"
            ? formatDate(val, "dd-MM-yyyy")
            : val;

        return typeof formatedVal === "object" ? "" : formatedVal;
      });
      worksheet.addRow(data);
    });

    worksheet.columns.forEach((column, index) => {
      if (index === 0) column.width = 24;
      else if (index === 5) column.width = 100;
      else column.width = 18;
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

        if (colNumber === 1 || colNumber === 5) {
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

  const getCellValueFormatted = (
    key: string,
    value: string | Date | number | string[]
  ) => {
    switch (key) {
      case "date":
        return formatDate(value as Date, "dd-MM-yyyy");
      case "result":
        return reversalReclassification
          ? String(value || "-")
          : (value as string[])?.join("/");
      default:
        return String(value);
    }
  };

  const getCellStyle = (key: string) => {
    switch (key) {
      case "value":
        return styles.valueCell;
      case "result":
        return styles.resultCell;
      case "account":
        return styles.accountCell;
      default:
        return styles.tableCell;
    }
  };

  return (
    <Stack style={styles.root}>
      <Stack style={styles.tableHeader}>
        <Typography style={styles.tableTitle}>Data overview</Typography>
        <Button
          onClick={() => exportTableToExcel()}
          variant="contained"
          style={styles.downloadBtn}
          endIcon={<DownloadIcon />}
        >
          Download
        </Button>
      </Stack>

      {data.length && (
        <AutoSizer style={{ width: "100%", height: 600 }}>
          {({ width, height }) => (
            <Table
              width={width}
              height={height - 80}
              headerHeight={40}
              rowHeight={30}
              rowCount={data.length}
              rowGetter={({ index }) => data[index]}
            >
              {header.map((item, index) => (
                <Column
                  key={index}
                  label={item?.title}
                  dataKey={item.key}
                  width={width / header.length}
                  minWidth={width / header.length}
                  maxWidth={width / header.length}
                  flexGrow={1}
                  cellRenderer={(props) => {
                    return (
                      <Tooltip
                        title={getCellValueFormatted(item.key, props.cellData)}
                      >
                        <Stack style={getCellStyle(item.key)}>
                          {getElipsis(
                            getCellValueFormatted(item.key, props.cellData),
                            20
                          )}
                        </Stack>
                      </Tooltip>
                    );
                  }}
                  headerRenderer={(props) => (
                    <Stack style={{ flex: 1, textAlign: "left" }}>
                      {props.label}
                    </Stack>
                  )}
                  cellDataGetter={(params) => params.rowData[item.title]}
                />
              ))}
            </Table>
          )}
        </AutoSizer>
      )}
    </Stack>
  );
};
