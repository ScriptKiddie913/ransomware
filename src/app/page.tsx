import { Activity, BarChart as BarIcon, PieChart as PieIcon } from "lucide-react";
import { CsvDownloadButton } from "@/components/csv-download-button";
import { ChartCard } from "@/components/chart-card";
import { AttacksLineChart, IndustryPieChart, TopGroupsBarChart } from "@/components/charts";
import { KpiCard } from "@/components/kpi-card";
import { Card, CardContent } from "@/components/ui/card";
import { attacksOverTime, industriesBreakdown, topGroups } from "@/lib/analytics";
import { getDataBundle } from "@/lib/ransomware";
import { getMostActiveGroup } from "@/lib/transform";

export const revalidate = 300;

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
          <AttacksLineChart data={lineData} />
        </ChartCard>

        <ChartCard title="Top Ransomware Groups">
          <TopGroupsBarChart data={topGroupData} />
        </ChartCard>

        <ChartCard title="Industry Distribution">
          <IndustryPieChart data={pieData} />
        </ChartCard>
      </section>
    </div>
  );
}
