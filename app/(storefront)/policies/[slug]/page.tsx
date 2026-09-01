import { notFound } from "next/navigation";
import { loadDb } from "@/lib/db/store";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = loadDb().pages.find((p) => p.slug === slug && p.published);
  return { title: page?.title ?? "Policy" };
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = loadDb().pages.find((p) => p.slug === slug && p.published);
  if (!page) notFound();
  return (
    <div className="container-page py-16 max-w-2xl">
      <h1 className="font-serif text-5xl">{page.title}</h1>
      <p className="mt-8 leading-relaxed">{page.body}</p>
    </div>
  );
}
