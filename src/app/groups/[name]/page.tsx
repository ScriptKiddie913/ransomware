import { notFound } from "next/navigation";
import { CountryBarChart, TimelineBarChart } from "@/components/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDataBundle } from "@/lib/ransomware";

export const revalidate = 300;

export default async function GroupDetailPage({ params }: { params: { name: string } }) {
  const decoded = decodeURIComponent(params.name);
  const { victims, groups } = await getDataBundle();

  const group = groups.find((g) => g.name.toLowerCase() === decoded.toLowerCase());
  if (!group) return notFound();

  const groupVictims = victims.filter((v) => v.group.toLowerCase() === decoded.toLowerCase());
  const timeline = groupVictims.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.date] = (acc[curr.date] ?? 0) + 1;
    return acc;
  }, {});
  const timelineData = Object.entries(timeline)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => (a.date > b.date ? 1 : -1));

  const byCountry = groupVictims.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.country] = (acc[curr.country] ?? 0) + 1;
    return acc;
  }, {});
  const countryData = Object.entries(byCountry)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{group.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-white/80">
          <p>{group.description}</p>
          <p>Total victims: {groupVictims.length}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity timeline</CardTitle>
        </CardHeader>
        <CardContent className="h-[280px]">
          <TimelineBarChart data={timelineData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent victims</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {groupVictims.slice(0, 30).map((victim, i) => (
            <div key={`${victim.company}-${i}`} className="rounded-md border border-white/10 bg-white/5 p-2 text-sm">
              <p className="font-medium">{victim.company}</p>
              <p className="text-white/70">
                {victim.date} | {victim.country} | {victim.industry}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Countries targeted</CardTitle>
        </CardHeader>
        <CardContent className="h-[260px]">
          <CountryBarChart data={countryData} />
        </CardContent>
      </Card>
    </div>
  );
}
