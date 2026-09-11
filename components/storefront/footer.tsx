import Link from "next/link";
import { getSiteSettings } from "@/lib/services/settings";
import { listPublicCategories } from "@/lib/services/catalog";

export async function StorefrontFooter() {
  const settings = getSiteSettings();
  const cats = listPublicCategories();

  return (
    <footer className="relative mt-0 overflow-hidden bg-[#211910] text-cream">
      <svg className="pointer-events-none absolute inset-x-0 top-0 h-24 w-full opacity-30" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden>
        {Array.from({ length: 10 }).map((_, i) => {
          const y = 8 + i * 11;
          const inset = 80 + i * 18;
          return (
            <line
              key={i}
              x1={inset}
              y1={y}
              x2={1200 - inset}
              y2={y}
              stroke="#667B45"
              strokeOpacity={0.45 - i * 0.03}
              strokeWidth="0.8"
            />
          );
        })}
      </svg>
      <div className="container-page relative py-12 md:py-20 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="font-tamil text-turmeric text-lg">{settings.tamil_tagline}</p>
          <p className="mt-1 font-serif text-3xl">{settings.brand_name}</p>
          <p className="mt-1 text-[0.7rem] tracking-[0.16em] uppercase text-cream/60">{settings.english_tagline}</p>
          <p className="mt-4 text-sm text-cream/70 leading-relaxed">{settings.footer_text}</p>
        </div>
        <nav aria-label="Footer shop">
          <p className="text-[0.68rem] tracking-[0.18em] uppercase text-cream/50 mb-3">Shop</p>
          <ul className="text-sm">
            {cats.map((c) => (
              <li key={c.id}>
                <Link href={`/category/${c.slug}`} className="flex min-h-11 items-center hover:text-turmeric">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Footer visit">
          <p className="text-[0.68rem] tracking-[0.18em] uppercase text-cream/50 mb-3">Visit</p>
          <ul className="text-sm">
            {[
              ["/about", "About"],
              ["/blog", "Journal"],
              ["/faq", "FAQ"],
              ["/contact", "Contact"],
              ["/policies/shipping", "Shipping"],
              ["/policies/privacy", "Privacy"],
              ["/policies/terms", "Terms"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="flex min-h-11 items-center hover:text-turmeric">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-[0.68rem] tracking-[0.18em] uppercase text-cream/50 mb-3">Studio</p>
          {settings.address && (
            <p className="text-sm text-cream/70 leading-relaxed">{settings.address}</p>
          )}
          <a href={`mailto:${settings.contact_email}`} className="mt-1 flex min-h-11 items-center text-sm text-cream/70 hover:text-turmeric">
            {settings.contact_email}
          </a>
          <a href={`tel:${settings.contact_phone.replace(/\s+/g, "")}`} className="flex min-h-11 items-center text-sm text-cream/70 hover:text-turmeric">
            {settings.contact_phone}
          </a>
          <p className="mt-4 text-xs text-cream/45">Newsletter is a Stage 2 integration (Resend).</p>
        </div>
      </div>
      <div
        className="container-page relative pt-6 border-t border-cream/10 text-xs text-cream/45 flex flex-wrap justify-between gap-2 pb-[calc(var(--bnav-h)+env(safe-area-inset-bottom,0px)+1.5rem)] md:pb-6"
      >
        <p>
          © {new Date().getFullYear()} {settings.brand_name}. Stage 1 development store.
        </p>
        <p>Payments, shipping, and invoices are not live.</p>
      </div>
    </footer>
  );
}
