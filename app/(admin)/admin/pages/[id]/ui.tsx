"use client";

import { useActionState } from "react";
import { updatePageAction } from "@/lib/actions/admin";
import type { Page } from "@/lib/db/types";

export function PageEditor({ page }: { page: Page }) {
  const [state, action, pending] = useActionState(updatePageAction, null);
  const ok = state && "ok" in state && (state as { ok: boolean }).ok;
  return (
    <form action={action} className="mt-8 max-w-2xl space-y-4">
      <input type="hidden" name="id" value={page.id} />
      {ok && <p className="text-sm text-green-700">✓ Page saved successfully.</p>}
      {state && "error" in (state ?? {}) && (
        <p className="text-sm text-red-600">{(state as { error: string }).error}</p>
      )}
      <div>
        <label className="label" htmlFor="title">
          Page title
        </label>
        <input id="title" name="title" className="input mt-1" defaultValue={page.title} required />
      </div>
      <div>
        <label className="label" htmlFor="body">
          Body content
        </label>
        <textarea
          id="body"
          name="body"
          className="input mt-1 min-h-64 font-sans text-sm leading-relaxed"
          defaultValue={page.body}
        />
        <p className="mt-1 text-xs text-ink-soft">Plain text with paragraphs.</p>
      </div>
      <div className="flex items-center gap-3">
        <input id="published" name="published" type="checkbox" defaultChecked={page.published} />
        <label htmlFor="published" className="text-sm">
          Published
        </label>
      </div>
      <div className="flex gap-3 items-center">
        <button className="btn btn-primary" disabled={pending}>
          {pending ? "Saving…" : "Save page"}
        </button>
        <a href={`/policies/${page.slug}`} target="_blank" className="btn btn-ghost">
          View live ↗
        </a>
      </div>
    </form>
  );
}
