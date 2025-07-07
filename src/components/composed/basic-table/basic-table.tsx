import {
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { formatDate } from "date-fns";
import { styles } from "./basic-table.style";
import DownloadIcon from "@mui/icons-material/Download";
import { RefObject, useRef } from "react";
import { Workbook } from "exceljs";
import saveAs from "file-saver";

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

  const tableRef = useRef(null);

  const exportTableToExcel = async () => {
    const tableData = (tableRef as RefObject<HTMLTableElement | null>).current;

    if (!tableData) return;

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const rows = tableData.querySelectorAll("tr");

    rows.forEach((row) => {
      const data = Array.from(row.querySelectorAll("td")).map((cell) =>
        cell?.textContent?.trim()
      );
      worksheet.addRow(data);
    });

    worksheet.columns.forEach((column, index) => {
      if (index === 0) column.width = 24;
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
      <TableContainer>
        <Table ref={tableRef}>
          <TableBody>
            <TableRow style={styles.tableRow}>
              {header.map((item) => (
                <TableCell
                  style={{
                    ...styles.headerTableCell,
                    ...(item.key === "value" || item.key === "result"
                      ? styles.rightAlign
                      : {}),
                  }}
                  key={Math.random()}
                >
                  {item.title}
                </TableCell>
              ))}
            </TableRow>
            {data.map((item) => (
              <TableRow style={styles.tableRow} key={Math.random()}>
                {header.map((headerItem) => (
                  <Tooltip
                    title={getCellValueFormatted(
                      headerItem.key,
                      item[headerItem.title]
                    )}
                  >
                    <TableCell
                      style={getCellStyle(headerItem.key)}
                      key={Math.random()}
                    >
                      {getCellValueFormatted(
                        headerItem.key,
                        item[headerItem.title]
                      )}
                    </TableCell>
                  </Tooltip>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
