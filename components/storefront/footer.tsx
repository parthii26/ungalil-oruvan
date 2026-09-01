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
      <div className="container-page relative py-20 grid gap-10 md:grid-cols-4">
        <div>
          <p className="font-serif text-3xl">{settings.brand_name}</p>
          <p className="mt-3 font-tamil text-turmeric">{settings.tamil_tagline}</p>
          <p className="mt-1 text-[0.7rem] tracking-[0.16em] uppercase text-cream/60">{settings.english_tagline}</p>
          <p className="mt-4 text-sm text-cream/70 leading-relaxed">{settings.footer_text}</p>
        </div>
        <div>
          <p className="text-[0.68rem] tracking-[0.18em] uppercase text-cream/50 mb-3">Shop</p>
          <ul className="space-y-2 text-sm">
            {cats.map((c) => (
              <li key={c.id}>
                <Link href={`/category/${c.slug}`} className="hover:text-turmeric">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[0.68rem] tracking-[0.18em] uppercase text-cream/50 mb-3">Visit</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/blog">Journal</Link>
            </li>
            <li>
              <Link href="/faq">FAQ</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/policies/shipping">Shipping</Link>
            </li>
            <li>
              <Link href="/policies/privacy">Privacy</Link>
            </li>
            <li>
              <Link href="/policies/terms">Terms</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[0.68rem] tracking-[0.18em] uppercase text-cream/50 mb-3">Studio</p>
          <p className="text-sm text-cream/70 leading-relaxed">
            {settings.address}
            <br />
            {settings.contact_email}
            <br />
            {settings.contact_phone}
          </p>
          <p className="mt-6 text-xs text-cream/45">Newsletter is a Stage 2 integration (Resend).</p>
        </div>
      </div>
      <div className="container-page relative py-6 border-t border-cream/10 text-xs text-cream/45 flex flex-wrap justify-between gap-2">
        <p>
          © {new Date().getFullYear()} {settings.brand_name}. Stage 1 development store.
        </p>
        <p>Payments, shipping, and invoices are not live.</p>
      </div>
    </footer>
  );
}
