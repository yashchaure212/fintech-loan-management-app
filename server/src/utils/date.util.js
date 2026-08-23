const UNIT_MS = {
  ms: 1,
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

export const addDays = (days) => {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};

export function parseDurationToMs(value, fallbackMs) {
  if (typeof value !== "string") {
    return fallbackMs;
  }

  const match = value.trim().match(/^(\d+)(ms|s|m|h|d)$/i);

  if (!match) {
    return fallbackMs;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  return amount * UNIT_MS[unit];
}

export function addDuration(value, fallbackDays = 7) {
  const fallbackMs = fallbackDays * UNIT_MS.d;

  return new Date(Date.now() + parseDurationToMs(value, fallbackMs));
}
