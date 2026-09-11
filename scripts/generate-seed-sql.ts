import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createSeed, DEV_ACCOUNTS } from "../lib/db/seed";

function toUuid(str: string): string {
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)) {
    return str;
  }
  const hash = crypto.createHash("md5").update(str).digest("hex");
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

function escapeSql(val: unknown): string {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
  if (typeof val === "number") return String(val);
  if (typeof val === "object") return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  return `'${String(val).replace(/'/g, "''")}'`;
}

export function generateSeedSql(): string {
  const db = createSeed();
  const lines: string[] = [];

  lines.push("-- Ungalil Oruvan - Supabase Database Seed");
  lines.push("-- Generated automatically from lib/db/seed.ts");
  lines.push("-- Run this script in the Supabase SQL Editor after 0001_stage1_schema.sql\n");

  // 1. Dietary Tags
  lines.push("-- 1. Dietary Tags");
  for (const tag of db.dietary_tags) {
    const id = toUuid(tag.id);
    lines.push(
      `insert into public.dietary_tags (id, name, slug) values (${escapeSql(id)}, ${escapeSql(tag.name)}, ${escapeSql(tag.slug)}) on conflict (slug) do update set name = excluded.name;`
    );
  }
  lines.push("");

  // 2. Categories
  lines.push("-- 2. Categories");
  for (const cat of db.categories) {
    const id = toUuid(cat.id);
    const parentId = cat.parent_id ? toUuid(cat.parent_id) : null;
    lines.push(
      `insert into public.categories (id, parent_id, name, slug, description, image_path, position, is_active) values (${escapeSql(id)}, ${escapeSql(parentId)}, ${escapeSql(cat.name)}, ${escapeSql(cat.slug)}, ${escapeSql(cat.description)}, ${escapeSql(cat.image_path)}, ${cat.position}, ${cat.is_active ? "TRUE" : "FALSE"}) on conflict (slug) do update set name = excluded.name, description = excluded.description, image_path = excluded.image_path, position = excluded.position;`
    );
  }
  lines.push("");

  // 3. Products
  lines.push("-- 3. Products");
  for (const p of db.products) {
    const id = toUuid(p.id);
    const categoryId = toUuid(p.category_id);
    const origin = (p as unknown as { origin?: string }).origin ?? null;
    lines.push(
      `insert into public.products (id, category_id, name, slug, short_description, description, ingredients, origin, storage_instructions, shelf_life, status, is_featured, is_bestseller, search_text) values (${escapeSql(id)}, ${escapeSql(categoryId)}, ${escapeSql(p.name)}, ${escapeSql(p.slug)}, ${escapeSql(p.short_description)}, ${escapeSql(p.description)}, ${escapeSql(p.ingredients)}, ${escapeSql(origin)}, ${escapeSql(p.storage_instructions)}, ${escapeSql(p.shelf_life)}, ${escapeSql(p.status)}, ${p.is_featured ? "TRUE" : "FALSE"}, ${p.is_bestseller ? "TRUE" : "FALSE"}, ${escapeSql(p.search_text)}) on conflict (slug) do update set name = excluded.name, short_description = excluded.short_description, description = excluded.description, is_featured = excluded.is_featured, is_bestseller = excluded.is_bestseller, search_text = excluded.search_text;`
    );
  }
  lines.push("");

  // 4. Product Variants
  lines.push("-- 4. Product Variants");
  for (const v of db.product_variants) {
    const id = toUuid(v.id);
    const productId = toUuid(v.product_id);
    lines.push(
      `insert into public.product_variants (id, product_id, sku, title, weight_grams, price_paise, compare_at_paise, status, position) values (${escapeSql(id)}, ${escapeSql(productId)}, ${escapeSql(v.sku)}, ${escapeSql(v.title)}, ${v.weight_grams}, ${v.price_paise}, ${escapeSql(v.compare_at_paise)}, ${escapeSql(v.status)}, ${v.position}) on conflict (sku) do update set title = excluded.title, weight_grams = excluded.weight_grams, price_paise = excluded.price_paise, compare_at_paise = excluded.compare_at_paise, status = excluded.status;`
    );
  }
  lines.push("");

  // 5. Product Images
  lines.push("-- 5. Product Images");
  for (const img of db.product_images) {
    const id = toUuid(img.id);
    const productId = toUuid(img.product_id);
    lines.push(
      `insert into public.product_images (id, product_id, path, alt, position, is_thumbnail) values (${escapeSql(id)}, ${escapeSql(productId)}, ${escapeSql(img.path)}, ${escapeSql(img.alt)}, ${img.position}, ${img.is_thumbnail ? "TRUE" : "FALSE"}) on conflict (id) do nothing;`
    );
  }
  lines.push("");

  // 6. Product Nutrition
  lines.push("-- 6. Product Nutrition");
  for (const n of db.product_nutrition) {
    const id = toUuid(n.id);
    const productId = toUuid(n.product_id);
    lines.push(
      `insert into public.product_nutrition (id, product_id, serving, energy_kcal, protein_g, carbohydrates_g, fat_g, fiber_g, sugar_g) values (${escapeSql(id)}, ${escapeSql(productId)}, ${escapeSql(n.serving)}, ${n.energy_kcal}, ${n.protein_g}, ${n.carbohydrates_g}, ${n.fat_g}, ${n.fiber_g}, ${n.sugar_g}) on conflict (product_id) do update set serving = excluded.serving, energy_kcal = excluded.energy_kcal, protein_g = excluded.protein_g, carbohydrates_g = excluded.carbohydrates_g, fat_g = excluded.fat_g, fiber_g = excluded.fiber_g, sugar_g = excluded.sugar_g;`
    );
  }
  lines.push("");

  // 7. Product Certifications
  lines.push("-- 7. Product Certifications");
  for (const c of db.product_certifications) {
    const id = toUuid(c.id);
    const productId = toUuid(c.product_id);
    lines.push(
      `insert into public.product_certifications (id, product_id, name, number) values (${escapeSql(id)}, ${escapeSql(productId)}, ${escapeSql(c.name)}, ${escapeSql(c.number)}) on conflict (id) do nothing;`
    );
  }
  lines.push("");

  // 8. Product Dietary Tags
  lines.push("-- 8. Product Dietary Tags");
  for (const dt of db.product_dietary_tags) {
    const productId = toUuid(dt.product_id);
    const tagId = toUuid(dt.tag_id);
    lines.push(
      `insert into public.product_dietary_tags (product_id, tag_id) values (${escapeSql(productId)}, ${escapeSql(tagId)}) on conflict do nothing;`
    );
  }
  lines.push("");

  // 9. Coupons
  lines.push("-- 9. Coupons");
  for (const cp of db.coupons) {
    const id = toUuid(cp.id);
    lines.push(
      `insert into public.coupons (id, code, type, value, min_subtotal_paise, max_discount_paise, starts_at, ends_at, is_active) values (${escapeSql(id)}, ${escapeSql(cp.code)}, ${escapeSql(cp.type)}, ${cp.value}, ${cp.min_subtotal_paise}, ${escapeSql(cp.max_discount_paise)}, ${escapeSql(cp.starts_at)}, ${escapeSql(cp.ends_at)}, ${cp.is_active ? "TRUE" : "FALSE"}) on conflict (code) do update set type = excluded.type, value = excluded.value, min_subtotal_paise = excluded.min_subtotal_paise, max_discount_paise = excluded.max_discount_paise, starts_at = excluded.starts_at, ends_at = excluded.ends_at, is_active = excluded.is_active;`
    );
  }
  lines.push("");

  // 10. Site Settings
  lines.push("-- 10. Site Settings");
  lines.push(
    `insert into public.site_settings (id, data, updated_at) values (1, ${escapeSql(db.site_settings)}, now()) on conflict (id) do update set data = excluded.data, updated_at = now();`
  );
  lines.push("");

  // 11. Storage Buckets (if storage extension is available)
  lines.push("-- 11. Supabase Storage Buckets");
  lines.push(`insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict (id) do nothing;`);
  lines.push(`insert into storage.buckets (id, name, public) values ('marketing', 'marketing', true) on conflict (id) do nothing;`);
  lines.push(`insert into storage.buckets (id, name, public) values ('private-docs', 'private-docs', false) on conflict (id) do nothing;`);
  lines.push("");

  return lines.join("\n");
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.includes("generate-seed-sql")) {
  const sql = generateSeedSql();
  const outPath = path.resolve(__dirname, "../supabase/seed.sql");
  fs.writeFileSync(outPath, sql, "utf-8");
  console.log(`Successfully generated seed SQL: ${outPath} (${sql.length} bytes)`);
}
