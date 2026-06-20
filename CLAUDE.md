# CLAUDE.md — CTF Challenge Generator

## What This Project Is
A React/Vite app that generates complete, playable Capture The Flag security
challenges on demand using the Anthropic API. Users pick category, difficulty,
and an optional theme. Claude returns a full challenge with progressive hints
and a solution walkthrough.

Portfolio project for Nick Agin (github.com/nick27g), targeting an
AI-Enabled Solutions Developer role at HII Mission Technologies.

---

## Current Goal
> **Build the generator UI, wire up Vercel Function, nail the prompt, deploy.**

---

## Stack
| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | React + Vite | Lightweight, single-page |
| API proxy | Vercel Serverless Function (`/api/generate.js`) | Keeps API key server-side |
| AI | Anthropic API, Claude Sonnet (`claude-sonnet-4-20250514`) | Core feature |
| Styling | Tailwind CSS -- dark theme, terminal aesthetic | Fits CTF culture |
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

```js
// api/generate.js
import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { category, difficulty, theme } = req.body;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const themeClause = theme ? `Theme/context: ${theme}.` : '';

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1200,
    system: `You are a CTF challenge author writing for a real security competition.
Generate a complete, solvable challenge. The challenge must be self-contained --
all information needed to solve it is present in the description.

${themeClause}

Return ONLY valid JSON matching this exact schema, no other text, no markdown:
{
  "title": "string",
  "description": "string",
  "points": number,
  "flag": "CTF{string}",
  "hints": ["string", "string", "string"],
  "solution": "string"
}

Rules:
- Flag must be in CTF{...} format
- hints[0] is vague, hints[1] is more specific, hints[2] nearly gives it away
- solution is a complete step-by-step walkthrough
- description contains all info needed -- no references to files that don't exist
  EXCEPTION: forensics and reversing may describe a fictional file/binary since
  actual files cannot be generated; write the challenge so clues are embedded
  in the description text itself
- points: easy=100, medium=250, hard=500`,
    messages: [{
      role: 'user',
      content: `Category: ${category}\nDifficulty: ${difficulty}`
    }],
  });

  try {
    const challenge = JSON.parse(message.content[0].text);
    res.json({ challenge });
  } catch {
    res.status(500).json({ error: 'Failed to parse challenge. Try again.' });
  }
}
```

---

## Challenge JSON Schema
```ts
interface Challenge {
  title: string;
  description: string;
  points: number;
  flag: string;          // Always CTF{...}
  hints: [string, string, string];
  solution: string;
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
- Loading state while Claude generates (show a spinner or skeleton card).

---

## MVP Features
- [ ] Category selector
- [ ] Difficulty selector
- [ ] Optional theme input
- [ ] Generate button → POST to `/api/generate`
- [ ] Challenge card with title, description, points
- [ ] Progressive hint reveal (3 hints)
- [ ] Solution toggle
- [ ] Reveal Flag button
- [ ] Copy challenge button
- [ ] Loading and error states

---

## Key Rules
- API key server-side only in the Vercel Function.
- Parse Claude's JSON in try/catch -- if it fails, show a retry message.
- Don't trust that Claude always returns valid JSON on the first attempt.
  Consider a retry on parse failure before showing the error to the user.
- No `<form>` tags. Use onClick handlers.

---

## Local Dev
```bash
npm install
npm run dev
# Vite runs at http://localhost:5173
# To test the Vercel Function: npm install -g vercel && vercel dev
```

---

## Deploy
```bash
vercel
```
Add `ANTHROPIC_API_KEY` in Vercel dashboard before first deploy.

---

## Known Limitations
- Forensics/reversing categories can't generate actual files -- challenges
  are text-scenario based. Documented in README.
- Claude occasionally generates a flag that isn't solvable from the description
  alone -- retry usually fixes this
- No persistence -- generated challenges are lost on page refresh (localStorage
  is a stretch goal)

---

## README Checklist (produce at end of project)
- [ ] What it does + live URL
- [ ] How the prompt produces consistent, solvable challenges
- [ ] Forensics/reversing limitation explanation
- [ ] How difficulty changes output
- [ ] How to run locally
- [ ] Known limitations
- [ ] Interview talking point: built to be genuinely playable
