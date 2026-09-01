import { notFound } from "next/navigation";
import { getCustomerById, findProfileById } from "@/lib/repositories/customers";
import { listAddresses } from "@/lib/repositories/addresses";
import { listOrdersForCustomer } from "@/lib/repositories/orders";
import { formatPrice } from "@/lib/formatters";
import Link from "next/link";

export const metadata = { title: "Customer" };

export default async function AdminCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = getCustomerById(id);
  if (!customer) notFound();
  const profile = findProfileById(customer.profile_id);
  const addresses = listAddresses(customer.id);
  const orders = listOrdersForCustomer(customer.id);

  return (
    <div>
      <h1 className="font-serif text-4xl">{profile?.full_name}</h1>
      <p className="mt-2 text-sm">{profile?.email}</p>
      <p className="text-sm">{profile?.phone}</p>
      <h2 className="font-serif text-2xl mt-10">Addresses</h2>
      <ul className="mt-3 text-sm">
        {addresses.map((a) => (
          <li key={a.id}>
            {a.line1}, {a.city}
          </li>
        ))}
      </ul>
      <h2 className="font-serif text-2xl mt-10">Orders</h2>
      <ul className="mt-3">
        {orders.map((o) => (
          <li key={o.id}>
            <Link href={`/admin/orders/${o.id}`}>{o.order_number}</Link> · {formatPrice(o.grand_total_paise)}
          </li>
        ))}
      </ul>
    </div>
  );
}
