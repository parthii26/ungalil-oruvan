import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";

export async function GET() {
  return NextResponse.json({
    ok: true,
    stage: 1,
    store: isSupabaseConfigured() ? "supabase" : "local-file",
    time: new Date().toISOString(),
  });
}
