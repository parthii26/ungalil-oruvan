"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

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
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setItems(data.items ?? []);
      } catch {
        setItems([]);
      }
    }, 180);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Search">
      <button aria-label="Close search" onClick={onClose} className="absolute inset-0 cursor-default bg-ink/40" />
      <div
        className="relative mx-auto mt-[max(0.75rem,env(safe-area-inset-top,0px))] md:mt-16 w-[min(640px,calc(100%-1.5rem))] border border-line bg-paper shadow-xl flex max-h-[calc(100dvh-2rem)] flex-col"
        style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <form
          className="p-4 md:p-5 pb-3"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/shop?q=${encodeURIComponent(q)}`);
            onClose();
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <label className="label mb-0" htmlFor="site-search">
              Search the pantry
            </label>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="grid min-h-11 min-w-11 place-items-center -mr-2 -mt-1 text-ink-soft"
            >
              <X size={20} />
            </button>
          </div>
          <div className="mt-2 flex gap-2">
            <input
              id="site-search"
              autoFocus
              className="input"
              placeholder="Honey, millet, turmeric…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              autoComplete="off"
              enterKeyHint="search"
            />
            <button type="submit" className="btn btn-primary shrink-0 !px-4" aria-label="Search">
              Go
            </button>
          </div>
        </form>
        <ul className="overflow-y-auto px-2 pb-2 md:px-3 divide-y divide-line overscroll-contain">
          {items.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/product/${item.slug}`}
                className="flex items-center gap-3 py-3 px-2 min-h-16 hover:bg-paper-deep"
                onClick={onClose}
              >
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt="" loading="lazy" decoding="async" className="h-12 w-12 shrink-0 object-cover" />
                ) : (
                  <div className="h-12 w-12 shrink-0 bg-paper-deep" />
                )}
                <span className="font-serif text-lg leading-snug">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        {q.trim().length >= 2 && items.length === 0 && (
          <p className="px-5 pb-5 text-sm text-ink-soft">No quick matches — press Go to search the full shop.</p>
        )}
      </div>
    </div>
  );
}
