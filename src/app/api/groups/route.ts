import { NextRequest, NextResponse } from "next/server";
import { getGroups } from "@/lib/ransomware";
import { isRateLimited } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const key = `groups:${req.ip ?? "anon"}`;
  if (isRateLimited(key)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const groups = await getGroups();
    return NextResponse.json({ data: groups, count: groups.length, cached: true });
  } catch {
    return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 });
  }
}
