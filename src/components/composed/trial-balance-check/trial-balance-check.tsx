"use client";

import { useState } from "react";
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Dropdown } from "../../ui-kit/dropdown/dropdown";
import { FileDropzone } from "../../ui-kit/dropzone/dropzone";
import { readFirstSheet } from "@/utils/workbook";
import { compareTrialBalance } from "@/utils/trial-balance";
import { theme } from "@/constants/theme";

function money(value: number) {
  return value.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const headerCellSx = {
  backgroundColor: theme.colors.darker,
  color: theme.colors.white,
  fontWeight: 700,
  fontSize: theme.fontSize.cell,
  borderBottom: `1px solid ${theme.colors.freshBlue}`,
  whiteSpace: "nowrap",
  py: 1,
};

const bodyCellSx = {
  fontSize: theme.fontSize.cell,
  color: theme.colors.black,
  borderBottom: `1px solid ${theme.colors.softBlue}`,
  py: 0.75,
};

export function TrialBalanceCheck({
  glRows,
  accountKey,
  valueKey,
}: {
  glRows: Record<string, unknown>[];
  accountKey: string;
  valueKey: string;
}) {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [fileName, setFileName] = useState("");
  const [accountColumn, setAccountColumn] = useState("");
  const [amountColumn, setAmountColumn] = useState("");
  const [error, setError] = useState("");

  const onDrop = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    if (!file.name.endsWith(".xlsx")) {
      setError("Drop an .xlsx trial balance.");
      return;
    }
    try {
      const buffer = await file.arrayBuffer();
      const sheet = await readFirstSheet(buffer);
      const accountColumnName =
        sheet.headers.find((header) => /account/i.test(header)) ??
        sheet.headers[0] ??
        "";
      const amountColumnName =
        sheet.headers.find((header) =>
          /current year|prior year|amount|saldo|balance/i.test(header)
        ) ??
        sheet.headers.find((header) => header !== accountColumnName) ??
        "";
      setHeaders(sheet.headers);
      setRows(sheet.rows);
      setFileName(file.name);
      setAccountColumn(accountColumnName);
      setAmountColumn(amountColumnName);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not read that trial balance."
      );
    }
  };

  const comparison =
    rows.length && accountColumn && amountColumn
      ? compareTrialBalance(
          glRows,
          accountKey,
          valueKey,
          rows,
          accountColumn,
          amountColumn
        )
      : null;

  const columnsOk =
    comparison &&
    comparison.matched / Math.max(comparison.trialAccounts, 1) >= 0.25;

  return (
    <Stack
      gap={1.5}
      sx={{
        backgroundColor: theme.colors.page,
        border: `1px solid ${theme.colors.softBlue}`,
        borderRadius: theme.borderRadius.sm,
        padding: "1rem 1.15rem",
      }}
    >
      <Typography fontWeight={700} color={theme.colors.darker}>
        Trial balance check
      </Typography>
      <Typography color={theme.colors.medium}>
        Drop a trial balance to compare its account totals with the general
        ledger.
      </Typography>
      <FileDropzone
        compact
        optional
        text="Drop trial balance here"
        fileName={fileName}
        uploaded={Boolean(fileName)}
        onDrop={onDrop}
      >
        {null}
      </FileDropzone>
      {error ? <Typography color={theme.colors.red}>{error}</Typography> : null}
      {headers.length > 0 && (
        <Stack direction="row" gap={2}>
          <Dropdown
            label="Account column"
            items={headers.map((header) => ({ value: header, title: header }))}
            value={accountColumn}
            onChange={(event) => setAccountColumn(String(event.target.value))}
          />
          <Dropdown
            label="Amount column"
            items={headers.map((header) => ({ value: header, title: header }))}
            value={amountColumn}
            onChange={(event) => setAmountColumn(String(event.target.value))}
          />
        </Stack>
      )}
      {comparison && !columnsOk && comparison.trialAccounts > 0 && (
        <Typography color={theme.colors.red}>
          Those columns do not line up. Account column should be Account code.
          Amount column should be Current year.
        </Typography>
      )}
      {columnsOk && comparison.differences.length === 0 && (
        <Typography color={theme.colors.darker}>
          The general ledger matches this trial balance.
        </Typography>
      )}
      {columnsOk && comparison.differences.length > 0 && (
        <Stack gap={1}>
          <Typography fontWeight={600} color={theme.colors.darker}>
            {comparison.differences.length.toLocaleString("en-US")} accounts
            differ
          </Typography>
          <TableContainer
            sx={{
              maxHeight: 360,
              border: `1px solid ${theme.colors.softBlue}`,
              borderRadius: theme.borderRadius.sm,
              backgroundColor: theme.colors.white,
            }}
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={headerCellSx}>Account</TableCell>
                  <TableCell sx={{ ...headerCellSx, textAlign: "right" }}>
                    Ledger
                  </TableCell>
                  <TableCell sx={{ ...headerCellSx, textAlign: "right" }}>
                    Trial balance
                  </TableCell>
                  <TableCell sx={{ ...headerCellSx, textAlign: "right" }}>
                    Difference
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {comparison.differences.map((row) => (
                  <TableRow key={row.code} hover>
                    <TableCell sx={{ ...bodyCellSx, fontWeight: 600 }}>
                      {row.code}
                    </TableCell>
                    <TableCell sx={{ ...bodyCellSx, textAlign: "right" }}>
                      {money(row.glAmount)}
                    </TableCell>
                    <TableCell sx={{ ...bodyCellSx, textAlign: "right" }}>
                      {row.trialAmount == null
                        ? "Missing"
                        : money(row.trialAmount)}
                    </TableCell>
                    <TableCell
                      sx={{
                        ...bodyCellSx,
                        textAlign: "right",
                        color:
                          Math.abs(row.difference) > 0.01
                            ? theme.colors.red
                            : theme.colors.black,
                        fontWeight: 600,
                      }}
                    >
                      {money(row.difference)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      )}
    </Stack>
  );
}
