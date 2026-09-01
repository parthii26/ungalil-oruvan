"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { UnauthorizedError, ValidationError, toUserMessage } from "@/lib/errors";
import { addressSchema } from "@/lib/validations/address";
import { profileSchema } from "@/lib/validations/auth";
import * as addressesRepo from "@/lib/repositories/addresses";
import * as customersRepo from "@/lib/repositories/customers";
import * as wishRepo from "@/lib/repositories/wishlists";
import { addToCartAction } from "./cart";

async function requireCustomer() {
  const session = await getSession();
  if (!session?.customerId) throw new UnauthorizedError();
  return session;
}

export async function saveProfileAction(_prev: unknown, formData: FormData) {
  try {
    const session = await requireCustomer();
    const parsed = profileSchema.safeParse({
      full_name: formData.get("full_name"),
      phone: formData.get("phone") || "",
    });
    if (!parsed.success) throw new ValidationError("Please check your profile details.");
    customersRepo.updateProfile(session.userId, parsed.data);
    revalidatePath("/account/profile");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: toUserMessage(e) };
  }
}

export async function createAddressAction(_prev: unknown, formData: FormData) {
  try {
    const session = await requireCustomer();
    const parsed = addressSchema.safeParse({
      name: formData.get("name"),
      phone: formData.get("phone"),
      line1: formData.get("line1"),
      line2: formData.get("line2") || "",
      landmark: formData.get("landmark") || "",
      city: formData.get("city"),
      state: formData.get("state"),
      postal_code: formData.get("postal_code"),
      country: "IN",
      is_default: formData.get("is_default") === "on",
    });
    if (!parsed.success) throw new ValidationError("Please check the address.", parsed.error.flatten());
    addressesRepo.insertAddress({
      customer_id: session.customerId!,
      name: parsed.data.name,
      phone: parsed.data.phone,
      line1: parsed.data.line1,
      line2: parsed.data.line2 || null,
      landmark: parsed.data.landmark || null,
      city: parsed.data.city,
      state: parsed.data.state,
      postal_code: parsed.data.postal_code,
      country: parsed.data.country ?? "IN",
      is_default: Boolean(parsed.data.is_default),
    });
    revalidatePath("/account/addresses");
    revalidatePath("/checkout");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: toUserMessage(e) };
  }
}

export async function deleteAddressAction(id: string) {
  const session = await requireCustomer();
  addressesRepo.deleteAddress(id, session.customerId!);
  revalidatePath("/account/addresses");
}

export async function toggleWishlistAction(variantId: string) {
  const session = await getSession();
  if (!session?.customerId) return { ok: false as const, error: "Sign in to save items." };
  if (wishRepo.isWished(session.customerId, variantId)) {
    wishRepo.removeWishlistItem(session.customerId, variantId);
  } else {
    wishRepo.addWishlistItem(session.customerId, variantId);
  }
  revalidatePath("/account/wishlist");
  return { ok: true as const };
}

export async function moveWishlistToCartAction(variantId: string) {
  const session = await requireCustomer();
  const result = await addToCartAction(variantId, 1);
  if (result.ok) wishRepo.removeWishlistItem(session.customerId!, variantId);
  revalidatePath("/account/wishlist");
  return result;
}
