import { NextResponse } from "next/server";
import { searchSuggestions } from "@/lib/services/catalog";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q") ?? "";
  return NextResponse.json({ items: searchSuggestions(q) });
}
