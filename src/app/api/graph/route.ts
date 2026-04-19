import { NextRequest, NextResponse } from "next/server";
import { getRecentVictims } from "@/lib/ransomware";
import { buildGraph, dedupeVictims } from "@/lib/transform";
import { isRateLimited } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const key = `graph:${req.ip ?? "anon"}`;
  if (isRateLimited(key)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const victims = dedupeVictims(await getRecentVictims());
    const payload = buildGraph(victims);
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ error: "Failed to build graph" }, { status: 500 });
  }
}
