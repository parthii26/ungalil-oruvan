"use client";

import Link from "next/link";
import { useEffect, useRef, type RefObject } from "react";
import type { GrowthStoryView } from "@/lib/story/types";
import { GROWTH_STAGES, POST_HARVEST_GRAIN } from "@/lib/story/growth-stages";
import { stageFromProgress } from "@/lib/story/growth-progress";

const LAST = GROWTH_STAGES.length - 1;

export type CompactHeroCopy = {
  headline: string;
  tamil: string;
  subhead: string;
  image: string;
};

export function CropGrowthTimeline({ story, hero }: { story: GrowthStoryView; hero?: CompactHeroCopy }) {
  const sectionRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The sticky scroll-driven timeline is desktop-only. Phones get the
    // compact hero below: no scroll-jacking, no rAF loop, faster to products.
    const mq = window.matchMedia("(min-width: 768px)");

    const setup = () => {
      const section = sectionRef.current;
      const root = rootRef.current;
      const fill = fillRef.current;
      if (!section || !root || !fill) return undefined;

      const plates = Array.from(root.querySelectorAll<HTMLElement>("[data-plate]"));
      const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-node]"));
      const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-card]"));
      const count = root.querySelector<HTMLElement>("[data-count]");
      const product = root.querySelector<HTMLElement>("[data-product]");
      if (plates.length !== GROWTH_STAGES.length) return undefined;

      let raf = 0;
      let idx = 0;
      let watching = true;

      // Enable crossfade transitions now that we are hydrated, then reveal
      // the frames around the current stage so scrolling never outruns the
      // network: only the first two photos ship with the initial markup.
      plates.forEach((el) => el.classList.add("is-live"));
      const prime = (center: number) => {
        for (let i = center - 1; i <= center + 1; i += 1) {
          const img = plates[i]?.querySelector("img");
          const src = img?.getAttribute("data-src");
          if (img && src && !img.getAttribute("src")) img.setAttribute("src", src);
        }
      };

      // Reset in case we are re-initialising after a breakpoint change.
      root.dataset.active = "0";
      plates.forEach((el, i) => el.classList.toggle("is-on", i === 0));
      nodes.forEach((el, i) => {
        el.classList.toggle("is-on", i === 0);
        el.classList.toggle("is-done", false);
      });
      cards.forEach((el, i) => el.classList.toggle("is-on", i === 0));
      if (count) count.textContent = `${GROWTH_STAGES[0].number} / ${GROWTH_STAGES[LAST].number}`;
      product?.classList.toggle("is-on", false);
      prime(0);

      const showStage = (next: number) => {
        if (next === idx) return;
        idx = next;
        root.dataset.active = String(idx);
        plates.forEach((el, i) => el.classList.toggle("is-on", i === idx));
        nodes.forEach((el, i) => {
          el.classList.toggle("is-on", i === idx);
          el.classList.toggle("is-done", i < idx);
        });
        cards.forEach((el, i) => el.classList.toggle("is-on", i === idx));
        if (count) count.textContent = `${GROWTH_STAGES[idx].number} / ${GROWTH_STAGES[LAST].number}`;
        product?.classList.toggle("is-on", idx >= LAST);
        prime(idx);
      };

      const tick = () => {
        raf = 0;
        if (!watching) return;
        const box = section.getBoundingClientRect();
        const travel = Math.max(1, section.offsetHeight - window.innerHeight);
        const p = Math.min(1, Math.max(0, -box.top / travel));
        fill.style.transform = `scaleX(${p})`;
        showStage(stageFromProgress(p, idx));
      };

      const onScroll = () => {
        if (raf) return;
        raf = requestAnimationFrame(tick);
      };

      fill.style.transform = "scaleX(0)";
      const io = new IntersectionObserver(
        ([entry]) => {
          watching = entry.isIntersecting;
          if (watching) onScroll();
        },
        { rootMargin: "80px 0px" },
      );
      io.observe(section);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      onScroll();
      return () => {
        io.disconnect();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        if (raf) cancelAnimationFrame(raf);
      };
    };

    let cleanup = mq.matches ? setup() : undefined;
    const onChange = () => {
      cleanup?.();
      cleanup = mq.matches ? setup() : undefined;
    };
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      cleanup?.();
    };
  }, []);

  return (
    <>
      {hero && <CompactGrowthHero story={story} hero={hero} />}
      <section ref={sectionRef} id="seed-stage" data-hero-tone="light" className="relative hidden h-[300vh] bg-[#F5F0E5] md:block">
        <div ref={rootRef} className="crop-root sticky top-0 flex min-h-[100svh] flex-col justify-center py-14" data-active="0">
          <div className="container-page mb-5">
            <p className="text-[0.62rem] tracking-[0.28em] uppercase text-earth">From seed</p>
            <h2 className="mt-1 font-serif text-4xl text-forest">A crop, in order</h2>
            <p className="mt-2 max-w-md text-sm text-ink-soft">From one grain to a field of life. Scroll to grow it.</p>
          </div>

          <TimelineTrack fillRef={fillRef} />

          <div className="container-page">
            <div className="gt-well relative mx-auto aspect-[16/9] max-h-[58vh] w-full overflow-hidden bg-[#141a17]">
              {GROWTH_STAGES.map((stage, i) => (
                <div key={stage.id} data-plate={i} className={`gt-plate absolute inset-0${i === 0 ? " is-on" : ""}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={i < 2 ? stage.photo : undefined}
                    data-src={i < 2 ? undefined : stage.photo}
                    alt={stage.alt}
                    width={1600}
                    height={900}
                    decoding="async"
                    fetchPriority={i === 0 ? "high" : undefined}
                    loading={i === 0 ? undefined : "lazy"}
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-3/5 bg-gradient-to-t from-[#101613]/80 via-[#101613]/30 to-transparent"
                aria-hidden
              />
              <p
                data-count
                className="absolute right-5 top-5 z-[2] text-[0.62rem] tracking-[0.28em] uppercase text-cream/80 [text-shadow:0_1px_8px_rgb(16_22_19/60%)]"
              >
                {GROWTH_STAGES[0].number} / {GROWTH_STAGES[LAST].number}
              </p>
              {GROWTH_STAGES.map((stage, i) => (
                <div key={stage.id} data-card={i} className={`gt-card gt-card-photo z-[2]${i === 0 ? " is-on" : ""}`}>
                  <p className="text-[0.62rem] tracking-[0.22em] uppercase text-turmeric">{stage.number}</p>
                  <p className="mt-1 font-tamil text-lg text-turmeric/90">{stage.tamil}</p>
                  <p className="mt-0.5 font-serif text-4xl text-cream">{stage.title}</p>
                  <p className="mt-2 max-w-md text-sm text-cream/85">{stage.caption}</p>
                </div>
              ))}
            </div>
          </div>

          <FinalProductTransition story={story} />
        </div>
      </section>
    </>
  );
}

function TimelineTrack({ fillRef }: { fillRef: RefObject<HTMLDivElement | null> }) {
  return (
    <div className="container-page mb-6">
      <div className="gt-track relative">
        <div className="gt-rail" aria-hidden />
        <div ref={fillRef} className="gt-fill" aria-hidden />
        <ol className="relative z-[1] flex items-start justify-between gap-1 overflow-visible pb-1">
          {GROWTH_STAGES.map((stage, i) => (
            <li key={stage.id} className="min-w-[3.4rem] flex-1 text-center">
              <div data-node={i} className={`gt-node${i === 0 ? " is-on" : ""}`}>
                <span className="gt-dot" />
                <p className="mt-2 text-[0.58rem] tracking-[0.16em] uppercase text-ink-soft">{stage.number}</p>
                <p className="hidden font-tamil text-xs text-terracotta md:block">{stage.tamil}</p>
                <p className="hidden text-[0.62rem] tracking-[0.12em] uppercase text-earth md:block">{stage.title}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function FinalProductTransition({ story }: { story: GrowthStoryView }) {
  const product = story.product;
  return (
    <div data-product className="gt-product container-page mt-8 grid items-center gap-6 md:grid-cols-[140px_1fr_auto]">
      <div className="overflow-hidden bg-paper-deep">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product?.image ?? POST_HARVEST_GRAIN}
          alt=""
          width={280}
          height={350}
          decoding="async"
          loading="lazy"
          className="aspect-[4/5] w-full object-cover"
        />
      </div>
      <div>
        <p className="text-[0.62rem] tracking-[0.22em] uppercase text-earth">From this crop</p>
        {product?.tamil && <p className="mt-1 font-tamil text-terracotta">{product.tamil}</p>}
        <p className="mt-0.5 font-serif text-3xl text-forest">{product?.name ?? story.tagline}</p>
      </div>
      <Link href={story.href} className="link-grow w-fit text-[0.7rem] tracking-[0.18em] uppercase text-forest">
        {story.cta}
      </Link>
    </div>
  );
}

/**
 * Mobile hero: one screen, one image, products one tap away. The same story
 * beats become a swipeable strip instead of a scroll-gated animation.
 */
function CompactGrowthHero({ story, hero }: { story: GrowthStoryView; hero: CompactHeroCopy }) {
  const product = story.product;
  return (
    <div className="md:hidden">
      <section className="relative overflow-hidden bg-forest text-cream">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero.image}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/60 to-forest/30" aria-hidden />
        <div className="container-page relative flex min-h-[68svh] flex-col justify-end pb-10 pt-16">
          <p className="text-[0.65rem] tracking-[0.28em] uppercase text-turmeric">From seed · {story.cropName}</p>
          <p className="mt-2 font-tamil text-xl text-turmeric/90">{hero.tamil}</p>
          <h1 className="mt-1 font-serif text-[2.6rem] leading-[1.02]">{hero.headline}</h1>
          <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-cream/85">{hero.subhead}</p>
          <div className="mt-6 flex gap-3">
            <Link href="/shop" className="btn flex-1 bg-cream text-forest">
              Shop the pantry
            </Link>
            <Link href="/about#story" className="btn btn-ghost on-dark flex-1">
              Our story
            </Link>
          </div>
        </div>
      </section>

      <section aria-label="A crop, in order" className="border-b border-line bg-paper py-8">
        <div className="container-page flex items-baseline justify-between gap-3">
          <h2 className="font-serif text-2xl text-forest">A crop, in order</h2>
          <p className="text-[0.65rem] tracking-[0.2em] uppercase text-ink-soft">Swipe</p>
        </div>
        <div className="scrollbar-none mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
          {GROWTH_STAGES.map((stage) => (
            <article
              key={stage.id}
              className="w-[68%] shrink-0 snap-start overflow-hidden border border-line bg-warmwhite"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={stage.photo}
                alt={stage.alt}
                loading="lazy"
                decoding="async"
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="p-5">
                <p className="text-[0.62rem] tracking-[0.22em] uppercase text-earth">{stage.number}</p>
                <p className="mt-1 font-tamil text-terracotta">{stage.tamil}</p>
                <h3 className="mt-0.5 font-serif text-2xl text-forest">{stage.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{stage.caption}</p>
              </div>
            </article>
          ))}
          <Link
            href={product ? `/product/${product.slug}` : story.href}
            className="block w-[68%] shrink-0 snap-start border border-forest bg-forest p-5 text-cream"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product?.image ?? POST_HARVEST_GRAIN}
              alt=""
              loading="lazy"
              decoding="async"
              className="aspect-[16/10] w-full object-cover"
            />
            <p className="mt-3 text-[0.62rem] tracking-[0.22em] uppercase text-turmeric">From this crop</p>
            {product?.tamil && <p className="mt-1 font-tamil text-turmeric/90">{product.tamil}</p>}
            <p className="mt-0.5 font-serif text-2xl leading-tight">{product?.name ?? story.tagline}</p>
            {product && (
              <p className="mt-1 text-sm text-cream/80">
                {product.price}
              </p>
            )}
            <p className="mt-3 text-[0.7rem] tracking-[0.18em] uppercase underline underline-offset-4">
              {story.cta}
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}

export function GrowthStory({ story, hero }: { story: GrowthStoryView; hero?: CompactHeroCopy }) {
  return <CropGrowthTimeline story={story} hero={hero} />;
}

export function SeedHero({ story, hero }: { story: GrowthStoryView; hero?: CompactHeroCopy }) {
  return <CropGrowthTimeline story={story} hero={hero} />;
}
