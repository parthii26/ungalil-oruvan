import type { MetadataRoute } from "next";
import { listPublishedProducts } from "@/lib/repositories/products";
import { listActiveCategories } from "@/lib/repositories/categories";
import { loadDb } from "@/lib/db/store";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const statics = ["", "/shop", "/about", "/contact", "/faq", "/blog"].map((p) => ({
    url: `${base}${p || "/"}`,
    lastModified: new Date(),
  }));
  const products = listPublishedProducts().map((p) => ({ url: `${base}/product/${p.slug}`, lastModified: new Date(p.updated_at) }));
  const cats = listActiveCategories().map((c) => ({ url: `${base}/category/${c.slug}`, lastModified: new Date(c.updated_at) }));
  const posts = loadDb()
    .blog_posts.filter((p) => p.published)
    .map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: new Date(p.created_at) }));
  return [...statics, ...products, ...cats, ...posts];
}
