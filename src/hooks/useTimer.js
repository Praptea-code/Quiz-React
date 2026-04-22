import { useState, useEffect, useRef } from 'react';

export function useTimer(initial = 60) {
  const [seconds, setSeconds] = useState(initial);
  const [running, setRunning] = useState(false);
  const ivRef = useRef(null);
  const cbRef = useRef(null);

  const start = (sec, onTick, onDone) => {
    clearInterval(ivRef.current);
    setSeconds(sec);
    cbRef.current = { onTick, onDone };
    setRunning(true);
    let rem = sec;
    ivRef.current = setInterval(() => {
      rem--;
      setSeconds(rem);
      cbRef.current?.onTick?.(rem);
      if (rem <= 0) {
        clearInterval(ivRef.current);
        setRunning(false);
        cbRef.current?.onDone?.();
      }
    }, 1000);
  };

  const stop = () => {
    clearInterval(ivRef.current);
    setRunning(false);
  };

  useEffect(() => () => clearInterval(ivRef.current), []);

  const urgency = seconds <= 5 ? 'danger' : seconds <= 15 ? 'warn' : 'ok';

  return { seconds, running, urgency, start, stop };
}
