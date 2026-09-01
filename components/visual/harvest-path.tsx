"use client";

import { Reveal } from "./reveal";

const STEPS = [
  { k: "Field", ta: "வயல்", img: "/images/farm-dawn.jpg", e: "Dawn on the bund." },
  { k: "Farmer", ta: "விவசாயி", img: "/images/farmer-field.jpg", e: "The walk between rows." },
  { k: "Harvest", ta: "அறுவடை", img: "/images/harvest-grain.jpg", e: "Cut when ready." },
  { k: "Grain", ta: "தானியம்", img: "/images/millet-foxtail.jpg", e: "Still warm from the sun." },
  { k: "Process", ta: "ஆலை", img: "/images/process-wood.jpg", e: "Wood, stone, patience." },
  { k: "Product", ta: "பொருள்", img: "/images/honey.jpg", e: "A named lot." },
  { k: "Table", ta: "மேசை", img: "/images/table-spread.jpg", e: "The last mile is the kitchen." },
];

export function HarvestPath() {
  return (
    <section className="py-16" data-farm-story>
      <div className="container-page mb-8">
        <Reveal>
          <p className="text-[0.65rem] tracking-[0.2em] uppercase text-earth">நமது பயிர் · Our crop</p>
          <h2 className="font-serif text-4xl text-forest mt-2">From soil to table</h2>
          <p className="mt-2 text-ink-soft max-w-lg">
            Dawn, the bund, the cut, the grain, the kitchen. Photographs only — not a live harvest claim.
          </p>
        </Reveal>
      </div>
      <div className="relative">
        <div className="absolute left-0 right-0 top-[46%] h-px bg-earth/20 hidden md:block" />
        <div className="flex gap-4 overflow-x-auto px-4 md:px-[max(1rem,calc((100%-1180px)/2))] pb-6 snap-x">
          {STEPS.map((s) => (
            <article key={s.k} className="min-w-[200px] snap-start" data-cursor="explore">
              <div className="aspect-[3/4] overflow-hidden bg-paper-deep">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.img} alt="" className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]" />
              </div>
              <p className="mt-3 text-[0.62rem] tracking-[0.2em] uppercase text-earth">{s.k}</p>
              <p className="font-tamil text-terracotta">{s.ta}</p>
              <p className="text-sm text-ink-soft">{s.e}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
