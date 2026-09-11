'use client';
import { useState, useEffect, useRef } from 'react';
import { TimerProps } from '@/types';

export default function Timer({ isRunning, onTimeUpdate, reset }: TimerProps) {
  const [seconds, setSeconds] = useState(0);
  const onTimeUpdateRef = useRef(onTimeUpdate);

  useEffect(() => {
    onTimeUpdateRef.current = onTimeUpdate;
  }, [onTimeUpdate]);

  useEffect(() => {
    if (reset !== undefined) {
      setSeconds(0);
      onTimeUpdateRef.current?.(0);
    }
  }, [reset]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const next = prev + 1;
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  useEffect(() => {
    onTimeUpdateRef.current?.(seconds);
  }, [seconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
      {formatTime(seconds)}
    </div>
  );
}
