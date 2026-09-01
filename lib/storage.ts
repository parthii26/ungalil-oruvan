import "server-only";
import { isSupabaseConfigured } from "./env";

export const BUCKETS = {
  productImages: "product-images",
  marketing: "marketing",
  privateDocs: "private-docs",
} as const;

export function publicObjectUrl(bucket: string, path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return path.startsWith("/") ? path : `/${path}`;
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}

export function storageMode() {
  return isSupabaseConfigured() ? "supabase" : "local-public";
}
