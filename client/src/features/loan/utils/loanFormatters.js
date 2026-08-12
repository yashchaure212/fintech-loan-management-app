export function formatCurrency(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function formatCurrencyRange(min, max) {
  if (min !== null && max !== null) {
    return `${formatCurrency(min)} – ${formatCurrency(max)}`;
  }

  if (min !== null) {
    return `From ${formatCurrency(min)}`;
  }

  if (max !== null) {
    return `Up to ${formatCurrency(max)}`;
  }

  return "Available on application";
}
