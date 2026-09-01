import Link from "next/link";
import { listCustomers } from "@/lib/repositories/customers";
import { formatDate } from "@/lib/formatters";

export const metadata = { title: "Customers" };

export default function AdminCustomersPage() {
  const rows = listCustomers();
  return (
    <div>
      <h1 className="font-serif text-4xl">Customers</h1>
      <table className="mt-8 w-full text-sm text-left">
        <thead className="text-[0.65rem] tracking-widest uppercase text-ink-soft">
          <tr>
            <th className="py-2">Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Orders</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ customer, profile, orders }) => (
            <tr key={customer.id} className="border-t border-line">
              <td className="py-3">
                <Link href={`/admin/customers/${customer.id}`} className="underline">
                  {profile.full_name}
                </Link>
              </td>
              <td>{profile.email}</td>
              <td>{profile.phone}</td>
              <td>{orders}</td>
              <td>{formatDate(customer.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
