import Link from "next/link";
import { loadDb } from "@/lib/db/store";

export const metadata = { title: "Journal" };

export default function BlogPage() {
  const posts = loadDb().blog_posts.filter((p) => p.published);
  return (
    <div className="container-page py-10 md:py-16">
      <h1 className="font-serif text-4xl md:text-5xl">Journal</h1>
      <div className="mt-8 md:mt-12 grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
        {posts.map((p) => (
          <Link key={p.id} href={`/blog/${p.slug}`} className="group">
            <div className="aspect-[16/10] bg-paper-deep overflow-hidden">
              {p.cover_path && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.cover_path} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
              )}
            </div>
            <h2 className="mt-3 font-serif text-xl md:text-2xl">{p.title}</h2>
            <p className="mt-2 text-sm text-ink-soft">{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
