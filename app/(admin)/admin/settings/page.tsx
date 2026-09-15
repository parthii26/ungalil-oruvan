import { getSiteSettings } from "@/lib/services/settings";
import { SettingsForm } from "./ui";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  const s = getSiteSettings();
  return (
    <div>
      <h1 className="font-serif text-3xl md:text-4xl">Settings</h1>
      <SettingsForm settings={s} />
      <section className="mt-16 grid md:grid-cols-2 gap-6">
        {[
          ["GST", "Brand GSTIN is live and printed on customer invoices."],
          ["FSSAI", "Brand-level FSSAI license is active and rendered on all invoices."],
          ["Shipping", "Flat estimate and free shipping threshold are live in store settings."],
          ["Tax", "Standard tax rules applied on invoice receipts."],
          ["Notifications", "Resend email scaffold active with graceful fallback."],
          ["SEO", "Per-page metadata and social tags are active."],
        ].map(([t, d]) => (
          <div key={t} className="border border-dashed border-line p-5">
            <h2 className="font-serif text-2xl">{t}</h2>
            <p className="mt-2 text-sm text-ink-soft">{d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
