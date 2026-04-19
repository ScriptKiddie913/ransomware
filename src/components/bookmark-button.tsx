"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BookmarkButton({ company }: { company: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("bookmarked-companies") ?? "[]") as string[];
    setSaved(items.includes(company));
  }, [company]);

  function toggle() {
    const items = new Set(JSON.parse(localStorage.getItem("bookmarked-companies") ?? "[]") as string[]);
    if (items.has(company)) {
      items.delete(company);
      setSaved(false);
    } else {
      items.add(company);
      setSaved(true);
    }
    localStorage.setItem("bookmarked-companies", JSON.stringify([...items]));
  }

  return (
    <Button variant="outline" size="sm" onClick={toggle}>
      <Star className={`mr-2 h-4 w-4 ${saved ? "fill-neon text-neon" : "text-white"}`} />
      {saved ? "Bookmarked" : "Bookmark"}
    </Button>
  );
}
