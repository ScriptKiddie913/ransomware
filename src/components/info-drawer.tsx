"use client";

import { GraphNode, VictimRecord } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookmarkButton } from "@/components/bookmark-button";

export function InfoDrawer({
  node,
  related,
  victims
}: {
  node: GraphNode | null;
  related: string[];
  victims: VictimRecord[];
}) {
  if (!node) {
    return (
      <Card className="h-full">
        <CardContent className="pt-4 text-sm text-white/70">Click a node to inspect linked entities and attack history.</CardContent>
      </Card>
    );
  }

  const history = victims.filter((v) => v.company === node.id || v.group === node.id || v.industry === node.id).slice(0, 20);

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader>
        <CardTitle>{node.id}</CardTitle>
        <p className="text-xs uppercase tracking-wider text-white/60">{node.type}</p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {node.type === "company" && <BookmarkButton company={node.id} />}
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/60">Related entities</h4>
          <ul className="space-y-1">
            {related.slice(0, 12).map((item) => (
              <li key={item} className="text-white/90">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/60">Attack history</h4>
          <ul className="space-y-2">
            {history.map((row, idx) => (
              <li key={`${row.company}-${row.date}-${idx}`} className="rounded-md border border-white/10 bg-white/5 p-2">
                <div className="font-medium">{row.company}</div>
                <div className="text-xs text-white/70">
                  {row.group} | {row.date} | {row.country}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
