import Link from "next/link";
import { getSiteSettings } from "@/lib/services/settings";
import { bestSellers, featuredProducts, listPublicCategories } from "@/lib/services/catalog";
import { ProductCard } from "@/components/product/product-card";
import { loadDb } from "@/lib/db/store";
import { resolveHomepageStory } from "@/lib/services/story";
import { GrowthStory } from "@/components/story/growth-story";
import { CountUp, EditorialImage, MaskImage, StoryHeading } from "@/components/story/editorial";

export default function HomePage() {
  const settings = getSiteSettings();
  const categories = listPublicCategories();
  const featured = featuredProducts(4);
  const sellers = bestSellers(4);
  const posts = loadDb().blog_posts.filter((p) => p.published).slice(0, 3);
  const published = loadDb().products.filter((p) => p.status === "published");
  const story = resolveHomepageStory();

  return (
    <div>
      <GrowthStory
        story={story}
        hero={{
          headline: settings.hero_headline,
          tamil: settings.hero_tamil,
          subhead: settings.hero_subhead,
          image: settings.hero_image,
        }}
      />

      <section className="bg-warmwhite border-b border-line">
        <div className="container-page grid grid-cols-2 gap-y-1 py-4 md:grid-cols-5 md:py-0">
          {["Farm direct", "Small lots", "Honest weights", "Zero chemicals", "Fair farmer pay"].map((item) => (
            <div key={item} className="py-2 md:py-6 text-[0.68rem] tracking-[0.18em] uppercase text-ink-soft md:border-r border-line last:border-0">
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* 1. Best Sellers — Immediate product reach */}
      <section className="container-page py-10 md:py-16">
        <div className="flex items-baseline justify-between mb-6 md:mb-8">
          <div>
            <h2 className="font-tamil text-2xl md:text-3xl font-semibold text-forest leading-snug">மக்கள் விரும்பி வாங்குபவை</h2>
            <p className="font-serif text-2xl md:text-3xl font-normal text-ink leading-snug">Best Sellers</p>
          </div>
          <Link href="/shop" className="link-grow min-h-11 inline-flex items-center text-[0.72rem] tracking-[0.16em] uppercase">
            View All Products →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {sellers.map((c) => (
            <ProductCard key={c.product.id} card={c} />
          ))}
        </div>
      </section>

      {/* 2. Pantry Counts & Scale */}
      <section className="bg-warmwhite py-10 md:py-14 border-y border-line">
        <div className="container-page grid grid-cols-3 gap-4 md:gap-8 text-center sm:text-left">
          <CountUp value={published.length} label="Pantry harvests" />
          <CountUp value={categories.length} label="Harvest categories" />
          <CountUp value={loadDb().product_variants.filter((v) => v.status === "active").length} label="Available pack sizes" />
        </div>
      </section>

      {/* 3. Shop by Category */}
      <section className="container-page py-12 md:py-20">
        <div className="flex items-baseline justify-between mb-6 md:mb-8">
          <div>
            <StoryHeading kicker="From the farm · Small batch" tamil="நாட்டு உணவு">
              The Pantry Categories
            </StoryHeading>
          </div>
          <Link href="/shop" className="link-grow min-h-11 inline-flex items-center text-[0.72rem] tracking-[0.16em] uppercase">
            Browse All →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {categories.map((c) => (
            <Link key={c.id} href={`/category/${c.slug}`} className="group relative aspect-[4/5] overflow-hidden bg-paper-deep" data-hint="View category">
              {c.image_path && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.image_path} alt={c.name} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03] group-hover:translate-x-[1%]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 text-cream">
                <p className="font-serif text-lg md:text-xl leading-tight">{c.name}</p>
                <p className="text-[0.68rem] text-cream/70 mt-0.5 line-clamp-1">{c.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Heritage Feature (Millets) */}
      <section className="grid md:grid-cols-2 items-stretch border-y border-line">
        <MaskImage src="/images/millet-foxtail.jpg" alt="Foxtail millet harvest" className="min-h-[36vh] md:min-h-[420px]" hint="Explore" />
        <div className="flex flex-col justify-center px-6 md:px-16 py-12 md:py-16 bg-paper-deep">
          <StoryHeading kicker="Traditional grain" tamil="நம் பாரம்பரிய உணவு">
            Ancient grain.
            <br />
            Everyday table.
          </StoryHeading>
          <p className="mt-4 text-ink-soft max-w-md text-sm md:text-base leading-relaxed">
            Foxtail, little millet, kodo, and ragi — everyday nourishing staples, not a novelty aisle. Cultivated in drought-hardy rainfed soil.
          </p>
          <Link href="/category/millets" className="link-grow mt-6 w-fit min-h-11 inline-flex items-center text-[0.72rem] tracking-[0.16em] uppercase">
            Shop Native Millets →
          </Link>
        </div>
      </section>

      {/* 5. Farm / Source Story */}
      <section id="story" className="grid md:grid-cols-2 md:min-h-[60vh]">
        <MaskImage src="/images/soil-hands.jpg" alt="Soil in working hands" className="min-h-[36vh] md:min-h-[50vh]" hint="Explore" />
        <div className="flex flex-col justify-center px-6 md:px-16 py-12 md:py-16 bg-forest text-cream">
          <StoryHeading kicker="Soil" tamil={settings.story_tamil} light>
            {settings.story_title}
          </StoryHeading>
          <p className="mt-6 text-cream/85 leading-relaxed max-w-md text-sm md:text-base">
            Soil first. Native millets, cold-pressed oils, and raw spices sourced directly from small family plots — packed in small batches so the harvest retains its genuine flavor and nutrition.
          </p>
        </div>
      </section>

      <section className="grid md:grid-cols-2 md:min-h-[60vh]">
        <div className="order-2 md:order-1 flex flex-col justify-center px-6 md:px-16 py-12 md:py-16 bg-cream">
          <StoryHeading kicker="The people behind the food">Hands that know the plot</StoryHeading>
          <p className="mt-4 text-ink-soft leading-relaxed max-w-md text-sm md:text-base">
            Grown with dedication by agrarian families who know every furrow of the land. Crop variety, natural processing method, and harvest origin are declared transparently on every single lot.
          </p>
          <p className="mt-6 text-[0.7rem] tracking-[0.16em] uppercase text-earth">Direct farmer partnership · Zero middlemen</p>
        </div>
        <EditorialImage
          src="/images/farmer-field.jpg"
          alt="Farmer walking a field"
          className="order-1 md:order-2 min-h-[36vh] md:min-h-[50vh]"
          hint="Explore"
        />
      </section>

      {/* 6. Traceability & Quality Standards */}
      <section className="bg-warmwhite py-12 md:py-18 border-y border-line">
        <div className="container-page grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <p className="label text-[0.7rem]">Integrity & Traceability</p>
            <h2 className="font-serif text-3xl md:text-4xl text-forest mt-2">On the package, not in the marketing</h2>
            <p className="mt-4 text-ink-soft text-sm md:text-base leading-relaxed">
              Where a farm lot carries formal organic certification or government registration, it is recorded accurately on that product. We never fabricate certifications or synthetic claims.
            </p>
          </div>
          <ul className="space-y-4 text-sm">
            <li className="border-b border-line pb-3 flex items-center justify-between">
              <span>Pure Single-Origin Sourcing</span>
              <span className="text-forest text-xs font-semibold">100% Verified Lots</span>
            </li>
            <li className="border-b border-line pb-3 flex items-center justify-between">
              <span>Traditional Wood Ghani Cold-Press</span>
              <span className="text-forest text-xs font-semibold">Unrefined & Raw</span>
            </li>
            <li className="border-b border-line pb-3 flex items-center justify-between">
              <span>Direct Farm Batch Traceability</span>
              <span className="text-forest text-xs font-semibold">Trackable Batches</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Zero Artificial Preservatives or Colors</span>
              <span className="text-forest text-xs font-semibold">Natural Pantry</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 7. Journal */}
      <section className="container-page py-12 md:py-16">
        <div className="flex items-end justify-between mb-6 md:mb-8">
          <div>
            <h2 className="font-tamil text-2xl md:text-3xl font-semibold text-forest leading-snug">களக் குறிப்புகள்</h2>
            <p className="font-serif text-2xl md:text-3xl font-normal text-ink leading-snug">From the Farm Journal</p>
          </div>
          <Link href="/blog" className="link-grow min-h-11 inline-flex items-center text-[0.7rem] tracking-[0.16em] uppercase">
            All Articles →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts.map((p) => (
            <Link key={p.id} href={`/blog/${p.slug}`} className="group">
              <div className="aspect-[16/10] overflow-hidden bg-paper-deep border border-line">
                {p.cover_path && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.cover_path} alt={p.title} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                )}
              </div>
              <h3 className="mt-3 font-serif text-xl md:text-2xl group-hover:text-forest transition-colors">{p.title}</h3>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed line-clamp-2">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
