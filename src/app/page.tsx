import { Activity, BarChart as BarIcon, PieChart as PieIcon } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { CsvDownloadButton } from "@/components/csv-download-button";
import { ChartCard } from "@/components/chart-card";
import { KpiCard } from "@/components/kpi-card";
import { Card, CardContent } from "@/components/ui/card";
import { attacksOverTime, industriesBreakdown, topGroups } from "@/lib/analytics";
import { getDataBundle } from "@/lib/ransomware";
import { getMostActiveGroup } from "@/lib/transform";

export const revalidate = 300;

const PIE_COLORS = ["#00d1ff", "#ff4d6d", "#30d158", "#f59e0b", "#8b5cf6", "#ef4444"];

export default async function DashboardPage() {
  const { victims, groups } = await getDataBundle();

  const lineData = attacksOverTime(victims);
  const topGroupData = topGroups(victims);
  const pieData = industriesBreakdown(victims);

  const countries = new Set(victims.map((v) => v.country)).size;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Ransomware Intelligence Overview</h1>
        <CsvDownloadButton victims={victims} />
      </div>
      <section className="grid gap-4 md:grid-cols-3">
        <KpiCard label="Total Recent Victims" value={victims.length} />
        <KpiCard label="Total Ransomware Groups" value={groups.length} />
        <KpiCard label="Most Active Group" value={getMostActiveGroup(victims)} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="animate-fade-up">
          <CardContent className="flex items-center gap-3 p-4 text-sm text-white/80">
            <Activity className="h-4 w-4 text-neon" />
            Countries affected: {countries}
          </CardContent>
        </Card>
        <Card className="animate-fade-up">
          <CardContent className="flex items-center gap-3 p-4 text-sm text-white/80">
            <BarIcon className="h-4 w-4 text-danger" />
            Top groups calculated from live victim feed
          </CardContent>
        </Card>
        <Card className="animate-fade-up">
          <CardContent className="flex items-center gap-3 p-4 text-sm text-white/80">
            <PieIcon className="h-4 w-4 text-success" />
            Industries inferred from victim metadata
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Attacks Over Time">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="attacks" stroke="#00d1ff" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Ransomware Groups">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topGroupData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="group" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#ff4d6d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Industry Distribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>
    </div>
  );
}
