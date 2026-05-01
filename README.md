# DSA Playground

A premium, production-grade React SPA to browse your solved DSA problems.

## Tech Stack
- React 18 + Vite
- React Router v6
- react-markdown + rehype-raw
- react-syntax-highlighter (Prism)
- Google Fonts: Syne, DM Sans, DM Mono
- No CSS frameworks — pure CSS variables

---

## Setup (Local)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
```

Open http://localhost:5173

---

## Deploy to Vercel

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel
```
Follow the prompts. Vercel auto-detects Vite.

### Option B — Vercel Dashboard
1. Push this folder to a GitHub repo
2. Go to https://vercel.com → New Project
3. Import your repo
4. Settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Framework Preset: Vite
5. Click Deploy

The included `vercel.json` handles SPA routing automatically.

---

## Folder Structure

```
dsa-playground/
├── public/
│   ├── favicon.svg
│   └── data/                  ← All problem data goes here
│       ├── stats.json
│       ├── 0001-two-sum/
│       │   ├── README.md
│       │   ├── 0001-two-sum.cpp
│       │   └── 0001-two-sum.java
│       └── ... (all other problems)
├── src/
│   ├── main.jsx
│   └── App.jsx                ← All logic lives here
├── index.html
├── vite.config.js
├── vercel.json
└── package.json
```

---

## Adding New Problems

1. Create a folder inside `public/data/` named `{id}-{slug}`
2. Add `README.md` and solution files (`*.cpp`, `*.java`, `*.js`, `*.py`)
3. Update `public/data/stats.json` with the new entry under `leetcode.shas`

The app dynamically fetches everything — no code changes needed.

---

## Features

- Dark / Light mode (persisted to localStorage)
- Search by title or problem ID
- Filter by difficulty (Easy / Medium / Hard)
- Syntax-highlighted code viewer with tabs per language
- One-click copy to clipboard
- Smooth animations and premium hover states
- Fully responsive
- SPA routing with no refresh issues on Vercel
