export const PROJECTOR_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Quiz Arena — Projector</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{
  background:#030710;
  color:#e2e8f0;
  font-family:'Rajdhani',sans-serif;
  height:100vh;
  display:flex;
  flex-direction:column;
  overflow:hidden;
  background-image:
    linear-gradient(rgba(0,245,255,0.03) 1px,transparent 1px),
    linear-gradient(90deg,rgba(0,245,255,0.03) 1px,transparent 1px);
  background-size:50px 50px;
}
body::before{
  content:'';position:fixed;inset:0;
  background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 4px);
  pointer-events:none;z-index:9999;
}

.header{
  background:rgba(5,8,18,0.95);
  border-bottom:1px solid rgba(0,245,255,0.2);
  padding:14px 32px;
  display:flex;align-items:center;justify-content:space-between;
  backdrop-filter:blur(12px);
}
.logo-area{display:flex;align-items:center;gap:16px;}
.logo-img{width:48px;height:48px;object-fit:contain;}
.logo-placeholder{
  width:48px;height:48px;border-radius:8px;
  border:2px solid rgba(0,245,255,0.4);
  display:flex;align-items:center;justify-content:center;
  font-family:'Orbitron',monospace;font-size:11px;font-weight:700;
  color:rgba(0,245,255,0.6);text-align:center;line-height:1.2;
}
.logo-text{
  font-family:'Orbitron',monospace;font-size:20px;font-weight:900;
  color:#00f5ff;text-shadow:0 0 10px rgba(0,245,255,0.8),0 0 20px rgba(0,245,255,0.4);
  letter-spacing:3px;
}
.scores-row{display:flex;gap:10px;flex-wrap:wrap;}
.score-chip{
  background:rgba(13,20,40,0.9);
  border:1px solid rgba(0,245,255,0.25);
  border-radius:8px;padding:6px 14px;
  display:flex;align-items:center;gap:10px;
  font-size:14px;font-weight:600;
}
.score-chip:nth-child(1){border-color:rgba(0,245,255,0.4);}
.score-chip:nth-child(2){border-color:rgba(255,107,53,0.4);}
.score-chip:nth-child(3){border-color:rgba(0,255,136,0.4);}
.score-chip:nth-child(4){border-color:rgba(179,71,255,0.4);}
.score-val{
  font-family:'Orbitron',monospace;font-size:18px;font-weight:700;
  color:#ffd700;text-shadow:0 0 8px rgba(255,215,0,0.6);
}

.body{
  flex:1;display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  padding:40px;gap:24px;text-align:center;
}

