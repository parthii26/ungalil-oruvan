"use client";

import { useActionState } from "react";
import { saveSettingsAction } from "@/lib/actions/admin";
import type { SiteSettings } from "@/lib/db/types";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState(saveSettingsAction, null);
  return (
    <form action={action} className="mt-8 max-w-xl space-y-3">
      {[
        ["brand_name", "Brand name", settings.brand_name],
        ["accent_color", "Accent color", settings.accent_color],
        ["tamil_tagline", "Tamil tagline", settings.tamil_tagline],
        ["english_tagline", "English tagline", settings.english_tagline],
        ["login_headline", "Customer login headline", settings.login_headline],
        ["login_subhead", "Customer login subhead", settings.login_subhead],
        ["hero_headline", "Hero headline", settings.hero_headline],
        ["hero_tamil", "Hero Tamil line", settings.hero_tamil],
        ["hero_subhead", "Hero subhead", settings.hero_subhead],
        ["story_title", "Story title", settings.story_title],
        ["story_tamil", "Story Tamil line", settings.story_tamil],
        ["contact_email", "Contact email", settings.contact_email],
        ["contact_phone", "Phone", settings.contact_phone],
        ["address", "Address", settings.address],
        ["footer_text", "Footer text", settings.footer_text],
        ["instagram", "Instagram", settings.social.instagram ?? ""],
        ["facebook", "Facebook", settings.social.facebook ?? ""],
      ].map(([name, label, value]) => (
        <div key={name}>
          <label className="label" htmlFor={name}>
            {label}
          </label>
          <input id={name} name={name} className="input" defaultValue={value} />
        </div>
      ))}
      {state && "ok" in state && state.ok && <p className="text-sm">Saved.</p>}
      <button className="btn btn-primary" disabled={pending}>
        Save
      </button>
    </form>
  );
}
