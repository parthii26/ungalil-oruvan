import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getSiteSettings } from "@/lib/services/settings";
import { CustomerLoginForm } from "@/components/auth/customer-login-form";
import { LoginStage } from "@/components/motion/login-stage";

export const metadata = { title: "Sign in" };

export default async function CustomerLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const session = await getSession();
  const { next, error } = await searchParams;
  if (session?.role === "admin") redirect("/admin");
  if (session?.role === "customer") {
    redirect(next && next.startsWith("/") && !next.startsWith("/admin") ? next : "/account");
  }

  const settings = getSiteSettings();

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-cream">
      <aside className="relative hidden md:block overflow-hidden bg-charcoal">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/harvest-grain.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover motion-safe:ken"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-end p-12 text-cream">
          <p className="font-tamil text-lg">{settings.tamil_tagline}</p>
          <h2 className="mt-2 font-serif text-5xl leading-tight">
            From our soil
            <br />
            to your table
          </h2>
        </div>
      </aside>
      <div className="flex items-center justify-center px-4 py-10 md:py-16">
        <LoginStage>
          <div className="w-full max-w-md border border-line bg-warmwhite p-6 md:p-8">
            <Link href="/" className="group block">
              <p className="font-tamil text-2xl md:text-3xl font-bold text-forest group-hover:text-terracotta transition">{settings.tamil_tagline}</p>
              <p className="font-serif text-sm text-terracotta tracking-[0.14em] uppercase mt-0.5">{settings.brand_name}</p>
            </Link>
            <h1 className="mt-4 font-serif text-3xl md:text-4xl text-forest">{settings.login_headline}</h1>
            <p className="mt-3 text-sm text-ink-soft">{settings.login_subhead}</p>
            <CustomerLoginForm next={next && !next.startsWith("/admin") ? next : "/account"} error={error} />
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link href="/auth/register" className="link-grow inline-flex min-h-11 items-center text-forest">
                Create account
              </Link>
              <Link href="/auth/forgot-password" className="inline-flex min-h-11 items-center text-ink-soft">
                Forgot password
              </Link>
            </div>
            <p className="mt-8 text-[0.7rem] tracking-widest uppercase text-ink-soft">
              Store staff?{" "}
              <Link href="/admin/login" className="text-earth">
                Administration
              </Link>
            </p>
          </div>
        </LoginStage>
      </div>
    </div>
  );
}
