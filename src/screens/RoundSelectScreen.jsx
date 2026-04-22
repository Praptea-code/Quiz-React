import { TopBar, PageBody, SectionTitle, ScoreChip } from '../components/UI';
import { openProjector } from './SetupScreen';

const ROUNDS = [
  {
    id: 1, num: 'SET A', title: 'Passable Round', badge: '4 teams · snake order',
    desc: 'Teams pick genre + question. Wrong or pass → next team with less time. Pass to audience if all teams pass.',
    color: 'text-cyan-400', border: 'border-cyan-500/30 hover:border-cyan-400', glow: 'hover:glow-cyan',
    bg: 'hover:bg-cyan-500/5',
  },
  {
    id: 'r1b', num: 'SET B', title: 'Passable Round', badge: '4 teams · snake order',
    desc: 'Same rules as Set A but with a fresh set of questions. Re-enter team names for this round.',
    color: 'text-orange-400', border: 'border-orange-500/30 hover:border-orange-400', glow: 'hover:glow-orange',
    bg: 'hover:bg-orange-500/5',
  },
  {
    id: 2, num: 'ROUND 2', title: 'Buzzer Round', badge: '10 questions · buzzer',
    desc: 'Random questions from all genres. First to buzz gets 60 seconds. Wrong = nobody scores.',
    color: 'text-green-400', border: 'border-green-500/30 hover:border-green-400', glow: 'hover:glow-green',
    bg: 'hover:bg-green-500/5',
  },
  {
    id: 3, num: 'ROUND 3', title: 'Rapid Fire', badge: 'each team · 3 minutes',
    desc: 'Each team gets their own 3-minute countdown. Questions fired to that team only. Most correct wins.',
    color: 'text-yellow-400', border: 'border-yellow-500/30 hover:border-yellow-400', glow: 'hover:glow-gold',
    bg: 'hover:bg-yellow-500/5',
  },
  {
    id: 'tie', num: '⚡', title: 'Tiebreaker', badge: 'buzzer · first to answer wins',
    desc: 'Buzzer format between tied teams. First team to buzz and answer correctly wins the question. First to 3 wins.',
    color: 'text-purple-400', border: 'border-purple-500/30 hover:border-purple-400', glow: 'hover:glow-purple',
    bg: 'hover:bg-purple-500/5',
  },
];

export function RoundSelectScreen({ teams, scores, onRound, notice }) {
  return (
    <div className="flex flex-col h-screen">
      <TopBar title="QUIZ ARENA" scores={scores} teams={teams} onProjector={openProjector} />
      <PageBody>
        <SectionTitle>CHOOSE ROUND</SectionTitle>

        <div className="grid grid-cols-2 gap-4 max-w-3xl w-full">
          {ROUNDS.map(r => (
            <button
              key={r.id}
              className={`panel ${r.border} ${r.bg} ${r.glow} text-left p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 relative overflow-hidden`}
              onClick={() => onRound(r.id)}
            >
              <div className={`font-orbitron text-3xl font-black mb-2 ${r.color}`}>{r.num}</div>
              <div className="font-orbitron text-base font-bold text-white mb-1 tracking-wide">{r.title}</div>
              <div className={`text-xs font-bold mb-2 font-rajdhani tracking-widest ${r.color}`}>{r.badge}</div>
              <div className="text-gray-400 text-xs leading-relaxed font-rajdhani">{r.desc}</div>
            </button>
          ))}
        </div>

        {notice && (
          <div className="text-cyan-500 font-orbitron text-sm tracking-widest mt-2 animate-pulse-glow">
            ✓ {notice}
          </div>
        )}
      </PageBody>
    </div>
  );
}
