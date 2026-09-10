import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { resetDb } from "../../lib/db/store";
import * as productsRepo from "../../lib/repositories/products";
import * as adminCatalog from "../../lib/services/admin-catalog";
import { searchCatalog, getPublicProduct } from "../../lib/services/catalog";
import { BusinessRuleError, ConflictError, NotFoundError } from "../../lib/errors";

beforeEach(() => resetDb());
afterAll(() => resetDb());

describe("admin catalog", () => {
  it("creates a draft that stays off the public shop", () => {
    const created = productsRepo.insertProduct({
      id: "prod-draft-test",
      category_id: "cat-honey",
      name: "Draft Hidden Honey",
      slug: "draft-hidden-honey",
      short_description: "A draft that must not list publicly.",
      description: "Longer description for the draft product.",
      ingredients: null,
      storage_instructions: null,
      shelf_life: null,
      status: "draft",
      is_featured: false,
      is_bestseller: false,
      hsn: null,
      tax_rate_bps: 0,
      fssai_license: null,
      seo_title: null,
      seo_description: null,
      tamil_name: null,
    });
    expect(created.status).toBe("draft");
    const shop = searchCatalog({ q: "draft hidden" });
    expect(shop.items.find((i) => i.product.id === created.id)).toBeUndefined();
    expect(() => getPublicProduct("draft-hidden-honey")).toThrow(NotFoundError);
  });

  it("rejects duplicate slugs", () => {
    expect(() => adminCatalog.assertSlugAvailable("organic-raw-forest-honey")).toThrow(ConflictError);
  });

  it("cannot publish without an active variant", () => {
    const created = productsRepo.insertProduct({
      id: "prod-novar",
      category_id: "cat-honey",
      name: "No Variant Yet",
      slug: "no-variant-yet",
      short_description: "Needs a variant before publish.",
      description: "Needs a variant before this can go live.",
      ingredients: null,
      storage_instructions: null,
      shelf_life: null,
      status: "draft",
      is_featured: false,
      is_bestseller: false,
      hsn: null,
      tax_rate_bps: 0,
      fssai_license: null,
      seo_title: null,
      seo_description: null,
      tamil_name: null,
    });
    expect(() => adminCatalog.setStatus(created.id, "published")).toThrow(BusinessRuleError);
  });

  it("publishes when a variant exists and then lists in shop", () => {
    const created = productsRepo.insertProduct({
      id: "prod-live-test",
      category_id: "cat-honey",
      name: "New Forest Honey",
      slug: "new-forest-honey",
      short_description: "A published honey for the shop.",
      description: "Published honey used to prove storefront wiring.",
      ingredients: "Honey",
      storage_instructions: null,
      shelf_life: null,
      status: "draft",
      is_featured: false,
      is_bestseller: false,
      hsn: null,
      tax_rate_bps: 0,
      fssai_license: null,
      seo_title: null,
      seo_description: null,
      tamil_name: null,
    });
    productsRepo.insertVariant({
      product_id: created.id,
      sku: "VZ-NEW-250",
      barcode: null,
      title: "250 g",
      weight_grams: 250,
      price_paise: 24900,
      compare_at_paise: null,
      cost_paise: null,
      status: "active",
      position: 0,
    });
    adminCatalog.setStatus(created.id, "published");
    const live = getPublicProduct("new-forest-honey");
    expect(live.product.status).toBe("published");
    const shop = searchCatalog({ q: "new forest honey" });
    expect(shop.items.find((i) => i.product.id === created.id)).toBeTruthy();
  });

  it("hides archived products from the public catalog", () => {
    adminCatalog.setStatus("prod-honey", "archived");
    expect(() => getPublicProduct("organic-raw-forest-honey")).toThrow(NotFoundError);
  });

  it("duplicates as draft with a unique slug", () => {
    const copy = adminCatalog.duplicateProduct("prod-honey");
    expect(copy.status).toBe("draft");
    expect(copy.slug).not.toBe("organic-raw-forest-honey");
    expect(productsRepo.getVariants(copy.id).length).toBeGreaterThan(0);
  });

  it("blocks category delete when products remain", () => {
    expect(adminCatalog.countProductsInCategory("cat-honey")).toBeGreaterThan(0);
  });

  it("validates product photo uploads", () => {
    expect(adminCatalog.assertImageFile({ name: "rice.jpg", type: "image/jpeg", size: 1000 })).toBe("jpg");
    expect(adminCatalog.assertImageFile({ name: "RICE.WEBP", type: "image/webp", size: 1000 })).toBe("webp");
    expect(() => adminCatalog.assertImageFile({ name: "doc.pdf", type: "application/pdf", size: 1000 })).toThrow(
      "JPG, PNG, or WebP",
    );
    expect(() => adminCatalog.assertImageFile({ name: "big.png", type: "image/png", size: 6 * 1024 * 1024 })).toThrow(
      "under 5 MB",
    );
  });

  it("generates unique variant SKUs", () => {
    const first = adminCatalog.generateVariantSku("New Test Grain", 1000);
    expect(first).toMatch(/^VZ-/);
    productsRepo.insertVariant({
      product_id: "prod-honey",
      sku: first,
      barcode: null,
      title: "1 kg",
      weight_grams: 1000,
      price_paise: 19900,
      compare_at_paise: null,
      cost_paise: null,
      status: "active",
      position: 9,
    });
    expect(adminCatalog.generateVariantSku("New Test Grain", 1000)).toBe(`${first}-2`);
  });
});
