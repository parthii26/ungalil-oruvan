"use server";

import { revalidatePath } from "next/cache";
import { getCartSessionId, getOrCreateCartSessionId, getSession } from "@/lib/auth/session";
import * as cartService from "@/lib/services/cart";
import { toUserMessage } from "@/lib/errors";

async function owner() {
  const session = await getSession();
  const sessionId = session?.customerId ? await getCartSessionId() : await getOrCreateCartSessionId();
  return { customerId: session?.customerId ?? null, sessionId };
}

export async function addToCartAction(variantId: string, quantity = 1) {
  try {
    await cartService.addToCart(await owner(), variantId, quantity);
    revalidatePath("/cart");
    revalidatePath("/shop");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: toUserMessage(e) };
  }
}

export async function updateCartQtyAction(itemId: string, quantity: number) {
  try {
    await cartService.updateQty(itemId, quantity, await owner());
    revalidatePath("/cart");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: toUserMessage(e) };
  }
}

export async function removeCartItemAction(itemId: string) {
  try {
    await cartService.removeFromCart(itemId, await owner());
    revalidatePath("/cart");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: toUserMessage(e) };
  }
}

export async function clearCartAction() {
  await cartService.emptyCart(await owner());
  revalidatePath("/cart");
}
