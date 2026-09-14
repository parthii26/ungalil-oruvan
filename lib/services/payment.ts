/**
 * Stage 2 — Razorpay payment service.
 * Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables to activate.
 * Falls back gracefully (keeps order as pending_payment) when not configured.
 */

export interface RazorpayOrderResult {
  created: boolean;
  razorpay_order_id?: string;
  amount?: number; // paise
  currency?: string;
  key_id?: string;
  reason?: string;
}

export interface RazorpayVerifyResult {
  verified: boolean;
  reason?: string;
}

export function isPaymentConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export async function createRazorpayOrder(
  orderId: string,
  amountPaise: number,
  currency = "INR",
): Promise<RazorpayOrderResult> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return {
      created: false,
      reason: "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
    };
  }
  try {
    const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency,
        receipt: orderId,
        notes: { order_id: orderId },
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("Razorpay order creation failed:", err);
      return { created: false, reason: "Payment gateway error. Please try again." };
    }
    const data = (await res.json()) as { id: string; amount: number; currency: string };
    return {
      created: true,
      razorpay_order_id: data.id,
      amount: data.amount,
      currency: data.currency,
      key_id: keyId,
    };
  } catch (err) {
    console.error("Razorpay createOrder error:", err);
    return { created: false, reason: "Could not reach payment gateway." };
  }
}

export function verifyRazorpaySignature(input: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): RazorpayVerifyResult {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return { verified: false, reason: "Not configured" };
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const crypto = require("crypto") as typeof import("crypto");
    const body = `${input.razorpay_order_id}|${input.razorpay_payment_id}`;
    const expected = crypto.createHmac("sha256", keySecret).update(body).digest("hex");
    if (expected !== input.razorpay_signature) {
      return { verified: false, reason: "Signature mismatch" };
    }
    return { verified: true };
  } catch {
    return { verified: false, reason: "Verification error" };
  }
}
