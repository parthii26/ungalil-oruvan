import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";
import { createSeed } from "../lib/db/seed";

// Load .env.local and .env if present
function loadEnv() {
  for (const file of [".env", ".env.local"]) {
    const p = path.resolve(process.cwd(), file);
    if (!fs.existsSync(p)) continue;
    const content = fs.readFileSync(p, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = val;
    }
  }
}
loadEnv();

function toUuid(str: string): string {
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)) {
    return str;
  }
  const hash = crypto.createHash("md5").update(str).digest("hex");
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

async function run() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn("⚠️  Supabase environment variables not configured.");
    console.warn("Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local to seed a live database.");
    console.warn("Alternatively, copy and paste 'supabase/seed.sql' into your Supabase Dashboard SQL Editor.");
    process.exit(0);
  }

  console.log(`Connecting to Supabase at: ${supabaseUrl}`);
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const db = createSeed();

  // 1. Dietary Tags
  console.log("Seeding dietary tags...");
  const tags = db.dietary_tags.map((t) => ({
    id: toUuid(t.id),
    name: t.name,
    slug: t.slug,
  }));
  const { error: tagsErr } = await supabase.from("dietary_tags").upsert(tags, { onConflict: "slug" });
  if (tagsErr) console.error("Error seeding tags:", tagsErr.message);

  // 2. Categories
  console.log("Seeding categories...");
  const categories = db.categories.map((c) => ({
    id: toUuid(c.id),
    parent_id: c.parent_id ? toUuid(c.parent_id) : null,
    name: c.name,
    slug: c.slug,
    description: c.description,
    image_path: c.image_path,
    position: c.position,
    is_active: c.is_active,
  }));
  const { error: catErr } = await supabase.from("categories").upsert(categories, { onConflict: "slug" });
  if (catErr) console.error("Error seeding categories:", catErr.message);

  // 3. Products
  console.log("Seeding products...");
  const products = db.products.map((p) => ({
    id: toUuid(p.id),
    category_id: toUuid(p.category_id),
    name: p.name,
    slug: p.slug,
    short_description: p.short_description,
    description: p.description,
    ingredients: p.ingredients,
    origin: (p as unknown as { origin?: string }).origin ?? null,
    storage_instructions: p.storage_instructions,
    shelf_life: p.shelf_life,
    status: p.status,
    is_featured: p.is_featured,
    is_bestseller: p.is_bestseller,
    search_text: p.search_text,
  }));
  const { error: prodErr } = await supabase.from("products").upsert(products, { onConflict: "slug" });
  if (prodErr) console.error("Error seeding products:", prodErr.message);

  // 4. Product Variants
  console.log("Seeding variants...");
  const variants = db.product_variants.map((v) => ({
    id: toUuid(v.id),
    product_id: toUuid(v.product_id),
    sku: v.sku,
    title: v.title,
    weight_grams: v.weight_grams,
    price_paise: v.price_paise,
    compare_at_paise: v.compare_at_paise ?? null,
    status: v.status,
    position: v.position,
  }));
  const { error: varErr } = await supabase.from("product_variants").upsert(variants, { onConflict: "sku" });
  if (varErr) console.error("Error seeding variants:", varErr.message);

  // 5. Product Images
  console.log("Seeding product images...");
  const images = db.product_images.map((img) => ({
    id: toUuid(img.id),
    product_id: toUuid(img.product_id),
    path: img.path,
    alt: img.alt,
    position: img.position,
    is_thumbnail: img.is_thumbnail,
  }));
  const { error: imgErr } = await supabase.from("product_images").upsert(images, { onConflict: "id" });
  if (imgErr) console.error("Error seeding images:", imgErr.message);

  // 6. Product Nutrition
  console.log("Seeding nutrition...");
  const nutrition = db.product_nutrition.map((n) => ({
    id: toUuid(n.id),
    product_id: toUuid(n.product_id),
    serving: n.serving,
    energy_kcal: n.energy_kcal,
    protein_g: n.protein_g,
    carbohydrates_g: n.carbohydrates_g,
    fat_g: n.fat_g,
    fiber_g: n.fiber_g,
    sugar_g: n.sugar_g,
  }));
  const { error: nutErr } = await supabase.from("product_nutrition").upsert(nutrition, { onConflict: "product_id" });
  if (nutErr) console.error("Error seeding nutrition:", nutErr.message);

  // 7. Product Dietary Tags
  console.log("Seeding product dietary tag links...");
  const pTags = db.product_dietary_tags.map((pt) => ({
    product_id: toUuid(pt.product_id),
    tag_id: toUuid(pt.tag_id),
  }));
  const { error: ptErr } = await supabase.from("product_dietary_tags").upsert(pTags, { onConflict: "product_id,tag_id" });
  if (ptErr) console.error("Error seeding product dietary tags:", ptErr.message);

  // 8. Coupons
  console.log("Seeding coupons...");
  const coupons = db.coupons.map((c) => ({
    id: toUuid(c.id),
    code: c.code,
    type: c.type,
    value: c.value,
    min_subtotal_paise: c.min_subtotal_paise,
    max_discount_paise: c.max_discount_paise ?? null,
    starts_at: c.starts_at,
    ends_at: c.ends_at,
    is_active: c.is_active,
  }));
  const { error: coupErr } = await supabase.from("coupons").upsert(coupons, { onConflict: "code" });
  if (coupErr) console.error("Error seeding coupons:", coupErr.message);

  // 9. Site Settings
  console.log("Seeding site settings...");
  const { error: setErr } = await supabase.from("site_settings").upsert(
    { id: 1, data: db.site_settings },
    { onConflict: "id" }
  );
  if (setErr) console.error("Error seeding site settings:", setErr.message);

  // 10. Storage Buckets
  console.log("Ensuring storage buckets...");
  const buckets = [
    { id: "product-images", public: true },
    { id: "marketing", public: true },
    { id: "private-docs", public: false },
  ];
  for (const b of buckets) {
    const { error: bErr } = await supabase.storage.createBucket(b.id, { public: b.public });
    if (bErr && !bErr.message.includes("already exists")) {
      console.warn(`Bucket '${b.id}':`, bErr.message);
    }
  }

  console.log("✅ Supabase seed completed successfully!");
}

run().catch((e) => {
  console.error("Seed script failed:", e);
  process.exit(1);
});
