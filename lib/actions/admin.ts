"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { ForbiddenError, ValidationError, toUserMessage } from "@/lib/errors";
import { productSchema, categorySchema } from "@/lib/validations/product";
import { variantSchema } from "@/lib/validations/variant";
import * as productsRepo from "@/lib/repositories/products";
import * as categoriesRepo from "@/lib/repositories/categories";
import * as settingsRepo from "@/lib/repositories/settings";
import { adminCancel } from "@/lib/services/orders";
import * as adminCatalog from "@/lib/services/admin-catalog";
import { slugify, uid } from "@/lib/utils";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";

async function requireAdmin() {
  const session = await getSession();
  if (session?.role !== "admin") throw new ForbiddenError("Admin access only.");
  return session;
}

async function storeUpload(file: File, prefix: string): Promise<string> {
  adminCatalog.assertImageFile(file);
  const input = Buffer.from(await file.arrayBuffer());
  const name = `${prefix}-${Date.now()}.webp`;

  const optimizedBuffer = await sharp(input)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  // 1. Upload to Supabase Cloud Storage if configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && serviceRoleKey) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(name, optimizedBuffer, {
          contentType: "image/webp",
          upsert: true,
        });

      if (!error && data) {
        const { data: pub } = supabase.storage
          .from("product-images")
          .getPublicUrl(name);
        if (pub?.publicUrl) return pub.publicUrl;
      }
      console.warn("Supabase storage upload returned error, falling back to local:", error);
    } catch (err) {
      console.warn("Supabase storage upload failed, falling back to local:", err);
    }
  }

  // 2. Serverless environment check: Vercel lambda filesystem is read-only, so Supabase Storage is required
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    throw new ValidationError(
      "Supabase Storage is not configured on Vercel. Please add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your Vercel Environment Variables to upload product photos.",
    );
  }

  // 3. Fallback to local disk for local dev / offline testing
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await sharp(optimizedBuffer).toFile(path.join(dir, name));
  return `/uploads/${name}`;
}

