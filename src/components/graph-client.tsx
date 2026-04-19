"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { GraphPayload, GraphNode, VictimRecord } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InfoDrawer } from "@/components/info-drawer";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

const COLORS = {
  company: "#2f81f7",
  group: "#ff4d6d",
  industry: "#30d158"
} as const;

export function GraphClient({ graph, victims }: { graph: GraphPayload; victims: VictimRecord[] }) {
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [groupFilter, setGroupFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

  const filteredVictims = useMemo(() => {
    return victims.filter((v) => {
      const groupOk = !groupFilter || v.group.toLowerCase().includes(groupFilter.toLowerCase());
      const countryOk = !countryFilter || v.country.toLowerCase().includes(countryFilter.toLowerCase());
      return groupOk && countryOk;
    });
  }, [victims, groupFilter, countryFilter]);

  const related = useMemo(() => {
    if (!selected) return [];
    const all = new Set<string>();
    for (const edge of graph.edges) {
      if (edge.source === selected.id) all.add(edge.target);
      if (edge.target === selected.id) all.add(edge.source);
    }
    return [...all];
  }, [selected, graph.edges]);

  const displayGraph = useMemo(() => {
    const companies = new Set(filteredVictims.map((v) => v.company));
    const groups = new Set(filteredVictims.map((v) => v.group));
    const industries = new Set(filteredVictims.map((v) => v.industry));

    const allowed = new Set<string>([...companies, ...groups, ...industries]);
    return {
      nodes: graph.nodes.filter((n) => allowed.has(n.id)),
      links: graph.edges.filter((e) => allowed.has(e.source) && allowed.has(e.target))
    };
  }, [filteredVictims, graph]);

  function exportJson() {
    const blob = new Blob([JSON.stringify(graph, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ransomware-graph.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="space-y-3">
        <div className="glass flex flex-wrap gap-2 rounded-xl p-3">
          <Input value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)} placeholder="Filter by group" className="w-52" />
          <Input value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} placeholder="Filter by country" className="w-52" />
          <Button variant="outline" onClick={exportJson}>
            Export Graph JSON
          </Button>
        </div>
        <div className="glass h-[70vh] overflow-hidden rounded-xl">
          <ForceGraph2D
            graphData={displayGraph}
            nodeLabel={(node) => `${(node as GraphNode).id}`}
            nodeColor={(node) => COLORS[(node as GraphNode).type]}
            nodeRelSize={6}
            linkColor={() => "rgba(255,255,255,0.25)"}
            onNodeClick={(node) => setSelected(node as GraphNode)}
            width={900}
            height={600}
          />
        </div>
      </div>
      <InfoDrawer node={selected} related={related} victims={filteredVictims} />
    </div>
  );
}
