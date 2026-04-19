import { notFound } from "next/navigation";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
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
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#ff4d6d" />
            </BarChart>
          </ResponsiveContainer>
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
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={countryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="country" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#00d1ff" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
