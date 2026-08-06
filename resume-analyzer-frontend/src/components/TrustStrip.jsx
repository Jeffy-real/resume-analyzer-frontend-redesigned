import React from 'react';
import { Icon } from './Icon';
import { Reveal } from './Reveal';

export function TrustStrip() {
  const items = [
    {
      icon: 'target',
      title: 'ATS Keyword Matching',
      desc: 'Compares document terms against target role requirements.',
    },
    {
      icon: 'layers',
      title: 'Structure Evaluation',
      desc: 'Audit contact info, summary, skills, projects, & education.',
    },
    {
      icon: 'chart',
      title: 'Report & Export',
      desc: 'Generates scoring metrics with downloadable PDF reports.',
    },
  ];

  return (
    <section className="py-9 border-y border-[var(--border-hair)]" id="features">
      <div className="shell grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {items.map((item, idx) => (
          <Reveal key={idx} delay={idx * 90} className="card-glass card-glass-interactive p-4 flex items-center gap-3.5">
            <div
              className="w-10 h-10 shrink-0 grid place-items-center rounded-xl text-[var(--accent-cyan)]"
              style={{ background: 'var(--gradient-signal-soft, rgba(52,224,234,0.1))', border: '1px solid rgba(52,224,234,0.24)' }}
            >
              <Icon name={item.icon} size={18} />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-0.5">{item.title}</h4>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mb-0">{item.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
