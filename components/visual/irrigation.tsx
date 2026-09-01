export function IrrigationBand() {
  return (
    <section className="relative h-36 md:h-44 overflow-hidden bg-[#3a4a38]" data-farm-story>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/farm-dawn.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-[50%_72%] opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-r from-forest/50 to-transparent" />
      <div className="water-sheen pointer-events-none absolute inset-0 mix-blend-soft-light opacity-40" />
      <div className="relative z-10 container-page h-full flex items-end pb-6">
        <p className="text-cream/90 text-[0.68rem] tracking-[0.2em] uppercase">
          Irrigation · earth water · reflected sky
        </p>
      </div>
    </section>
  );
}
