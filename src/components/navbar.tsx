import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/graph", label: "Graph" },
  { href: "/groups", label: "Groups" },
  { href: "/search", label: "Search" }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-wider text-neon">
          <ShieldAlert className="h-4 w-4" />
          Ransomware Live Dashboard
        </Link>
        <nav className="hidden items-center gap-4 md:flex">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-white/80 transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
