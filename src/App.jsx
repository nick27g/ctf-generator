import { useState } from 'react';
import GeneratorForm from './components/GeneratorForm.jsx';
import ChallengeCard from './components/ChallengeCard.jsx';

export default function App() {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async ({ category, difficulty, theme }) => {
    setLoading(true);
    setError(null);
    setChallenge(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, difficulty, theme }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error ?? 'Generation failed. Please try again.');
      }

      setChallenge(data.challenge);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
        <header className="space-y-1">
          <div className="text-green-400 font-mono text-xs tracking-widest">
            $ ./ctf-generator --interactive
          </div>
          <h1 className="text-green-400 font-mono text-3xl font-bold tracking-tight">
            CTF Challenge Generator
          </h1>
          <p className="text-zinc-500 font-mono text-sm">
            AI-powered security challenges, ready to play.
          </p>
        </header>

        <GeneratorForm onGenerate={handleGenerate} loading={loading} />

        {error && (
          <div className="bg-zinc-900 border border-red-800 rounded-lg p-4">
            <p className="text-red-400 font-mono text-sm">
              <span className="text-red-600 font-bold">ERROR:</span> {error}
            </p>
          </div>
        )}

        {challenge && <ChallengeCard challenge={challenge} />}
      </div>
    </div>
  );
}
