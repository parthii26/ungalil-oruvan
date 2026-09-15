import { listAllBatches } from "@/lib/repositories/batches";
import { listAllProducts } from "@/lib/repositories/products";
import { formatDate } from "@/lib/formatters";
import { deleteBatchAction } from "@/lib/actions/admin";
import { BatchForm } from "./batch-form";

export const metadata = { title: "Batches & Expiry" };

export default function BatchesPage() {
  const batches = listAllBatches();
  const products = listAllProducts();
  const productMap = new Map(products.map((p) => [p.id, p]));

  const now = new Date();
  const sixtyDaysFromNow = new Date(now.getTime() + 60 * 86400000);

  const expiredCount = batches.filter((b) => new Date(b.expiry_date) < now).length;
  const expiringSoonCount = batches.filter((b) => {
    const d = new Date(b.expiry_date);
    return d >= now && d <= sixtyDaysFromNow;
  }).length;
  const totalStock = batches.reduce((sum, b) => sum + b.remaining_quantity, 0);

  return (
    <div>
      <h1 className="font-serif text-3xl md:text-4xl">Batches & Expiry</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Track agricultural harvest dates, packaging lots, and shelf-life expiration.
      </p>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-8">
        <div className="border border-line p-4">
          <p className="label">Total Batches</p>
          <p className="font-serif text-3xl mt-1">{batches.length}</p>
        </div>
        <div className="border border-line p-4">
          <p className="label">Batch Stock</p>
          <p className="font-serif text-3xl mt-1">{totalStock}</p>
        </div>
        <div className="border border-line p-4">
          <p className="label">Expiring Soon (60d)</p>
          <p className={`font-serif text-3xl mt-1 ${expiringSoonCount > 0 ? "text-amber-700 font-bold" : ""}`}>
            {expiringSoonCount}
          </p>
        </div>
        <div className="border border-line p-4">
          <p className="label">Expired Lots</p>
          <p className={`font-serif text-3xl mt-1 ${expiredCount > 0 ? "text-red-700 font-bold" : ""}`}>
            {expiredCount}
          </p>
        </div>
      </div>

      {/* New Batch Creation */}
      <BatchForm products={products} />

      {/* Batches Table */}
      <div className="admin-table-scroll">
        <table className="w-full text-sm text-left">
          <thead className="text-[0.65rem] tracking-widest uppercase text-ink-soft">
            <tr>
              <th className="py-2 whitespace-nowrap">Batch #</th>
              <th className="whitespace-nowrap">Product</th>
              <th className="whitespace-nowrap">Packaged</th>
              <th className="whitespace-nowrap">Expiry</th>
              <th className="whitespace-nowrap">Stock</th>
              <th className="whitespace-nowrap">Status</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-6 text-ink-soft">No batch lots recorded yet.</td>
              </tr>
            ) : (
              batches.map((b) => {
                const product = productMap.get(b.product_id);
                const expiryDate = new Date(b.expiry_date);
                const isExpired = expiryDate < now;
                const isExpiringSoon = !isExpired && expiryDate <= sixtyDaysFromNow;

                return (
                  <tr key={b.id} className="border-t border-line">
                    <td className="py-3 font-mono font-medium">{b.batch_number}</td>
                    <td className="py-3 font-medium">{product?.name ?? "—"}</td>
                    <td className="py-3 whitespace-nowrap text-xs text-ink-soft">
                      {formatDate(b.packaging_date)}
                    </td>
                    <td className="py-3 whitespace-nowrap font-medium text-xs">
                      {formatDate(b.expiry_date)}
                    </td>
                    <td className="py-3 whitespace-nowrap">
                      {b.remaining_quantity} / {b.initial_quantity}
                    </td>
                    <td className="py-3 whitespace-nowrap">
                      {isExpired ? (
                        <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded font-medium">
                          Expired
                        </span>
                      ) : isExpiringSoon ? (
                        <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-900 rounded font-medium">
                          Expiring Soon
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded font-medium">
                          Fresh
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <form
                        action={async () => {
                          "use server";
                          await deleteBatchAction(b.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="text-xs text-ink-soft hover:text-red-700 underline underline-offset-4"
                        >
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
