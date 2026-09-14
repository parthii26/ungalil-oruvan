import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { resetDb } from "@/lib/db/store";

export async function POST() {
  resetDb();
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/navigation");
  return NextResponse.json({ ok: true });
}