.state-label{
  font-family:'Orbitron',monospace;font-size:12px;font-weight:600;
  letter-spacing:4px;color:rgba(0,245,255,0.5);text-transform:uppercase;
}
.team-label{
  font-family:'Orbitron',monospace;
  font-size:clamp(2rem,4vw,3rem);font-weight:900;
  letter-spacing:2px;
}
.team-label.t0{color:#00f5ff;text-shadow:0 0 15px rgba(0,245,255,0.8);}
.team-label.t1{color:#ff6b35;text-shadow:0 0 15px rgba(255,107,53,0.8);}
.team-label.t2{color:#00ff88;text-shadow:0 0 15px rgba(0,255,136,0.8);}
.team-label.t3{color:#b347ff;text-shadow:0 0 15px rgba(179,71,255,0.8);}

.question-box{
  background:rgba(13,20,40,0.8);
  border:1px solid rgba(0,245,255,0.2);
  border-radius:16px;padding:36px 48px;
  max-width:900px;width:100%;
  font-size:clamp(1.4rem,2.5vw,2rem);line-height:1.6;font-weight:500;
  color:#f1f5f9;
  box-shadow:0 0 40px rgba(0,245,255,0.05),inset 0 0 60px rgba(0,0,0,0.3);
}
.timer-display{
  font-family:'Orbitron',monospace;font-size:clamp(5rem,12vw,9rem);font-weight:900;
  line-height:1;color:#00ff88;text-shadow:0 0 20px rgba(0,255,136,0.8);
}
.timer-display.warn{color:#ffd700;text-shadow:0 0 20px rgba(255,215,0,0.8);}
.timer-display.danger{
  color:#ff3b5c;text-shadow:0 0 20px rgba(255,59,92,0.8);
  animation:dpulse 0.5s ease-in-out infinite;
}
@keyframes dpulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}

.result-display{
  font-family:'Orbitron',monospace;font-size:clamp(3rem,8vw,6rem);font-weight:900;
  animation:zbounce 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
}
.result-display.correct{color:#00ff88;text-shadow:0 0 20px rgba(0,255,136,0.9);}
.result-display.wrong{color:#ff3b5c;text-shadow:0 0 20px rgba(255,59,92,0.9);}
@keyframes zbounce{from{transform:scale(0.3);opacity:0}70%{transform:scale(1.1)}to{transform:scale(1);opacity:1}}

.buzz-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:600px;width:100%;}
.buzz-card{
  padding:32px 20px;border-radius:12px;font-family:'Orbitron',monospace;
  font-size:18px;font-weight:700;border:2px solid;text-align:center;
}
.buzz-card.t0{background:rgba(0,245,255,0.08);border-color:#00f5ff;color:#00f5ff;}
.buzz-card.t1{background:rgba(255,107,53,0.08);border-color:#ff6b35;color:#ff6b35;}
.buzz-card.t2{background:rgba(0,255,136,0.08);border-color:#00ff88;color:#00ff88;}
.buzz-card.t3{background:rgba(179,71,255,0.08);border-color:#b347ff;color:#b347ff;}

.rf-board{
  display:flex;gap:60px;align-items:center;
  background:rgba(13,20,40,0.8);border:1px solid rgba(0,245,255,0.2);
  border-radius:16px;padding:28px 48px;
}
.rf-team{text-align:center;}
.rf-name{font-size:15px;color:rgba(255,255,255,0.5);margin-bottom:8px;font-weight:600;letter-spacing:2px;}
.rf-score{font-family:'Orbitron',monospace;font-size:72px;font-weight:900;color:#f8fafc;}
.rf-vs{font-family:'Orbitron',monospace;font-size:32px;font-weight:900;color:rgba(255,255,255,0.2);}

.winner-trophy{font-size:80px;animation:float 2s ease-in-out infinite;}
.winner-big{font-family:'Orbitron',monospace;font-size:clamp(3rem,7vw,5.5rem);font-weight:900;color:#ffd700;text-shadow:0 0 20px rgba(255,215,0,0.8);}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}

.tie-grid{display:flex;gap:24px;flex-wrap:wrap;justify-content:center;}
.tie-box{
  text-align:center;padding:20px 32px;border-radius:12px;
  background:rgba(13,20,40,0.8);border:2px solid rgba(179,71,255,0.4);min-width:140px;
}
.tie-name{font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:6px;letter-spacing:2px;}
.tie-wins{font-family:'Orbitron',monospace;font-size:60px;font-weight:900;color:#b347ff;text-shadow:0 0 15px rgba(179,71,255,0.7);}
.tie-sub{font-size:12px;color:rgba(255,255,255,0.3);margin-top:4px;}

.waiting-text{font-size:28px;color:rgba(255,255,255,0.3);letter-spacing:3px;}

.round-end{font-family:'Orbitron',monospace;font-size:clamp(2rem,5vw,4rem);font-weight:900;color:#ffd700;text-shadow:0 0 20px rgba(255,215,0,0.8);}
</style>
</head>
<body>
<div class="header">
  <div class="logo-area">
    <div class="logo-placeholder" id="logo-el">LOGO<br/>HERE</div>
    <div class="logo-text">QUIZ ARENA</div>
  </div>
  <div class="scores-row" id="proj-scores"></div>
</div>
<div class="body" id="proj-body">
  <div class="waiting-text">WAITING FOR QUIZMASTER...</div>
</div>
<script>
let timerIv;
const teamColors = ['t0','t1','t2','t3'];

window.addEventListener('message', e => {
  try {
    const d = JSON.parse(e.data);
    if (d.scores) updateScores(d.scores);
    const body = document.getElementById('proj-body');
    clearInterval(timerIv);

    if (d.type === 'question') {
      const tc = teamColors[d.teamIdx] || 't0';
      body.innerHTML = \`
        <div class="state-label">\${d.round}</div>
        <div class="team-label \${tc}">\${d.team}</div>
        <div class="question-box">\${d.question}</div>
        <div class="timer-display" id="pt">\${d.timer}</div>
      \`;
      let rem = d.timer;
      timerIv = setInterval(() => {
        rem--;
        const t = document.getElementById('pt');
        if (!t) return;
        t.textContent = rem;
        if (rem <= 5) t.className = 'timer-display danger';
        else if (rem <= 15) t.className = 'timer-display warn';
        if (rem <= 0) clearInterval(timerIv);
      }, 1000);

    } else if (d.type === 'result') {
      body.innerHTML = \`<div class="result-display \${d.correct ? 'correct' : 'wrong'}">\${d.correct ? '✓ CORRECT!' : '✗ WRONG'}</div>\`;

    } else if (d.type === 'buzzerReady') {
      const grid = d.teams.map((n,i) => \`<div class="buzz-card t\${i}">\${n}</div>\`).join('');
      body.innerHTML = \`
        <div class="state-label">\${d.round} · Q\${d.qNum}/10</div>
        <div class="state-label" style="font-size:20px;color:rgba(255,255,255,0.4);margin:8px 0;">🔔 BUZZ IN!</div>
        <div class="buzz-grid">\${grid}</div>
      \`;

    } else if (d.type === 'tieBuzzerReady') {
      const grid = d.teams.map((n,i) => \`<div class="buzz-card t\${i}">\${n}</div>\`).join('');
      body.innerHTML = \`
        <div class="state-label">⚡ TIEBREAKER</div>
        <div class="state-label" style="font-size:20px;color:rgba(255,255,255,0.4);margin:8px 0;">🔔 FIRST TO BUZZ WINS!</div>
        <div class="buzz-grid">\${grid}</div>
      \`;

    } else if (d.type === 'tieScores') {
      const boxes = d.teams.map((n,i) => \`
        <div class="tie-box">
          <div class="tie-name">\${n}</div>
          <div class="tie-wins">\${d.wins[i]}</div>
          <div class="tie-sub">need 3</div>
        </div>
      \`).join('');
      body.innerHTML = \`
        <div class="state-label">⚡ TIEBREAKER · FIRST TO 3</div>
        <div class="tie-grid">\${boxes}</div>
      \`;

    } else if (d.type === 'pickGenre') {
      const tc = teamColors[d.teamIdx] || 't0';
      body.innerHTML = \`
        <div class="state-label">Round 1 — Passable</div>
        <div class="team-label \${tc}">\${d.team}</div>
        <div class="waiting-text" style="margin-top:8px;">CHOOSING GENRE...</div>
      \`;

    } else if (d.type === 'timeout') {
      body.innerHTML = \`<div class="result-display wrong">⏰ TIME'S UP!</div>\`;

    } else if (d.type === 'roundEnd') {
      body.innerHTML = \`<div class="round-end">🎯 \${d.message}</div>\`;

    } else if (d.type === 'rapidFire') {
      body.innerHTML = \`
        <div class="state-label">ROUND 3 — RAPID FIRE</div>
        <div class="rf-board">
          <div class="rf-team"><div class="rf-name">\${d.team1}</div><div class="rf-score" id="rp0">0</div></div>
          <div class="rf-vs">VS</div>
          <div class="rf-team"><div class="rf-name">\${d.team2}</div><div class="rf-score" id="rp1">0</div></div>
        </div>
        <div class="question-box" id="rf-q" style="opacity:0.5;">Ready...</div>
      \`;

    } else if (d.type === 'rapidQuestion') {
      const el = document.getElementById('rf-q');
      if (el) { el.textContent = d.question; el.style.opacity = '1'; }

    } else if (d.type === 'rapidScore') {
      const r0 = document.getElementById('rp0'), r1 = document.getElementById('rp1');
      if (r0) r0.textContent = d.t0score;
      if (r1) r1.textContent = d.t1score;

    } else if (d.type === 'winner') {
      body.innerHTML = \`
        <div class="winner-trophy">🏆</div>
        <div class="state-label" style="letter-spacing:6px;margin:8px 0;">CHAMPION</div>
        <div class="winner-big">\${d.team}</div>
      \`;

    } else if (d.type === 'passedToAudience') {
      body.innerHTML = \`
        <div class="state-label">\${d.round}</div>
        <div class="team-label t0" style="color:#ffd700;text-shadow:0 0 15px rgba(255,215,0,0.8);">📣 AUDIENCE</div>
        <div class="question-box">\${d.question}</div>
      \`;
    }
  } catch(err) {}
});

function updateScores(scores) {
  const el = document.getElementById('proj-scores');
  if (el) el.innerHTML = scores.map(s =>
    \`<div class="score-chip"><span>\${s.name}</span><span class="score-val">\${s.score}</span></div>\`
  ).join('');
}
<\/script>
</body>
</html>`;
