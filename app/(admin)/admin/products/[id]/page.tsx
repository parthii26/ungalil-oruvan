import { notFound } from "next/navigation";
import Link from "next/link";
import { assembleProduct } from "@/lib/services/catalog";
import { getProductById, listDietaryTags, getDietaryTags } from "@/lib/repositories/products";
import { listAllCategories } from "@/lib/repositories/categories";
import { ProductForm } from "../product-form";
import { VariantPanel } from "./variants";
import { ImagePanel } from "./images";
import { ExtraPanel } from "./extras";

export const metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();
  const data = assembleProduct(product);
  const tags = getDietaryTags(product.id).map((t) => t.id);

  return (
    <div>
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <p className="text-[0.65rem] tracking-widest uppercase text-ink-soft">{product.status}</p>
          <h1 className="text-2xl font-semibold">Edit product</h1>
        </div>
        <Link href={`/admin/products/${id}/preview`} className="btn btn-ghost ink">
          Preview
        </Link>
      </div>
      <ProductForm product={product} categories={listAllCategories()} tags={listDietaryTags()} selectedTags={tags} />
      <VariantPanel productId={id} variants={data.variants} />
      <ImagePanel productId={id} images={data.images} />
      <ExtraPanel productId={id} nutrition={data.nutrition} certs={data.certifications} />
    </div>
  );
}
