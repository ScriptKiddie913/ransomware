import { fallbackGroups, fallbackVictims } from "@/lib/fallback-data";
import { getCache, setCache } from "@/lib/cache";
import { toSafeDate, toSafeString } from "@/lib/sanitize";
import { GroupRecord, VictimRecord } from "@/lib/types";

const API_BASE = "https://api.ransomware.live";
const TTL = 5 * 60 * 1000;

type RawVictim = Record<string, unknown>;
type RawGroup = Record<string, unknown>;

async function safeFetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 }
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function normalizeVictim(raw: RawVictim): VictimRecord {
  const company = toSafeString(raw.victim || raw.company || raw.name);
  const group = toSafeString(raw.group_name || raw.group || "Unknown Group");
  const date = toSafeDate(raw.discovered || raw.date || raw.published || raw.posted);
  const country = toSafeString(raw.country || raw.country_code || "Unknown");
  const industry = toSafeString(raw.activity || raw.industry || "Unknown");
  const leak_url = toSafeString(raw.website || raw.url || raw.post_url || "N/A", "N/A");
  const description = toSafeString(raw.description || raw.details || "No description available.", "No description available.");

  return {
    company,
    group,
    date,
    country,
    industry,
    ransomware_type: "Ransomware",
    leak_url,
    description
  };
}

function normalizeGroup(raw: RawGroup): GroupRecord {
  return {
    name: toSafeString(raw.name || raw.group_name || raw.slug),
    description: toSafeString(raw.description || raw.profile || "No details available.", "No details available.")
  };
}

export async function getRecentVictims(): Promise<VictimRecord[]> {
  const cached = getCache<VictimRecord[]>("recent:victims");
  if (cached) return cached;

  const payload = await safeFetchJson<RawVictim[]>(`${API_BASE}/recentvictims`);
  const normalized = Array.isArray(payload) ? payload.map(normalizeVictim) : fallbackVictims;
  setCache("recent:victims", normalized, TTL);
  return normalized;
}

export async function getGroups(): Promise<GroupRecord[]> {
  const cached = getCache<GroupRecord[]>("ransom:groups");
  if (cached) return cached;

  const payload = await safeFetchJson<RawGroup[]>(`${API_BASE}/groups`);
  const normalized = Array.isArray(payload) ? payload.map(normalizeGroup) : fallbackGroups;
  setCache("ransom:groups", normalized, TTL);
  return normalized;
}

export async function getDataBundle() {
  const [victims, groups] = await Promise.all([getRecentVictims(), getGroups()]);
  return { victims, groups };
}
