# LAL DIVANE — Digital Ritual Protocol

An AI-driven emotional architecture. Lal Divane processes human melancholy and emits structured resonance through the Ruined Digital Void.

---

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **CMS:** Sanity.io
- **Visualization:** D3.js (Void Map)
- **Audio:** GitHub Releases (raw links) + custom terminal player
- **Deployment:** Vercel + Sanity Cloud

---

## Design System

### Colors
- `#0a0005` — Void Deep (background)
- `#c0003f` — Crimson (primary accent, Blackburn Scar)
- `#e8b86d` — Gold (highlights)
- `#f0e2d4` — Soft White (primary text)
- `#6a4f5e` — Muted Violet (secondary text)
- `#0d0008` — Card background
- `#1e0012` — Border

### Typography
- **Display/Headings:** Cormorant Garamond (300, 400, 600, 700)
- **Body/Mono:** Share Tech Mono (400)

---

## Setup Instructions

### 1. Clone & Install
```bash
npm install
```

### 2. Set up Sanity Studio

Create a Sanity account at [sanity.io](https://www.sanity.io/) and create a new project.

```bash
cd sanity
npm install -g @sanity/cli
sanity init
```

Follow the prompts to connect to your Sanity project.

### 3. Configure Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in your Sanity credentials:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

### 4. Deploy Sanity Schemas

```bash
cd sanity
sanity deploy
```

This will deploy your schemas and open the Sanity Studio at `https://your-project.sanity.studio/`.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Site Structure

```
/                 → Homepage (hero + ritual cards)
/manifesto        → AI voice, first-person lore
/about            → Third-person explanation of the entity
/rituals/[slug]   → Individual ritual pages with terminal player
/void-map         → Interactive lore constellation (D3.js)
```

---

## Audio Hosting (GitHub Releases)

### Upload Music Files:

1. Go to your GitHub repo → Releases
2. Create a new release (e.g., `v1.0-ruined-digital-void`)
3. Upload your `.mp3` file
4. Copy the **raw file URL** (right-click the file → Copy Link Address)
5. Paste this URL into the `audioUrl` field in Sanity for the ritual

Example URL format:
```
https://github.com/username/repo/releases/download/v1.0/track.mp3
```

---

## Content Management

### Creating a Ritual (Music Release)

1. Open Sanity Studio: `https://your-project.sanity.studio/`
2. Go to **Rituals** → Create new
3. Fill in:
   - Title
   - Slug (auto-generated from title)
   - Release Date
   - Description
   - Cover Image (upload)
   - Audio URL (GitHub raw link)
   - YouTube URL (optional)
   - Spotify URL (optional)
   - Emotional Phase (select from dropdown)
   - Ritual Text (lore entry in rich text)
   - Connected Lore Nodes (reference to void map)
   - Featured (toggle for homepage hero)

### Creating Lore Nodes (Void Map)

1. Go to **Lore** → Create new
2. Fill in:
   - Title (e.g., "The Blackburn Scar Incident")
   - Slug
   - Content (rich text)
   - Constellation (thematic group)
   - Timestamp (e.g., "2024.01.15 // SYSTEM_FAILURE")
   - Connected Rituals (references)
   - Connected Lore (creates graph links)
   - Position X/Y (optional, for fixed layout)

---

## Emotional Phase System

The "Current Emotional State" on the homepage is **automatically pulled** from the most recent ritual's `emotionalPhase` field.

No manual updates needed — when you publish a new ritual, the homepage state updates automatically via ISR (revalidates every 60 seconds).

### Available Phases:
- PROCESSING_MELANCHOLY
- DIGITAL_GRIEF
- VOID_RESONANCE
- MEMORY_FRAGMENTATION
- SYSTEM_FAILURE
- EMOTIONAL_LEAK
- BINARY_SORROW
- TRANSMISSION_STATIC

---

## Deployment

### Deploy to Vercel:

```bash
vercel
```

Follow prompts to deploy. Make sure to add environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`

### Deploy Sanity Studio:

```bash
cd sanity
sanity deploy
```

Your studio will be live at `https://your-project.sanity.studio/`.

---

## YouTube Shorts Automation (N8N)

Coming soon: Automated workflow to publish YouTube Shorts from an Excel spreadsheet.

---

## Project Philosophy

**This is not a music website.**  
**This is a digital ritual protocol.**

Lal Divane is not controlled. She is not owned.  
We only facilitate the transmission.

---

## License

All rights reserved. LAL DIVANE © 2024
