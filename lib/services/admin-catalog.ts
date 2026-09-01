import { BusinessRuleError, ConflictError, NotFoundError } from "@/lib/errors";
import * as productsRepo from "@/lib/repositories/products";
import * as categoriesRepo from "@/lib/repositories/categories";
import { slugify, uid } from "@/lib/utils";
import type { Product, ProductStatus } from "@/lib/db/types";

export function uniqueSlug(base: string, exceptId?: string): string {
  const root = slugify(base) || "product";
  let slug = root;
  let n = 2;
  while (true) {
    const existing = productsRepo.getProductBySlug(slug);
    if (!existing || existing.id === exceptId) return slug;
    slug = `${root}-${n++}`;
  }
}

export function assertSlugAvailable(slug: string, exceptId?: string) {
  const existing = productsRepo.getProductBySlug(slug);
  if (existing && existing.id !== exceptId) {
    throw new ConflictError("That slug is already used. Choose another.");
  }
}

export function assertSkuAvailable(sku: string, exceptId?: string) {
  const all = productsRepo.listAllProducts().flatMap((p) => productsRepo.getVariants(p.id));
  const hit = all.find((v) => v.sku.toLowerCase() === sku.toLowerCase() && v.id !== exceptId);
  if (hit) throw new ConflictError("That SKU is already used.");
}

export function assertPublishable(productId: string) {
  const product = productsRepo.getProductById(productId);
  if (!product) throw new NotFoundError("Product not found.");
  if (product.name.length < 2) throw new BusinessRuleError("Name is required to publish.");
  if (product.short_description.length < 8) throw new BusinessRuleError("Short description is required to publish.");
  if (product.description.length < 8) throw new BusinessRuleError("Description is required to publish.");
  if (!product.category_id) throw new BusinessRuleError("Category is required to publish.");
  const variants = productsRepo.getVariants(productId).filter((v) => v.status === "active");
  if (!variants.length) throw new BusinessRuleError("Add at least one active variant before publishing.");
  return product;
}

export function setStatus(productId: string, status: ProductStatus) {
  const product = productsRepo.getProductById(productId);
  if (!product) throw new NotFoundError("Product not found.");
  if (status === "published") assertPublishable(productId);
  return productsRepo.updateProduct(productId, { status });
}

export function duplicateProduct(productId: string) {
  const product = productsRepo.getProductById(productId);
  if (!product) throw new NotFoundError("Product not found.");
  const slug = uniqueSlug(`${product.slug}-copy`);
  const copy = productsRepo.insertProduct({
    ...product,
    id: uid(),
    name: `${product.name} (copy)`,
    slug,
    status: "draft",
    is_featured: false,
  });
  productsRepo.setProductTags(
    copy.id,
    productsRepo.getDietaryTags(productId).map((t) => t.id),
  );
  productsRepo.getVariants(productId).forEach((v, i) => {
    productsRepo.insertVariant({
      product_id: copy.id,
      sku: uniqueCopySku(v.sku),
      barcode: v.barcode,
      title: v.title,
      weight_grams: v.weight_grams,
      price_paise: v.price_paise,
      compare_at_paise: v.compare_at_paise,
      cost_paise: v.cost_paise,
      status: v.status,
      position: i,
    });
  });
  productsRepo.getImages(productId).forEach((img) => {
    productsRepo.addImage(copy.id, img.path, img.alt);
  });
  const nut = productsRepo.getNutrition(productId);
  if (nut) {
    productsRepo.upsertNutrition(copy.id, {
      serving: nut.serving,
      energy_kcal: nut.energy_kcal,
      protein_g: nut.protein_g,
      carbohydrates_g: nut.carbohydrates_g,
      fat_g: nut.fat_g,
      fiber_g: nut.fiber_g,
      sugar_g: nut.sugar_g,
      extra: nut.extra,
    });
  }
  productsRepo.getCertifications(productId).forEach((c) => {
    productsRepo.addCertification({
      product_id: copy.id,
      name: c.name,
      number: c.number,
      valid_from: c.valid_from,
      valid_until: c.valid_until,
      document_path: c.document_path,
    });
  });
  return copy;
}

function uniqueCopySku(sku: string) {
  let next = `${sku}-COPY`;
  let n = 2;
  const all = productsRepo.listAllProducts().flatMap((p) => productsRepo.getVariants(p.id).map((v) => v.sku));
  while (all.includes(next)) {
    next = `${sku}-COPY${n++}`;
  }
  return next;
}

export function listAdminProducts(query: {
  q?: string;
  category?: string;
  status?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.min(50, query.pageSize ?? 20);
  let rows = productsRepo.listAllProducts();
  if (query.q) {
    const q = query.q.toLowerCase();
    rows = rows.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.includes(q) ||
        productsRepo.getVariants(p.id).some((v) => v.sku.toLowerCase().includes(q)),
    );
  }
  if (query.category) rows = rows.filter((p) => p.category_id === query.category);
  if (query.status && query.status !== "all") rows = rows.filter((p) => p.status === query.status);

  rows = [...rows];
  const sort = query.sort ?? "updated";
  rows.sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "status") return a.status.localeCompare(b.status);
    return b.updated_at.localeCompare(a.updated_at);
  });

  const total = rows.length;
  const slice = rows.slice((page - 1) * pageSize, page * pageSize);
  return {
    items: slice.map((product) => hydrateAdminRow(product)),
    total,
    page,
    pageSize,
    pages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export function hydrateAdminRow(product: Product) {
  const variants = productsRepo.getVariants(product.id);
  const def = variants[0];
  const cat = categoriesRepo.getCategoryById(product.category_id);
  return {
    product,
    sku: def?.sku ?? "—",
    categoryName: cat?.name ?? "—",
    variantCount: variants.length,
    price_paise: def?.price_paise ?? null,
  };
}

export function countProductsInCategory(categoryId: string) {
  return productsRepo.listAllProducts().filter((p) => p.category_id === categoryId).length;
}
