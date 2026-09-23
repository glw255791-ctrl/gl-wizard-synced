import { Stack, Typography } from "@mui/material";
import { formatDate } from "date-fns";
import {
  CheckedIcon,
  ExcelDownloadButton,
  getCellStyleByHeader,
  LabelText,
  ReversalCellWrapper,
  styles,
  TableHeaderStyled,
  TableTitle,
  UncheckedIcon,
  Wrapper,
} from "./style";
import DownloadIcon from "@mui/icons-material/Download";
import { Table, Column, AutoSizer } from "react-virtualized";
import "react-virtualized/styles.css";
import { getElipsis } from "../../data-overview/table/ellipsis";
import { useCallback, useState } from "react";
import { exportTableToExcel } from "./functions";
import { DownloadProgress } from "../download-progress/download-progress";
import { TableHeader } from "../../../types";
import { theme } from "../../../constants/theme";

// Re-export type for backward compatibility
export type { TableHeader };

const HEIGHT_ADJUST = 80;
const HEADER_HEIGHT = theme.height.headerWrapper;
const ROW_HEIGHT = theme.height.cell;
const MAX_CHARS = theme.textTruncation.maxChars;

const DATE = "date";
const RESULT = "result";
const REVERSAL = "reversal";
const VALUE = "value";

interface Props {
  header: TableHeader[];
  data: Record<string, string>[];
  reversalReclassification?: boolean;
}

/**
 * Basic table component for displaying data with export functionality
 * @param header - Array of table header definitions
 * @param data - Array of row data objects
 * @param reversalReclassification - Optional flag for reversal/reclassification mode
 */
export const BasicTable = ({
  header,
  data,
  reversalReclassification,
}: Props) => {
  /**
   * Formats a cell value based on its key/column type
   * @param key - The column key identifier
   * @param value - The cell value to format
   * @returns Formatted string representation of the value
   */
  const getCellValueFormatted = (
    key: string,
    value: string | Date | number | string[]
  ) => {
    if (value == null) return "";
    switch (key) {
      case VALUE:
        return typeof value === "number"
          ? Number(value.toFixed(2)).toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              useGrouping: true,
            })
          : String(value);
      case DATE:
        return value instanceof Date
          ? formatDate(value, "dd-MM-yyyy")
          : String(value);
      case RESULT:
        return Array.isArray(value)
          ? reversalReclassification
            ? String(value)
            : value.join("/")
          : String(value);
      default:
        return String(value);
    }
  };

  const [exportProgress, setExportProgress] = useState<{
    done: number;
    total: number;
  } | null>(null);

  const onExportTable = useCallback(async () => {
    setExportProgress({ done: 0, total: data.length });
    try {
      await exportTableToExcel(header, data, (done, total) =>
        setExportProgress({ done, total })
      );
    } finally {
      setExportProgress(null);
    }
  }, [header, data]);

  return (
    <Wrapper>
      <TableHeaderStyled>
        <TableTitle>Data overview</TableTitle>
        {exportProgress ? (
          <DownloadProgress done={exportProgress.done} total={exportProgress.total} />
        ) : null}
        <ExcelDownloadButton
          onClick={onExportTable}
          disabled={exportProgress != null}
          variant="contained"
          endIcon={<DownloadIcon />}
        >
          Download
        </ExcelDownloadButton>
      </TableHeaderStyled>

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
              {header.map((col) => (
                <Column
                  key={col.key}
                  label={col.title}
                  dataKey={col.key}
                  style={styles.columnStyle}
                  width={width / header.length}
                  minWidth={width / header.length}
                  maxWidth={width / header.length}
                  flexGrow={1}
                  cellRenderer={({ cellData }) => {
                    const text =
                      col.key === REVERSAL
                        ? ""
                        : getCellValueFormatted(col.key, cellData);
                    return (
                      <Typography
                        component={"div"}
                        title={text.length > MAX_CHARS ? text : undefined}
                        style={{
                          ...styles.cellBaseStyle,
                          ...getCellStyleByHeader(col.key),
                        }}
                      >
                        {col.key === REVERSAL ? (
                          cellData === "reversal" ? (
                            <ReversalCellWrapper>
                              <CheckedIcon />
                              <LabelText>Reversal</LabelText>
                            </ReversalCellWrapper>
                          ) : (
                            <UncheckedIcon />
                          )
                        ) : (
                          getElipsis(text, MAX_CHARS)
                        )}
                      </Typography>
                    );
                  }}
                  headerStyle={styles.headerWrapper}
                  headerRenderer={({ label }) => (
                    <Stack style={styles.headerCell}>
                      {getElipsis(
                        label as string,
                        theme.textTruncation.maxCharsShort
                      )}
                    </Stack>
                  )}
                  cellDataGetter={({ rowData }) =>
                    rowData[col.title === "Result" ? "result" : col.title]
                  }
                />
              ))}
            </Table>
          )}
        </AutoSizer>
      )}
    </Wrapper>
  );
};
