import { Reveal } from "./reveal";

const STEPS = [
  { t: "Grown", img: "/images/farm-dawn.jpg", d: "Named plots. Rain, sun, and time." },
  { t: "Harvested", img: "/images/harvest-grain.jpg", d: "Cut when the grain is ready, not the calendar." },
  { t: "Processed", img: "/images/process-wood.jpg", d: "Stone, wood, and small lots." },
  { t: "Packed", img: "/images/table-spread.jpg", d: "Honest weights. Short lists." },
  { t: "Delivered", img: "/images/soil-hands.jpg", d: "To the table. Shipping is Stage 2." },
];

export function ProcessTimeline() {
  return (
    <section className="py-20 bg-warmwhite">
      <div className="container-page">
        <Reveal>
          <p className="label">From land to table</p>
          <h2 className="font-serif text-4xl text-forest mt-2">How the food moves</h2>
        </Reveal>
        <div className="mt-10 hidden md:grid grid-cols-5 gap-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.06}>
              <article>
                <div className="aspect-[4/5] overflow-hidden bg-paper-deep">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt="" className="h-full w-full object-cover" />
                </div>
                <p className="mt-3 text-[0.68rem] tracking-[0.18em] uppercase text-earth">
                  {String(i + 1).padStart(2, "0")} · {s.t}
                </p>
                <p className="mt-1 text-sm text-ink-soft">{s.d}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <ol className="mt-10 md:hidden space-y-8">
          {STEPS.map((s, i) => (
            <li key={s.t} className="grid grid-cols-[88px_1fr] gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.img} alt="" className="h-24 w-full object-cover" />
              <div>
                <p className="text-[0.68rem] tracking-[0.18em] uppercase text-earth">
                  {String(i + 1).padStart(2, "0")} · {s.t}
                </p>
                <p className="mt-1 text-sm text-ink-soft">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
