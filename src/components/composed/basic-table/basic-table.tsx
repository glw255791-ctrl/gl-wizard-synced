import { Button, Stack, Tooltip, Typography } from "@mui/material";
import { formatDate } from "date-fns";
import { getCellStyleByHeader, styles } from "./basic-table.style";
import DownloadIcon from "@mui/icons-material/Download";

import { Table, Column, AutoSizer } from "react-virtualized";
import "react-virtualized/styles.css";
import { getElipsis } from "../../analysed-data-overview/table/functions";
import { useCallback } from "react";
import { exportTableToExcel } from "./functions";

const HEIGHT_ADJUST = 80;
const HEADER_HEIGHT = 24;
const ROW_HEIGHT = 24;
const MAX_CHARS = 20;
const DATE = "date";
const RESULT = "result";
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
  const getCellValueFormatted = (
    key: string,
    value: string | Date | number | string[]
  ) => {
    switch (key) {
      case DATE:
        return formatDate(value as Date, "dd-MM-yyyy");
      case RESULT:
        return reversalReclassification
          ? String(value || "-")
          : (value as string[])?.join("/");
      default:
        return String(value);
    }
  };

  const onExportTable = useCallback(
    () => exportTableToExcel(header, data),
    [header, data]
  );

  return (
    <Stack style={styles.root}>
      <Stack style={styles.tableHeader}>
        <Typography style={styles.tableTitle}>Data overview</Typography>
        <Button
          onClick={onExportTable}
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
              height={height - HEIGHT_ADJUST}
              headerHeight={HEADER_HEIGHT}
              rowHeight={ROW_HEIGHT}
              rowCount={data.length}
              rowGetter={({ index }) => data[index]}
            >
              {header.map((item, index) => (
                <Column
                  style={styles.columnStyle}
                  key={index}
                  label={item.title}
                  dataKey={item.key}
                  width={width / header.length}
                  minWidth={width / header.length}
                  maxWidth={width / header.length}
                  flexGrow={1}
                  cellRenderer={({ cellData }) => (
                    <Tooltip
                      title={
                        getCellValueFormatted(item.key, cellData)?.length >
                        MAX_CHARS
                          ? getCellValueFormatted(item.key, cellData)
                          : ""
                      }
                    >
                      <Stack
                        style={{
                          ...styles.cellBaseStyle,
                          ...getCellStyleByHeader(item.key),
                        }}
                      >
                        {getElipsis(
                          getCellValueFormatted(item.key, cellData),
                          MAX_CHARS
                        )}
                      </Stack>
                    </Tooltip>
                  )}
                  headerStyle={styles.headerWrapper}
                  headerRenderer={({ label }) => (
                    <Stack style={styles.headerCell}>
                      {getElipsis(label as string, 25)}
                    </Stack>
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
