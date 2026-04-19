import { CompanySearch } from "@/components/company-search";
import { getRecentVictims } from "@/lib/ransomware";

export const revalidate = 300;

export default async function SearchPage() {
  const victims = await getRecentVictims();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Company Search</h1>
      <CompanySearch victims={victims} />
    </div>
  );
}
