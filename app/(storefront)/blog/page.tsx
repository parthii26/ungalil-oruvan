import Link from "next/link";
import { loadDb } from "@/lib/db/store";

export const metadata = { title: "Journal" };

export default function BlogPage() {
  const posts = loadDb().blog_posts.filter((p) => p.published);
  return (
    <div className="container-page py-16">
      <h1 className="font-serif text-5xl">Journal</h1>
      <div className="mt-12 grid md:grid-cols-3 gap-8">
        {posts.map((p) => (
          <Link key={p.id} href={`/blog/${p.slug}`}>
            <div className="aspect-[16/10] bg-paper-deep overflow-hidden">
              {p.cover_path && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.cover_path} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <h2 className="mt-3 font-serif text-2xl">{p.title}</h2>
            <p className="mt-2 text-sm text-ink-soft">{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
