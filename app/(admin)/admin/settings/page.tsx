import { getSiteSettings } from "@/lib/services/settings";
import { SettingsForm } from "./ui";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  const s = getSiteSettings();
  return (
    <div>
      <h1 className="font-serif text-4xl">Settings</h1>
      <SettingsForm settings={s} />
      <section className="mt-16 grid md:grid-cols-2 gap-6">
        {[
          ["GST", "GSTIN and tax slabs are Stage 2."],
          ["FSSAI", "Brand-level FSSAI is a placeholder. Product-level field exists."],
          ["Shipping", "Courier APIs are Stage 2. Flat estimate is used only as information."],
          ["Tax", "Tax is 0 until configured."],
          ["Notifications", "Resend / WhatsApp are Stage 2."],
          ["SEO", "Per-page metadata is live. Sitemap is generated."],
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
