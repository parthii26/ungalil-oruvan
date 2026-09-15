import Link from "next/link";
import { ForgotPasswordForm } from "./form";

export const metadata = { title: "Reset password" };

export default function ForgotPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-warmwhite">
      <div className="max-w-md w-full border border-line bg-cream p-8 shadow-sm">
        <h1 className="font-serif text-3xl md:text-4xl text-forest">Reset password</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Enter your registered email address and we will dispatch password recovery instructions.
        </p>
        <ForgotPasswordForm />
        <Link href="/login" className="block mt-6 text-sm underline underline-offset-4 text-forest">
          ← Back to sign in
        </Link>
      </div>
    </div>
  );
}
