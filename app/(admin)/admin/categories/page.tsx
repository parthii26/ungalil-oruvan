import { listAllCategories } from "@/lib/repositories/categories";
import { countProductsInCategory } from "@/lib/services/admin-catalog";
import { CategoryForm } from "./ui";
import { deleteCategoryAction, toggleCategoryAction } from "@/lib/actions/admin";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";

export const metadata = { title: "Categories" };

export default function AdminCategoriesPage() {
  const cats = listAllCategories();
  return (
    <div>
      <h1 className="text-2xl font-semibold">Categories</h1>
      <ul className="mt-6 divide-y divide-line">
        {cats.map((c) => {
          const count = countProductsInCategory(c.id);
          return (
            <li key={c.id} className="py-3 flex flex-wrap justify-between gap-3 text-sm">
              <span>
                {c.name} · /{c.slug} {c.is_active ? "" : "(inactive)"} · {count} products
              </span>
              <div className="flex gap-3 text-xs uppercase tracking-widest">
                <form action={toggleCategoryAction.bind(null, c.id, !c.is_active)}>
                  <button>{c.is_active ? "Deactivate" : "Activate"}</button>
                </form>
                {count === 0 ? (
                  <ConfirmSubmit
                    action={deleteCategoryAction.bind(null, c.id)}
                    label="Delete"
                    message="Delete this category?"
                  />
                ) : (
                  <span className="text-ink-soft">Reassign products to delete</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <CategoryForm categories={cats} />
    </div>
  );
}
