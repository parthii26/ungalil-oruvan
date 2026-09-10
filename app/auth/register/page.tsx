import Link from "next/link";
import { getSiteSettings } from "@/lib/services/settings";
import { RegisterForm } from "./ui";

export const metadata = { title: "Create account" };

export default function RegisterPage() {
  const settings = getSiteSettings();
  return (
    <div className="min-h-screen grid md:grid-cols-2 kolam-bg">
      <aside className="relative hidden md:block overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={settings.hero_image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-forest/55" />
      </aside>
      <div className="flex items-center justify-center p-4 md:p-8 py-10">
        <div className="w-full max-w-sm border border-line bg-cream/90 p-6 md:p-8">
          <Link href="/" className="inline-flex min-h-11 items-center font-serif text-3xl text-forest">
            {settings.brand_name}
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl mt-6 md:mt-8">Create account</h1>
          <p className="mt-2 text-sm text-ink-soft">Registration always creates a customer. Admin cannot be self-assigned.</p>
          <RegisterForm />
          <p className="mt-6 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="inline-flex min-h-11 items-center underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
