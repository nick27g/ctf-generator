# CTF Challenge Generator

A web app that uses Claude AI to generate complete, playable Capture The Flag security challenges on demand. Pick a category, difficulty, and optional theme, and get a self-contained challenge with progressive hints, a flag, and a solution walkthrough — no setup required.

**Live demo:** https://ctf-generator-beta.vercel.app

---

## Stack

| Layer | Choice | Why |
|-------|--------|-----|
| React + Vite | Frontend UI | Fast dev experience, minimal bundle, single-page with no routing needed |
| Tailwind CSS v4 | Styling | Utility-first, dark terminal aesthetic with almost no custom CSS |
| Vercel Serverless Function | `/api/generate.js` | Keeps the Anthropic API key server-side; zero infrastructure to manage |
| Anthropic SDK (`claude-sonnet-4-6`) | AI generation | Best balance of speed, cost, and output quality for structured generation |

---

## How AI Is Integrated

The Vercel function sends a carefully structured system prompt to Claude that instructs it to act as a CTF challenge author and return **only** a JSON object — no prose, no explanation. The schema is spelled out verbatim in the prompt:

```json
{
  "title": "string",
  "description": "string",
  "points": 100 | 250 | 500,
  "flag": "CTF{string}",
  "hints": ["vague", "more specific", "nearly gives it away"],
  "solution": "string"
}
```

**Why structured JSON output matters:** The frontend can rely on a stable contract. Each field maps directly to a UI component — `hints` drives the progressive reveal, `flag` is hidden behind a button, `solution` is gated behind a warning toggle. If Claude returned free-form text, the UI would have no way to separate these pieces. Structured output turns the model into a deterministic data source rather than a black box.

The system prompt also enforces challenge quality rules: the flag must be derivable from the description alone, hints must escalate in specificity, and the solution must be concise (3–4 steps, no code blocks). The `difficulty` parameter controls point value and implicitly guides Claude toward simpler or more complex techniques.

One practical wrinkle: Claude occasionally wraps JSON output in markdown fences (` ```json `) despite being instructed not to. The function strips these with a regex before parsing, and logs the raw response to Vercel's function logs for debugging.

---

## How to Run Locally

```bash
# 1. Clone and install
git clone https://github.com/nick27g/ctf-generator.git
cd ctf-generator
npm install

# 2. Add your Anthropic API key
cp .env.example .env
# Edit .env and set ANTHROPIC_API_KEY=sk-ant-...

# 3. Start the dev server (Vercel CLI serves both frontend and /api/generate)
npm install -g vercel
vercel dev
```

Open http://localhost:3000.

> `vercel dev` is required (not `npm run dev`) because Vite alone won't proxy requests to `/api/generate`.

---

## Known Limitations

- **Web and forensics challenges reference fictional servers/files.** CTF challenges in these categories normally involve a live server to attack or a file to download. Since this app only generates text, web challenges describe a fictional vulnerable endpoint and forensics challenges describe a file with embedded clues — both are solvable from the description alone, but you can't actually "run" the exploit.

- **Occasional JSON parse errors.** Despite explicit instructions, Claude sometimes returns malformed JSON (extra commentary, nested fences). The function handles the common fence case automatically, but edge cases may still surface a "Try again" error. A second generation attempt always resolves it.

---

## What I'd Do With More Time

- **Docker challenge containers** — For web and reversing categories, spin up a real vulnerable service (e.g., a Flask app with a SQL injection) so challenges are actually exploitable, not just described.
- **Challenge history and saving** — Persist generated challenges to localStorage or a database so users can build a personal library and track which challenges they've solved.
- **Difficulty calibration** — Add automated validation that checks the flag appears solvable from the description before returning it to the frontend, retrying internally if not.
- **Export to CTFd** — Generate a ZIP importable into CTFd (the most common self-hosted CTF platform) so teams can use generated challenges in real competitions.

---

## Security

The Anthropic API key lives exclusively in the Vercel Serverless Function (`api/generate.js`) and is injected at runtime via an environment variable set in the Vercel dashboard. It is never bundled into the frontend, never returned in API responses, and never committed to the repository (`.env` is in `.gitignore`). The browser only ever calls `/api/generate` — it has no direct access to the Anthropic API or the key.
