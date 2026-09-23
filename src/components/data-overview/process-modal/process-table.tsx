import React, { useEffect, useState } from "react";
import { Stack, Tooltip, Typography } from "@mui/material";

import { getElipsis } from "../table/ellipsis";
import { buildMovementTable } from "../table/build-movement-table";
import { AnyType } from "../../../types";
import {
  RowLabelWrapper,
  TableScrollableWrapper,
  TableHeaderStyled,
  TableTitle,
  IconButtonStyled,
  RowLabelCell,
  QueryStatsIconStyled,
  AddCircleOutlineIconStyled,
  RemoveCircleOutlineIconStyled,
  AmountCell,
  LabelText,
  ProcessRow,
  ProcessRowsBody,
  ProcessTableShell,
} from "./style";
import { ProcessValue, SearchByObject } from "./types";

const MAX_CHARS = 52;
const TOTAL = "Total";
const TOP_MAX_HEIGHT = 220;
const BOTTOM_MAX_HEIGHT = 420;

interface Filters {
  header: string;
  value: string;
}

interface Props {
  title: string;
  mappingValue: string;
  groupingValue: string;
  valueKey: string;
  id?: string;
  selectedFilter: Filters;
  rows: Record<string, AnyType>[];
  onAddToProcess?: (processValue: ProcessValue) => void;
  sortedDataDisplayHeader?: Record<string, AnyType>[];
  overviewTableData?: Record<string, AnyType>;
  isTopTable?: boolean;
  level: number;
  setSearchByObject: (searchByObject: SearchByObject) => void;
  overallProcessObject: ProcessValue[];
  removeFromProcess?: (processValue: ProcessValue) => void;
}

export const ProcessDataTable: React.FC<Props> = ({
  title,
  mappingValue,
  groupingValue,
  valueKey,
  selectedFilter,
  rows,
  level,
  id,
  sortedDataDisplayHeader,
  overviewTableData,
  onAddToProcess,
  removeFromProcess,
  overallProcessObject,
  isTopTable,
  setSearchByObject,
}) => {
  const [tableRows, setTableRows] = useState<Record<string, AnyType>[]>(
    rows || []
  );

  const stringifyWithoutBg = (row: Record<string, AnyType>) => {
    const copy = { ...row };
    delete copy.bg;
    return JSON.stringify(copy);
  };

  const maxProcessLevel = overallProcessObject.reduce(
    (max, item) => Math.max(max, item.level),
    0
  );

  useEffect(() => {
    if (!isTopTable || !rows) return;
    setTableRows(rows);
  }, [rows, isTopTable]);

  const generateTableData = () => {
    const { rows: generatedRows } = buildMovementTable({
      sortedDataDisplayHeader,
      overviewTableData: overviewTableData ?? {},
      groupingValue,
      valueKey,
      selectedFilter,
    });
    if (!generatedRows[1]) {
      setTableRows([]);
      return;
    }

    const ignoreKeys = ["header", "sideHeader", "total", "bg"];
    const valueKeys = Object.keys(generatedRows[1]).filter(
      (key) => !ignoreKeys.includes(key)
    );

    const omitRows = overallProcessObject
      .filter((item) => item.title === title)
      .flatMap((item) => item.rows)
      .map(stringifyWithoutBg);

    const filteredRows = generatedRows
      .slice(2, generatedRows.length - 1)
      .filter((row: Record<string, string>) =>
        valueKeys.some((key) => row[key] !== "0,00" && generatedRows[0][key])
      )
      .filter(
        (row: Record<string, AnyType>) =>
          !omitRows.includes(stringifyWithoutBg(row))
      );

    setTableRows([...filteredRows]);
  };

  useEffect(() => {
    if (sortedDataDisplayHeader && overviewTableData) {
      generateTableData();
      return;
    }

    const omitRows = overallProcessObject
      .filter((item) => item.title === title && !item.parent)
      .flatMap((item) => item.rows)
      .map(stringifyWithoutBg);

    if (!isTopTable) {
      setTableRows(
        rows.filter((row) => !omitRows.includes(stringifyWithoutBg(row)))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedDataDisplayHeader, overviewTableData, overallProcessObject, rows]);

  const renderActions = (row: Record<string, AnyType>) => {
    if (row.header || row.sideHeader === TOTAL) return null;

    if (isTopTable) {
      return (
        <RowLabelCell>
          <IconButtonStyled
            aria-label="Drill into related movements"
            onClick={() =>
              setSearchByObject({
                title,
                level,
                value: String(row.sideHeader),
                bg: row.bg as string,
              })
            }
          >
            <QueryStatsIconStyled />
          </IconButtonStyled>
          {level === maxProcessLevel ? (
            <IconButtonStyled
              aria-label="Remove from process"
              onClick={() =>
                removeFromProcess?.({
                  title,
                  level,
                  rows: [row],
                })
              }
            >
              <RemoveCircleOutlineIconStyled />
            </IconButtonStyled>
          ) : null}
        </RowLabelCell>
      );
    }

    return (
      <RowLabelCell>
        <IconButtonStyled
          aria-label="Add to process"
          onClick={() =>
            onAddToProcess?.({
              title,
              rows: [row],
              level,
            })
          }
        >
          <AddCircleOutlineIconStyled />
        </IconButtonStyled>
      </RowLabelCell>
    );
  };

  const maxHeight = isTopTable ? TOP_MAX_HEIGHT : BOTTOM_MAX_HEIGHT;

  return (
    <ProcessTableShell>
      <TableScrollableWrapper id={id}>
        <TableHeaderStyled>
          <TableTitle>
            <Tooltip title={title}>
              <Stack>{getElipsis(title, 48)}</Stack>
            </Tooltip>
          </TableTitle>
        </TableHeaderStyled>

        <ProcessRowsBody sx={{ maxHeight }}>
          {tableRows.length === 0 ? (
            <Stack
              height={72}
              width="100%"
              justifyContent="center"
              alignItems="center"
            >
              <Typography fontSize={14} fontWeight={600} color="text.secondary">
                No rows available
              </Typography>
            </Stack>
          ) : (
            tableRows.map((row, index) => {
              const label = row.sideHeader
                ? getElipsis(String(row.sideHeader), MAX_CHARS)
                : "";
              const amount = row.total ? String(row.total) : "";
              const tooltipTitle =
                typeof row.sideHeader === "string" &&
                row.sideHeader.length > MAX_CHARS
                  ? row.sideHeader
                  : "";
              const bg =
                row.bg && row.bg !== "white"
                  ? String(row.bg)
                  : index % 2 === 0
                    ? "#fff"
                    : "#f7fafb";
              const isTotal =
                row.sideHeader === TOTAL || row.sideHeader === mappingValue;

              return (
                <ProcessRow
                  key={`${String(row.sideHeader)}-${index}`}
                  sx={{
                    backgroundColor: bg,
                    fontWeight: isTotal ? 700 : 400,
                  }}
                >
                  <RowLabelWrapper>
                    <Tooltip title={tooltipTitle}>
                      <LabelText>{label}</LabelText>
                    </Tooltip>
                    {renderActions(row)}
                  </RowLabelWrapper>
                  <AmountCell>{amount}</AmountCell>
                </ProcessRow>
              );
            })
          )}
        </ProcessRowsBody>
      </TableScrollableWrapper>
    </ProcessTableShell>
  );
};
