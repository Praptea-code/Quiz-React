import { useState, useEffect } from 'react';
import { TopBar, PageBody, SectionTitle, AnswerBox, ActionRow } from '../components/UI';
import { useTimer } from '../hooks/useTimer';
import { beep } from '../hooks/useAudio';
import { projSend } from './SetupScreen';

// Team selection
export function RapidSelectScreen({ teams, scores, onStart }) {
  const [selected, setSelected] = useState(null); // index of team currently "on deck"

  // We'll run each team one by one; select which team goes first
  const [order, setOrder] = useState([]); // order of teams to run

  const toggle = (i) => {
    setOrder(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  const COLORS = [
    'border-cyan-500/50 text-cyan-400 bg-cyan-500/10',
    'border-orange-500/50 text-orange-400 bg-orange-500/10',
    'border-green-500/50 text-green-400 bg-green-500/10',
    'border-purple-500/50 text-purple-400 bg-purple-500/10',
  ];

  return (
    <div className="flex flex-col h-screen">
      <TopBar title="ROUND 3 — RAPID FIRE" scores={scores} teams={teams} />
      <PageBody center>
        <SectionTitle sub="Select teams to compete. Each team gets their own 3-minute rapid fire session.">
          SELECT TEAMS
        </SectionTitle>

        <div className="grid grid-cols-2 gap-3 max-w-md w-full">
          {teams.map((name, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`py-6 rounded-xl border-2 font-orbitron text-base font-bold transition-all duration-150
                ${order.includes(i) ? COLORS[i] + ' scale-105' : 'border-gray-700 text-gray-500 bg-transparent hover:border-gray-500'}
              `}
            >
              {order.includes(i) && <span className="mr-2">#{order.indexOf(i) + 1}</span>}
              {name}
            </button>
          ))}
        </div>

        <div className="text-gray-500 text-xs font-rajdhani tracking-widest">
          Selected order: {order.length === 0 ? 'none' : order.map(i => teams[i]).join(' → ')}
        </div>

        <button
          className={`btn-neon btn-green text-base py-3 px-10 ${order.length < 2 ? 'opacity-40 cursor-not-allowed' : ''}`}
          disabled={order.length < 2}
          onClick={() => onStart(order)}
        >
          ▶ START RAPID FIRE
        </button>
      </PageBody>
    </div>
  );
}

// Rapid fire for a single team
export function RapidFireScreen({ teams, scores, teamIdx, questions, teamRFScore, onPoint, onNext, onDone, showAnswer, onShowAnswer, currentQIdx }) {
  const { seconds, urgency, start, stop } = useTimer(180);

  useEffect(() => {
    start(
      180,
      (rem) => { if (rem <= 30) beep('tick'); },
      () => {
        beep('timeout');
        projSend({ type: 'timeout' });
        onDone();
      }
    );
    projSend({
      type: 'rapidFire',
      team1: teams[teamIdx],
      team2: '',
      scores: teams.map((n, i) => ({ name: n, score: scores[i] })),
    });
  }, [teamIdx]);

  useEffect(() => {
    if (questions[currentQIdx]) {
      projSend({ type: 'rapidQuestion', question: questions[currentQIdx].q });
    }
  }, [currentQIdx]);

  const mins = Math.floor(seconds / 60);
  const secs = String(seconds % 60).padStart(2, '0');
  const timerColor = urgency === 'danger' ? 'text-red-500 text-glow-red animate-danger'
                   : urgency === 'warn' ? 'text-yellow-400 text-glow-gold'
                   : 'text-green-400 text-glow-green';

  const COLORS = ['text-cyan-400','text-orange-400','text-green-400','text-purple-400'];
  const BG = ['bg-cyan-500/10 border-cyan-500/30','bg-orange-500/10 border-orange-500/30',
              'bg-green-500/10 border-green-500/30','bg-purple-500/10 border-purple-500/30'];

  const handlePoint = () => {
    beep('correct');
    onPoint();
  };

  const handleDone = () => { stop(); onDone(); };

  const q = questions[currentQIdx];

  return (
    <div className="flex flex-col h-screen">
      <TopBar title="ROUND 3 — RAPID FIRE" scores={scores} teams={teams}>
        <div className={`font-orbitron text-2xl font-black ${timerColor}`}>{mins}:{secs}</div>
      </TopBar>
      <PageBody>
        <div className="w-full max-w-2xl flex flex-col gap-4">
          {/* Team header */}
          <div className={`flex items-center justify-between rounded-xl border p-4 ${BG[teamIdx]}`}>
            <div>
              <div className="font-orbitron text-xs text-gray-500 tracking-widest mb-1">NOW UP</div>
              <div className={`font-orbitron text-2xl font-black ${COLORS[teamIdx]}`}>{teams[teamIdx]}</div>
            </div>
            <div className="text-right">
              <div className="font-orbitron text-xs text-gray-500 tracking-widest mb-1">POINTS THIS ROUND</div>
              <div className={`font-orbitron text-4xl font-black ${COLORS[teamIdx]}`}>{teamRFScore}</div>
            </div>
          </div>

          {/* Question */}
          {q && (
            <div className="panel p-6 text-xl leading-relaxed font-medium text-gray-100 min-h-24 flex items-center">
              {q.q}
            </div>
          )}

          {/* Answer */}
          <div className="flex items-center gap-3">
            <button className="btn-neon btn-ghost text-xs py-2 px-4" onClick={onShowAnswer}>
              👁 {showAnswer ? 'HIDE ANSWER' : 'SHOW ANSWER'}
            </button>
          </div>
          <AnswerBox answer={q?.a} visible={showAnswer} />

          {/* Actions */}
          <ActionRow>
            <button className="btn-neon btn-green flex-1 py-4" onClick={handlePoint}>
              ✓ CORRECT +10
            </button>
            <button className="btn-neon btn-ghost flex-1" onClick={onNext}>
              ⟶ NEXT Q
            </button>
          </ActionRow>

          <button className="btn-neon btn-red text-xs py-2 px-4 self-end" onClick={handleDone}>
            ⏹ END THIS TEAM'S TURN
          </button>
        </div>
      </PageBody>
    </div>
  );
}

// Between teams — show results and prep next
export function RapidFireHandoffScreen({ teams, doneTeams, nextTeamIdx, onNext, scores }) {
  return (
    <div className="flex flex-col h-screen">
      <TopBar title="ROUND 3 — RAPID FIRE" scores={scores} teams={teams} />
      <PageBody center>
        <div className="font-orbitron text-4xl mb-2">⏱</div>
        <div className="font-orbitron text-2xl font-bold text-white tracking-wide text-center mb-6">
          ROUND DONE!
        </div>
        <div className="flex flex-col gap-3 w-full max-w-sm mb-8">
          {doneTeams.map(({ teamIdx, rfScore }, i) => (
            <div key={i} className="panel flex items-center justify-between px-5 py-3">
              <span className="font-rajdhani font-bold text-gray-300">{teams[teamIdx]}</span>
              <span className="font-orbitron text-xl font-black text-yellow-400">{rfScore} pts</span>
            </div>
          ))}
        </div>
        {nextTeamIdx !== null ? (
          <>
            <div className="text-gray-400 font-rajdhani tracking-widest text-sm mb-4">NEXT UP:</div>
            <div className={`font-orbitron text-3xl font-black mb-6 ${['text-cyan-400','text-orange-400','text-green-400','text-purple-400'][nextTeamIdx]}`}>
              {teams[nextTeamIdx]}
            </div>
            <button className="btn-neon btn-cyan text-base py-3 px-10" onClick={onNext}>
              ▶ START {teams[nextTeamIdx]}'S TURN
            </button>
          </>
        ) : (
          <button className="btn-neon btn-gold text-base py-3 px-10" onClick={onNext}>
            ✓ ROUND COMPLETE
          </button>
        )}
      </PageBody>
    </div>
  );
}
