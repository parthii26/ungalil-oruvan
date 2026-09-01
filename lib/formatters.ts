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
