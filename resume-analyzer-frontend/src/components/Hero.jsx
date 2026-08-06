import React from 'react';
import { Icon } from './Icon';
import { Reveal } from './Reveal';

export function Hero({ loadSampleResume }) {
  return (
    <section className="relative py-16 lg:py-24 border-b border-[var(--border-hair)] overflow-hidden" id="overview">
      <div className="shell grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative">
        {/* Left Copy & Action Column */}
        <div className="lg:col-span-7 space-y-6">
          <Reveal>
            <div className="badge badge-violet px-3 py-1 text-[11px] font-medium">
              <Icon name="terminal" size={14} />
              <span>AI CAPSTONE PROJECT — RECRUITMENT &amp; ATS ENGINE</span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-heading font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.08]">
              Analyze &amp; optimize your resume <br className="hidden sm:block" />
              for <span className="text-gradient">industry hiring standards</span>
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="max-w-xl text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              Evaluate your resume structure, calculate ATS compatibility scores, extract missing technical keywords, and receive actionable feedback tailored for modern hiring workflows.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#upload"
                className="inline-flex items-center gap-2 px-5 py-3 text-xs btn-signal"
              >
                <Icon name="upload" size={15} />
                <span>Upload Resume File</span>
              </a>

              <button
                type="button"
                onClick={loadSampleResume}
                className="inline-flex items-center gap-2 px-4 py-3 text-xs btn-ghost cursor-pointer"
              >
                <Icon name="file" size={15} />
                <span>Try Sample Resume</span>
              </button>
            </div>
          </Reveal>

          <Reveal delay={260}>
            <div className="flex items-center gap-5 pt-4 text-[11px] font-mono text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] pulse-dot" />
                Live parser online
              </span>
              <span>·</span>
              <span>No sign-up required</span>
            </div>
          </Reveal>
        </div>

        {/* Right Preview Card Column */}
        <Reveal delay={160} className="lg:col-span-5 relative grid place-items-center">
          <div className="w-full max-w-sm card-glass card-glass-interactive p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-hair)] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--color-success)] pulse-dot" />
                <span className="text-xs font-mono font-medium text-[var(--text-secondary)]">PARSER EVALUATION</span>
              </div>
              <span className="badge badge-cyan px-2 py-0.5 text-[10px]">
                MODULE 2 &amp; 3
              </span>
            </div>

            <div className="flex items-center justify-around py-2">
              <div className="text-center">
                <div className="text-3xl font-heading font-extrabold text-gradient">82<span className="text-xs text-[var(--text-muted)] font-normal">/100</span></div>
                <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase mt-1">Resume Score</div>
              </div>
              <div className="h-10 w-px bg-[var(--border-hair)]" />
              <div className="text-center">
                <div className="text-3xl font-heading font-extrabold" style={{ color: 'var(--color-success)' }}>76%</div>
                <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase mt-1">ATS Compatibility</div>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-[var(--border-hair)] text-xs">
              <div className="flex items-center justify-between text-[var(--text-secondary)]">
                <span className="text-[var(--text-muted)]">Resume Structure</span>
                <span className="font-mono font-medium" style={{ color: 'var(--color-success)' }}>Complete (15/15)</span>
              </div>
              <div className="flex items-center justify-between text-[var(--text-secondary)]">
                <span className="text-[var(--text-muted)]">Skills Section</span>
                <span className="font-mono font-medium" style={{ color: 'var(--color-success)' }}>Matched (20/25)</span>
              </div>
              <div className="flex items-center justify-between text-[var(--text-secondary)]">
                <span className="text-[var(--text-muted)]">Projects Section</span>
                <span className="font-mono font-medium" style={{ color: 'var(--color-warning)' }}>Action Needed (14/20)</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
