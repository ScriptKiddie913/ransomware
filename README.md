# Ransomware Live Dashboard

Production-ready Next.js 14 dashboard for ransomware intelligence, powered only by:
- https://api.ransomware.live/recentvictims
- https://api.ransomware.live/groups

## Stack
- Next.js 14 App Router
- Tailwind CSS + shadcn-style UI components
- Recharts
- react-force-graph-2d
- Framer Motion-ready UI structure

## Features
- Live server-side data fetching with ISR (`revalidate = 300`)
- In-memory API caching and fallback dataset
- API routes: `/api/recent`, `/api/groups`, `/api/data`, `/api/graph`, `/api/company/[name]`
- Dashboard KPIs + charts
- Group list + group detail analytics
- Company search with autocomplete + mini relationship graph
- Maltego-style graph explorer with node click side panel
- Graph JSON export and CSV download
- Dark/light toggle and bookmarks
- Basic per-route in-memory rate limiting and sanitization

## Run (pnpm)
```bash
pnpm install
pnpm build
pnpm start
```

## Notes
- Designed to be Vercel-compatible without extra config.
- If ransomware.live is unavailable, fallback sample data is used to keep UI operational.
