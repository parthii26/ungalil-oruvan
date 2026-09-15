import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { resetDb } from "@/lib/db/store";
import { getSession } from "@/lib/auth/session";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    const session = await getSession();
    if (session?.role !== "admin") {
      return NextResponse.json({ error: "Development endpoints are disabled in production." }, { status: 403 });
    }
  }

  resetDb();
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/navigation");
  return NextResponse.json({ ok: true });
}

