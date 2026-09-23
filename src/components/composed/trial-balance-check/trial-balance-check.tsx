"use client";

import { useState } from "react";
import { Stack, Typography } from "@mui/material";
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
      setError(err instanceof Error ? err.message : "Could not read that trial balance.");
    }
  };

  const comparison =
    rows.length && accountColumn && amountColumn
      ? compareTrialBalance(glRows, accountKey, valueKey, rows, accountColumn, amountColumn)
      : null;

  return (
    <Stack
      gap={1.5}
      sx={{
        backgroundColor: theme.colors.lighter,
        border: `1px solid ${theme.colors.surface}`,
        borderRadius: theme.borderRadius.sm,
        padding: "1rem 1.15rem",
      }}
    >
      <Typography fontWeight={700} color={theme.colors.black}>
        Trial balance check
      </Typography>
      <Typography color={theme.colors.medium}>
        Drop a trial balance to compare its account totals with the general ledger.
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
      {comparison &&
        comparison.trialAccounts > 0 &&
        comparison.matched / comparison.trialAccounts < 0.25 && (
          <Typography color={theme.colors.red}>
            Those columns do not line up. Account column should be Account code.
            Amount column should be Current year.
          </Typography>
        )}
      {comparison &&
        comparison.matched / Math.max(comparison.trialAccounts, 1) >= 0.25 &&
        comparison.differences.length === 0 && (
        <Typography color={theme.colors.black}>
          The general ledger matches this trial balance.
        </Typography>
      )}
      {comparison &&
        comparison.matched / Math.max(comparison.trialAccounts, 1) >= 0.25 &&
        comparison.differences.length > 0 && (
        <Stack gap={0.5}>
          <Typography color={theme.colors.black}>
            {comparison.differences.length.toLocaleString("en-US")} accounts differ.
          </Typography>
          {comparison.differences.slice(0, 12).map((row) => (
            <Typography key={row.code} color={theme.colors.medium}>
              {row.code}: ledger {money(row.glAmount)}
              {row.trialAmount == null
                ? ", missing from the trial balance"
                : `, trial balance ${money(row.trialAmount)}, difference ${money(row.difference)}`}
            </Typography>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
