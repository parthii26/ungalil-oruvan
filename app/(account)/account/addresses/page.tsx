import { getSession } from "@/lib/auth/session";
import { listAddresses } from "@/lib/repositories/addresses";
import { AddressManager } from "./ui";

export const metadata = { title: "Addresses" };

export default async function AddressesPage() {
  const session = await getSession();
  const addresses = session?.customerId ? listAddresses(session.customerId) : [];
  return (
    <div>
      <h1 className="font-serif text-4xl">Addresses</h1>
      {addresses.length === 0 && <p className="mt-4 text-ink-soft">No saved addresses.</p>}
      <AddressManager addresses={addresses} />
    </div>
  );
}
