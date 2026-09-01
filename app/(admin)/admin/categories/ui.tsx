"use client";

import { useActionState } from "react";
import { saveCategoryAction } from "@/lib/actions/admin";
import type { Category } from "@/lib/db/types";

export function CategoryForm({ categories = [] }: { categories?: Category[] }) {
  const [state, action, pending] = useActionState(saveCategoryAction, null);
  return (
    <form action={action} className="mt-10 max-w-md space-y-3">
      <h2 className="text-lg font-semibold">Add category</h2>
      <input name="name" className="input" placeholder="Name" required />
      <input name="slug" className="input" placeholder="slug (optional)" />
      <input name="description" className="input" placeholder="Description" />
      <select name="parent_id" className="input" defaultValue="">
        <option value="">No parent</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <input name="image_path" className="input" placeholder="Image path e.g. /images/honey.jpg" />
      <input name="position" className="input" placeholder="Position" defaultValue={0} />
      {state && "error" in state && state.error && <p className="text-sm text-danger">{state.error}</p>}
      {state && "ok" in state && state.ok && <p className="text-sm">Saved.</p>}
      <button className="btn btn-primary" disabled={pending}>
        Save category
      </button>
    </form>
  );
}
