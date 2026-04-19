"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-xl border border-danger/30 bg-danger/10 p-6">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="mt-2 text-sm text-white/80">We could not load live ransomware data. Please retry.</p>
      <Button className="mt-4" onClick={() => reset()}>
        Retry
      </Button>
    </div>
  );
}
