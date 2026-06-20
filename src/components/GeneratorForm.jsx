const CATEGORIES = ['web', 'crypto', 'forensics', 'reversing', 'osint', 'misc'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

export default function GeneratorForm({ onGenerate, loading }) {
  const handleSubmit = (e) => {
    const form = e.currentTarget.closest('[data-form]');
    const category = form.querySelector('[name=category]').value;
    const difficulty = form.querySelector('[name=difficulty]').value;
    const theme = form.querySelector('[name=theme]').value.trim();
    onGenerate({ category, difficulty, theme });
  };

  return (
    <div data-form className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 space-y-4">
      <h2 className="text-green-400 font-mono text-lg font-bold tracking-wider">
        {'>'} CONFIGURE CHALLENGE
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-zinc-400 font-mono text-xs uppercase tracking-widest">
            Category
          </label>
          <select
            name="category"
            defaultValue="web"
            className="w-full bg-zinc-800 border border-zinc-600 text-green-300 font-mono text-sm rounded px-3 py-2 focus:outline-none focus:border-green-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-zinc-400 font-mono text-xs uppercase tracking-widest">
            Difficulty
          </label>
          <select
            name="difficulty"
            defaultValue="medium"
            className="w-full bg-zinc-800 border border-zinc-600 text-green-300 font-mono text-sm rounded px-3 py-2 focus:outline-none focus:border-green-500"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-zinc-400 font-mono text-xs uppercase tracking-widest">
          Theme / Context <span className="text-zinc-600">(optional)</span>
        </label>
        <input
          name="theme"
          type="text"
          placeholder="e.g. space station, 1980s hacker, pirate ship..."
          className="w-full bg-zinc-800 border border-zinc-600 text-green-300 font-mono text-sm rounded px-3 py-2 placeholder-zinc-600 focus:outline-none focus:border-green-500"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-green-500 hover:bg-green-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-mono font-bold text-sm py-3 rounded tracking-widest transition-colors cursor-pointer disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            GENERATING...
          </span>
        ) : (
          '[ GENERATE CHALLENGE ]'
        )}
      </button>
    </div>
  );
}