export async function saveProductAction(_prev: unknown, formData: FormData) {
  try {
    await requireAdmin();
    const id = String(formData.get("id") || "");
    const parsed = productSchema.safeParse({
      name: formData.get("name"),
      slug: formData.get("slug") || slugify(String(formData.get("name") || "")),
      short_description: formData.get("short_description"),
      description: formData.get("description"),
      ingredients: formData.get("ingredients") || "",
      storage_instructions: formData.get("storage_instructions") || "",
      shelf_life: formData.get("shelf_life") || "",
      category_id: formData.get("category_id"),
      status: formData.get("status") || "draft",
      is_featured: formData.get("is_featured") === "on",
      is_bestseller: formData.get("is_bestseller") === "on",
      hsn: formData.get("hsn") || "",
      tax_rate_bps: formData.get("tax_rate_bps") || 0,
      fssai_license: formData.get("fssai_license") || "",
      seo_title: formData.get("seo_title") || "",
      seo_description: formData.get("seo_description") || "",
      tamil_name: formData.get("tamil_name") || "",
    });
    if (!parsed.success) {
      const fields: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!fields[key]) fields[key] = issue.message;
      }
      return { ok: false as const, error: "Please check the highlighted fields.", fields };
    }
    const tagIds = formData.getAll("dietary_tag_ids").map(String).filter(Boolean);
    try {
      adminCatalog.assertSlugAvailable(parsed.data.slug, id || undefined);
    } catch (e) {
      return { ok: false as const, error: toUserMessage(e), fields: { slug: toUserMessage(e) } };
    }
    const photoInput = id ? null : formData.get("photo");
    const photo = photoInput instanceof File && photoInput.size > 0 ? photoInput : null;
    if (photo) {
      try {
        adminCatalog.assertImageFile(photo);
      } catch (e) {
        return { ok: false as const, error: toUserMessage(e), fields: { photo: toUserMessage(e) } };
      }
    }
    const vTitle = id ? "" : String(formData.get("variant_title") || "").trim();
    const vSku = id ? "" : String(formData.get("variant_sku") || "").trim();
    const vWeight = id ? "" : String(formData.get("variant_weight_grams") || "").trim();
    const vPriceInr = id ? "" : String(formData.get("variant_price_inr") || formData.get("variant_price") || "").trim();
    const vPricePaiseRaw = id ? "" : String(formData.get("variant_price_paise") || "").trim();

    let vPrice = "";
    if (vPriceInr) {
      const n = parseFloat(vPriceInr);
      vPrice = !isNaN(n) ? String(Math.round(n * 100)) : "";
    } else if (vPricePaiseRaw) {
      vPrice = vPricePaiseRaw;
    }

    const variantTouched = Boolean(vTitle || vSku || vWeight || vPrice);
    let firstVariant: { sku: string; title: string; weight_grams: number; price_paise: number } | null = null;
    if (variantTouched) {
      const parsedVariant = variantSchema.safeParse({
        sku: vSku || adminCatalog.generateVariantSku(parsed.data.name, Number(vWeight) || 0),
        barcode: "",
        title: vTitle,
        weight_grams: vWeight,
        price_paise: vPrice,
        status: "active",
      });
      if (!parsedVariant.success) {
        const map: Record<string, string> = {
          title: "variant_title",
          sku: "variant_sku",
          weight_grams: "variant_weight_grams",
          price_paise: vPriceInr ? "variant_price_inr" : "variant_price_paise",
        };
        const fields: Record<string, string> = {};
        for (const issue of parsedVariant.error.issues) {
          const key = map[String(issue.path[0] ?? "variant")] ?? "variant_title";
          if (!fields[key]) fields[key] = issue.message;
        }
        return { ok: false as const, error: "Please check the first pack fields.", fields };
      }
      try {
        adminCatalog.assertSkuAvailable(parsedVariant.data.sku);
      } catch (e) {
        return { ok: false as const, error: toUserMessage(e), fields: { variant_sku: toUserMessage(e) } };
      }
      firstVariant = {
        sku: parsedVariant.data.sku,
        title: parsedVariant.data.title,
        weight_grams: parsedVariant.data.weight_grams,
        price_paise: parsedVariant.data.price_paise,
      };
    }
    const intent = String(formData.get("intent") || "save");
    let status = parsed.data.status;
    if (intent === "draft") status = "draft";
    if (intent === "publish") status = "published";

    const payload = {
      name: parsed.data.name,
      slug: parsed.data.slug,
      short_description: parsed.data.short_description,
      description: parsed.data.description,
      ingredients: parsed.data.ingredients || null,
      storage_instructions: parsed.data.storage_instructions || null,
      shelf_life: parsed.data.shelf_life || null,
      category_id: parsed.data.category_id,
      status,
      is_featured: Boolean(parsed.data.is_featured),
      is_bestseller: Boolean(parsed.data.is_bestseller),
      hsn: parsed.data.hsn || null,
      tax_rate_bps: parsed.data.tax_rate_bps,
      fssai_license: parsed.data.fssai_license || null,
      seo_title: parsed.data.seo_title || null,
      seo_description: parsed.data.seo_description || null,
      tamil_name: parsed.data.tamil_name || null,
    };

    if (id) {
      productsRepo.updateProduct(id, payload);
      productsRepo.setProductTags(id, tagIds);
      if (status === "published") {
        try {
          adminCatalog.assertPublishable(id);
        } catch (e) {
          productsRepo.updateProduct(id, { status: "draft" });
          return { ok: false as const, error: toUserMessage(e) };
        }
      }
      revalidatePath("/admin/products");
      revalidatePath("/shop");
      revalidatePath(`/product/${payload.slug}`);
      return { ok: true as const, id };
    }
    const created = productsRepo.insertProduct({ id: uid(), ...payload });
    productsRepo.setProductTags(created.id, tagIds);
    if (photo) {
      const stored = await storeUpload(photo, created.id);
      productsRepo.addImage(created.id, stored, String(formData.get("photo_alt") || parsed.data.name));
    }
    if (firstVariant) {
      productsRepo.insertVariant({
        product_id: created.id,
        barcode: null,
        compare_at_paise: null,
        cost_paise: null,
        status: "active",
        position: 0,
        ...firstVariant,
      });
    }
    revalidatePath("/admin/products");
    redirect(`/admin/products/${created.id}`);
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { ok: false as const, error: toUserMessage(e) };
  }
}

