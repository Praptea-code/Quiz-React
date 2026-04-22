import { useState } from 'react';
import { PROJECTOR_HTML } from '../data/projector';

let projWin = null;

export function openProjector() {
  const blob = new Blob([PROJECTOR_HTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  projWin = window.open(url, 'QuizProjector', 'width=1280,height=720');
  if (!projWin) { alert('Please allow popups to open the projector window.'); return; }
  projWin.addEventListener('load', () => URL.revokeObjectURL(url));
}

export function projSend(data) {
  if (projWin && !projWin.closed) projWin.postMessage(JSON.stringify(data), '*');
}

const TEAM_PLACEHOLDERS = ['Thunderbolts', 'Cyber Wolves', 'Neon Eagles', 'Quantum Force'];
const TEAM_COLORS = ['text-cyan-400', 'text-orange-400', 'text-green-400', 'text-purple-400'];
const TEAM_DOT_COLORS = ['bg-cyan-400', 'bg-orange-400', 'bg-green-400', 'bg-purple-400'];
const TEAM_BORDER = ['border-cyan-500/30', 'border-orange-500/30', 'border-green-500/30', 'border-purple-500/30'];

export function SetupScreen({ onStart }) {
  const [names, setNames] = useState(['', '', '', '']);

  const update = (i, v) => setNames(n => { const a = [...n]; a[i] = v; return a; });
  const handleStart = () => {
    const teams = names.map((n, i) => n.trim() || `Team ${i + 1}`);
    onStart(teams);
  };

  return (
    <div className="min-h-screen grid-bg flex flex-col items-center justify-center p-6 gap-8">
      {/* Logo / Title */}
      <div className="text-center">
        {/* LOGO PLACEHOLDER — replace this div with an <img> tag */}
        <div className="w-20 h-20 rounded-2xl border-2 border-cyan-500/40 bg-cyan-500/5 flex items-center justify-center mx-auto mb-5 glow-cyan">
          <span className="font-orbitron text-xs text-cyan-500/70 text-center leading-tight">LOGO<br/>HERE</span>
        </div>
        <h1 className="font-orbitron text-5xl font-black text-cyan-400 text-glow-cyan tracking-widest mb-2">
          QUIZ ARENA
        </h1>
        <p className="text-gray-500 font-rajdhani text-lg tracking-widest">TECHNOLOGY CHAMPIONSHIP · QUIZMASTER CONSOLE</p>
      </div>

      {/* Projector notice */}
      <div className="panel w-full max-w-2xl p-4 flex items-start gap-4">
        <span className="text-2xl">📺</span>
        <div className="text-sm text-gray-400 leading-relaxed">
          <span className="text-cyan-400 font-semibold">Two-screen setup:</span> This tab is your Quizmaster view — it shows answers and controls.
          Open the <span className="text-cyan-400 font-semibold">Projector tab</span> separately and display that on your big screen.
          The audience sees only questions, timers, and scores — never the answers.
        </div>
      </div>

      {/* Team names */}
      <div className="panel w-full max-w-2xl p-6">
        <h3 className="font-orbitron text-sm font-bold text-gray-400 tracking-widest mb-5">ENTER TEAM NAMES</h3>
        <div className="grid grid-cols-2 gap-4">
          {names.map((n, i) => (
            <div key={i} className="flex flex-col gap-2">
              <label className={`font-rajdhani font-semibold text-sm tracking-wide ${TEAM_COLORS[i]} flex items-center gap-2`}>
                <span className={`w-2.5 h-2.5 rounded-full ${TEAM_DOT_COLORS[i]}`} />
                Team {i + 1}
              </label>
              <input
                className={`neon-input border ${TEAM_BORDER[i]}`}
                placeholder={TEAM_PLACEHOLDERS[i]}
                value={n}
                onChange={e => update(i, e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleStart()}
              />
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-4 flex-wrap justify-center">
        <button className="btn-neon btn-cyan text-base py-3 px-8" onClick={handleStart}>
          START GAME →
        </button>
        <button className="btn-neon btn-ghost" onClick={openProjector}>
          📺 OPEN PROJECTOR
        </button>
      </div>
    </div>
  );
}
