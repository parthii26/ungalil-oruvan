export function CustomerLoginForm({ next, error }: { next: string; error?: string }) {
  return (
    <form action="/api/auth/customer" method="post" className="mt-8 space-y-4">
      <input type="hidden" name="next" value={next || "/account"} />
      <div>
        <label className="label" htmlFor="email">
          <span className="font-tamil font-medium">மின்னஞ்சல்</span> / Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="input"
          autoComplete="email"
        />
      </div>
      <div>
        <label className="label" htmlFor="password">
          <span className="font-tamil font-medium">கடவுச்சொல்</span> / Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="input"
          autoComplete="current-password"
        />
      </div>
      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-primary w-full">
        <span className="font-tamil font-semibold">உள்நுழைய</span> / Login
      </button>
    </form>
  );
}
