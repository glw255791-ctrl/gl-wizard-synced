type TrialRow = {
  code: string;
  glAmount: number;
  trialAmount: number | null;
  difference: number;
};

function addAmount(totals: Map<string, number>, code: string, amount: number) {
  if (!code) return;
  totals.set(
    code,
    Number(((totals.get(code) ?? 0) + amount).toFixed(2))
  );
}

export function compareTrialBalance(
  glRows: Record<string, unknown>[],
  accountKey: string,
  valueKey: string,
  trialRows: Record<string, unknown>[],
  trialAccountKey: string,
  trialAmountKey: string
) {
  const glTotals = new Map<string, number>();
  for (const row of glRows) {
    const amount = Number(row[valueKey]);
    addAmount(
      glTotals,
      String(row[accountKey] ?? ""),
      Number.isFinite(amount) ? amount : 0
    );
  }

  const trialTotals = new Map<string, number>();
  for (const row of trialRows) {
    const amount = Number(row[trialAmountKey]);
    addAmount(
      trialTotals,
      String(row[trialAccountKey] ?? ""),
      Number.isFinite(amount) ? amount : 0
    );
  }

  const differences: TrialRow[] = [];
  const codes = new Set([...glTotals.keys(), ...trialTotals.keys()]);
  let matched = 0;
  for (const code of codes) {
    const glAmount = glTotals.get(code) ?? 0;
    const hasTrial = trialTotals.has(code);
    const trialAmount = hasTrial ? (trialTotals.get(code) ?? 0) : null;
    if (hasTrial && glTotals.has(code)) matched += 1;
    const difference = Number((glAmount - (trialAmount ?? 0)).toFixed(2));
    if (!hasTrial || Math.abs(difference) > 0.01) {
      differences.push({ code, glAmount, trialAmount, difference });
    }
  }

  differences.sort((left, right) => {
    const leftMissing = left.trialAmount == null || !glTotals.has(left.code);
    const rightMissing = right.trialAmount == null || !glTotals.has(right.code);
    if (leftMissing !== rightMissing) return leftMissing ? 1 : -1;
    return Math.abs(right.difference) - Math.abs(left.difference);
  });
  return {
    differences,
    glAccounts: glTotals.size,
    trialAccounts: trialTotals.size,
    matched,
  };
}
