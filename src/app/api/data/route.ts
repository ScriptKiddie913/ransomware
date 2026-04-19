import { NextRequest, NextResponse } from "next/server";
import { getDataBundle } from "@/lib/ransomware";
import { dedupeVictims } from "@/lib/transform";
import { isRateLimited } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const key = `data:${req.ip ?? "anon"}`;
  if (isRateLimited(key)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const { victims, groups } = await getDataBundle();
    return NextResponse.json({
      data: {
        victims: dedupeVictims(victims),
        groups
      }
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
