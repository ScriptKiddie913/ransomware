import { NextRequest, NextResponse } from "next/server";
import { getRecentVictims } from "@/lib/ransomware";
import { buildGraph } from "@/lib/transform";
import { isRateLimited } from "@/lib/rate-limit";

export async function GET(req: NextRequest, { params }: { params: { name: string } }) {
  const key = `company:${req.ip ?? "anon"}`;
  if (isRateLimited(key)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const name = decodeURIComponent(params.name).toLowerCase();
    const all = await getRecentVictims();
    const incidents = all.filter((v) => v.company.toLowerCase().includes(name));
    return NextResponse.json({
      company: decodeURIComponent(params.name),
      incidents,
      graph: buildGraph(incidents)
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch company data" }, { status: 500 });
  }
}
