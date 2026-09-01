import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ processed: 0, reason: "Outbox worker is a Stage 2 job." });
}
