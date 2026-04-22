import { useEffect } from 'react';
import { beep } from '../hooks/useAudio';
import { projSend } from './SetupScreen';

export function WinnerScreen({ teams, scores, winnerIdx, onPlayAgain }) {
  useEffect(() => {
    beep('fanfare');
    const sorted = [...teams.map((n, i) => ({ n, i, s: scores[i] }))].sort((a, b) => b.s - a.s);
    projSend({ type: 'winner', team: teams[winnerIdx], scores: sorted.map(t => ({ name: t.n, score: t.s })) });
  }, []);

  const sorted = [...teams.map((n, i) => ({ n, i, s: scores[i] }))].sort((a, b) => b.s - a.s);
  const medalColors = ['text-yellow-400 text-glow-gold', 'text-gray-300', 'text-orange-600', 'text-gray-500'];
  const medals = ['🥇', '🥈', '🥉', '4th'];

  return (
    <div className="min-h-screen grid-bg flex flex-col items-center justify-center gap-8 p-6 text-center">
      {/* Trophy */}
      <div className="text-8xl animate-float">🏆</div>

      {/* Champion label */}
      <div>
        <div className="font-orbitron text-xs tracking-[6px] text-gray-500 mb-3">CHAMPION</div>
        <h1 className="font-orbitron text-5xl font-black text-yellow-400 text-glow-gold tracking-wider">
          {teams[winnerIdx]}
        </h1>
      </div>

      {/* Confetti-like decorative elements */}
      <div className="flex gap-4 text-3xl">
        {['⭐','✨','🌟','⭐','✨'].map((e, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.3}s` }} className="animate-float">{e}</span>
        ))}
      </div>

      {/* Final scoreboard */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        {sorted.map((t, rank) => (
          <div
            key={t.i}
            className={`flex items-center gap-4 panel px-5 py-4 ${t.i === winnerIdx ? 'glow-gold border-yellow-400/40' : ''}`}
          >
            <span className="text-2xl w-8">{medals[rank]}</span>
            <span className="font-rajdhani font-bold text-lg flex-1 text-left text-gray-200">{t.n}</span>
            <span className="font-orbitron text-2xl font-black text-yellow-400">{t.s}</span>
          </div>
        ))}
      </div>

      <button className="btn-neon btn-cyan text-base py-3 px-10" onClick={onPlayAgain}>
        🔄 PLAY AGAIN
      </button>
    </div>
  );
}
