import { useState, useEffect, useCallback } from 'react';
import { TopBar, PageBody, SectionTitle, TimerCircle, AnswerBox, PassChain, ActionRow, ResultFlash } from '../components/UI';
import { useTimer } from '../hooks/useTimer';
import { beep } from '../hooks/useAudio';
import { projSend } from './SetupScreen';
import { GENRE_META, shuffle } from '../data/questions';

const TEAM_COLORS = ['text-cyan-400','text-orange-400','text-green-400','text-purple-400'];
const ORDER_COLORS = ['border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
                     'border-orange-500/40 text-orange-400 bg-orange-500/10',
                     'border-green-500/40 text-green-400 bg-green-500/10',
                     'border-purple-500/40 text-purple-400 bg-purple-500/10'];

// Genre select
export function GenreScreen({ teams, scores, snakeOrder, snakeIdx, onGenre, onRandomGenre, qSet }) {
  const currentTeam = teams[snakeOrder[snakeIdx]];
  const currentTeamIdx = snakeOrder[snakeIdx];
  const genres = Object.keys(GENRE_META);

  return (
    <div className="flex flex-col h-screen">
      <TopBar title={`${currentTeam} — PICK GENRE`} scores={scores} teams={teams} />
      <PageBody>
        {/* Order strip */}
        <div className="flex gap-2 flex-wrap max-w-2xl w-full">
          {snakeOrder.map((ti, i) => (
            <div key={i} className={`px-3 py-1 rounded-full border text-xs font-bold font-rajdhani tracking-wide transition-all ${
              i === snakeIdx ? `${ORDER_COLORS[ti]} scale-105` : i < snakeIdx ? 'text-gray-700 border-gray-800 line-through' : 'text-gray-500 border-gray-800'
            }`}>
              {i + 1}. {teams[ti]}
            </div>
          ))}
        </div>

        <div className={`font-orbitron text-sm tracking-widest font-bold ${TEAM_COLORS[currentTeamIdx]}`}>
          SET {qSet} · ROUND 1
        </div>

        <SectionTitle>CHOOSE A GENRE</SectionTitle>

        <div className="grid grid-cols-3 gap-3 max-w-xl w-full">
          {genres.map(g => {
            const meta = GENRE_META[g];
            return (
              <button
                key={g}
                className="panel p-5 text-center cursor-pointer transition-all hover:-translate-y-1 hover:border-cyan-400/50 hover:glow-cyan"
                onClick={() => onGenre(g)}
              >
                <div className="text-3xl mb-2">{meta.emoji}</div>
                <div className="font-orbitron text-sm font-bold text-white tracking-wider">{meta.label}</div>
              </button>
            );
          })}
          <button
            className="panel p-5 text-center cursor-pointer transition-all hover:-translate-y-1"
            style={{ borderStyle: 'dashed', borderColor: 'rgba(255,215,0,0.4)' }}
            onClick={onRandomGenre}
          >
            <div className="text-3xl mb-2">🎲</div>
            <div className="font-orbitron text-sm font-bold text-yellow-400 tracking-wider">RANDOM</div>
          </button>
        </div>
      </PageBody>
    </div>
  );
}

// Question number select
export function QSelectScreen({ teams, scores, snakeOrder, snakeIdx, genre, usedIndices, onSelect, onBack }) {
  const currentTeam = teams[snakeOrder[snakeIdx]];
  const meta = GENRE_META[genre];
  const nums = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div className="flex flex-col h-screen">
      <TopBar title={`${currentTeam} · ${meta.label}`} scores={scores} teams={teams} />
      <PageBody>
        <SectionTitle sub={`${meta.emoji} ${meta.label} — Select question number`}>
          SELECT A QUESTION
        </SectionTitle>

        <div className="grid grid-cols-5 gap-3 max-w-md w-full">
          {nums.map(i => {
            const used = usedIndices.includes(i);
            return (
              <button
                key={i}
                disabled={used}
                onClick={() => !used && onSelect(i)}
                className={`h-16 rounded-xl font-orbitron text-xl font-black border-2 transition-all ${
                  used
                    ? 'bg-gray-900 border-gray-800 text-gray-700 cursor-not-allowed'
                    : 'bg-[#0d1428] border-cyan-500/30 text-white hover:border-cyan-400 hover:text-cyan-400 hover:scale-105 hover:glow-cyan cursor-pointer'
                }`}
              >
                {used ? '✓' : i + 1}
              </button>
            );
          })}
        </div>

        <button className="btn-neon btn-ghost text-xs py-2 px-4 mt-2" onClick={onBack}>
          ← CHANGE GENRE
        </button>
      </PageBody>
    </div>
  );
}

