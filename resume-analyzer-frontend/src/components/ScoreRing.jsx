import React, { useEffect, useRef, useState } from 'react';

let ringIdCounter = 0;

export function ScoreRing({ value, label, size = 'lg' }) {
  const [displayValue, setDisplayValue] = useState(0);
  const gradientId = useRef(`score-ring-gradient-${ringIdCounter++}`);
  const frameRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const from = displayValue;
    const to = value;
    const duration = 900;

    const step = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      }
    };

    frameRef.current = requestAnimationFrame(step);
    return () => frameRef.current && cancelAnimationFrame(frameRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const dims = size === 'lg' ? 112 : 84;
  const dash = `${displayValue} 100`;

  return (
    <div
      className="relative grid place-items-center mx-auto"
      style={{ width: dims, height: dims }}
    >
      <svg
        className="absolute w-full h-full -rotate-90"
        viewBox="0 0 42 42"
        aria-label={`${label}: ${value} percent`}
      >
        <defs>
          <linearGradient id={gradientId.current} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c5cff" />
            <stop offset="100%" stopColor="#34e0ea" />
          </linearGradient>
        </defs>
        <circle
          className="fill-none stroke-[3.4]"
          style={{ stroke: 'rgba(255,255,255,0.07)' }}
          cx="21"
          cy="21"
          r="15.9155"
        />
        <circle
          className="fill-none stroke-[3.4] stroke-linecap-round"
          style={{
            stroke: `url(#${gradientId.current})`,
            filter: 'drop-shadow(0 0 6px rgba(124,92,255,0.55))',
          }}
          cx="21"
          cy="21"
          r="15.9155"
          pathLength="100"
          strokeDasharray={dash}
        />
      </svg>
      <div className="relative flex flex-col items-center leading-none">
        <strong className="text-gradient text-2xl font-heading font-extrabold tracking-tight">
          {displayValue}
        </strong>
        <span className="text-[10px] text-[var(--text-muted)] font-mono mt-1 font-medium">/100</span>
      </div>
    </div>
  );
}
