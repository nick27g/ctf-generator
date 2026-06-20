import { useState } from 'react';
import HintReveal from './HintReveal.jsx';
import SolutionToggle from './SolutionToggle.jsx';

export default function ChallengeCard({ challenge }) {
  const [flagVisible, setFlagVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(challenge.description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const difficultyColor = {
    100: 'text-green-400 border-green-800',
    250: 'text-yellow-400 border-yellow-800',
    500: 'text-red-400 border-red-800',
  }[challenge.points] ?? 'text-zinc-400 border-zinc-700';

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-green-400 font-mono text-xl font-bold">{challenge.title}</h2>
        </div>
        <div className={`border rounded px-3 py-1 font-mono text-sm font-bold ${difficultyColor}`}>
          {challenge.points} pts
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-zinc-400 font-mono text-xs uppercase tracking-widest">Description</h3>
          <button
            onClick={handleCopy}
            className="text-zinc-500 hover:text-green-400 font-mono text-xs transition-colors cursor-pointer"
          >
            {copied ? '✓ Copied' : '[ Copy ]'}
          </button>
        </div>
        <div className="bg-zinc-800 border border-zinc-700 rounded p-4">
          <p className="text-zinc-200 font-mono text-sm whitespace-pre-wrap leading-relaxed">
            {challenge.description}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-zinc-400 font-mono text-xs uppercase tracking-widest">Flag</h3>
        {flagVisible ? (
          <div className="bg-zinc-800 border border-green-900 rounded p-3 flex items-center justify-between gap-2">
            <code className="text-green-400 font-mono text-sm break-all">{challenge.flag}</code>
            <button
              onClick={() => setFlagVisible(false)}
              className="text-zinc-600 hover:text-zinc-400 font-mono text-xs shrink-0 cursor-pointer"
            >
              Hide
            </button>
          </div>
        ) : (
          <button
            onClick={() => setFlagVisible(true)}
            className="w-full border border-dashed border-green-800 hover:border-green-500 text-green-700 hover:text-green-400 font-mono text-xs py-2 px-3 rounded text-left transition-colors cursor-pointer"
          >
            {'>> '} Reveal Flag
          </button>
        )}
      </div>

      <HintReveal hints={challenge.hints} />
      <SolutionToggle solution={challenge.solution} />
    </div>
  );
}
