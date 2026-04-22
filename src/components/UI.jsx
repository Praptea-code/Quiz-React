import { useEffect, useState } from 'react';

export const TEAM_COLORS = ['#00f5ff', '#ff6b35', '#00ff88', '#b347ff'];
export const TEAM_NAMES_CSS = ['team-0', 'team-1', 'team-2', 'team-3'];

// Top bar
export function TopBar({ title, scores, teams, children, onProjector }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-cyan-500/20 bg-[#050812]/90 backdrop-blur-sm flex-wrap gap-3 shrink-0">
      <div className="font-orbitron text-base font-bold text-cyan-400 tracking-widest text-glow-cyan">{title}</div>
      <div className="flex items-center gap-3 flex-wrap">
        {scores && teams && teams.map((name, i) => (
          <ScoreChip key={i} name={name} score={scores[i]} teamIdx={i} />
        ))}
        {children}
        {onProjector && (
          <button className="btn-neon btn-ghost text-xs py-2 px-3" onClick={onProjector}>
            📺 Projector
          </button>
        )}
      </div>
    </div>
  );
}

// Score chip
export function ScoreChip({ name, score, teamIdx }) {
  const borderColors = ['border-cyan-500/40', 'border-orange-500/40', 'border-green-400/40', 'border-purple-500/40'];
  const valColors = ['text-cyan-400', 'text-orange-400', 'text-green-400', 'text-purple-400'];
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0d1428] border ${borderColors[teamIdx]} text-sm font-semibold`}>
      <span className="text-gray-300">{name}</span>
      <span className={`font-orbitron text-base font-bold ${valColors[teamIdx]}`}>{score}</span>
    </div>
  );
}

// Timer circle
export function TimerCircle({ seconds, urgency, size = 'md' }) {
  const sizes = { sm: 'w-14 h-14 text-xl', md: 'w-20 h-20 text-2xl', lg: 'w-28 h-28 text-4xl' };
  const colors = {
    ok: 'border-cyan-400 text-cyan-400',
    warn: 'border-yellow-400 text-yellow-400',
    danger: 'border-red-500 text-red-500 animate-danger'
  };
  return (
    <div className={`${sizes[size]} rounded-full border-4 ${colors[urgency]} flex items-center justify-center font-orbitron font-black shrink-0`}>
      {seconds}
    </div>
  );
}

// Result flash overlay
export function ResultFlash({ result, onDone }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 200); }, 1200);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;
  const isCorrect = result === 'correct';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-black/30">
      <div className={`animate-zoom-bounce px-16 py-8 rounded-2xl font-orbitron text-5xl font-black border-4 ${
        isCorrect
          ? 'bg-green-500/15 border-green-400 text-green-400 glow-green'
          : 'bg-red-500/15 border-red-500 text-red-400 glow-red'
      }`}>
        {isCorrect ? '✓ CORRECT!' : '✗ WRONG'}
      </div>
    </div>
  );
}

// Answer reveal box
export function AnswerBox({ answer, visible }) {
  if (!visible) return null;
  return (
    <div className="animate-slide-up bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 text-cyan-300 font-medium">
      <span className="text-cyan-500 font-orbitron text-xs font-bold tracking-widest mr-2">ANSWER:</span>
      {answer}
    </div>
  );
}

// Section heading
export function SectionTitle({ children, sub }) {
  return (
    <div className="text-center">
      <h2 className="font-orbitron text-2xl font-bold text-white tracking-wider">{children}</h2>
      {sub && <p className="text-gray-400 text-sm mt-1">{sub}</p>}
    </div>
  );
}

// Pass chain display
export function PassChain({ chain, teams, currentIdx, passedToAudience }) {
  return (
    <div className="flex items-center gap-2 flex-wrap bg-[#0d1428] border border-cyan-500/15 rounded-xl px-4 py-3">
      {chain.map((ti, i) => {
        const isCurrent = !passedToAudience && i === currentIdx;
        const isDone = passedToAudience ? true : i < currentIdx;
        const colors = ['text-cyan-400 border-cyan-500/50 bg-cyan-500/10',
                        'text-orange-400 border-orange-500/50 bg-orange-500/10',
                        'text-green-400 border-green-500/50 bg-green-500/10',
                        'text-purple-400 border-purple-500/50 bg-purple-500/10'];
        return (
          <div key={i} className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full border text-xs font-bold font-rajdhani tracking-wide transition-all ${
              isCurrent ? `${colors[ti]} scale-110` : isDone ? 'text-gray-600 border-gray-700 bg-transparent line-through' : 'text-gray-500 border-gray-700 bg-transparent'
            }`}>
              {teams[ti]}
            </div>
            {i < chain.length - 1 && <span className="text-gray-600 text-sm">→</span>}
          </div>
        );
      })}
      {passedToAudience && (
        <>
          <span className="text-gray-600 text-sm">→</span>
          <div className="px-3 py-1 rounded-full border border-yellow-500/50 bg-yellow-500/10 text-yellow-400 text-xs font-bold font-rajdhani tracking-wide scale-110">
            📣 AUDIENCE
          </div>
        </>
      )}
    </div>
  );
}

// Action button row
export function ActionRow({ children }) {
  return <div className="flex gap-3 flex-wrap">{children}</div>;
}

// Page body wrapper
export function PageBody({ children, center = false }) {
  return (
    <div className={`flex-1 overflow-y-auto p-6 flex flex-col gap-5 ${center ? 'items-center justify-center' : 'items-center'}`}>
      {children}
    </div>
  );
}
