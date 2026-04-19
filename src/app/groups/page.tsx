import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDataBundle } from "@/lib/ransomware";

export const revalidate = 300;

export default async function GroupsPage() {
  const { victims, groups } = await getDataBundle();

  const victimCountByGroup = victims.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.group] = (acc[curr.group] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Ransomware Groups</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <Link key={group.name} href={`/groups/${encodeURIComponent(group.name)}`}>
            <Card className="h-full transition hover:translate-y-[-2px]">
              <CardHeader>
                <CardTitle>{group.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/70">Victims observed: {victimCountByGroup[group.name] ?? 0}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
