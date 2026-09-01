import { listAllCategories } from "@/lib/repositories/categories";
import { listDietaryTags } from "@/lib/repositories/products";
import { ProductForm } from "../product-form";

export const metadata = { title: "New product" };

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-serif text-4xl">New product</h1>
      <ProductForm categories={listAllCategories()} tags={listDietaryTags()} />
    </div>
  );
}
