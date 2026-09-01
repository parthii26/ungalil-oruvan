export const metadata = { title: "Inventory" };

export default function InventoryPage() {
  return (
    <div>
      <h1 className="font-serif text-4xl">Inventory</h1>
      <p className="mt-4 text-ink-soft">
        Batches, balances, and FEFO reservation are Stage 2. Schema tables are in <code>supabase/migrations</code>.
      </p>
    </div>
  );
}
