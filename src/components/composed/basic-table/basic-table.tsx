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

export const BasicTable = ({
  header,
  data,
  reversalReclassification,
}: Props) => {
  const exportTableToExcel = async () => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const fullHeader = Object.keys(data[0]).filter(
      (item) => item !== "coaData"
    );
    worksheet.addRow(fullHeader.map((item) => item));

    data.forEach((row) => {
      const rowData = fullHeader.map((item) => {
        const val = row[item];

        const formattedVal =
          item === "result" && typeof val === "object"
            ? (val as string[]).join("/")
            : item === header.find((it) => it.key === "date")?.title
            ? formatDate(val, "dd-MM-yyyy")
            : val;

        return typeof formattedVal === "object" ? "" : formattedVal;
      });

      worksheet.addRow(rowData);
    });

    worksheet.columns.forEach((column) => {
      column.width = 24;
    });

    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        const isHeader = rowNumber === 1;

        if (isHeader) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "CCCCCC" },
          };
        }

        if (isHeader) {
          cell.font = { bold: true };
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
          onClick={exportTableToExcel}
          variant="contained"
          style={styles.downloadBtn}
          endIcon={<DownloadIcon />}
        >
          Download
        </Button>
      </Stack>

      {data.length > 0 && (
        <AutoSizer style={styles.autoSizer}>
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
                  label={item.title}
                  dataKey={item.key}
                  width={width / header.length}
                  minWidth={width / header.length}
                  maxWidth={width / header.length}
                  flexGrow={1}
                  cellRenderer={({ cellData }) => (
                    <Tooltip title={getCellValueFormatted(item.key, cellData)}>
                      <Stack style={getCellStyle(item.key)}>
                        {getElipsis(
                          getCellValueFormatted(item.key, cellData),
                          20
                        )}
                      </Stack>
                    </Tooltip>
                  )}
                  headerRenderer={({ label }) => (
                    <Stack style={styles.headerCell}>{label}</Stack>
                  )}
                  cellDataGetter={({ rowData }) => rowData[item.title]}
                />
              ))}
            </Table>
          )}
        </AutoSizer>
      )}
    </Stack>
  );
};
