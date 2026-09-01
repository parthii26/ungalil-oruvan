"use server";

import { redirect } from "next/navigation";
import { getCartSessionId, getSession } from "@/lib/auth/session";
import { checkoutPending } from "@/lib/services/checkout";
import { addressSchema } from "@/lib/validations/address";
import { getAddress } from "@/lib/repositories/addresses";
import { BusinessRuleError, toUserMessage } from "@/lib/errors";

export async function placeOrderAction(_prev: unknown, formData: FormData) {
  try {
    const session = await getSession();
    const sessionId = await getCartSessionId();
    const email = String(formData.get("email") || session?.email || "");
    const addressId = String(formData.get("address_id") || "");
    let address;
    if (addressId && session?.customerId) {
      const saved = getAddress(addressId);
      if (!saved || saved.customer_id !== session.customerId) {
        throw new BusinessRuleError("Choose a valid address.");
      }
      address = {
        name: saved.name,
        phone: saved.phone,
        line1: saved.line1,
        line2: saved.line2,
        landmark: saved.landmark,
        city: saved.city,
        state: saved.state,
        postal_code: saved.postal_code,
        country: saved.country,
      };
    } else {
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
      });
      if (!parsed.success) throw new BusinessRuleError("Please complete the delivery address.");
      address = {
        name: parsed.data.name,
        phone: parsed.data.phone,
        line1: parsed.data.line1,
        line2: parsed.data.line2 || null,
        landmark: parsed.data.landmark || null,
        city: parsed.data.city,
        state: parsed.data.state,
        postal_code: parsed.data.postal_code,
        country: parsed.data.country ?? "IN",
      };
    }

    const order = checkoutPending({
      customerId: session?.customerId ?? null,
      sessionId,
      email,
      address,
      couponCode: String(formData.get("coupon_code") || "") || null,
      notes: String(formData.get("notes") || "") || null,
      idempotencyKey: String(formData.get("idempotency_key") || crypto.randomUUID()),
    });
    redirect(`/order/success?order=${order.order_number}`);
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: toUserMessage(e) };
  }
}
