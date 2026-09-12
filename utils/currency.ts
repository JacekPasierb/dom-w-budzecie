const plnFormatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
  maximumFractionDigits: 0,
});

const plnFormatterPrecise = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatPLN(amount: number): string {
  const hasCents = Math.round(amount * 100) % 100 !== 0;
  return hasCents ? plnFormatterPrecise.format(amount) : plnFormatter.format(amount);
}

export function parseAmount(value: string): number | null {
  const normalized = value.trim().replace(/\s/g, "").replace(",", ".");
  if (normalized === "") return null;
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : null;
}
