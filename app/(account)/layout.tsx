import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { StorefrontHeader } from "@/components/storefront/header";
import { StorefrontFooter } from "@/components/storefront/footer";
import { AccountNav } from "@/components/account/account-nav";
import { Suspense } from "react";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/account");

  return (
    <>
      <Suspense>
        <StorefrontHeader />
      </Suspense>
      <div className="container-page py-8 md:py-12 grid md:grid-cols-[200px_1fr] gap-8 md:gap-10 flex-1 has-bottom-nav">
        <aside className="min-w-0">
          <p className="font-serif text-xl md:text-2xl truncate">{session.name}</p>
          <p className="text-xs text-ink-soft truncate">{session.email}</p>
          <div className="mt-4 md:mt-6">
            <AccountNav isAdmin={session.role === "admin"} />
          </div>
          <form action="/api/auth/logout" method="post" className="mt-4 md:mt-8">
            <button className="inline-flex min-h-11 items-center text-xs uppercase tracking-widest underline underline-offset-4">
              Sign out
            </button>
          </form>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
      <StorefrontFooter />
    </>
  );
}
