import Link from "next/link";
import { listAllPages } from "@/lib/repositories/pages";

export const metadata = { title: "Pages" };

export default function AdminPagesPage() {
  const pages = listAllPages();
  return (
    <div>
      <h1 className="font-serif text-3xl md:text-4xl">Pages</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Edit policy and static pages shown to your customers.
      </p>
      <ul className="mt-8 divide-y divide-line border-b border-line">
        {pages.map((page) => (
          <li key={page.id} className="py-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">{page.title}</p>
              <p className="text-xs text-ink-soft mt-0.5">
                /policies/{page.slug} · {page.published ? "Published" : "Draft"}
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <Link
                href={`/policies/${page.slug}`}
                target="_blank"
                className="text-xs underline underline-offset-4 text-ink-soft hover:text-ink"
              >
                View ↗
              </Link>
              <Link href={`/admin/pages/${page.id}`} className="btn btn-ghost text-xs py-1 px-3">
                Edit
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
