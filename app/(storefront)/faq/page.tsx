import { loadDb } from "@/lib/db/store";

export const metadata = { title: "FAQ" };

export default function FaqPage() {
  const faqs = loadDb().faqs.filter((f) => f.published);
  return (
    <div className="container-page py-10 md:py-16 max-w-2xl">
      <h1 className="font-serif text-4xl md:text-5xl">FAQ</h1>
      <div className="mt-8 md:mt-10 divide-y divide-line border-b border-line">
        {faqs.map((f) => (
          <details key={f.id} className="py-2">
            <summary className="font-serif text-xl md:text-2xl">{f.question}</summary>
            <p className="mt-1 pb-3 text-ink-soft">{f.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
