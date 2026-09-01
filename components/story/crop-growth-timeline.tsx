"use client";

import Link from "next/link";
import { useEffect, useRef, type RefObject } from "react";
import type { GrowthStoryView } from "@/lib/story/types";
import { GROWTH_STAGES, POST_HARVEST_GRAIN } from "@/lib/story/growth-stages";
import { computeGrowth, snapshotForStage, stageFromProgress } from "@/lib/story/growth-progress";
import { bindPlant } from "@/lib/story/apply-growth";
import { RicePlantSvg } from "@/components/story/rice-plant-svg";

const LAST = GROWTH_STAGES.length - 1;

export function CropGrowthTimeline({ story }: { story: GrowthStoryView }) {
  const sectionRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const root = rootRef.current;
    const fill = fillRef.current;
    const svg = root?.querySelector<SVGSVGElement>(".rp-svg");
    if (!section || !root || !fill || !svg) return;

    const apply = bindPlant(svg);
    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-node]"));
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-card]"));
    const product = root.querySelector<HTMLElement>("[data-product]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let idx = 0;
    let watching = true;

    const showStage = (next: number) => {
      if (next === idx) return;
      idx = next;
      root.dataset.active = String(idx);
      nodes.forEach((el, i) => {
        el.classList.toggle("is-on", i === idx);
        el.classList.toggle("is-done", i < idx);
      });
      cards.forEach((el, i) => el.classList.toggle("is-on", i === idx));
      product?.classList.toggle("is-on", idx >= LAST);
    };

    const paint = (p: number) => {
      fill.style.transform = `scaleX(${p})`;
      const next = stageFromProgress(p, idx);
      if (reduce) {
        showStage(next);
        apply(computeGrowth(snapshotForStage(next)));
        return;
      }
      apply(computeGrowth(p));
      showStage(next);
    };

    const tick = () => {
      raf = 0;
      if (!watching) return;
      const box = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      paint(Math.min(1, Math.max(0, -box.top / travel)));
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(tick);
    };

    fill.style.transform = "scaleX(0)";
    apply(computeGrowth(reduce ? snapshotForStage(0) : 0));

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
  }, []);

  return (
    <section ref={sectionRef} id="seed-stage" data-hero-tone="light" className="relative h-[240vh] bg-[#F5F0E5] md:h-[300vh]">
      <div ref={rootRef} className="crop-root sticky top-0 flex min-h-[100svh] flex-col justify-center py-12 md:py-14" data-active="0">
        <div className="container-page mb-5">
          <p className="text-[0.62rem] tracking-[0.28em] uppercase text-earth">From seed</p>
          <h2 className="mt-1 font-serif text-3xl text-forest md:text-4xl">A crop, in order</h2>
          <p className="mt-2 max-w-md text-sm text-ink-soft">From one grain to a field of life.</p>
        </div>

        <TimelineTrack fillRef={fillRef} />

        <div className="container-page">
          <div className="gt-well rp-well relative mx-auto aspect-[16/9] max-h-[56vh] w-full overflow-hidden bg-[#e8dcc4] md:max-h-[58vh]">
            <RicePlantSvg />
            <div className="pointer-events-none absolute left-4 top-4 z-[2] max-w-sm text-forest md:left-6 md:top-6">
              {GROWTH_STAGES.map((stage, i) => (
                <div key={stage.id} data-card={i} className={`gt-card gt-card-ink${i === 0 ? " is-on" : ""}`}>
                  <p className="text-[0.62rem] tracking-[0.22em] uppercase text-earth">{stage.number}</p>
                  <p className="mt-1 font-serif text-3xl text-forest md:text-4xl">{stage.title}</p>
                  <p className="mt-1 font-tamil text-terracotta">{stage.tamil}</p>
                  <p className="mt-2 max-w-md text-sm text-ink-soft">{stage.caption}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <FinalProductTransition story={story} />
      </div>
    </section>
  );
}

function TimelineTrack({ fillRef }: { fillRef: RefObject<HTMLDivElement | null> }) {
  return (
    <div className="container-page mb-6">
      <div className="gt-track relative">
        <div className="gt-rail" aria-hidden />
        <div ref={fillRef} className="gt-fill" aria-hidden />
        <ol className="relative z-[1] flex items-start justify-between gap-1 overflow-x-auto pb-1 md:overflow-visible">
          {GROWTH_STAGES.map((stage, i) => (
            <li key={stage.id} className="min-w-[3.4rem] flex-1 text-center">
              <div data-node={i} className={`gt-node${i === 0 ? " is-on" : ""}`}>
                <span className="gt-dot" />
                <p className="mt-2 text-[0.58rem] tracking-[0.16em] uppercase text-ink-soft">{stage.number}</p>
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
        <p className="mt-1 font-serif text-2xl text-forest md:text-3xl">{product?.name ?? story.tagline}</p>
        {product?.origin && <p className="mt-1 text-[0.68rem] tracking-[0.16em] uppercase text-ink-soft">{product.origin}</p>}
      </div>
      <Link href={story.href} className="link-grow w-fit text-[0.7rem] tracking-[0.18em] uppercase text-forest">
        {story.cta}
      </Link>
    </div>
  );
}

export function GrowthStory({ story }: { story: GrowthStoryView }) {
  return <CropGrowthTimeline story={story} />;
}

export function SeedHero({ story }: { story: GrowthStoryView }) {
  return <CropGrowthTimeline story={story} />;
}
