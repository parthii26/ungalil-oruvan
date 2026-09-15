import Link from "next/link";

export const metadata = { title: "Phone Verification" };

export default function OtpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-warmwhite">
      <div className="max-w-md w-full border border-line bg-cream p-8 shadow-sm">
        <h1 className="font-serif text-3xl md:text-4xl text-forest">Phone Login</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Verify your mobile number to sign in or access your orders quickly.
        </p>
        <form className="mt-6 space-y-4" onSubmit={undefined}>
          <div>
            <label className="label" htmlFor="phone">Mobile Number</label>
            <div className="flex mt-1">
              <span className="inline-flex items-center px-3 border border-r-0 border-line bg-white text-sm text-ink-soft">
                +91
              </span>
              <input
                id="phone"
                name="phone"
                type="tel"
                maxLength={10}
                placeholder="9876543210"
                className="input rounded-none"
              />
            </div>
          </div>
          <button type="button" className="btn btn-primary w-full text-sm">
            Send One-Time Passcode
          </button>
        </form>
        <div className="mt-6 pt-6 border-t border-line text-center text-xs text-ink-soft space-y-2">
          <p>
            Standard SMS rates may apply. Or continue with{" "}
            <Link href="/login" className="underline underline-offset-4 text-forest font-medium">
              email and password
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
