import Link from "next/link";

export function AdminLoginForm({ error }: { error?: string }) {
  return (
    <form action="/api/auth/admin" method="post" className="space-y-4">
      <div>
        <label className="block text-[0.68rem] tracking-[0.16em] uppercase text-white/50 mb-2" htmlFor="admin-email">
          Email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          required
          autoComplete="username"
          defaultValue="admin@varizel.dev"
          className="w-full border border-white/15 bg-[#121410] px-3 py-2.5 text-sm text-white outline-none focus:border-[#C59A3D]"
        />
      </div>
      <div>
        <label className="block text-[0.68rem] tracking-[0.16em] uppercase text-white/50 mb-2" htmlFor="admin-password">
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          defaultValue="Admin123!Dev"
          className="w-full border border-white/15 bg-[#121410] px-3 py-2.5 text-sm text-white outline-none focus:border-[#C59A3D]"
        />
      </div>
      {error && (
        <p className="text-sm text-[#E8A598]" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="w-full bg-[#234B35] hover:bg-[#1a3a28] py-3 text-[0.72rem] tracking-[0.2em] uppercase text-white"
      >
        Sign In
      </button>
      <p className="text-[0.7rem] text-white/40">Development password: Admin123!Dev</p>
      <Link href="/auth/forgot-password" className="block text-center text-xs text-white/45">
        Forgot password
      </Link>
    </form>
  );
}
