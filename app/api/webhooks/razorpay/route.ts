import { NextResponse } from "next/server";
import { isPaymentConfigured } from "@/lib/services/payment";
import { updateOrderStatus } from "@/lib/repositories/orders";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  if (!isPaymentConfigured()) {
    return NextResponse.json(
      { accepted: false, reason: "Razorpay is not configured." },
      { status: 501 },
    );
  }

  const rawBody = await request.text();
  let body: {
    event: string;
    payload?: {
      payment?: {
        entity?: {
          order_id?: string;
          id?: string;
        };
      };
    };
  };

  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ accepted: false, reason: "Invalid JSON" }, { status: 400 });
  }

  // Razorpay webhook signature verification
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  const keySecret = process.env.RAZORPAY_KEY_SECRET ?? "";
  const crypto = await import("crypto");
  const expected = crypto.createHmac("sha256", keySecret).update(rawBody).digest("hex");
  if (expected !== signature) {
    return NextResponse.json({ accepted: false, reason: "Invalid signature" }, { status: 400 });
  }

  // Handle payment.captured event
  if (body.event === "payment.captured") {
    const razorpayOrderId = body.payload?.payment?.entity?.order_id;
    if (razorpayOrderId) {
      const { loadDb } = await import("@/lib/db/store");
      const db = loadDb();
      const order = db.orders.find(
        (o) => o.id === razorpayOrderId || o.order_number === razorpayOrderId,
      );
      if (order) {
        updateOrderStatus(order.id, "confirmed", "Payment captured via Razorpay.");
        revalidatePath(`/admin/orders/${order.id}`);
        revalidatePath("/admin/orders");
      }
    }
  }

  return NextResponse.json({ accepted: true });
}
