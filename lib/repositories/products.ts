import { loadDb, mutate } from "@/lib/db/store";
import type { Product, ProductImage, ProductVariant } from "@/lib/db/types";
import { nowIso, uid } from "@/lib/utils";

export function listPublishedProducts() {
  const db = loadDb();
  return db.products.filter((p) => p.status === "published");
}

export function listAllProducts() {
  return loadDb().products;
}

export function getProductBySlug(slug: string) {
  return loadDb().products.find((p) => p.slug === slug) ?? null;
}

export function getProductById(id: string) {
  return loadDb().products.find((p) => p.id === id) ?? null;
}

export function getVariants(productId: string) {
  return loadDb()
    .product_variants.filter((v) => v.product_id === productId)
    .sort((a, b) => a.position - b.position);
}

export function getVariantById(id: string) {
  return loadDb().product_variants.find((v) => v.id === id) ?? null;
}

export function getImages(productId: string) {
  return loadDb()
    .product_images.filter((i) => i.product_id === productId)
    .sort((a, b) => a.position - b.position);
}

export function getNutrition(productId: string) {
  return loadDb().product_nutrition.find((n) => n.product_id === productId) ?? null;
}

export function getCertifications(productId: string) {
  return loadDb().product_certifications.filter((c) => c.product_id === productId);
}

export function getDietaryTags(productId: string) {
  const db = loadDb();
  const ids = db.product_dietary_tags.filter((x) => x.product_id === productId).map((x) => x.tag_id);
  return db.dietary_tags.filter((t) => ids.includes(t.id));
}

export function listDietaryTags() {
  return loadDb().dietary_tags;
}

export function getThumbnail(productId: string): ProductImage | null {
  const images = getImages(productId);
  return images.find((i) => i.is_thumbnail) ?? images[0] ?? null;
}

export function insertProduct(input: Omit<Product, "created_at" | "updated_at" | "search_text"> & { search_text?: string }) {
  return mutate((db) => {
    const now = nowIso();
    const row: Product = {
      ...input,
      search_text:
        input.search_text ??
        [input.name, input.short_description, input.ingredients, input.origin].filter(Boolean).join(" ").toLowerCase(),
      created_at: now,
      updated_at: now,
    };
    db.products.push(row);
    return row;
  });
}

export function updateProduct(id: string, patch: Partial<Product>) {
  return mutate((db) => {
    const row = db.products.find((p) => p.id === id);
    if (!row) return null;
    Object.assign(row, patch, { updated_at: nowIso() });
    row.search_text = [row.name, row.short_description, row.ingredients, row.origin]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return row;
  });
}

export function setProductTags(productId: string, tagIds: string[]) {
  mutate((db) => {
    db.product_dietary_tags = db.product_dietary_tags.filter((x) => x.product_id !== productId);
    for (const tag_id of tagIds) db.product_dietary_tags.push({ product_id: productId, tag_id });
  });
}

export function insertVariant(input: Omit<ProductVariant, "id" | "created_at" | "updated_at"> & { id?: string }) {
  return mutate((db) => {
    const now = nowIso();
    const row: ProductVariant = {
      ...input,
      id: input.id ?? uid(),
      created_at: now,
      updated_at: now,
    };
    db.product_variants.push(row);
    return row;
  });
}

export function updateVariant(id: string, patch: Partial<ProductVariant>) {
  return mutate((db) => {
    const row = db.product_variants.find((v) => v.id === id);
    if (!row) return null;
    Object.assign(row, patch, { updated_at: nowIso() });
    return row;
  });
}

export function deleteVariant(id: string) {
  mutate((db) => {
    db.product_variants = db.product_variants.filter((v) => v.id !== id);
  });
}

export function addImage(productId: string, path: string, alt: string) {
  return mutate((db) => {
    const existing = db.product_images.filter((i) => i.product_id === productId);
    const row: ProductImage = {
      id: uid(),
      product_id: productId,
      path,
      alt,
      position: existing.length,
      is_thumbnail: existing.length === 0,
      created_at: nowIso(),
    };
    db.product_images.push(row);
    return row;
  });
}

export function deleteImage(id: string) {
  mutate((db) => {
    db.product_images = db.product_images.filter((i) => i.id !== id);
  });
}

export function setThumbnail(id: string) {
  mutate((db) => {
    const img = db.product_images.find((i) => i.id === id);
    if (!img) return;
    db.product_images
      .filter((i) => i.product_id === img.product_id)
      .forEach((i) => {
        i.is_thumbnail = i.id === id;
      });
  });
}

export function upsertNutrition(
  productId: string,
  data: Omit<import("@/lib/db/types").ProductNutrition, "id" | "product_id">,
) {
  return mutate((db) => {
    const existing = db.product_nutrition.find((n) => n.product_id === productId);
    if (existing) {
      Object.assign(existing, data);
      return existing;
    }
    const row = { id: uid(), product_id: productId, ...data };
    db.product_nutrition.push(row);
    return row;
  });
}

export function addCertification(input: Omit<import("@/lib/db/types").ProductCertification, "id" | "created_at">) {
  return mutate((db) => {
    const row = { ...input, id: uid(), created_at: nowIso() };
    db.product_certifications.push(row);
    return row;
  });
}

export function deleteCertification(id: string) {
  mutate((db) => {
    db.product_certifications = db.product_certifications.filter((c) => c.id !== id);
  });
}

export function moveVariant(id: string, direction: "up" | "down") {
  mutate((db) => {
    const row = db.product_variants.find((v) => v.id === id);
    if (!row) return;
    const siblings = db.product_variants
      .filter((v) => v.product_id === row.product_id)
      .sort((a, b) => a.position - b.position);
    const idx = siblings.findIndex((v) => v.id === id);
    const swap = direction === "up" ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= siblings.length) return;
    const a = siblings[idx].position;
    siblings[idx].position = siblings[swap].position;
    siblings[swap].position = a;
  });
}

export function setDefaultVariant(id: string) {
  mutate((db) => {
    const row = db.product_variants.find((v) => v.id === id);
    if (!row) return;
    const siblings = db.product_variants
      .filter((v) => v.product_id === row.product_id)
      .sort((a, b) => a.position - b.position);
    siblings.forEach((v, i) => {
      v.position = v.id === id ? 0 : i + 1;
    });
  });
}

export function moveImage(id: string, direction: "up" | "down") {
  mutate((db) => {
    const row = db.product_images.find((i) => i.id === id);
    if (!row) return;
    const siblings = db.product_images
      .filter((i) => i.product_id === row.product_id)
      .sort((a, b) => a.position - b.position);
    const idx = siblings.findIndex((i) => i.id === id);
    const swap = direction === "up" ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= siblings.length) return;
    const a = siblings[idx].position;
    siblings[idx].position = siblings[swap].position;
    siblings[swap].position = a;
  });
}

export function updateImageAlt(id: string, alt: string) {
  mutate((db) => {
    const row = db.product_images.find((i) => i.id === id);
    if (row) row.alt = alt;
  });
}
