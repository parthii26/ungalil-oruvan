import Link from "next/link";

export const metadata = { title: "Access denied" };

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-paper px-6 text-center">
      <div>
        <p className="label">403</p>
        <h1 className="font-serif text-4xl md:text-5xl mt-2">Unauthorized</h1>
        <p className="mt-4 text-ink-soft max-w-md">
          This area is reserved for store administrators. Your account does not have that role.
        </p>
        <div className="mt-8 grid gap-3 sm:flex sm:justify-center">
          <Link href="/account" className="btn btn-primary w-full sm:w-auto">
            My account
          </Link>
          <Link href="/" className="btn btn-ghost w-full sm:w-auto">
            Store
          </Link>
        </div>
      </div>
    </div>
  );
}
