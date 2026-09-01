import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById } from "@/lib/repositories/products";
import { assembleProduct } from "@/lib/services/catalog";
import { formatPrice } from "@/lib/formatters";

export const metadata = { title: "Preview" };

export default async function ProductPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();
  const data = assembleProduct(product);
  const def = data.variants[0];

  return (
    <div>
      <p className="text-[0.7rem] tracking-widest uppercase text-earth">
        Admin preview · {product.status} · not a public publish
      </p>
      <div className="mt-4 flex gap-3">
        <Link href={`/admin/products/${id}`} className="btn btn-ghost ink">
          Back to editor
        </Link>
        {product.status === "published" && (
          <Link href={`/product/${product.slug}`} className="btn btn-primary">
            Open live page
          </Link>
        )}
      </div>
      <div className="mt-10 grid md:grid-cols-2 gap-10">
        <div>
          {data.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.images[0].path} alt={data.images[0].alt} className="w-full object-cover" />
          ) : (
            <div className="aspect-square bg-paper-deep grid place-items-center text-ink-soft">No image</div>
          )}
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-ink-soft">{data.category?.name}</p>
          <h1 className="font-serif text-4xl text-forest">{product.name}</h1>
          {product.tamil_name && <p className="font-tamil text-terracotta">{product.tamil_name}</p>}
          <p className="mt-3 text-ink-soft">{product.short_description}</p>
          {def && <p className="mt-4 text-2xl">{formatPrice(def.price_paise)}</p>}
          <ul className="mt-4 text-sm space-y-1">
            {data.variants.map((v) => (
              <li key={v.id}>
                {v.title} · {v.sku} · {formatPrice(v.price_paise)} · {v.status}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed">{product.description}</p>
        </div>
      </div>
    </div>
  );
}
