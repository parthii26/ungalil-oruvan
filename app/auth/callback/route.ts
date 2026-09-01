import { NextResponse } from "next/server";

/** Supabase auth callback. No-op until hosted Supabase is configured. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  return NextResponse.redirect(new URL("/account", url.origin));
}
