import Link from "next/link";
import { preload } from "react-dom";
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
  const originCount = new Set(published.map((p) => p.origin).filter(Boolean)).size;
  const story = resolveHomepageStory();

  preload("/images/growth/one-rice-seed.jpg", { as: "image" });
  preload("/images/growth/soil-texture.jpg", { as: "image" });

  return (
    <div>
      <GrowthStory story={story} />

      <section className="bg-warmwhite border-b border-line">
        <div className="container-page grid grid-cols-2 md:grid-cols-5">
          {["Named origin", "Small lots", "Honest weights", "Short lists", "No theatre"].map((item) => (
            <div key={item} className="py-6 text-[0.68rem] tracking-[0.18em] uppercase text-ink-soft md:border-r border-line last:border-0">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-20">
        <StoryHeading kicker="From the same soil">Featured</StoryHeading>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {featured.map((c) => (
            <ProductCard key={c.product.id} card={c} />
          ))}
        </div>
      </section>

      <section id="story" className="grid md:grid-cols-2 min-h-[70vh]">
        <MaskImage src="/images/soil-hands.jpg" alt="Soil in working hands" className="min-h-[50vh]" hint="Explore" />
        <div className="flex flex-col justify-center px-8 md:px-16 py-16 bg-forest text-cream">
          <StoryHeading kicker="Soil" tamil={settings.story_tamil} light>
            {settings.story_title}
          </StoryHeading>
          <p className="mt-6 text-cream/80 leading-relaxed max-w-md">
            Soil first. Grain, oil, and spice named to a place — not a slogan. Packed in small lots so the jar still remembers the season.
          </p>
        </div>
      </section>

      <section className="grid md:grid-cols-2 min-h-[70vh]">
        <div className="order-2 md:order-1 flex flex-col justify-center px-8 md:px-16 py-16 bg-cream">
          <StoryHeading kicker="The people behind the food">Hands that know the plot</StoryHeading>
          <p className="mt-4 text-ink-soft leading-relaxed max-w-md">
            Development photograph — environmental, not a campaign face. Crop, method, and harvest stay on the product when the data exists.
          </p>
          <p className="mt-6 text-[0.7rem] tracking-[0.16em] uppercase text-earth">Where named · Dharmapuri · Salem · Nilgiris</p>
        </div>
        <EditorialImage
          src="/images/farmer-field.jpg"
          alt="Farmer walking a field"
          className="order-1 md:order-2 min-h-[50vh]"
          hint="Explore"
        />
      </section>

      <section className="container-page py-20">
        <StoryHeading kicker="From the farm · Small batch" tamil="நாட்டு உணவு">
          The pantry
        </StoryHeading>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((c) => (
            <Link key={c.id} href={`/category/${c.slug}`} className="group relative aspect-[4/5] overflow-hidden bg-paper-deep" data-hint="View product">
              {c.image_path && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.image_path} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03] group-hover:translate-x-[1%]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-cream font-serif text-2xl">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-2 items-stretch">
        <MaskImage src="/images/millet-foxtail.jpg" alt="Foxtail millet" className="min-h-[420px]" hint="Explore" />
        <div className="flex flex-col justify-center px-8 md:px-16 py-16 bg-paper-deep">
          <StoryHeading kicker="Traditional grain">
            Ancient food.
            <br />
            Modern table.
          </StoryHeading>
          <p className="font-tamil text-xl text-terracotta mt-4">நம் பாரம்பரிய உணவு</p>
          <p className="mt-4 text-ink-soft max-w-md">Foxtail, little millet, ragi — everyday cooking, not a novelty aisle.</p>
          <Link href="/category/millets" className="link-grow mt-6 w-fit text-[0.72rem] tracking-[0.16em] uppercase">
            Shop millets
          </Link>
        </div>
      </section>

      <section className="bg-warmwhite py-16">
        <div className="container-page grid grid-cols-3 gap-8">
          <CountUp value={published.length} label="Products in the pantry" />
          <CountUp value={categories.length} label="Categories" />
          <CountUp value={originCount} label="Named origins" />
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="font-serif text-4xl text-forest">Best sellers</h2>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {sellers.map((c) => (
            <ProductCard key={c.product.id} card={c} />
          ))}
        </div>
      </section>

      <section className="bg-warmwhite py-20">
        <div className="container-page grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="label">Trust</p>
            <h2 className="font-serif text-4xl text-forest mt-2">On the product, not the wallpaper</h2>
            <p className="mt-4 text-ink-soft">
              Where a lot carries NPOP or PGS, it is stored on that product. We do not invent seals, revenue, or stock.
            </p>
          </div>
          <ul className="space-y-4 text-sm">
            <li className="border-b border-line pb-3">India Organic / NPOP — shown when present</li>
            <li className="border-b border-line pb-3">PGS-India — shown when present</li>
            <li className="border-b border-line pb-3">FSSAI field — per product, when entered</li>
            <li>Traceability is a label: origin, crop, process</li>
          </ul>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-serif text-4xl text-forest">Journal</h2>
          <Link href="/blog" className="link-grow text-[0.7rem] tracking-[0.16em] uppercase">
            All essays
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((p) => (
            <Link key={p.id} href={`/blog/${p.slug}`} className="group">
              <div className="aspect-[16/10] overflow-hidden bg-paper-deep">
                {p.cover_path && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.cover_path} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                )}
              </div>
              <h3 className="mt-3 font-serif text-2xl">{p.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
