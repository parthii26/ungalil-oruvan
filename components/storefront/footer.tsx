import Link from "next/link";
import { getSiteSettings } from "@/lib/services/settings";
import { listPublicCategories } from "@/lib/services/catalog";
import { NewsletterForm } from "@/components/storefront/newsletter-form";

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
      <div className="container-page relative py-12 md:py-18 grid gap-8 sm:grid-cols-2 md:grid-cols-5">
        {/* Col 1: Brand & Philosophy */}
        <div className="md:col-span-1">
          <p className="font-tamil text-turmeric text-lg">{settings.tamil_tagline}</p>
          <p className="mt-1 font-serif text-2xl md:text-3xl">{settings.brand_name}</p>
          <p className="mt-1 text-[0.7rem] tracking-[0.16em] uppercase text-cream/60">{settings.english_tagline}</p>
          <p className="mt-4 text-xs text-cream/70 leading-relaxed">{settings.footer_text}</p>
          {(settings.fssai || settings.gstin) && (
            <div className="mt-4 pt-3 border-t border-cream/10 text-[0.68rem] text-cream/50 space-y-1">
              {settings.fssai && <p>FSSAI Lic: {settings.fssai}</p>}
              {settings.gstin && <p>GSTIN: {settings.gstin}</p>}
            </div>
          )}
        </div>

        {/* Col 2: Shop Categories */}
        <nav aria-label="Footer shop">
          <p className="text-[0.68rem] tracking-[0.18em] uppercase text-turmeric/90 mb-3 font-medium">Pantry Shop</p>
          <ul className="text-xs space-y-2">
            {cats.map((c) => (
              <li key={c.id}>
                <Link href={`/category/${c.slug}`} className="hover:text-turmeric transition-colors block py-0.5">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Col 3: Company */}
        <nav aria-label="Footer company">
          <p className="text-[0.68rem] tracking-[0.18em] uppercase text-turmeric/90 mb-3 font-medium">Company</p>
          <ul className="text-xs space-y-2">
            <li>
              <Link href="/about" className="hover:text-turmeric transition-colors block py-0.5">
                About Our Harvests
              </Link>
            </li>
            <li>
              <Link href="/about#story" className="hover:text-turmeric transition-colors block py-0.5">
                Our Farming Roots
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-turmeric transition-colors block py-0.5">
                Farm Journal
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-turmeric transition-colors block py-0.5">
                Frequently Asked Questions
              </Link>
            </li>
          </ul>
        </nav>

        {/* Col 4: Customer Care & Legal */}
        <nav aria-label="Footer legal">
          <p className="text-[0.68rem] tracking-[0.18em] uppercase text-turmeric/90 mb-3 font-medium">Care & Legal</p>
          <ul className="text-xs space-y-2">
            <li>
              <Link href="/order/track" className="hover:text-turmeric transition-colors block py-0.5 font-medium text-cream">
                Track Order →
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-turmeric transition-colors block py-0.5">
                Contact Customer Care
              </Link>
            </li>
            <li>
              <Link href="/policies/shipping" className="hover:text-turmeric transition-colors block py-0.5">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link href="/policies/refunds" className="hover:text-turmeric transition-colors block py-0.5">
                Returns & Refunds
              </Link>
            </li>
            <li>
              <Link href="/policies/cancellation" className="hover:text-turmeric transition-colors block py-0.5">
                Cancellation & Claims
              </Link>
            </li>
            <li>
              <Link href="/policies/privacy" className="hover:text-turmeric transition-colors block py-0.5">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/policies/terms" className="hover:text-turmeric transition-colors block py-0.5">
                Terms of Use
              </Link>
            </li>
          </ul>
        </nav>

        {/* Col 5: Contact & Newsletter */}
        <div>
          <p className="text-[0.68rem] tracking-[0.18em] uppercase text-turmeric/90 mb-3 font-medium">Support</p>
          {settings.address && (
            <p className="text-xs text-cream/70 leading-relaxed mb-2">{settings.address}</p>
          )}
          <a href={`mailto:${settings.contact_email}`} className="block text-xs text-cream/80 hover:text-turmeric transition-colors py-0.5">
            {settings.contact_email}
          </a>
          <a href={`tel:${settings.contact_phone.replace(/\s+/g, "")}`} className="block text-xs text-cream/80 hover:text-turmeric transition-colors py-0.5">
            {settings.contact_phone}
          </a>
          {settings.support_hours && (
            <p className="text-[0.7rem] text-cream/50 mt-1">{settings.support_hours}</p>
          )}
          <div className="mt-4 pt-3 border-t border-cream/10">
            <p className="text-[0.68rem] tracking-[0.16em] uppercase text-cream/60 mb-2">Harvest Newsletter</p>
            <NewsletterForm />
          </div>
        </div>
      </div>
      <div
        className="container-page relative pt-6 border-t border-cream/10 text-xs text-cream/45 flex flex-wrap justify-between gap-2 pb-[calc(var(--bnav-h)+env(safe-area-inset-bottom,0px)+1.5rem)] md:pb-6"
      >
        <p>
          © {new Date().getFullYear()} {settings.brand_name}. {settings.english_tagline}
        </p>
        <p>Pure, organic, and ethically sourced from local farmers.</p>
      </div>
    </footer>
  );
}
