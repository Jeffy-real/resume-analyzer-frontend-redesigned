import React from 'react';
import { Icon } from './Icon';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-hair)] py-8" style={{ backgroundColor: 'var(--bg-deep)' }}>
      <div className="shell flex flex-col sm:flex-row items-center justify-between gap-4">
        <a href="#top" className="inline-flex items-center gap-2.5 text-[var(--text-primary)] font-heading text-sm font-bold">
          <span
            className="w-7 h-7 grid place-items-center rounded-lg text-[#04050c]"
            style={{ backgroundImage: 'var(--gradient-signal)' }}
          >
            <Icon name="sparkle" size={14} />
          </span>
          <span>Smart Resume Analyzer</span>
        </a>

        <div className="text-xs text-[var(--text-secondary)] font-mono text-center sm:text-right space-y-0.5">
          <div>SkillOrbit AI Capstone Project — Final Deliverable</div>
          <div className="text-[11px] text-[var(--text-muted)]">Built with React, Tailwind CSS, &amp; Rule-Based NLP Logic</div>
        </div>
      </div>
    </footer>
  );
}
