import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getSiteSettings } from "@/lib/services/settings";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (session.role !== "admin") redirect("/forbidden");
  const settings = getSiteSettings();

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
        <header className="h-14 border-b border-black/10 bg-white flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <AdminNav mobile />
            <input
              className="hidden sm:block w-56 border border-black/10 px-3 py-1.5 text-sm"
              placeholder="Search — not configured"
              disabled
            />
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-ink-soft hidden sm:inline">Notifications — not configured</span>
            <span className="font-medium">{session.name}</span>
            <Link href="/" className="text-ink-soft">
              Store
            </Link>
            <form action="/api/auth/logout?admin=1" method="post">
              <button type="submit" className="text-[0.7rem] tracking-widest uppercase">
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
