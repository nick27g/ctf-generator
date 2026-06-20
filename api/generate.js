import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { category, difficulty, theme } = req.body;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const themeClause = theme ? `Theme/context: ${theme}.` : '';

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
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
- solution should be concise, maximum 3-4 steps, no code blocks
- description contains all info needed
- points: easy=100, medium=250, hard=500`,
    messages: [{
      role: 'user',
      content: `Category: ${category}\nDifficulty: ${difficulty}`
    }],
  });

  const raw = message.content[0].text;
  console.log('[generate] raw response:', raw);

  try {
    const stripped = raw.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/, '').trim();
    const challenge = JSON.parse(stripped);
    res.json({ challenge });
  } catch {
    res.status(500).json({ error: 'Failed to parse challenge. Try again.' });
  }
}
