import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { unlink } from "fs/promises";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw { digest: "NEXT_REDIRECT", url };
  },
}));
vi.mock("@/lib/auth/session", () => ({
  getSession: async () => ({ userId: "admin-1", email: "admin@varizel.dev", role: "admin" }),
}));

import { resetDb } from "../../lib/db/store";
import { saveProductAction } from "../../lib/actions/admin";
import * as productsRepo from "../../lib/repositories/products";

beforeEach(() => resetDb());
afterAll(() => resetDb());

function baseForm(over: Record<string, string> = {}) {
  const fd = new FormData();
  fd.set("name", "Test Farm Grain");
  fd.set("slug", "test-farm-grain");
  fd.set("short_description", "A test grain for the create flow.");
  fd.set("description", "Full description of the test grain product.");
  fd.set("category_id", "cat-grains");
  fd.set("status", "draft");
  fd.set("tax_rate_bps", "0");
  fd.set("intent", "draft");
  for (const [k, v] of Object.entries(over)) fd.set(k, v);
  return fd;
}

describe("admin create product with photo and first pack", () => {
  it("creates product + thumbnail image + variant in one submit", async () => {
    const fd = baseForm({
      variant_title: "1 kg",
      variant_weight_grams: "1000",
      variant_price_paise: "19900",
      photo_alt: "Test grain",
    });
    const onePx = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "base64",
    );
    fd.set("photo", new File([onePx], "grain.png", { type: "image/png" }));
    const outcome = await saveProductAction(null, fd).catch((e) => e);
    expect(outcome?.digest).toBe("NEXT_REDIRECT");

    const created = productsRepo.getProductBySlug("test-farm-grain");
    expect(created).toBeTruthy();
    const images = productsRepo.getImages(created!.id);
    expect(images).toHaveLength(1);
    expect(images[0].path).toMatch(/\.webp$/);
    expect(images[0].is_thumbnail).toBe(true);
    expect(images[0].alt).toBe("Test grain");
    const variants = productsRepo.getVariants(created!.id);
    expect(variants).toHaveLength(1);
    expect(variants[0].price_paise).toBe(19900);
    expect(variants[0].sku).toMatch(/^VZ-/);
    await unlink(`public${images[0].path}`);
  });

  it("rejects a bad photo without creating anything", async () => {
    const fd = baseForm();
    fd.set("photo", new File([new Uint8Array([1])], "doc.pdf", { type: "application/pdf" }));
    const res = await saveProductAction(null, fd);
    expect(res).toMatchObject({ ok: false, fields: { photo: expect.any(String) } });
    expect(productsRepo.getProductBySlug("test-farm-grain")).toBeNull();
  });

  it("rejects a half-filled first pack without creating anything", async () => {
    const fd = baseForm({ variant_title: "1 kg" });
    const res = await saveProductAction(null, fd);
    expect(res).toMatchObject({ ok: false });
    expect(productsRepo.getProductBySlug("test-farm-grain")).toBeNull();
  });
});
