import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getSiteSettings } from "@/lib/services/settings";
import { AdminLoginForm } from "@/components/auth/admin-login-form";

export const metadata = { title: "Store administration" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (session?.role === "admin") redirect("/admin");
  const { error } = await searchParams;

  const settings = getSiteSettings();

  return (
    <div className="min-h-screen bg-[#161814] text-[#F4F1EA] grid place-items-center px-6 py-16">
      <div className="w-full max-w-[400px]">
        <p className="text-[0.68rem] tracking-[0.28em] uppercase text-[#C59A3D]">{settings.brand_name}</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Store Administration</h1>
        <p className="mt-2 text-sm text-white/60">Manage your commerce operations securely.</p>
        <div className="mt-8 border border-white/10 bg-[#1d201b] p-7">
          <AdminLoginForm error={error} />
        </div>
        <p className="mt-6 text-xs text-white/40">
          Access is limited to provisioned operators. Role is verified on the server. MFA is a future option.
        </p>
        <p className="mt-6 text-xs text-white/35">
          Shopping? <Link href="/login" className="text-[#C59A3D]">Customer sign-in</Link>
        </p>
      </div>
    </div>
  );
}
