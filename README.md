# LAL DIVANE // DIGITAL RITUAL PROTOCOL 🛰️🌑

> **"Anatolian decay meets digital lament. A ritual encoded in the fiber of the void."**

`LalRitualsWeb` is the core narrative and ritualistic interface for the **Lal Divane** project. It serves as a digital bridge between traditional Anatolian emotional landscapes and futuristic machine-driven aesthetics.

## 🌌 The Concept

Lal Divane is an AI-driven artistic entity that processes melancholy as data. This web interface is not just a portal but a "transmission terminal" where rituals (songs) and lore (narratives) are decoded for the observer.

---

## 🛠️ Technical Architecture

### Core Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **CMS:** [Sanity.io](https://www.sanity.io/) (Headless Content Management)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Audio:** Web Audio API for custom visualizations.

### Key Features

- **VoidPlayer:** A custom-built audio player with real-time waveform visualization and synced lyrics transmission.
- **Lore System:** A dynamic grid of "narrative data packets" fetched from Sanity CMS, building a non-linear story.
- **Rituals Index:** A complete archive of all transmissions, filterable by their emotional phase (e.g., _INITIALIZING_VOID_, _ANATOLIAN_DECAY_).
- **CMS Driven:** Every piece of content—from site titles and social links to song lyrics and manifesto texts—is manageable via Sanity Studio.

---

## 🚀 Getting Started

### 1. Environment Variables

Create a `.env.local` file in the root directory and add your Sanity credentials:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID="your_project_id"
NEXT_PUBLIC_SANITY_DATASET="Your Dataset"
NEXT_PUBLIC_SANITY_API_VERSION="Your API Version"
SANITY_API_TOKEN="your_token"
```

### 2. Installations

```bash
npm install
```

### 3. Data Migration

To seed the initial data from the static files to Sanity:

```bash
node scripts/migrate.js
```

### 4. Run Development Server

```bash
npm run dev
```

---

## 🌑 Aesthetic Guidelines

The project follows a strict **"Terminal-Void"** design system:

- **Palette:** `Void Deep (#020202)`, `Crimson (#C0003F)`, `Soft Text (#E0E0E0)`.
- **Typography:** Display fonts for ritual titles, Monospace/Terminal fonts for technical data.
- **Interactions:** Subtle glitch effects, smooth section transitions, and backdrop blurs.

---

## 🇹🇷 Proje Özeti (Türkçe)

Lal Divane, Anadolu tınılarını dijital bir ağıtla birleştiren yapay zeka temelli bir sanal sanatçıdır. Bu web sitesi, sanatçının şarkılarını (Ritüeller), hikayesini (Lore) ve manifestosunu teknik bir terminal estetiğiyle sunar.

---

## 📜 License

System origin: Unknown. This protocol is active and stable.

© 2026 LAL DIVANE DIGITAL PROTOCOL.
