import { Stack, Tooltip } from "@mui/material";
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
import { getElipsis } from "../../analysed-data-overview/table/functions";
import { useCallback } from "react";
import { exportTableToExcel } from "./functions";

const HEIGHT_ADJUST = 80;
const HEADER_HEIGHT = 24;
const ROW_HEIGHT = 24;
const MAX_CHARS = 20;

const DATE = "date";
const RESULT = "result";
const REVERSAL = "reversal";

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
  // Utility to format a cell value based on its key/column type
  const getCellValueFormatted = (
    key: string,
    value: string | Date | number | string[]
  ) => {

    if (!value) return "-";
    switch (key) {
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

  const onExportTable = useCallback(
    () => {exportTableToExcel(header, data); },
    [header, data]
  );

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
                        String(getCellValueFormatted(col.key, cellData)).length >
                          MAX_CHARS
                          ? getCellValueFormatted(col.key, cellData)
                          : ""
                      }
                    >
                      <Stack
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
                        
                      </Stack>
                    </Tooltip>
                  )}
                  headerStyle={styles.headerWrapper}
                  headerRenderer={({ label }) => (
                    <Stack style={styles.headerCell}>
                      {getElipsis(label as string, 25)}
                    </Stack>
                  )}
                  cellDataGetter={({ rowData }) => rowData[col.title==='Result'?'result':col.title]}
                />
              ))}
            </Table>
          )}
        </AutoSizer>
      )}
    </Wrapper>
  );
};
