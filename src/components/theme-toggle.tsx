"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [mode, setMode] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme-mode") as "dark" | "light" | null;
    const next = saved ?? "dark";
    setMode(next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }, []);

  function toggle() {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    localStorage.setItem("theme-mode", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  return (
    <Button variant="outline" size="sm" onClick={toggle} aria-label="Toggle theme">
      {mode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
