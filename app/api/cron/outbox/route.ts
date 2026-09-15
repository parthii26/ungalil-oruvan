import { NextResponse } from "next/server";
import { loadDb, mutate } from "@/lib/db/store";
import { notificationsService } from "@/lib/services/notifications";
import { nowIso } from "@/lib/utils";

export async function POST(request?: Request) {
  const authHeader = request?.headers?.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}` && request?.headers?.get("x-cron-secret") !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = loadDb();
  const pending = (db.outbox_events ?? []).filter((e) => !e.processed_at);

  if (pending.length === 0) {
    return NextResponse.json({ ok: true, processed: 0, message: "No pending outbox events" });
  }

  let processedCount = 0;
  for (const event of pending) {
    try {
      const payload = event.payload as Record<string, unknown>;
      if (event.type === "order_confirmation") {
        await notificationsService.sendOrderConfirmation({
          to: String(payload.email || ""),
          orderNumber: String(payload.orderNumber || ""),
          totalFormatted: String(payload.totalFormatted || ""),
          items: (payload.items as { name: string; qty: number; price: string }[]) ?? [],
        });
      } else if (event.type === "order_shipped") {
        await notificationsService.sendOrderShipped({
          to: String(payload.email || ""),
          orderNumber: String(payload.orderNumber || ""),
          trackingNote: payload.trackingNote ? String(payload.trackingNote) : undefined,
        });
      }
      processedCount++;
    } catch {
      // Keep going for remaining events
    }
  }

  // Mark events as processed
  mutate((state) => {
    for (const event of pending) {
      const match = state.outbox_events.find((e) => e.id === event.id);
      if (match) {
        match.processed_at = nowIso();
      }
    }
  });

  return NextResponse.json({ ok: true, processed: processedCount, total: pending.length });
}

export async function GET() {
  const db = loadDb();
  const pending = (db.outbox_events ?? []).filter((e) => !e.processed_at).length;
  const processed = (db.outbox_events ?? []).filter((e) => Boolean(e.processed_at)).length;
  return NextResponse.json({ pending, processed, total: (db.outbox_events ?? []).length });
}
