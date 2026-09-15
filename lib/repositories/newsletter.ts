import { loadDb, mutate } from "@/lib/db/store";
import type { NewsletterSubscriber } from "@/lib/db/types";
import { nowIso, uid } from "@/lib/utils";

export function subscribeEmail(email: string): { ok: boolean; message: string; subscriber?: NewsletterSubscriber } {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !normalized.includes("@")) {
    return { ok: false, message: "Please provide a valid email address." };
  }

  const db = loadDb();
  const existing = (db.newsletter_subscribers ?? []).find((s) => s.email.toLowerCase() === normalized);
  if (existing) {
    return { ok: true, message: "You are already subscribed to our harvest updates!", subscriber: existing };
  }

  const created = mutate((state) => {
    if (!state.newsletter_subscribers) {
      state.newsletter_subscribers = [];
    }
    const record: NewsletterSubscriber = {
      id: uid(),
      email: normalized,
      created_at: nowIso(),
    };
    state.newsletter_subscribers.push(record);
    return record;
  });

  return { ok: true, message: "Thank you for subscribing! We'll keep you updated with harvest news and seasonal offers.", subscriber: created };
}

export function listSubscribers(): NewsletterSubscriber[] {
  return (loadDb().newsletter_subscribers ?? []).slice().reverse();
}
