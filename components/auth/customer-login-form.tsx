export function CustomerLoginForm({ next, error }: { next: string; error?: string }) {
  return (
    <form action="/api/auth/customer" method="post" className="mt-8 space-y-4">
      <input type="hidden" name="next" value={next || "/account"} />
      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="input"
          autoComplete="email"
          defaultValue="ananya@varizel.dev"
        />
      </div>
      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="input"
          autoComplete="current-password"
          defaultValue="Customer123!"
        />
      </div>
      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-primary w-full">
        Login
      </button>
      <p className="text-[0.7rem] text-ink-soft">
        Development login is prefilled. Customer password: <code>Customer123!</code>
      </p>
    </form>
  );
}
