"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveProductAction } from "@/lib/actions/admin";
import type { Category, DietaryTag, Product } from "@/lib/db/types";
import { slugify } from "@/lib/utils";

type State = { ok?: boolean; error?: string; fields?: Record<string, string>; id?: string } | null;

export function ProductForm({
  product,
  categories,
  tags,
  selectedTags = [],
}: {
  product?: Product;
  categories: Category[];
  tags: DietaryTag[];
  selectedTags?: string[];
}) {
  const [state, action, pending] = useActionState(saveProductAction, null as State);
  const [slugTouched, setSlugTouched] = useState(Boolean(product?.slug));
  const [slug, setSlug] = useState(product?.slug ?? "");
  const fields = state && "fields" in state ? state.fields ?? {} : {};

  return (
    <form action={action} className="mt-8 max-w-2xl space-y-8">
      {product && <input type="hidden" name="id" value={product.id} />}
      <section>
        <h2 className="text-lg font-semibold">Basic information</h2>
        <div className="mt-4 space-y-3">
          <Field
            name="name"
            label="Product name"
            defaultValue={product?.name}
            required
            error={fields.name}
            onChange={(v) => {
              if (!slugTouched) setSlug(slugify(v));
            }}
          />
          <Field name="tamil_name" label="Tamil / local name" defaultValue={product?.tamil_name ?? ""} />
          <div>
            <label className="label" htmlFor="slug">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              className="input"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
            />
            {fields.slug && <p className="text-xs text-danger mt-1">{fields.slug}</p>}
          </div>
          <Field
            name="short_description"
            label="Short description"
            defaultValue={product?.short_description}
            required
            error={fields.short_description}
          />
          <div>
            <label className="label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="input min-h-32"
              defaultValue={product?.description}
              required
            />
            {fields.description && <p className="text-xs text-danger mt-1">{fields.description}</p>}
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-lg font-semibold">Classification</h2>
        <div className="mt-4 space-y-3">
          <div>
            <label className="label" htmlFor="category_id">
              Category
            </label>
            <select id="category_id" name="category_id" className="input" defaultValue={product?.category_id}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.parent_id ? " (child)" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-3">
            {tags.map((t) => (
              <label key={t.id} className="text-sm flex gap-2">
                <input type="checkbox" name="dietary_tag_ids" value={t.id} defaultChecked={selectedTags.includes(t.id)} />
                {t.name}
              </label>
            ))}
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-lg font-semibold">Organic information</h2>
        <div className="mt-4 space-y-3">
          <Field name="ingredients" label="Ingredients" defaultValue={product?.ingredients ?? ""} />
          <Field name="origin" label="Origin" defaultValue={product?.origin ?? ""} />
          <Field name="storage_instructions" label="Storage" defaultValue={product?.storage_instructions ?? ""} />
          <Field name="shelf_life" label="Shelf life" defaultValue={product?.shelf_life ?? ""} />
        </div>
      </section>
      <section>
        <h2 className="text-lg font-semibold">Compliance</h2>
        <div className="mt-4 space-y-3">
          <Field name="hsn" label="HSN" defaultValue={product?.hsn ?? ""} />
          <Field name="tax_rate_bps" label="Tax rate (bps)" defaultValue={String(product?.tax_rate_bps ?? 0)} error={fields.tax_rate_bps} />
          <Field name="fssai_license" label="FSSAI" defaultValue={product?.fssai_license ?? ""} />
        </div>
      </section>
      <section>
        <h2 className="text-lg font-semibold">SEO</h2>
        <Field name="seo_title" label="SEO title" defaultValue={product?.seo_title ?? ""} />
        <Field name="seo_description" label="SEO description" defaultValue={product?.seo_description ?? ""} />
      </section>
      <section className="space-y-2">
        <div>
          <label className="label" htmlFor="status">
            Status
          </label>
          <select id="status" name="status" className="input" defaultValue={product?.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <label className="flex gap-2 text-sm">
          <input type="checkbox" name="is_featured" defaultChecked={product?.is_featured} /> Featured
        </label>
        <label className="flex gap-2 text-sm">
          <input type="checkbox" name="is_bestseller" defaultChecked={product?.is_bestseller} /> Bestseller
        </label>
      </section>
      {state && "error" in state && state.error && <p className="text-danger text-sm">{state.error}</p>}
      {state && "ok" in state && state.ok && <p className="text-sm text-ok">Saved.</p>}
      <div className="flex flex-wrap gap-3">
        <button className="btn btn-ghost ink" name="intent" value="draft" disabled={pending}>
          Save draft
        </button>
        <button className="btn btn-primary" name="intent" value="publish" disabled={pending}>
          Publish
        </button>
        {product && (
          <Link href={`/admin/products/${product.id}/preview`} className="btn btn-ghost ink">
            Preview
          </Link>
        )}
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  defaultValue,
  required,
  error,
  onChange,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
  error?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        className="input"
        defaultValue={defaultValue}
        required={required}
        onChange={(e) => onChange?.(e.target.value)}
      />
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </div>
  );
}
