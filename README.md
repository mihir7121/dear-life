# Atlas of Me

A premium personal travel scrapbook — pin memories on an interactive 3D globe, browse them in a cinematic timeline and gallery, and relive every place you've been.

## Features

- **Interactive 3D globe** — polygon-based country rendering with hover-to-highlight, custom memory pins, and smooth rotation
- **Memory CRUD** — title, date, location (with Geolocation API), category, tags, mood, photos/video
- **Timeline view** — chronological memory feed
- **Gallery view** — masonry photo grid
- **Favorites** — starred memories surfaced across views
- **Clerk auth** — sign-up / sign-in, per-user data isolation
- **Cloudinary media** — signed uploads with server-side API route
- **Dark / light mode** — system-aware, persisted preference

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Auth | Clerk |
| Database | PostgreSQL via Prisma |
| Media | Cloudinary |
| Globe | react-globe.gl + topojson-client |
| UI | Tailwind CSS, Radix UI, Framer Motion |
| Hosting | Vercel (recommended) |

---

## Local Setup

### Prerequisites

- Node.js 20+
- A PostgreSQL database (local or [Neon](https://neon.tech) free tier)
- [Clerk](https://clerk.com) account (free tier)
- [Cloudinary](https://cloudinary.com) account (free tier)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd TripTag2
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | Clerk dashboard → API Keys |
| `DATABASE_URL` | Your PostgreSQL connection string |
| `CLOUDINARY_*` | Cloudinary console → Settings → API Keys |

### 3. Set up the database

```bash
# Push schema to your database (creates all tables)
npm run db:push

# (Optional) Open Prisma Studio to browse data
npm run db:studio
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Database Commands

```bash
npm run db:push        # Sync schema to DB (no migration history)
npm run db:migrate     # Create a named migration (production use)
npm run db:generate    # Regenerate Prisma client after schema changes
npm run db:studio      # Open Prisma Studio GUI
npm run db:seed        # Seed with sample data (if seed file exists)
```

> All `db:*` commands load `.env.local` automatically via `dotenv-cli`.

---

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add all variables from `.env.example` to Vercel → Settings → Environment Variables
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel deployment URL
5. Deploy — `prisma generate` runs automatically before `next build`


---

## Known Limitations

- **Country hover tooltip** covers ~130 common countries; smaller territories show no name
- **Globe polygon data** is 110m resolution (simplified) — fine for country-level interaction, not sub-country detail
- **Media upload** requires an active Cloudinary account; no local file storage fallback
- **No offline support** — country GeoJSON is fetched from jsDelivr CDN on first load
- **Mobile globe interaction** works but is not optimized (touch controls are basic OrbitControls defaults)
- **No email/password auth** — Clerk social/magic-link only unless configured separately in Clerk dashboard
