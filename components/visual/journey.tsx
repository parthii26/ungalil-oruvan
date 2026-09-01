import { ParallaxImage } from "./parallax-image";
import { Reveal } from "./reveal";

const BEATS = [
  { k: "Farm", img: "/images/farm-dawn.jpg", t: "நமது மண்", e: "The field first." },
  { k: "Soil", img: "/images/soil-hands.jpg", t: "மண்", e: "What the hands know." },
  { k: "Crop", img: "/images/millet-foxtail.jpg", t: "பயிர்", e: "Grain, still in the light." },
  { k: "Harvest", img: "/images/harvest-grain.jpg", t: "அறுவடை", e: "Cut, dried, kept." },
  { k: "Process", img: "/images/process-wood.jpg", t: "ஆலை", e: "Wood and stone, not a plant." },
  { k: "Product", img: "/images/honey.jpg", t: "பொருள்", e: "A jar that remembers the season." },
  { k: "Home", img: "/images/table-spread.jpg", t: "வீடு", e: "The pantry, not a warehouse." },
  { k: "Table", img: "/images/tea.jpg", t: "மேசை", e: "Food, finally." },
];

export function Journey() {
  return (
    <section className="py-8">
      <div className="container-page mb-8">
        <Reveal>
          <p className="label">A journey</p>
          <h2 className="font-serif text-4xl text-forest">Farm to table, in order</h2>
        </Reveal>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 md:px-[max(1rem,calc((100%-1180px)/2))] pb-4 snap-x">
        {BEATS.map((b) => (
          <article key={b.k} className="min-w-[220px] md:min-w-[240px] snap-start">
            <ParallaxImage src={b.img} alt="" className="aspect-[3/4] bg-paper-deep" range={16} />
            <p className="mt-3 text-[0.65rem] tracking-[0.2em] uppercase text-earth">{b.k}</p>
            <p className="font-tamil text-terracotta">{b.t}</p>
            <p className="text-sm text-ink-soft">{b.e}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
