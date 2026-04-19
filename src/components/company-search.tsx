"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { VictimRecord } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

export function CompanySearch({ victims }: { victims: VictimRecord[] }) {
  const [query, setQuery] = useState("");
  const companies = useMemo(() => [...new Set(victims.map((v) => v.company))], [victims]);

  const suggestions = useMemo(
    () => companies.filter((c) => c.toLowerCase().includes(query.toLowerCase())).slice(0, 8),
    [companies, query]
  );

  const selectedCompany = suggestions[0] ?? "";
  const incidents = useMemo(
    () => victims.filter((v) => v.company.toLowerCase() === selectedCompany.toLowerCase()),
    [victims, selectedCompany]
  );

  const miniGraph = useMemo(() => {
    if (!selectedCompany) return { nodes: [], links: [] };
    const links = incidents.map((incident) => ({ source: selectedCompany, target: incident.group }));
    const uniqueGroups = [...new Set(incidents.map((incident) => incident.group))];
    return {
      nodes: [{ id: selectedCompany, type: "company" }, ...uniqueGroups.map((g) => ({ id: g, type: "group" }))],
      links
    };
  }, [incidents, selectedCompany]);

  return (
    <div className="space-y-4">
      <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search company..." />
      {query.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestions.map((s) => (
              <button key={s} className="block w-full rounded-md border border-white/10 bg-white/5 p-2 text-left text-sm" onClick={() => setQuery(s)}>
                {s}
              </button>
            ))}
            {suggestions.length === 0 && <p className="text-sm text-white/70">No matching company found.</p>}
          </CardContent>
        </Card>
      )}
      {incidents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedCompany}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {incidents.map((incident, idx) => (
              <div key={`${incident.date}-${idx}`} className="rounded-md border border-white/10 bg-white/5 p-2 text-sm">
                <p>
                  <span className="text-white/60">Group:</span> {incident.group}
                </p>
                <p>
                  <span className="text-white/60">Date:</span> {incident.date}
                </p>
                <p>
                  <span className="text-white/60">Country:</span> {incident.country}
                </p>
              </div>
            ))}
            <div className="mt-4 overflow-hidden rounded-lg border border-white/10 bg-black/30">
              <ForceGraph2D
                graphData={miniGraph}
                width={700}
                height={250}
                nodeColor={(node) => ((node as { type?: string }).type === "company" ? "#2f81f7" : "#ff4d6d")}
                nodeRelSize={7}
                linkColor={() => "rgba(255,255,255,0.35)"}
                cooldownTicks={80}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
