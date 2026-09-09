import { notFound } from "next/navigation";
import { loadDb } from "@/lib/db/store";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = loadDb().blog_posts.find((p) => p.slug === slug && p.published);
  return { title: post?.title ?? "Journal" };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = loadDb().blog_posts.find((p) => p.slug === slug && p.published);
  if (!post) notFound();
  return (
    <article className="container-page py-10 md:py-16 max-w-2xl">
      <p className="label">Journal</p>
      <h1 className="font-serif text-3xl md:text-5xl mt-2 text-balance">{post.title}</h1>
      <p className="mt-4 text-ink-soft">{post.excerpt}</p>
      {post.cover_path && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.cover_path} alt="" loading="lazy" decoding="async" className="mt-6 md:mt-8 aspect-[16/9] w-full bg-paper-deep object-cover" />
      )}
      <p className="mt-6 md:mt-8 leading-relaxed">{post.body}</p>
    </article>
  );
}
