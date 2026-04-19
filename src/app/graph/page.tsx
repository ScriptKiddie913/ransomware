import { GraphClient } from "@/components/graph-client";
import { getRecentVictims } from "@/lib/ransomware";
import { buildGraph, dedupeVictims } from "@/lib/transform";

export const revalidate = 300;

export default async function GraphPage() {
  const victims = dedupeVictims(await getRecentVictims());
  const graph = buildGraph(victims);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Graph Explorer</h1>
      <p className="text-sm text-white/70">Maltego-style relationship view. Click nodes to inspect connected entities.</p>
      <GraphClient graph={graph} victims={victims} />
    </div>
  );
}
