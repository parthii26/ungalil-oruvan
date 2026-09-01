"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function SearchDialog({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<{ name: string; slug: string; image: string | null }[]>([]);
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(async () => {
      if (q.trim().length < 2) {
        setItems([]);
        return;
      }
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setItems(data.items ?? []);
    }, 180);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="fixed inset-0 z-50 bg-ink/40" role="dialog" aria-modal="true" aria-label="Search">
      <div className="mx-auto mt-16 w-[min(640px,calc(100%-2rem))] border border-line bg-paper p-5 shadow-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/shop?q=${encodeURIComponent(q)}`);
            onClose();
          }}
        >
          <label className="label" htmlFor="site-search">
            Search the pantry
          </label>
          <input
            id="site-search"
            autoFocus
            className="input"
            placeholder="Honey, millet, turmeric…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>
        <ul className="mt-4 divide-y divide-line">
          {items.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/product/${item.slug}`}
                className="flex items-center gap-3 py-3 hover:bg-paper-deep px-2"
                onClick={onClose}
              >
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt="" className="h-12 w-12 object-cover" />
                ) : (
                  <div className="h-12 w-12 bg-paper-deep" />
                )}
                <span className="font-serif text-lg">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        <button className="mt-4 text-xs tracking-widest uppercase text-ink-soft" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
