import { formatPaise, type Paise } from "./money";

export function formatPrice(paise: Paise): string {
  return formatPaise(paise);
}

export function formatDate(iso: string, locale = "en-IN"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatDateTime(iso: string, locale = "en-IN"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function discountPercent(price: Paise, compareAt: Paise | null | undefined): number | null {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function formatWeight(grams: number): string {
  if (grams >= 1000 && grams % 1000 === 0) return `${grams / 1000} kg`;
  if (grams >= 1000) return `${(grams / 1000).toFixed(2).replace(/0+$/, "").replace(/\.$/, "")} kg`;
  return `${grams} g`;
}

export function formatUnitPrice(
  pricePaise: Paise,
  weightGrams: number | undefined | null,
  title?: string
): string | null {
  if (!weightGrams || weightGrams <= 0) return null;
  const isLiquid = Boolean(title && /(ml|litre|liter|oil|நெய்|எண்ணெய்)/i.test(title));

  if (weightGrams >= 1000 && weightGrams % 1000 === 0) {
    const kgs = weightGrams / 1000;
    const perKgPaise = Math.round(pricePaise / kgs);
    return `${formatPrice(perKgPaise)} / ${isLiquid ? "litre" : "kg"}`;
  }

  const per100gPaise = Math.round((pricePaise / weightGrams) * 100);
  return `${formatPrice(per100gPaise)} / ${isLiquid ? "100ml" : "100g"}`;
}

