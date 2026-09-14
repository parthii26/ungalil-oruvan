import { notFound } from "next/navigation";
import { getPageById } from "@/lib/repositories/pages";
import { PageEditor } from "./ui";

export const metadata = { title: "Edit Page" };

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = getPageById(id);
  if (!page) notFound();
  return (
    <div>
      <h1 className="font-serif text-3xl md:text-4xl">Edit: {page.title}</h1>
      <PageEditor page={page} />
    </div>
  );
}
