import { redirect } from "next/navigation";

export default async function LegacyLoginRedirect({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const dest = next ? `/login?next=${encodeURIComponent(next)}` : "/login";
  redirect(dest);
}
