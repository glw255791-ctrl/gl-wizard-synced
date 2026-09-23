export function isLicenceExpired(value: string | null | undefined): boolean {
  if (!value) return false;

  const expiry = new Date(value);
  if (Number.isNaN(expiry.getTime())) return false;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const expiryDay = new Date(expiry);
  expiryDay.setHours(0, 0, 0, 0);

  return expiryDay < startOfToday;
}
