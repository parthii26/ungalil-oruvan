"use client";

import { useActionState } from "react";
import { subscribeNewsletterAction } from "@/lib/actions/newsletter";

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribeNewsletterAction, null);

  if (state?.ok) {
    return (
      <div className="mt-4 border border-cream/20 bg-cream/10 p-3 text-xs text-cream/90">
        <p className="font-serif text-sm text-turmeric">✓ Subscribed</p>
        <p className="mt-1 text-cream/80">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="mt-4 space-y-2">
      <div className="flex gap-2">
        <input
          type="email"
          name="email"
          required
          placeholder="Enter your email"
          className="w-full bg-cream/10 border border-cream/20 px-3 py-2 text-xs text-cream placeholder:text-cream/40 focus:outline-none focus:border-turmeric"
        />
        <button
          type="submit"
          disabled={pending}
          className="whitespace-nowrap bg-turmeric text-forest px-4 py-2 text-xs font-medium hover:bg-turmeric/90 disabled:opacity-50 transition-colors"
        >
          {pending ? "Joining…" : "Join"}
        </button>
      </div>
      {state && !state.ok && (
        <p className="text-xs text-red-400">{state.error}</p>
      )}
      <p className="text-[0.7rem] text-cream/50">Seasonal harvests, new mill runs, and farm updates.</p>
    </form>
  );
}
