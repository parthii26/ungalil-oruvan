import Link from "next/link";
import { listCustomers } from "@/lib/repositories/customers";
import { formatDate } from "@/lib/formatters";

export const metadata = { title: "Customers" };

export default function AdminCustomersPage() {
  const rows = listCustomers();
  return (
    <div>
      <h1 className="font-serif text-3xl md:text-4xl">Customers</h1>
      <div className="admin-table-scroll mt-6 md:mt-8">
        <table className="w-full text-sm text-left">
          <thead className="text-[0.65rem] tracking-widest uppercase text-ink-soft">
            <tr>
              <th className="py-2 whitespace-nowrap">Name</th>
              <th className="whitespace-nowrap">Email</th>
              <th className="whitespace-nowrap">Phone</th>
              <th className="whitespace-nowrap">Orders</th>
              <th className="whitespace-nowrap">Joined</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ customer, profile, orders }) => (
              <tr key={customer.id} className="border-t border-line">
                <td className="py-2">
                  <Link href={`/admin/customers/${customer.id}`} className="underline underline-offset-4">
                    {profile.full_name}
                  </Link>
                </td>
                <td className="py-2">{profile.email}</td>
                <td className="py-2 whitespace-nowrap">{profile.phone}</td>
                <td className="py-2">{orders}</td>
                <td className="py-2 whitespace-nowrap">{formatDate(customer.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