// Question answering screen
export function QuestionScreen({ teams, scores, question, passChain, passIdx, passedToAudience, onCorrect, onWrong, onPass, onShowAnswer, showAnswer }) {
  const { seconds, urgency, start, stop } = useTimer(60);
  const currentTeamIdx = passedToAudience ? -1 : passChain[passIdx];
  const timerSecs = [60, 45, 30, 20][Math.min(passIdx, 3)];

  useEffect(() => {
    start(
      timerSecs,
      (rem) => { if (rem <= 10) beep('tick'); },
      () => {
        beep('timeout');
        projSend({ type: 'timeout' });
        if (!passedToAudience && passIdx < passChain.length - 1) onPass();
        else onWrong();
      }
    );
    projSend({
      type: 'question',
      team: passedToAudience ? 'AUDIENCE' : teams[passChain[passIdx]],
      teamIdx: passedToAudience ? 0 : passChain[passIdx],
      question: question.q,
      timer: timerSecs,
      round: 'Round 1 — Passable',
      scores: teams.map((n, i) => ({ name: n, score: scores[i] })),
    });
  }, [passIdx, passedToAudience]);

  const handleCorrect = () => { stop(); onCorrect(); };
  const handleWrong = () => { stop(); onWrong(); };
  const handlePass = () => { stop(); onPass(); };

  return (
    <div className="flex flex-col h-screen">
      <TopBar title="ROUND 1 — PASSABLE" scores={scores} teams={teams} />
      <PageBody>
        <div className="w-full max-w-2xl flex flex-col gap-4">
          {/* Header row */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-orbitron text-xs text-gray-500 tracking-widest mb-1">NOW ANSWERING</div>
              <div className={`font-orbitron text-2xl font-black tracking-wide ${
                passedToAudience ? 'text-yellow-400' : ['text-cyan-400','text-orange-400','text-green-400','text-purple-400'][currentTeamIdx]
              }`}>
                {passedToAudience ? '📣 AUDIENCE' : teams[currentTeamIdx]}
              </div>
            </div>
            <TimerCircle seconds={seconds} urgency={urgency} size="md" />
          </div>

          {/* Question */}
          <div className="panel p-7 text-xl leading-relaxed font-medium text-gray-100 min-h-28 flex items-center">
            {question.q}
          </div>

          {/* Pass chain */}
          <PassChain chain={passChain} teams={teams} currentIdx={passIdx} passedToAudience={passedToAudience} />

          {/* Answer reveal */}
          <div className="flex items-center gap-3">
            <button className="btn-neon btn-ghost text-xs py-2 px-4" onClick={onShowAnswer}>
              👁 {showAnswer ? 'HIDE ANSWER' : 'SHOW ANSWER'}
            </button>
            <span className="text-gray-600 text-xs">Only visible on this screen</span>
          </div>
          <AnswerBox answer={question.a} visible={showAnswer} />

          {/* Actions */}
          <ActionRow>
            <button className="btn-neon btn-green flex-1" onClick={handleCorrect}>✓ CORRECT +10</button>
            <button className="btn-neon btn-red flex-1" onClick={handleWrong}>✗ WRONG</button>
            {!passedToAudience && passIdx < passChain.length - 1 && (
              <button className="btn-neon btn-orange flex-1" onClick={handlePass}>⟶ PASS</button>
            )}
            {!passedToAudience && passIdx >= passChain.length - 1 && (
              <button className="btn-neon btn-orange flex-1" onClick={handlePass}>📣 PASS TO AUDIENCE</button>
            )}
          </ActionRow>
        </div>
      </PageBody>
    </div>
  );
}
