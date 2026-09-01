import { loadDb } from "@/lib/db/store";

export const metadata = { title: "FAQ" };

export default function FaqPage() {
  const faqs = loadDb().faqs.filter((f) => f.published);
  return (
    <div className="container-page py-16 max-w-2xl">
      <h1 className="font-serif text-5xl">FAQ</h1>
      <div className="mt-10 divide-y divide-line">
        {faqs.map((f) => (
          <details key={f.id} className="py-5">
            <summary className="cursor-pointer font-serif text-2xl">{f.question}</summary>
            <p className="mt-3 text-ink-soft">{f.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
