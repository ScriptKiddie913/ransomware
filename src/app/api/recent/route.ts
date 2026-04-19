import { NextRequest, NextResponse } from "next/server";
import { getRecentVictims } from "@/lib/ransomware";
import { isRateLimited } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const key = `recent:${req.ip ?? "anon"}`;
  if (isRateLimited(key)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const victims = await getRecentVictims();
    return NextResponse.json({ data: victims, count: victims.length, cached: true });
  } catch {
    return NextResponse.json({ error: "Failed to fetch recent victims" }, { status: 500 });
  }
}
