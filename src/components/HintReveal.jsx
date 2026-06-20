import { useState } from 'react';

export default function HintReveal({ hints }) {
  const [revealed, setRevealed] = useState(0);

  return (
    <div className="space-y-3">
      <h3 className="text-zinc-400 font-mono text-xs uppercase tracking-widest">Hints</h3>
      <div className="space-y-2">
        {hints.map((hint, i) => (
          <div key={i}>
            {i < revealed ? (
              <div className="bg-zinc-800 border border-yellow-800 rounded p-3">
                <span className="text-yellow-400 font-mono text-xs uppercase tracking-wider mr-2">
                  Hint {i + 1}:
                </span>
                <span className="text-zinc-300 font-mono text-sm">{hint}</span>
              </div>
            ) : i === revealed ? (
              <button
                onClick={() => setRevealed(i + 1)}
                className="w-full border border-dashed border-yellow-700 hover:border-yellow-500 text-yellow-600 hover:text-yellow-400 font-mono text-xs py-2 px-3 rounded text-left transition-colors cursor-pointer"
              >
                {'>> '} Reveal Hint {i + 1}
              </button>
            ) : (
              <div className="border border-dashed border-zinc-700 text-zinc-600 font-mono text-xs py-2 px-3 rounded opacity-40">
                {'>> '} Hint {i + 1} (locked)
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
