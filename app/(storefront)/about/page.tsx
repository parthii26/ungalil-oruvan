import { getSiteSettings } from "@/lib/services/settings";

export const metadata = { title: "About" };

export default function AboutPage() {
  const s = getSiteSettings();
  return (
    <div className="container-page py-16 max-w-3xl">
      <p className="font-tamil text-terracotta">{s.tamil_tagline}</p>
      <h1 className="font-serif text-5xl mt-2 text-forest">{s.brand_name}</h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-soft">
        {s.english_tagline}. {s.footer_text}
      </p>
      <div className="mt-10 grid md:grid-cols-2 gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/farm-dawn.jpg" alt="" className="h-56 w-full object-cover" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/soil-hands.jpg" alt="" className="h-56 w-full object-cover" />
      </div>
      <section id="story" className="mt-16">
        <p className="font-tamil text-earth">{s.story_tamil}</p>
        <h2 className="font-serif text-4xl">{s.story_title}</h2>
        <p className="mt-4 leading-relaxed">
          Traditional roots, modern commerce. The storefront carries Tamil Nadu soil in its details — millet names, named
          origins, terracotta accents — without turning the shop into a costume. Words here are configuration-ready from
          Settings.
        </p>
      </section>
    </div>
  );
}
