import React from 'react';
import { Reveal } from './Reveal';

const steps = [
  {
    num: '01',
    title: 'Resume file upload',
    desc: 'Users upload PDF or DOCX resume documents into the input parsing system.',
  },
  {
    num: '02',
    title: 'Text extraction & NLP',
    desc: 'System parses text content and isolates skills, structure, contact info, and education.',
  },
  {
    num: '03',
    title: 'ATS keyword matching',
    desc: 'Target job role keywords are compared with candidate resume text to compute match rate.',
  },
  {
    num: '04',
    title: 'Scoring & report generation',
    desc: 'Final parameter scores out of 100 and smart suggestions are rendered on the dashboard.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-18 sm:py-22 border-t border-[var(--border-hair)]">
      <div className="shell space-y-10">
        <Reveal>
          <span className="text-[11px] font-mono font-medium text-[var(--accent-cyan)] uppercase tracking-wider block mb-1">
            PROJECT ARCHITECTURE &amp; WORKFLOW
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[var(--text-primary)]">
            How the analysis engine operates
          </h2>
        </Reveal>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* connecting line, desktop only */}
          <div
            className="hidden lg:block absolute top-[27px] left-[12.5%] right-[12.5%] h-px"
            style={{ background: 'linear-gradient(90deg, rgba(124,92,255,0.5), rgba(52,224,234,0.5))' }}
            aria-hidden="true"
          />

          {steps.map((step, idx) => (
            <Reveal key={step.num} delay={idx * 100} className="relative card-glass card-glass-interactive p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span
                  className="relative z-10 inline-flex items-center justify-center w-9 h-9 rounded-lg text-xs font-mono font-bold text-[#04050c]"
                  style={{ backgroundImage: 'var(--gradient-signal)' }}
                >
                  {step.num}
                </span>
              </div>
              <h3 className="text-xs font-semibold text-[var(--text-primary)] leading-snug">
                {step.title}
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                {step.desc}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