export async function setProductStatusAction(id: string, status: "draft" | "published" | "archived") {
  await requireAdmin();
  adminCatalog.setStatus(id, status);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function duplicateProductAction(id: string) {
  await requireAdmin();
  const copy = adminCatalog.duplicateProduct(id);
  revalidatePath("/admin/products");
  redirect(`/admin/products/${copy.id}`);
}

export async function saveVariantAction(productId: string, formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");

  const toPaise = (val: FormDataEntryValue | null) => {
    if (!val) return "";
    const str = String(val).trim();
    if (!str) return "";
    const n = parseFloat(str);
    return isNaN(n) ? "" : String(Math.round(n * 100));
  };

  const priceInr = formData.get("price_inr") ?? formData.get("price");
  const compareAtInr = formData.get("compare_at_inr") ?? formData.get("compare_at");
  const costInr = formData.get("cost_inr") ?? formData.get("cost");

  const pricePaise = priceInr != null && String(priceInr).trim() !== ""
    ? toPaise(priceInr)
    : (formData.get("price_paise") || "");
  const compareAtPaise = compareAtInr != null && String(compareAtInr).trim() !== ""
    ? toPaise(compareAtInr)
    : (formData.get("compare_at_paise") || "");
  const costPaise = costInr != null && String(costInr).trim() !== ""
    ? toPaise(costInr)
    : (formData.get("cost_paise") || "");

  const rawSku = String(formData.get("sku") || "").trim();
  const prod = productsRepo.getProductById(productId);
  const sku = rawSku || adminCatalog.generateVariantSku(prod?.name ?? "item", Number(formData.get("weight_grams")) || 0);

  const parsed = variantSchema.safeParse({
    sku,
    barcode: formData.get("barcode") || "",
    title: formData.get("title"),
    weight_grams: formData.get("weight_grams"),
    price_paise: pricePaise,
    compare_at_paise: compareAtPaise,
    cost_paise: costPaise,
    status: formData.get("status") || "active",
  });
  if (!parsed.success) return { error: "Check variant fields." };
  try {
    adminCatalog.assertSkuAvailable(parsed.data.sku, id || undefined);
  } catch (e) {
    return { error: toUserMessage(e) };
  }
  const payload = {
    sku: parsed.data.sku,
    barcode: parsed.data.barcode || null,
    title: parsed.data.title,
    weight_grams: parsed.data.weight_grams,
    price_paise: parsed.data.price_paise,
    compare_at_paise: typeof parsed.data.compare_at_paise === "number" ? parsed.data.compare_at_paise : null,
    cost_paise: typeof parsed.data.cost_paise === "number" ? parsed.data.cost_paise : null,
    status: parsed.data.status,
  };
  if (id) productsRepo.updateVariant(id, payload);
  else {
    const pos = productsRepo.getVariants(productId).length;
    productsRepo.insertVariant({ product_id: productId, position: pos, ...payload });
  }
  revalidatePath(`/admin/products/${productId}`);
  return { ok: true };
}

export async function deleteVariantAction(id: string, productId: string) {
  await requireAdmin();
  productsRepo.deleteVariant(id);
  revalidatePath(`/admin/products/${productId}`);
}

export async function moveVariantAction(id: string, productId: string, direction: "up" | "down") {
  await requireAdmin();
  productsRepo.moveVariant(id, direction);
  revalidatePath(`/admin/products/${productId}`);
}

export async function setDefaultVariantAction(id: string, productId: string) {
  await requireAdmin();
  productsRepo.setDefaultVariant(id);
  revalidatePath(`/admin/products/${productId}`);
}

export async function uploadProductImageAction(productId: string, formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose an image." };
  try {
    const stored = await storeUpload(file, productId);
    productsRepo.addImage(productId, stored, String(formData.get("alt") || "Product image"));
  } catch (e) {
    return { error: toUserMessage(e) };
  }
  revalidatePath(`/admin/products/${productId}`);
  return { ok: true };
}

export async function deleteImageAction(id: string, productId: string) {
  await requireAdmin();
  productsRepo.deleteImage(id);
  revalidatePath(`/admin/products/${productId}`);
}

export async function setThumbnailAction(id: string, productId: string) {
  await requireAdmin();
  productsRepo.setThumbnail(id);
  revalidatePath(`/admin/products/${productId}`);
}

export async function moveImageAction(id: string, productId: string, direction: "up" | "down") {
  await requireAdmin();
  productsRepo.moveImage(id, direction);
  revalidatePath(`/admin/products/${productId}`);
}

export async function saveImageAltAction(id: string, productId: string, formData: FormData) {
  await requireAdmin();
  productsRepo.updateImageAlt(id, String(formData.get("alt") || ""));
  revalidatePath(`/admin/products/${productId}`);
}

export async function saveNutritionAction(productId: string, formData: FormData) {
  await requireAdmin();
  productsRepo.upsertNutrition(productId, {
    serving: String(formData.get("serving") || ""),
    energy_kcal: formData.get("energy_kcal") ? Number(formData.get("energy_kcal")) : null,
    protein_g: formData.get("protein_g") ? Number(formData.get("protein_g")) : null,
    carbohydrates_g: formData.get("carbohydrates_g") ? Number(formData.get("carbohydrates_g")) : null,
    fat_g: formData.get("fat_g") ? Number(formData.get("fat_g")) : null,
    fiber_g: formData.get("fiber_g") ? Number(formData.get("fiber_g")) : null,
    sugar_g: formData.get("sugar_g") ? Number(formData.get("sugar_g")) : null,
    extra: {},
  });
  revalidatePath(`/admin/products/${productId}`);
}

export async function saveCertificationAction(productId: string, formData: FormData) {
  await requireAdmin();
  let document_path: string | null = null;
  const file = formData.get("document");
  if (file instanceof File && file.size > 0) {
    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = (file.name.split(".").pop() || "pdf").toLowerCase();
    const name = `cert-${productId}-${Date.now()}.${ext}`;
    const dir = path.join(process.cwd(), "data", "private-docs");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), bytes);
    document_path = `/private-docs/${name}`;
  }
  productsRepo.addCertification({
    product_id: productId,
    name: String(formData.get("name") || ""),
    number: String(formData.get("number") || "") || null,
    valid_from: String(formData.get("valid_from") || "") || null,
    valid_until: String(formData.get("valid_until") || "") || null,
    document_path,
  });
  revalidatePath(`/admin/products/${productId}`);
}

