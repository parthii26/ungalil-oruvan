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
      <div className="w-full max-w-[420px]">
        <div>
          <span className="font-tamil text-xl font-bold text-[#C59A3D]">உங்களில் ஒருவர்</span>
          <span className="block text-[0.68rem] tracking-[0.25em] uppercase text-[#C59A3D]/80 font-serif">Ungalil Oruvar</span>
        </div>
        <div className="mt-4">
          <h1 className="font-tamil text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
            நிர்வாக உள்நுழைவு
          </h1>
          <p className="font-serif text-xl sm:text-2xl text-white/90 leading-tight">
            Admin Sign In
          </p>
        </div>
        <p className="mt-2 text-xs sm:text-sm text-white/60">
          வணிக செயல்பாடுகளைப் பாதுகாப்பாக நிர்வகிக்கவும் · Manage commerce operations securely.
        </p>
        <div className="mt-8 border border-white/10 bg-[#1d201b] p-6 sm:p-7 shadow-xl">
          <AdminLoginForm error={error} />
        </div>
        <p className="mt-6 text-xs text-white/40">
          Access is limited to verified store administrators. Session role is validated strictly on the server.
        </p>
        <p className="mt-4 text-xs text-white/45">
          Shopping?{" "}
          <Link href="/login" className="text-[#C59A3D] hover:underline">
            வாடிக்கையாளர் உள்நுழைவு / Customer sign-in
          </Link>
        </p>
      </div>
    </div>
  );
}
