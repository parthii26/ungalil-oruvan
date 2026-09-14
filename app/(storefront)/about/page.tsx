import { getSiteSettings } from "@/lib/services/settings";

export const metadata = { title: "About" };

export default function AboutPage() {
  const s = getSiteSettings();

  const tamilBadge = s.about_tamil_badge ?? s.tamil_tagline ?? "உங்களில் ஒருவன்";
  const title = s.about_title || s.brand_name || "Ungalil Oruvan";
  const intro = s.about_intro || `${s.english_tagline}. ${s.footer_text}`;
  const image1 = s.about_image_1 || "/images/farm-dawn.jpg";
  const image1Alt = s.about_image_1_alt || "Farm at dawn";
  const image2 = s.about_image_2 || "/images/soil-hands.jpg";
  const image2Alt = s.about_image_2_alt || "Soil in working hands";
  const storyTamil = s.story_tamil ?? "நமது மண்ணில் வேரூன்றியது";
  const storyTitle = s.story_title || "Rooted in Our Soil";
  const storyBody =
    s.story_body ||
    "Traditional roots, modern commerce. The storefront carries honest soil in its details — millet names, farm lots, terracotta accents — without turning the shop into a costume. Words here are configuration-ready from Settings.";

  return (
    <div className="container-page py-10 md:py-16 max-w-3xl">
      {tamilBadge && (
        <p data-testid="about-tamil-badge" className="font-tamil text-terracotta">
          {tamilBadge}
        </p>
      )}
      <h1 data-testid="about-title" className="font-serif text-4xl md:text-5xl mt-2 text-forest">
        {title}
      </h1>
      <p data-testid="about-intro" className="mt-6 text-lg leading-relaxed text-ink-soft whitespace-pre-line">
        {intro}
      </p>
      <div className="mt-8 md:mt-10 grid sm:grid-cols-2 gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-testid="about-image-1"
          src={image1}
          alt={image1Alt}
          loading="lazy"
          decoding="async"
          className="h-56 w-full object-cover"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-testid="about-image-2"
          src={image2}
          alt={image2Alt}
          loading="lazy"
          decoding="async"
          className="h-56 w-full object-cover"
        />
      </div>
      <section id="story" className="mt-12 md:mt-16 scroll-mt-24">
        {storyTamil && (
          <p data-testid="story-tamil" className="font-tamil text-earth">
            {storyTamil}
          </p>
        )}
        <h2 data-testid="story-title" className="font-serif text-3xl md:text-4xl">
          {storyTitle}
        </h2>
        <p data-testid="story-body" className="mt-4 leading-relaxed whitespace-pre-line">
          {storyBody}
        </p>
      </section>
    </div>
  );
}
