import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Icon } from './Icon';

export function ChartCard({ title, description, children }) {
  return (
    <div className="card">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-on-surface">{title}</h3>
        {description && (
          <p className="text-xs text-on-surface-variant mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// Animated Radar Chart — flat muted fill, no glow
export function RadarChart({ sections, title = 'Section Strengths', description }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const duration = 1100;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const data = (sections || []).map((s) => ({
    label: s.label ? s.label.split(' ').slice(0, 2).join(' ').replace('&', '&') : '',
    value: s.max > 0 ? Math.round((s.pts / s.max) * 100) : 0,
  }));

  if (!data || data.length === 0) {
    return (
      <ChartCard title={title} description={description}>
        <p className="text-sm text-on-surface-variant">No section data available.</p>
      </ChartCard>
    );
  }

  const size = 280;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 48;
  const angleStep = (2 * Math.PI) / data.length;

  const getPoint = (index, value, scale = 1) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * radius * scale;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    };
  };

  const polygonPoints = data
    .map((item, idx) => {
      const point = getPoint(idx, item.value, progress);
      return `${point.x},${point.y}`;
    })
    .join(' ');

  const gridLevels = [25, 50, 75, 100];

  return (
    <ChartCard title={title} description={description}>
      <svg width="100%" height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto overflow-visible">
        {/* Grid circles */}
        {gridLevels.map((level) => (
          <circle
            key={level}
            cx={centerX}
            cy={centerY}
            r={(level / 100) * radius}
            fill="none"
            stroke="var(--outline-variant)"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {data.map((_, idx) => {
          const end = getPoint(idx, 100);
          return (
            <line
              key={idx}
              x1={centerX}
              y1={centerY}
              x2={end.x}
              y2={end.y}
              stroke="var(--outline-variant)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        <motion.polygon
          points={polygonPoints}
          fill="rgba(53, 37, 205, 0.12)"
          stroke="var(--primary)"
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />

        {/* Data points */}
        {data.map((item, idx) => {
          const point = getPoint(idx, item.value, progress);
          return (
            <motion.circle
              key={idx}
              cx={point.x}
              cy={point.y}
              r="3.5"
              fill="var(--primary)"
              stroke="var(--surface)"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.45 + idx * 0.05, duration: 0.3 }}
            />
          );
        })}

        {/* Labels */}
        {data.map((item, idx) => {
          const angle = idx * angleStep - Math.PI / 2;
          const labelRadius = radius + 28;
          const x = centerX + labelRadius * Math.cos(angle);
          const y = centerY + labelRadius * Math.sin(angle);
          return (
            <text
              key={idx}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[10px] fill-on-surface-variant"
            >
              {item.label}
            </text>
          );
        })}
      </svg>
    </ChartCard>
  );
}

// Animated Bar Chart — flat colors
export function BarChart({ data, showValues = true }) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-3">
      {data.map((item, idx) => (
        <div key={idx} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-on-surface-variant truncate">{item.label}</span>
            {showValues && (
              <motion.span
                className="tabular-nums font-medium text-on-surface"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
              >
                {item.value}%
              </motion.span>
            )}
          </div>
          <div className="h-2 rounded-full bg-surface-container-low overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: item.color || 'var(--primary)' }}
              initial={{ width: 0 }}
              animate={{ width: `${(item.value / maxValue) * 100}%` }}
              transition={{
                delay: 0.2 + idx * 0.08,
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Animated Donut Chart — flat segmented colors, clean legend
export function DonutChart({ matched = 0, missing = 0, title = 'ATS Keyword Match', description }) {
  const data = [
    { label: 'Matched', value: matched, color: 'var(--tertiary)' },
    { label: 'Missing', value: missing, color: 'var(--secondary)' },
  ];
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const size = 140;
  const thickness = 20;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const matchedPercent = Math.round((matched / total) * 100);

  let accumulatedOffset = 0;

  return (
    <ChartCard title={title} description={description}>
      <div className="flex items-center gap-6">
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="var(--surface-container-low)"
              strokeWidth={thickness}
            />
            {data.map((item, idx) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = (percentage / 100) * circumference;
              const strokeDashoffset = -accumulatedOffset;
              accumulatedOffset += strokeDasharray;

              return (
                <motion.circle
                  key={idx}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={thickness}
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{
                    delay: 0.3 + idx * 0.15,
                    duration: 0.8,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                />
              );
            })}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-2xl font-bold text-on-surface tabular-nums"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {matchedPercent}%
            </motion.span>
            <span className="text-[10px] text-on-surface-variant">Match</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3">
          {data.map((item) => (
            <div key={item.label} className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-2 text-on-surface-variant">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                {item.label}
              </span>
              <span className="tabular-nums font-semibold text-on-surface">{item.value}</span>
            </div>
          ))}
          <div className="pt-2 border-t border-outline-variant">
            <div className="flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Total keywords</span>
              <span className="tabular-nums font-semibold text-on-surface">{total}</span>
            </div>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}

// Skill Distribution Grid
export function SkillDistribution({ matched, missing }) {
  const total = matched.length + missing.length;
  const matchedPercent = total > 0 ? Math.round((matched.length / total) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs">
        <span className="text-on-surface-variant">Skill Match Rate</span>
        <span className="tabular-nums font-bold text-on-surface">{matchedPercent}%</span>
      </div>

      <div className="h-3 rounded-full bg-surface-container-low overflow-hidden flex">
        <motion.div
          className="h-full bg-tertiary"
          initial={{ width: 0 }}
          animate={{ width: `${matchedPercent}%` }}
          transition={{ delay: 0.3, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-3 rounded-xl bg-tertiary/10 border border-tertiary/20">
          <motion.div
            className="text-xl font-bold text-tertiary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {matched.length}
          </motion.div>
          <div className="text-[10px] text-on-surface-variant mt-1">Matched</div>
        </div>
        <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20">
          <motion.div
            className="text-xl font-bold text-secondary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {missing.length}
          </motion.div>
          <div className="text-[10px] text-on-surface-variant mt-1">Missing</div>
        </div>
      </div>
    </div>
  );
}

export const Charts = {
  RadarChart,
  BarChart,
  DonutChart,
  SkillDistribution,
  ChartCard,
};
