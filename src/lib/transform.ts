import { GraphEdge, GraphNode, GraphPayload, VictimRecord } from "@/lib/types";

export function dedupeVictims(victims: VictimRecord[]): VictimRecord[] {
  const seen = new Set<string>();
  const result: VictimRecord[] = [];

  for (const v of victims) {
    const key = `${v.company}::${v.group}::${v.date}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(v);
  }
  return result;
}

export function buildGraph(victims: VictimRecord[]): GraphPayload {
  const nodesMap = new Map<string, GraphNode>();
  const edgesMap = new Map<string, GraphEdge>();

  for (const victim of victims) {
    if (!nodesMap.has(victim.company)) {
      nodesMap.set(victim.company, { id: victim.company, type: "company", val: 2 });
    }
    if (!nodesMap.has(victim.group)) {
      nodesMap.set(victim.group, { id: victim.group, type: "group", val: 4 });
    }
    if (!nodesMap.has(victim.industry)) {
      nodesMap.set(victim.industry, { id: victim.industry, type: "industry", val: 3 });
    }

    const a = `${victim.company}->${victim.group}`;
    if (!edgesMap.has(a)) {
      edgesMap.set(a, {
        source: victim.company,
        target: victim.group,
        relationship: "attacked_by"
      });
    }

    const b = `${victim.company}->${victim.industry}`;
    if (!edgesMap.has(b)) {
      edgesMap.set(b, {
        source: victim.company,
        target: victim.industry,
        relationship: "belongs_to"
      });
    }
  }

  return {
    nodes: [...nodesMap.values()],
    edges: [...edgesMap.values()]
  };
}

export function getMostActiveGroup(victims: VictimRecord[]): string {
  const tally = victims.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.group] = (acc[curr.group] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";
}
