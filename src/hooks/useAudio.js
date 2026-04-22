let ac = null;
function getAC() {
  if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
  return ac;
}

export function beep(type) {
  try {
    const a = getAC();
    const t = a.currentTime;

    const note = (freq, start, dur, type = 'sine', vol = 0.2) => {
      const o = a.createOscillator();
      const g = a.createGain();
      o.type = type;
      o.frequency.value = freq;
      o.connect(g); g.connect(a.destination);
      g.gain.setValueAtTime(vol, t + start);
      g.gain.exponentialRampToValueAtTime(0.001, t + start + dur);
      o.start(t + start); o.stop(t + start + dur);
    };

    if (type === 'correct') {
      [523, 659, 784, 1047].forEach((f, i) => note(f, i * 0.1, 0.25, 'sine', 0.22));
    } else if (type === 'wrong') {
      note(200, 0, 0.4, 'sawtooth', 0.3);
      note(150, 0.15, 0.35, 'sawtooth', 0.25);
    } else if (type === 'buzz') {
      note(880, 0, 0.08, 'square', 0.35);
      note(660, 0.05, 0.1, 'square', 0.3);
      note(880, 0.12, 0.08, 'square', 0.35);
    } else if (type === 'tick') {
      note(1200, 0, 0.05, 'sine', 0.07);
    } else if (type === 'timeout') {
      note(440, 0, 0.3, 'sawtooth', 0.4);
      note(330, 0.2, 0.3, 'sawtooth', 0.35);
      note(220, 0.4, 0.4, 'sawtooth', 0.3);
    } else if (type === 'fanfare') {
      [523, 659, 784, 1047, 1319].forEach((f, i) => note(f, i * 0.12, 0.3, 'sine', 0.18));
    }
  } catch (e) {}
}
