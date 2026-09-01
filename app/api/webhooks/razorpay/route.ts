import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { accepted: false, reason: "Razorpay webhooks are a Stage 2 integration." },
    { status: 501 },
  );
}
