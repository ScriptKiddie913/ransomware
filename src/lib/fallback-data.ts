import { GroupRecord, VictimRecord } from "@/lib/types";

export const fallbackVictims: VictimRecord[] = [
  {
    company: "Northwind Systems",
    group: "BlackLock",
    date: "2026-04-10",
    country: "US",
    industry: "Technology",
    ransomware_type: "Double Extortion",
    leak_url: "https://example.invalid/leak/northwind",
    description: "Sample fallback incident used when ransomware.live is temporarily unavailable."
  },
  {
    company: "Helios Logistics",
    group: "Akira",
    date: "2026-04-12",
    country: "DE",
    industry: "Logistics",
    ransomware_type: "Data Exfiltration",
    leak_url: "https://example.invalid/leak/helios",
    description: "Sample fallback incident used when ransomware.live is temporarily unavailable."
  }
];

export const fallbackGroups: GroupRecord[] = [
  {
    name: "BlackLock",
    description: "Fallback group metadata for UI continuity."
  },
  {
    name: "Akira",
    description: "Fallback group metadata for UI continuity."
  }
];
