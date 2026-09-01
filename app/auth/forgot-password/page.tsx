import Link from "next/link";

export const metadata = { title: "Reset password" };

export default function ForgotPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-sm">
        <h1 className="font-serif text-4xl">Reset password</h1>
        <p className="mt-4 text-ink-soft">
          Hosted Supabase Auth email reset is used when <code>NEXT_PUBLIC_SUPABASE_URL</code> is set. In local file-store mode,
          ask an admin to rotate the development password or reset the seed database.
        </p>
        <form className="mt-6 space-y-3">
          <input className="input" placeholder="Email" disabled />
          <button className="btn btn-primary" disabled type="button">
            Send link — not configured locally
          </button>
        </form>
        <Link href="/login" className="block mt-6 text-sm underline">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
