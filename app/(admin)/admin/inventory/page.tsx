import { listAllVariantsWithProduct } from "@/lib/repositories/products";
import { InventoryTable } from "./ui";

export const metadata = { title: "Inventory" };

export default function InventoryPage() {
  const rows = listAllVariantsWithProduct();
  return (
    <div>
      <h1 className="font-serif text-3xl md:text-4xl">Inventory</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Manage stock levels for each variant. Batch and FEFO tracking are Stage 2.
      </p>
      <InventoryTable rows={rows} />
    </div>
  );
}
