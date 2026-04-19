import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function KpiCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="animate-fade-up">
      <CardHeader>
        <CardTitle className="text-white/70">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="font-mono text-3xl font-semibold text-white">{value}</div>
      </CardContent>
    </Card>
  );
}
