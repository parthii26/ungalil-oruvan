/** All money is integer paise. Never use floats for calculations. */

export type Paise = number;

export function assertPaise(value: unknown, field = "amount"): Paise {
  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new Error(`${field} must be an integer number of paise`);
  }
  return value;
}

export function addPaise(...values: Paise[]): Paise {
  return values.reduce((sum, v) => sum + assertPaise(v), 0);
}

export function mulQty(unitPaise: Paise, qty: number): Paise {
  if (!Number.isInteger(qty) || qty < 0) {
    throw new Error("quantity must be a non-negative integer");
  }
  return assertPaise(unitPaise, "unit") * qty;
}

export function percentOf(amount: Paise, bps: number): Paise {
  // bps = basis points, 10000 = 100%
  if (!Number.isInteger(bps) || bps < 0) {
    throw new Error("basis points must be a non-negative integer");
  }
  // Integer division, remainder discarded (floor)
  return Math.trunc((assertPaise(amount) * bps) / 10_000);
}

export function minPaise(a: Paise, b: Paise): Paise {
  return Math.min(assertPaise(a), assertPaise(b));
}

export function maxPaise(a: Paise, b: Paise): Paise {
  return Math.max(assertPaise(a), assertPaise(b));
}

export function rupeesToPaise(rupees: number): Paise {
  if (!Number.isInteger(rupees)) {
    throw new Error("rupeesToPaise expects whole rupees; pass paise directly for fractional");
  }
  return rupees * 100;
}

export function formatPaise(paise: Paise, locale = "en-IN"): string {
  const sign = paise < 0 ? "-" : "";
  const abs = Math.abs(assertPaise(paise));
  const rupees = Math.trunc(abs / 100);
  const remainder = abs % 100;
  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(rupees);
  if (remainder === 0) return `${sign}₹${formatted}`;
  return `${sign}₹${formatted}.${remainder.toString().padStart(2, "0")}`;
}
