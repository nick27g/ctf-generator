# CLAUDE.md — CTF Challenge Generator

## What This Project Is
A React/Vite app that generates complete, playable Capture The Flag security
challenges on demand using the Anthropic API. Users pick category, difficulty,
and an optional theme. Claude returns a full challenge with progressive hints
and a solution walkthrough.

Portfolio project for Nick Agin (github.com/nick27g), targeting an
AI-Enabled Solutions Developer role at HII Mission Technologies.

---

## Status: COMPLETE ✓
Live at: https://ctf-generator-beta.vercel.app

---

## Current Goal
> **DONE. All MVP features shipped and deployed.**

---

## Stack
| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | React + Vite | Lightweight, single-page |
| API proxy | Vercel Serverless Function (`/api/generate.js`) | Keeps API key server-side |
| AI | Anthropic API, `claude-sonnet-4-6` | Core feature |
| Styling | Tailwind CSS v4 -- dark theme, terminal aesthetic | Fits CTF culture |
| Deploy | Vercel | Auto-deploy, free tier |

---

## Project Structure
```
ctf-generator/
├── api/
│   └── generate.js          # Vercel Function -- Anthropic call lives here
├── src/
│   ├── App.jsx
│   ├── components/
│   │   ├── GeneratorForm.jsx    # Category, difficulty, theme inputs
│   │   ├── ChallengeCard.jsx    # The generated challenge display
│   │   ├── HintReveal.jsx       # Progressive hint reveal (3 hints)
│   │   └── SolutionToggle.jsx   # Hidden solution walkthrough
│   └── main.jsx
├── .env
├── .env.example
├── .gitignore
└── vite.config.js
```

---

## Environment Variables
```
# .env
ANTHROPIC_API_KEY=your_key_here

# Vercel dashboard: Project → Settings → Environment Variables
```

---

## Vercel Function Design
- Model: `claude-sonnet-4-6`
- `max_tokens: 2000` (raised from 1200 to prevent cut-off responses)
- Markdown fence stripping applied before `JSON.parse` — Claude sometimes wraps
  output in ```json fences despite instructions. Regex: strip leading ```json\n
  and trailing \n```.
- Raw response logged via `console.log` for debugging in Vercel Function logs.

---

## Challenge JSON Schema
```ts
interface Challenge {
  title: string;
  description: string;
  points: number;
  flag: string;          // Always CTF{...}
  hints: [string, string, string];
  solution: string;      // Concise, 3-4 steps, no code blocks
}
```

---

## Categories and What Claude Generates
| Category | What it generates |
|----------|-------------------|
| web | SQL injection, XSS, IDOR, auth bypass scenarios |
| crypto | Caesar, XOR, RSA basics, encoding chains |
| forensics | Steganography/file carving scenarios (text-based, no actual files) |
| reversing | Pseudocode or binary description to analyze (text-based) |
| osint | Fictional persona research scenarios |
| misc | Logic puzzles, encoding, trivia |

---

## UI / UX Notes
- Dark theme. Monospace font for challenge text and flag. Terminal aesthetic.
- Hints hidden behind "Reveal Hint 1/2/3" buttons -- each click reveals next.
- Flag hidden by default. "Reveal Flag" button shows it.
- Solution hidden behind a toggle. Clear warning: "Don't click until you've tried."
- Copy button on the challenge description.
- Loading spinner while Claude generates.

---

## MVP Features
- [x] Category selector
- [x] Difficulty selector
- [x] Optional theme input
- [x] Generate button → POST to `/api/generate`
- [x] Challenge card with title, description, points
- [x] Progressive hint reveal (3 hints)
- [x] Solution toggle
- [x] Reveal Flag button
- [x] Copy challenge button
- [x] Loading and error states

---

## Key Rules
- API key server-side only in the Vercel Function.
- Parse Claude's JSON in try/catch -- if it fails, show a retry message.
- Markdown fence stripping before parse (fence-stripping fix shipped).
- No `<form>` tags. Use onClick handlers.

---

## Local Dev
```bash
npm install
vercel dev   # serves both Vite frontend and /api/generate at localhost:3000
```

---

## Deploy
```bash
vercel --prod
```
Add `ANTHROPIC_API_KEY` in Vercel dashboard before first deploy.

---

## Known Limitations
- Forensics/reversing categories can't generate actual files -- challenges
  are text-scenario based.
- Claude occasionally wraps JSON in markdown fences; fence-stripping handles
  this but an occasional retry may still be needed.
- No persistence -- generated challenges are lost on page refresh.