export async function deleteCertificationAction(id: string, productId: string) {
  await requireAdmin();
  productsRepo.deleteCertification(id);
  revalidatePath(`/admin/products/${productId}`);
}

export async function saveCategoryAction(_prev: unknown, formData: FormData) {
  try {
    await requireAdmin();
    const id = String(formData.get("id") || "");
    const parsed = categorySchema.safeParse({
      name: formData.get("name"),
      slug: formData.get("slug") || slugify(String(formData.get("name") || "")),
      description: formData.get("description") || "",
      parent_id: formData.get("parent_id") || "",
      image_path: formData.get("image_path") || "",
      position: formData.get("position") || 0,
      is_active: formData.get("is_active") !== "off",
    });
    if (!parsed.success) throw new ValidationError("Check category fields.");
    if (categoriesRepo.getCategoryBySlugExcept(parsed.data.slug, id || undefined)) {
      return { ok: false as const, error: "That category slug is already used." };
    }
    const payload = {
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || "",
      parent_id: parsed.data.parent_id || null,
      image_path: parsed.data.image_path || null,
      position: parsed.data.position,
      is_active: parsed.data.is_active !== false,
    };
    if (id) categoriesRepo.updateCategory(id, payload);
    else categoriesRepo.insertCategory(payload);
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: toUserMessage(e) };
  }
}

export async function toggleCategoryAction(id: string, active: boolean) {
  await requireAdmin();
  categoriesRepo.updateCategory(id, { is_active: active });
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();
  const count = adminCatalog.countProductsInCategory(id);
  if (count > 0) {
    throw new ValidationError(`Cannot delete: ${count} product(s) still use this category. Reassign them first.`);
  }
  categoriesRepo.deleteCategory(id);
  revalidatePath("/admin/categories");
}

export async function cancelOrderAction(id: string) {
  await requireAdmin();
  adminCancel(id);
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
}

export async function saveSettingsAction(_prev: unknown, formData: FormData) {
  try {
    await requireAdmin();
    settingsRepo.updateSettings({
      brand_name: String(formData.get("brand_name") || "Ungalil Oruvan"),
      accent_color: String(formData.get("accent_color") || "#9A4A2A"),
      contact_email: String(formData.get("contact_email") || ""),
      contact_phone: String(formData.get("contact_phone") || ""),
      address: String(formData.get("address") || ""),
      footer_text: String(formData.get("footer_text") || ""),
      hero_headline: String(formData.get("hero_headline") || ""),
      hero_subhead: String(formData.get("hero_subhead") || ""),
      hero_tamil: String(formData.get("hero_tamil") || ""),
      tamil_tagline: String(formData.get("tamil_tagline") || ""),
      english_tagline: String(formData.get("english_tagline") || ""),
      login_headline: String(formData.get("login_headline") || ""),
      login_subhead: String(formData.get("login_subhead") || ""),
      story_title: String(formData.get("story_title") || ""),
      story_tamil: String(formData.get("story_tamil") || ""),
      social: {
        instagram: String(formData.get("instagram") || ""),
        facebook: String(formData.get("facebook") || ""),
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: toUserMessage(e) };
  }
}
