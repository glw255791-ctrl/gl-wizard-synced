import { Stack, Tooltip, Typography } from "@mui/material";
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
import { getElipsis } from "../../data-overview/table/functions";
import { useCallback } from "react";
import { exportTableToExcel } from "./functions";
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
    switch (key) {
      case VALUE:
        return Number(Number(value).toFixed(2)).toLocaleString("de-DE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          useGrouping: true,
        });
      case DATE:
        return formatDate(value as Date, "dd-MM-yyyy");
      case RESULT:
        return reversalReclassification
          ? String(value)
          : (value as string[])?.join("/");
      default:
        return String(value);
    }
  };

  const onExportTable = useCallback(() => {
    exportTableToExcel(header, data);
  }, [header, data]);

  return (
    <Wrapper>
      <TableHeaderStyled>
        <TableTitle>Data overview</TableTitle>
        <ExcelDownloadButton
          onClick={onExportTable}
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
                  cellRenderer={({ cellData }) => (
                    <Tooltip
                      title={
                        String(getCellValueFormatted(col.key, cellData))
                          .length > MAX_CHARS
                          ? getCellValueFormatted(col.key, cellData)
                          : ""
                      }
                    >
                      <Typography
                        component={"div"}
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
                          getElipsis(
                            getCellValueFormatted(col.key, cellData),
                            MAX_CHARS
                          )
                        )}
                      </Typography>
                    </Tooltip>
                  )}
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
