import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getSiteSettings } from "@/lib/services/settings";
import { loadDb } from "@/lib/db/store";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (session.role !== "admin") redirect("/forbidden");
  const settings = getSiteSettings();
  const db = loadDb();
  const unreadMessages = db.contact_messages?.filter((m) => !m.read).length ?? 0;
  const pendingOrders = db.orders?.filter((o) => o.status === "pending_payment").length ?? 0;

  return (
    <div className="admin-shell min-h-screen md:grid md:grid-cols-[232px_1fr] text-charcoal">
      <aside className="hidden md:flex flex-col bg-[#1c211d] text-[#E8E4DA] min-h-screen">
        <div className="px-5 py-5 border-b border-white/10">
          <p className="text-[0.65rem] tracking-[0.22em] uppercase text-[#C59A3D]">Operations</p>
          <p className="mt-1 text-lg font-semibold">{settings.brand_name}</p>
        </div>
        <AdminNav />
      </aside>
      <div className="min-w-0">
        <header className="min-h-14 border-b border-black/10 bg-white flex items-center justify-between gap-2 px-4 md:px-6 py-1">
          <div className="flex min-w-0 items-center gap-2 md:gap-3">
            <AdminNav mobile />
            <form action="/admin/orders" method="get" className="hidden sm:block">
              <input
                name="q"
                className="w-56 border border-black/10 px-3 py-1.5 text-sm focus:outline-none focus:border-forest"
                placeholder="Search orders…"
              />
            </form>
          </div>
          <div className="flex items-center gap-3 md:gap-4 text-sm">
            {unreadMessages > 0 ? (
              <Link
                href="/admin/messages"
                className="inline-flex items-center gap-1.5 text-xs bg-forest/10 text-forest px-2.5 py-1 rounded font-medium hover:bg-forest/20 transition-colors"
                title={`${unreadMessages} unread messages`}
              >
                <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
                {unreadMessages} new
              </Link>
            ) : pendingOrders > 0 ? (
              <Link
                href="/admin/orders"
                className="inline-flex items-center gap-1.5 text-xs bg-amber-50 text-amber-800 px-2.5 py-1 rounded font-medium hover:bg-amber-100 transition-colors"
              >
                {pendingOrders} pending
              </Link>
            ) : (
              <span className="text-ink-soft text-xs hidden lg:inline">All caught up</span>
            )}
            <span className="font-medium hidden sm:inline truncate max-w-32 md:max-w-none">{session.name}</span>
            <Link href="/" className="text-ink-soft px-1">
              Store
            </Link>
            <form action="/api/auth/logout?admin=1" method="post">
              <button type="submit" className="text-[0.7rem] tracking-widest uppercase px-1">
                Sign out
              </button>
            </form>
          </div>
        </header>
        <div className="p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
