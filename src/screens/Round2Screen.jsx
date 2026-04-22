import { useState, useEffect } from 'react';
import { TopBar, PageBody, TimerCircle, AnswerBox, ActionRow } from '../components/UI';
import { useTimer } from '../hooks/useTimer';
import { beep } from '../hooks/useAudio';
import { projSend } from './SetupScreen';

const BUZZ_COLORS = [
  'border-cyan-500/50 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:glow-cyan',
  'border-orange-500/50 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 hover:glow-orange',
  'border-green-500/50 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:glow-green',
  'border-purple-500/50 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:glow-purple',
];

export function BuzzerScreen({ teams, scores, question, qIdx, qTotal, buzzedTeam, onBuzz, onCorrect, onWrong, showAnswer, onShowAnswer }) {
  const { seconds, urgency, start, stop } = useTimer(60);

  useEffect(() => {
    projSend({
      type: 'buzzerReady',
      teams,
      qNum: qIdx + 1,
      round: 'Round 2 — Buzzer',
      scores: teams.map((n, i) => ({ name: n, score: scores[i] })),
    });
  }, [qIdx]);

  useEffect(() => {
    if (buzzedTeam === null) return;
    start(
      60,
      (rem) => { if (rem <= 10) beep('tick'); },
      () => {
        beep('timeout');
        projSend({ type: 'timeout' });
        onWrong();
      }
    );
    projSend({
      type: 'question',
      team: teams[buzzedTeam],
      teamIdx: buzzedTeam,
      question: question.q,
      timer: 60,
      round: 'Round 2 — Buzzer',
      scores: teams.map((n, i) => ({ name: n, score: scores[i] })),
    });
  }, [buzzedTeam]);

  const handleBuzz = (ti) => {
    if (buzzedTeam !== null) return;
    beep('buzz');
    onBuzz(ti);
  };

  const handleCorrect = () => { stop(); onCorrect(); };
  const handleWrong = () => { stop(); onWrong(); };

  return (
    <div className="flex flex-col h-screen">
      <TopBar title="ROUND 2 — BUZZER ROUND" scores={scores} teams={teams}>
        <div className="font-orbitron text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-full">
          Q {qIdx + 1}/{qTotal}
        </div>
      </TopBar>
      <PageBody>
        <div className="w-full max-w-2xl flex flex-col gap-4">

          {/* Buzzed banner */}
          {buzzedTeam !== null ? (
            <div className={`animate-slide-up text-center py-4 rounded-xl border-2 font-orbitron text-xl font-black tracking-wider ${BUZZ_COLORS[buzzedTeam]}`}>
              🔔 {teams[buzzedTeam]} BUZZED!
            </div>
          ) : (
            <div className="text-center py-3 font-rajdhani text-gray-500 tracking-widest text-sm">
              WAITING FOR A TEAM TO BUZZ...
            </div>
          )}

          {/* Buzzer pads */}
          <div className="grid grid-cols-2 gap-3">
            {teams.map((name, i) => (
              <button
                key={i}
                onClick={() => handleBuzz(i)}
                disabled={buzzedTeam !== null}
                className={`py-8 rounded-xl border-2 font-orbitron text-lg font-bold transition-all duration-150 cursor-pointer
                  ${buzzedTeam !== null ? 'opacity-25 cursor-not-allowed' : BUZZ_COLORS[i] + ' hover:scale-[1.02] active:scale-95'}
                `}
              >
                {name}
              </button>
            ))}
          </div>

          {/* Question panel — shown after buzz */}
          {buzzedTeam !== null && (
            <div className="animate-slide-up flex flex-col gap-3">
              <div className="panel p-6 text-lg leading-relaxed font-medium text-gray-100 flex items-center min-h-24">
                {question.q}
              </div>

              <div className="flex items-center gap-3">
                <button className="btn-neon btn-ghost text-xs py-2 px-4" onClick={onShowAnswer}>
                  👁 {showAnswer ? 'HIDE ANSWER' : 'SHOW ANSWER'}
                </button>
                <span className="text-gray-600 text-xs">Only visible here</span>
              </div>
              <AnswerBox answer={question.a} visible={showAnswer} />

              <div className="flex items-center justify-between gap-4 flex-wrap">
                <ActionRow>
                  <button className="btn-neon btn-green" onClick={handleCorrect}>✓ CORRECT +15</button>
                  <button className="btn-neon btn-red" onClick={handleWrong}>✗ WRONG / PASS</button>
                </ActionRow>
                <TimerCircle seconds={seconds} urgency={urgency} size="md" />
              </div>
            </div>
          )}
        </div>
      </PageBody>
    </div>
  );
}
