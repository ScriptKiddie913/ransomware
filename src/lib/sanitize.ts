export function toSafeString(value: unknown, fallback = "Unknown"): string {
  if (typeof value !== "string") return fallback;
  const stripped = value
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return stripped.length ? stripped : fallback;
}

export function toSafeDate(value: unknown): string {
  const date = new Date(typeof value === "string" ? value : "");
  if (Number.isNaN(date.getTime())) return new Date().toISOString().split("T")[0];
  return date.toISOString().split("T")[0];
}
