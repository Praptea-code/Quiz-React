import { useState } from 'react';
import './index.css';

import { SetupScreen } from './screens/SetupScreen';
import { ReenterTeamsScreen } from './screens/ReenterTeamsScreen';
import { RoundSelectScreen } from './screens/RoundSelectScreen';
import { GenreScreen, QSelectScreen, QuestionScreen } from './screens/Round1Screens';
import { BuzzerScreen } from './screens/Round2Screen';
import { RapidSelectScreen, RapidFireScreen, RapidFireHandoffScreen } from './screens/Round3Screen';
import { TiebreakerScreen } from './screens/TiebreakerScreen';
import { WinnerScreen } from './screens/WinnerScreen';
import { ResultFlash } from './components/UI';
import { beep } from './hooks/useAudio';
import { projSend } from './screens/SetupScreen';
import { SET_A, SET_B, allQuestions, shuffle } from './data/questions';

const SNAKE_ORDER = [0, 1, 2, 3, 3, 2, 1, 0];

function initR1State() {
  return {
    snakeIdx: 0,
    used: { ior: [], robotics: [], cloud: [], ai: [], iq: [] },
    genre: null,
    question: null,
    passChain: [],
    passIdx: 0,
    passedToAudience: false,
  };
}

export default function App() {
  const [screen, setScreen] = useState('setup');
  const [teams, setTeams] = useState(['Team 1', 'Team 2', 'Team 3', 'Team 4']);
  const [scores, setScores] = useState([0, 0, 0, 0]);
  const [notice, setNotice] = useState('');
  const [flash, setFlash] = useState(null);
  const [r1, setR1] = useState(initR1State());
  const [r1Set, setR1Set] = useState('A');
  const [showAnswer, setShowAnswer] = useState(false);
  const [r2, setR2] = useState({ questions: [], qIdx: 0, buzzedTeam: null });
  const [r3, setR3] = useState({ teamOrder: [], currentSlot: 0, questions: [], qIdx: 0, teamRFScores: {}, doneTeams: [] });
  const [tie, setTie] = useState({ wins: [0, 0, 0, 0], questions: [], qIdx: 0, buzzedTeam: null });

  const flashResult = (correct) => {
    beep(correct ? 'correct' : 'wrong');
    setFlash(correct ? 'correct' : 'wrong');
    projSend({ type: 'result', correct });
  };

  const addScore = (teamIdx, pts) =>
    setScores(s => { const a = [...s]; a[teamIdx] += pts; return a; });

  const handleStart = (newTeams) => {
    setTeams(newTeams);
    setScores([0, 0, 0, 0]);
    setNotice('');
    setScreen('roundSelect');
  };

  const handleRound = (r) => {
    if (r === 1) {
      setR1Set('A'); setR1(initR1State()); setScreen('reenterTeams_r1a');
    } else if (r === 'r1b') {
      setR1Set('B'); setR1(initR1State()); setScreen('reenterTeams_r1b');
    } else if (r === 2) {
      const qs = shuffle([...allQuestions('A'), ...allQuestions('B')]).slice(0, 10);
      setR2({ questions: qs, qIdx: 0, buzzedTeam: null });
      setScreen('reenterTeams_r2');
    } else if (r === 3) {
      setScreen('reenterTeams_r3');
    } else if (r === 'tie') {
      const qs = shuffle([...allQuestions('A'), ...allQuestions('B')]);
      setTie({ wins: [0, 0, 0, 0], questions: qs, qIdx: 0, buzzedTeam: null });
      setScreen('tie');
    }
  };

  const startR1 = (newTeams) => {
    setTeams(newTeams);
    const ti = SNAKE_ORDER[0];
    projSend({ type: 'pickGenre', team: newTeams[ti], teamIdx: ti, scores: newTeams.map((n, i) => ({ name: n, score: scores[i] })) });
    setScreen('genre');
  };

  const startR2 = (newTeams) => { setTeams(newTeams); setScreen('buzzer'); };
  const startR3Setup = (newTeams) => { setTeams(newTeams); setScreen('rapidSelect'); };

  const handleGenre = (genre) => { setR1(s => ({ ...s, genre })); setScreen('qselect'); };

  const handleQSelect = (qi) => {
    const src = r1Set === 'B' ? SET_B : SET_A;
    const question = src[r1.genre][qi];
    const ti = SNAKE_ORDER[r1.snakeIdx];
    const passChain = [ti, ...[0, 1, 2, 3].filter(x => x !== ti)];
    setR1(s => ({ ...s, question, used: { ...s.used, [s.genre]: [...s.used[s.genre], qi] }, passChain, passIdx: 0, passedToAudience: false }));
    setShowAnswer(false);
    setScreen('question');
  };

  const handlePass = () => {
    const nextIdx = r1.passIdx + 1;
    if (nextIdx >= r1.passChain.length) {
      setR1(s => ({ ...s, passedToAudience: true }));
      projSend({ type: 'passedToAudience', round: 'Round 1 — Passable', question: r1.question.q });
    } else {
      setR1(s => ({ ...s, passIdx: nextIdx }));
    }
    setShowAnswer(false);
  };

  const handleR1Correct = () => {
    if (!r1.passedToAudience) addScore(r1.passChain[r1.passIdx], 10);
    flashResult(true);
    setTimeout(() => endR1Question(), 1300);
  };

  const handleR1Wrong = () => { flashResult(false); setTimeout(() => endR1Question(), 1300); };

  const endR1Question = () => {
    const nextIdx = r1.snakeIdx + 1;
    if (nextIdx >= SNAKE_ORDER.length) {
      setNotice(`Set ${r1Set} Passable Round complete!`);
      projSend({ type: 'roundEnd', message: `Set ${r1Set} Complete!` });
      setScreen('roundSelect');
      return;
    }
    setR1(s => ({ ...s, snakeIdx: nextIdx, passIdx: 0, passedToAudience: false }));
    const ti = SNAKE_ORDER[nextIdx];
    projSend({ type: 'pickGenre', team: teams[ti], teamIdx: ti, scores: teams.map((n, i) => ({ name: n, score: scores[i] })) });
    setShowAnswer(false);
    setScreen('genre');
  };

  const handleBuzz = (ti) => setR2(s => ({ ...s, buzzedTeam: ti }));

  const handleR2Correct = () => { addScore(r2.buzzedTeam, 15); flashResult(true); setTimeout(() => nextBuzzerQ(), 1300); };
  const handleR2Wrong = () => { flashResult(false); setTimeout(() => nextBuzzerQ(), 1300); };

  const nextBuzzerQ = () => {
    const next = r2.qIdx + 1;
    if (next >= 10) { setNotice('Buzzer Round complete!'); projSend({ type: 'roundEnd', message: 'Round 2 Complete!' }); setScreen('roundSelect'); }
    else setR2(s => ({ ...s, qIdx: next, buzzedTeam: null }));
    setShowAnswer(false);
  };

  const handleRapidStart = (teamOrder) => {
    const questions = shuffle([...allQuestions('A'), ...allQuestions('B')]);
    setR3({ teamOrder, currentSlot: 0, questions, qIdx: 0, teamRFScores: Object.fromEntries(teamOrder.map(i => [i, 0])), doneTeams: [] });
    setShowAnswer(false);
    setScreen('rapidFire');
  };

  const handleRFPoint = () => {
    const ti = r3.teamOrder[r3.currentSlot];
    addScore(ti, 10);
    setR3(s => ({ ...s, teamRFScores: { ...s.teamRFScores, [ti]: (s.teamRFScores[ti] || 0) + 10 }, qIdx: s.qIdx + 1 }));
    setShowAnswer(false);
  };

  const handleRFNext = () => { setR3(s => ({ ...s, qIdx: s.qIdx + 1 })); setShowAnswer(false); };

  const handleRFDone = () => {
    const ti = r3.teamOrder[r3.currentSlot];
    const newDone = [...r3.doneTeams, { teamIdx: ti, rfScore: r3.teamRFScores[ti] || 0 }];
    setR3(s => ({ ...s, doneTeams: newDone, currentSlot: s.currentSlot + 1 }));
    setShowAnswer(false);
    setScreen('rapidHandoff');
  };

  const handleRFHandoffNext = () => {
    if (r3.currentSlot >= r3.teamOrder.length) {
      setNotice('Rapid Fire complete!'); projSend({ type: 'roundEnd', message: 'Rapid Fire Complete!' }); setScreen('roundSelect');
    } else {
      setR3(s => ({ ...s, qIdx: 0 })); setShowAnswer(false); setScreen('rapidFire');
    }
  };

  const handleTieBuzz = (ti) => setTie(s => ({ ...s, buzzedTeam: ti }));

  const handleTieCorrect = () => {
    const ti = tie.buzzedTeam;
    const newWins = [...tie.wins];
    newWins[ti]++;
    setTie(s => ({ ...s, wins: newWins, buzzedTeam: null, qIdx: s.qIdx + 1 }));
    flashResult(true);
    setShowAnswer(false);
    projSend({ type: 'tieScores', teams, wins: newWins });
    if (newWins[ti] >= 3) setTimeout(() => setScreen('winner_' + ti), 1300);
  };

  const handleTieWrong = () => {
    flashResult(false);
    setTie(s => ({ ...s, buzzedTeam: null, qIdx: s.qIdx + 1 }));
    setShowAnswer(false);
  };

  const handlePlayAgain = () => { setTeams(['Team 1','Team 2','Team 3','Team 4']); setScores([0,0,0,0]); setScreen('setup'); };

  const winnerMatch = screen.match(/^winner_(\d+)$/);

  return (
    <>
      {flash && <ResultFlash result={flash} onDone={() => setFlash(null)} />}

      {screen === 'setup' && <SetupScreen onStart={handleStart} />}
      {screen === 'roundSelect' && <RoundSelectScreen teams={teams} scores={scores} onRound={handleRound} notice={notice} />}

      {screen === 'reenterTeams_r1a' && <ReenterTeamsScreen currentTeams={teams} roundLabel="SET A · PASSABLE ROUND" onConfirm={startR1} />}
      {screen === 'reenterTeams_r1b' && <ReenterTeamsScreen currentTeams={teams} roundLabel="SET B · PASSABLE ROUND" onConfirm={startR1} />}
      {screen === 'reenterTeams_r2' && <ReenterTeamsScreen currentTeams={teams} roundLabel="ROUND 2 · BUZZER ROUND" onConfirm={startR2} />}
      {screen === 'reenterTeams_r3' && <ReenterTeamsScreen currentTeams={teams} roundLabel="ROUND 3 · RAPID FIRE" onConfirm={startR3Setup} />}

      {screen === 'genre' && (
        <GenreScreen teams={teams} scores={scores} snakeOrder={SNAKE_ORDER} snakeIdx={r1.snakeIdx}
          onGenre={handleGenre}
          onRandomGenre={() => {
            const src = r1Set === 'B' ? SET_B : SET_A;
            const genres = Object.keys(src);
            const avail = genres.filter(g => (r1.used[g] || []).length < 10);
            handleGenre(avail.length ? avail[Math.floor(Math.random() * avail.length)] : genres[0]);
          }}
          qSet={r1Set}
        />
      )}

      {screen === 'qselect' && (
        <QSelectScreen teams={teams} scores={scores} snakeOrder={SNAKE_ORDER} snakeIdx={r1.snakeIdx}
          genre={r1.genre} usedIndices={r1.used[r1.genre] || []}
          onSelect={handleQSelect} onBack={() => setScreen('genre')}
        />
      )}

      {screen === 'question' && r1.question && (
        <QuestionScreen teams={teams} scores={scores} question={r1.question}
          passChain={r1.passChain} passIdx={r1.passIdx} passedToAudience={r1.passedToAudience}
          onCorrect={handleR1Correct} onWrong={handleR1Wrong} onPass={handlePass}
          showAnswer={showAnswer} onShowAnswer={() => setShowAnswer(v => !v)}
        />
      )}

      {screen === 'buzzer' && r2.questions.length > 0 && (
        <BuzzerScreen teams={teams} scores={scores} question={r2.questions[r2.qIdx]}
          qIdx={r2.qIdx} qTotal={10} buzzedTeam={r2.buzzedTeam}
          onBuzz={handleBuzz} onCorrect={handleR2Correct} onWrong={handleR2Wrong}
          showAnswer={showAnswer} onShowAnswer={() => setShowAnswer(v => !v)}
        />
      )}

      {screen === 'rapidSelect' && <RapidSelectScreen teams={teams} scores={scores} onStart={handleRapidStart} />}

      {screen === 'rapidFire' && r3.teamOrder.length > 0 && r3.currentSlot < r3.teamOrder.length && (
        <RapidFireScreen teams={teams} scores={scores}
          teamIdx={r3.teamOrder[r3.currentSlot]} questions={r3.questions}
          teamRFScore={r3.teamRFScores[r3.teamOrder[r3.currentSlot]] || 0}
          currentQIdx={r3.qIdx}
          onPoint={handleRFPoint} onNext={handleRFNext} onDone={handleRFDone}
          showAnswer={showAnswer} onShowAnswer={() => setShowAnswer(v => !v)}
        />
      )}

      {screen === 'rapidHandoff' && (
        <RapidFireHandoffScreen teams={teams} scores={scores} doneTeams={r3.doneTeams}
          nextTeamIdx={r3.currentSlot < r3.teamOrder.length ? r3.teamOrder[r3.currentSlot] : null}
          onNext={handleRFHandoffNext}
        />
      )}

      {screen === 'tie' && tie.questions.length > 0 && (
        <TiebreakerScreen teams={teams} scores={scores} wins={tie.wins}
          question={tie.questions[tie.qIdx % tie.questions.length]}
          buzzedTeam={tie.buzzedTeam}
          onBuzz={handleTieBuzz} onCorrect={handleTieCorrect} onWrong={handleTieWrong}
          showAnswer={showAnswer} onShowAnswer={() => setShowAnswer(v => !v)}
        />
      )}

      {winnerMatch && (
        <WinnerScreen teams={teams} scores={scores} winnerIdx={parseInt(winnerMatch[1])} onPlayAgain={handlePlayAgain} />
      )}
    </>
  );
}
