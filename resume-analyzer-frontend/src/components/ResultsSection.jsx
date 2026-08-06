import React from 'react';
import { Icon } from './Icon';
import { ScoreRing } from './ScoreRing';
import { Reveal } from './Reveal';

export function ResultsSection({ hasAnalysis, visibleName, analysis, selectedRole }) {
  return (
    <section className="py-16 sm:py-20 results-section" id="results">
      <div className="shell">
        {/* Results Heading Bar */}
        <Reveal className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono font-medium text-[var(--accent-cyan)] uppercase tracking-wider">
                MODULES 2, 3, 4 &amp; 5
              </span>
              <span className="text-[var(--text-muted)]">•</span>
              <span className="text-xs text-[var(--text-secondary)] font-medium">Evaluation Dashboard &amp; Report</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[var(--text-primary)]">
              {hasAnalysis ? 'Resume analysis results & report' : 'Sample analysis dashboard preview'}
            </h2>
          </div>

          <div className="inline-flex items-center gap-2 max-w-full sm:max-w-[300px] px-3.5 py-1.5 rounded-lg card-solid text-xs font-mono text-[var(--text-secondary)] truncate">
            <span className="shrink-0 text-[var(--accent-cyan)]">
              <Icon name="file" size={15} />
            </span>
            <span className="truncate">{visibleName}</span>
          </div>
        </Reveal>

        {/* Top 3 Metrics Grid (Module 2 & 3) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Main Score Card (5 cols) */}
          <Reveal as="article" delay={0} className="md:col-span-5 card-glass card-glass-interactive p-6 flex items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-semibold text-[var(--accent-violet)] uppercase tracking-wider">
                OVERALL RESUME SCORE
              </span>
              <h3 className="text-xl font-heading font-bold text-[var(--text-primary)] leading-tight">
                {analysis.score >= 80 ? 'Strong Candidate Resume' : 'Moderate Match'}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-[220px]">
                Evaluated against structure, skills, education, projects, contact info, and completeness parameters.
              </p>
            </div>
            <div className="shrink-0">
              <ScoreRing value={analysis.score} label="Overall resume score" />
            </div>
          </Reveal>

          {/* ATS Card (3 cols) */}
          <Reveal as="article" delay={80} className="md:col-span-3 card-glass card-glass-interactive p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider" style={{ color: 'var(--color-success)' }}>
                  ATS MATCH RATE
                </span>
                <span className="badge badge-emerald px-2 py-0.5 text-[10px]">
                  {analysis.ats >= 75 ? 'Pass Grade' : 'Review'}
                </span>
              </div>
              <div className="text-3xl font-heading font-bold text-[var(--text-primary)] my-1">
                {analysis.ats}%
                <span className="text-xs font-normal text-[var(--text-muted)] ml-1.5">keyword match</span>
              </div>
              <div className="progress-track h-2 my-3">
                <div
                  className="progress-fill"
                  style={{ width: `${analysis.ats}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              Role target: <strong className="text-[var(--text-primary)]">{selectedRole}</strong>
            </p>
          </Reveal>

          {/* Parameters Summary (4 cols) */}
          <Reveal as="article" delay={160} className="md:col-span-4 card-glass card-glass-interactive p-6">
            <span className="block text-[10px] font-mono font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
              EVALUATION PARAMETERS (MODULE 2)
            </span>
            <div className="space-y-2">
              {analysis.sections.slice(0, 3).map((item) => (
                <div key={item.label} className="flex items-center justify-between text-xs border-b border-[var(--border-hair)] pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-4 h-4 grid place-items-center rounded text-[9px] font-bold ${
                        item.status === 'complete'
                          ? 'badge-emerald'
                          : 'badge-amber'
                      }`}
                    >
                      {item.status === 'complete' ? <Icon name="check" size={10} /> : '!'}
                    </span>
                    <span className="font-medium text-[var(--text-primary)]">{item.label}</span>
                  </div>
                  <small className="text-[10px] text-[var(--text-muted)] font-mono">{item.pts}/{item.max} pts</small>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Detail Grid (Skill Gap + Sections) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
          {/* Module 3: Skill Gap Analysis Card (7 cols) */}
          <Reveal as="article" className="md:col-span-7 card-glass card-glass-interactive p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <span className="text-[10px] font-mono font-semibold text-[var(--accent-violet)] uppercase tracking-wider block">
                  MODULE 3: ATS KEYWORD CHECKER
                </span>
                <h3 className="text-base font-heading font-bold text-[var(--text-primary)] mt-1">
                  Required skills &amp; keyword comparison ({selectedRole})
                </h3>
              </div>
              <span className="badge badge-violet px-2.5 py-1 text-xs shrink-0">
                {selectedRole}
              </span>
            </div>

            {/* Matched Skills */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-success)' }} />
                <span>Extracted &amp; matched keywords ({analysis.matchedSkills.length})</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.matchedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="chip chip-matched px-2.5 py-1 text-xs"
                  >
                    <Icon name="check" size={12} />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div>
              <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-warning)' }} />
                <span>Missing industry keywords ({analysis.missingSkills.length})</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="chip chip-missing px-2.5 py-1 text-xs"
                  >
                    <Icon name="plus" size={12} />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Module 2 Parameters Check Card (5 cols) */}
          <Reveal as="article" delay={100} className="md:col-span-5 card-glass card-glass-interactive p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <span className="text-[10px] font-mono font-semibold text-[var(--text-muted)] uppercase tracking-wider block">
                  MODULE 2: PARAMETER AUDIT
                </span>
                <h3 className="text-base font-heading font-bold text-[var(--text-primary)] mt-1">
                  Section completeness check
                </h3>
              </div>
              <span className="px-2.5 py-1 text-xs font-mono text-[var(--text-secondary)] bg-white/5 rounded border border-[var(--border-hair)] shrink-0">
                Score Breakdown
              </span>
            </div>

            <div className="space-y-2.5">
              {analysis.sections.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-xs py-1 border-b border-[var(--border-hair)]/70 last:border-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-4 h-4 grid place-items-center rounded text-[9px] font-bold ${
                        item.status === 'complete'
                          ? 'badge-emerald'
                          : 'badge-amber'
                      }`}
                    >
                      {item.status === 'complete' ? <Icon name="check" size={10} /> : '!'}
                    </span>
                    <span className="font-medium text-[var(--text-primary)]">{item.label}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">
                    {item.pts}/{item.max} pts
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Module 4 & 5: Smart Feedback System & Report Export */}
        <Reveal as="article" className="mt-4 rounded-xl card-glass p-6 sm:p-8 space-y-6 feedback-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-hair)] pb-6">
            <div>
              <span className="text-[10px] font-mono font-semibold text-[var(--accent-violet)] uppercase tracking-wider block mb-1">
                MODULE 4 &amp; 5: SMART FEEDBACK &amp; REPORT GENERATION
              </span>
              <h3 className="text-xl sm:text-2xl font-heading font-bold text-[var(--text-primary)]">
                Personalized improvement suggestions
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Review tailored suggestions ranked by priority and export a print-ready report.
              </p>
            </div>

            <button
              className="no-print inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs btn-signal cursor-pointer"
              type="button"
              onClick={() => window.print()}
            >
              <Icon name="download" size={15} />
              <span>Export PDF Report</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysis.tips.map((tip, idx) => (
              <div
                key={tip.number}
                className="relative p-4 bg-white/[0.02] border border-[var(--border-hair)] rounded-lg space-y-2 overflow-hidden transition-colors hover:border-[var(--border-strong)]"
              >
                <span
                  className="absolute -top-3 -right-2 text-[52px] font-heading font-black leading-none opacity-[0.06] select-none"
                  aria-hidden="true"
                >
                  {tip.number}
                </span>
                <div className="flex items-center justify-between relative">
                  <span className="badge badge-violet px-2 py-0.5 text-[10px] font-semibold">
                    {tip.category || 'Feedback'}
                  </span>
                  <span className="text-[10px] font-mono" style={{ color: 'var(--color-warning)' }}>
                    {tip.impact}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-[var(--text-primary)] leading-snug relative">
                  {tip.title}
                </h4>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed relative">
                  {tip.text}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
