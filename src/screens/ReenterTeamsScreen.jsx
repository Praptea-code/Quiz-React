import { useState } from 'react';

const TEAM_COLORS = ['text-cyan-400', 'text-orange-400', 'text-green-400', 'text-purple-400'];
const TEAM_DOT = ['bg-cyan-400', 'bg-orange-400', 'bg-green-400', 'bg-purple-400'];
const TEAM_BORDER = ['border-cyan-500/30', 'border-orange-500/30', 'border-green-500/30', 'border-purple-500/30'];

export function ReenterTeamsScreen({ currentTeams, roundLabel, onConfirm }) {
  const [names, setNames] = useState([...currentTeams]);
  const update = (i, v) => setNames(n => { const a = [...n]; a[i] = v; return a; });

  return (
    <div className="min-h-screen grid-bg flex flex-col items-center justify-center p-6 gap-8">
      <div className="text-center">
        <div className="font-orbitron text-xs tracking-widest text-cyan-500 mb-3">{roundLabel}</div>
        <h2 className="font-orbitron text-3xl font-black text-white tracking-wider">CONFIRM TEAM NAMES</h2>
        <p className="text-gray-500 font-rajdhani mt-2 tracking-wider text-sm">
          Update names if needed — these will carry through for this round.
        </p>
      </div>

      <div className="panel w-full max-w-lg p-6">
        <div className="grid grid-cols-2 gap-4">
          {names.map((n, i) => (
            <div key={i} className="flex flex-col gap-2">
              <label className={`font-rajdhani font-semibold text-sm tracking-wide ${TEAM_COLORS[i]} flex items-center gap-2`}>
                <span className={`w-2.5 h-2.5 rounded-full ${TEAM_DOT[i]}`} />
                Team {i + 1}
              </label>
              <input
                className={`neon-input border ${TEAM_BORDER[i]}`}
                value={n}
                onChange={e => update(i, e.target.value)}
                onKeyDown={e => e.key === 'Enter' && onConfirm(names.map((nm, idx) => nm.trim() || `Team ${idx + 1}`))}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        className="btn-neon btn-cyan text-base py-3 px-10"
        onClick={() => onConfirm(names.map((n, i) => n.trim() || `Team ${i + 1}`))}
      >
        CONFIRM & START →
      </button>
    </div>
  );
}
