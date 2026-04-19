import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-lg font-semibold">No matching entity found</h2>
      <p className="mt-2 text-sm text-white/70">The requested group or company could not be resolved.</p>
      <Link href="/" className="mt-4 inline-block text-neon underline">
        Return to dashboard
      </Link>
    </div>
  );
}
