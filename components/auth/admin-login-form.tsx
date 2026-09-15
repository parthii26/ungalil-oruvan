import Link from "next/link";

export function AdminLoginForm({ error }: { error?: string }) {
  return (
    <form action="/api/auth/admin" method="post" className="space-y-4">
      <div>
        <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5" htmlFor="admin-email">
          <span className="font-tamil font-medium">மின்னஞ்சல்</span> / Email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="w-full border border-white/15 bg-[#121410] px-3 py-2.5 text-sm text-white outline-none focus:border-[#C59A3D]"
        />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5" htmlFor="admin-password">
          <span className="font-tamil font-medium">கடவுச்சொல்</span> / Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
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
        className="w-full bg-[#234B35] hover:bg-[#1a3a28] py-3 text-xs tracking-wider uppercase text-white font-medium transition-colors"
      >
        <span className="font-tamil font-semibold">உள்நுழைய</span> / Sign In
      </button>
      <Link href="/auth/forgot-password" className="block text-center text-xs text-white/55 hover:text-white/80 transition-colors pt-1">
        <span className="font-tamil">கடவுச்சொல்லை மறந்துவிட்டீர்களா?</span> / Forgot password
      </Link>
    </form>
  );
}
