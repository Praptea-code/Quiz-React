import { useState, useEffect } from 'react';
import { TopBar, PageBody, SectionTitle, TimerCircle, AnswerBox, ActionRow } from '../components/UI';
import { useTimer } from '../hooks/useTimer';
import { beep } from '../hooks/useAudio';
import { projSend } from './SetupScreen';

const BUZZ_COLORS = [
  'border-cyan-500/50 bg-cyan-500/10 text-cyan-400',
  'border-orange-500/50 bg-orange-500/10 text-orange-400',
  'border-green-500/50 bg-green-500/10 text-green-400',
  'border-purple-500/50 bg-purple-500/10 text-purple-400',
];

export function TiebreakerScreen({ teams, scores, wins, question, buzzedTeam, onBuzz, onCorrect, onWrong, showAnswer, onShowAnswer }) {
  const { seconds, urgency, start, stop } = useTimer(60);

  useEffect(() => {
    projSend({
      type: 'tieBuzzerReady',
      teams,
      scores: teams.map((n, i) => ({ name: n, score: scores[i] })),
    });
  }, []);

  useEffect(() => {
    if (buzzedTeam === null) {
      // Reset — show buzzer ready
      projSend({
        type: 'tieBuzzerReady',
        teams,
        scores: teams.map((n, i) => ({ name: n, score: scores[i] })),
      });
      return;
    }
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
      round: '⚡ Tiebreaker',
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
      <TopBar title="⚡ TIEBREAKER" scores={scores} teams={teams} />
      <PageBody>
        <div className="w-full max-w-2xl flex flex-col gap-4">
          {/* Win tracker */}
          <div className="flex gap-3 justify-center flex-wrap">
            {teams.map((name, i) => (
              <div key={i} className={`flex flex-col items-center panel px-5 py-3 min-w-[100px] ${BUZZ_COLORS[i]}`}>
                <div className="font-rajdhani font-bold text-sm mb-1">{name}</div>
                <div className="font-orbitron text-3xl font-black">{wins[i]}</div>
                <div className="text-xs opacity-60 mt-1">/ 3 wins</div>
              </div>
            ))}
          </div>

          <div className="font-orbitron text-xs text-center text-yellow-400 tracking-widest animate-pulse-glow">
            ⚡ FIRST TO BUZZ AND ANSWER CORRECTLY WINS THE POINT
          </div>

          {/* Buzzed banner */}
          {buzzedTeam !== null ? (
            <div className={`animate-slide-up text-center py-4 rounded-xl border-2 font-orbitron text-xl font-black tracking-wider ${BUZZ_COLORS[buzzedTeam]}`}>
              🔔 {teams[buzzedTeam]} BUZZED!
            </div>
          ) : (
            <div className="text-center py-2 font-rajdhani text-gray-500 tracking-widest text-sm">
              WAITING FOR BUZZ...
            </div>
          )}

          {/* Buzzer pads */}
          <div className="grid grid-cols-2 gap-3">
            {teams.map((name, i) => (
              <button
                key={i}
                onClick={() => handleBuzz(i)}
                disabled={buzzedTeam !== null}
                className={`py-8 rounded-xl border-2 font-orbitron text-lg font-bold transition-all duration-150
                  ${buzzedTeam !== null ? 'opacity-25 cursor-not-allowed' : BUZZ_COLORS[i] + ' hover:scale-[1.02] active:scale-95 cursor-pointer'}
                `}
              >
                {name}
              </button>
            ))}
          </div>

          {/* Question + answer + actions after buzz */}
          {buzzedTeam !== null && (
            <div className="animate-slide-up flex flex-col gap-3">
              <div className="panel p-6 text-lg leading-relaxed font-medium text-gray-100 flex items-center min-h-24">
                {question.q}
              </div>

              <div className="flex items-center gap-3">
                <button className="btn-neon btn-ghost text-xs py-2 px-4" onClick={onShowAnswer}>
                  👁 {showAnswer ? 'HIDE ANSWER' : 'SHOW ANSWER'}
                </button>
              </div>
              <AnswerBox answer={question.a} visible={showAnswer} />

              <div className="flex items-center justify-between gap-4 flex-wrap">
                <ActionRow>
                  <button className="btn-neon btn-green" onClick={handleCorrect}>✓ CORRECT — WINS POINT</button>
                  <button className="btn-neon btn-red" onClick={handleWrong}>✗ WRONG</button>
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
