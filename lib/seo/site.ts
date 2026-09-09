/** Absolute site base URL for canonical links, feeds, and structured data. */
export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
}
