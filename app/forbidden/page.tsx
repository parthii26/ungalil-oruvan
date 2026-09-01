import Link from "next/link";

export const metadata = { title: "Access denied" };

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-paper px-6 text-center">
      <div>
        <p className="label">403</p>
        <h1 className="font-serif text-5xl mt-2">Unauthorized</h1>
        <p className="mt-4 text-ink-soft max-w-md">
          This area is reserved for store administrators. Your account does not have that role.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/account" className="btn btn-primary">
            My account
          </Link>
          <Link href="/" className="btn btn-ghost">
            Store
          </Link>
        </div>
      </div>
    </div>
  );
}
