import { useState } from 'react';

export default function SolutionToggle({ solution }) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-2">
      <h3 className="text-zinc-400 font-mono text-xs uppercase tracking-widest">Solution</h3>
      {!show ? (
        <button
          onClick={() => setShow(true)}
          className="w-full border border-dashed border-red-800 hover:border-red-600 rounded p-3 text-left transition-colors group cursor-pointer"
        >
          <p className="text-red-600 group-hover:text-red-400 font-mono text-xs uppercase tracking-wider">
            ⚠ Don&apos;t reveal until you&apos;ve tried!
          </p>
          <p className="text-zinc-600 font-mono text-xs mt-1">Click to show solution walkthrough</p>
        </button>
      ) : (
        <div className="bg-zinc-800 border border-red-900 rounded p-4 space-y-2">
          <p className="text-red-400 font-mono text-xs uppercase tracking-wider">Solution Walkthrough</p>
          <p className="text-zinc-300 font-mono text-sm whitespace-pre-wrap leading-relaxed">{solution}</p>
        </div>
      )}
    </div>
  );
}
