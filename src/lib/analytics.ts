import { VictimRecord } from "@/lib/types";

export function attacksOverTime(victims: VictimRecord[]) {
  const buckets = victims.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.date] = (acc[curr.date] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(buckets)
    .sort((a, b) => (a[0] > b[0] ? 1 : -1))
    .map(([date, attacks]) => ({ date, attacks }));
}

export function topGroups(victims: VictimRecord[]) {
  const buckets = victims.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.group] = (acc[curr.group] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(buckets)
    .map(([group, count]) => ({ group, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

export function industriesBreakdown(victims: VictimRecord[]) {
  const buckets = victims.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.industry] = (acc[curr.industry] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(buckets)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}
