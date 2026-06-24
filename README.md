# kevinclear.me

Personal portfolio + résumé site for **Kevin Clear** — a single-page, recruiter-first
site presented as a "personal status page" (reliability engineer = high-uptime service).

## Stack

- **Next.js 16** (App Router) + **TypeScript**, **static export** (`output: "export"` → `/out`)
- **Tailwind v4** + **shadcn/ui** (base-nova)
- **Type:** Space Grotesk (display) · Inter (body) · IBM Plex Mono (labels/data)
- **Palette:** warm paper / near-black ink / slate / hairline + a single jade "signal" accent; light + dark.

No server runtime — the build emits static HTML/CSS/JS, self-hosted on my homelab.

## Develop

```bash
npm install
npm run dev            # http://localhost:3000
npm run build          # static export → ./out
npx serve out          # preview the production build
```

Content lives in data arrays at the top of `src/app/page.tsx` (experience, projects, skills).
The downloadable résumé is `public/kevin-clear-resume.pdf`.

## Deploy

Statically exported and self-hosted on my homelab.
