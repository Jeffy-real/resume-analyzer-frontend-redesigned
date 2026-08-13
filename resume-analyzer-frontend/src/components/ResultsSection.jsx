import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from './Icon';
import { ChartCard, BarChart } from './Charts';

// M3 semantic colors per section status. Text/badge tint and the progress-bar
// fill each get their own value so inline styles never need CSS-var opacity.
function statusColor(status) {
  if (status === 'complete') {
    return { text: 'var(--tertiary)', bg: 'rgba(0, 83, 56, 0.10)', bar: 'var(--tertiary)' };
  }
  if (status === 'review') {
    return { text: 'var(--secondary)', bg: 'rgba(80, 95, 118, 0.10)', bar: 'var(--secondary)' };
  }
  return { text: 'var(--outline)', bg: 'rgba(119, 117, 135, 0.10)', bar: 'var(--outline)' };
}

function statusLabel(status) {
  if (status === 'complete') return 'Complete';
  if (status === 'review') return 'Review';
  return 'Missing';
}

export function ResultsSection({ hasAnalysis, visibleName, analysis, selectedRole, title = 'Analysis Detail' }) {
  return (
    <section className="py-12 md:py-20 results-section" id="results">
      <div className="shell">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
              {title}
            </h2>
            <p className="mt-1 text-on-surface-variant">
              {visibleName} &middot; {selectedRole}
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="no-print inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm btn-secondary cursor-pointer self-start"
          >
            <Icon name="download" size={16} />
            <span>Download Report</span>
          </button>
        </div>

        {/* Score Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="text-3xl font-bold text-on-surface tabular-nums">
              {analysis.score}
              <span className="text-sm text-outline tabular-nums">/100</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">Overall Resume Score</p>
          </div>
          <div className="card">
            <div className="text-3xl font-bold text-tertiary tabular-nums">
              {analysis.ats}
              <span className="text-sm text-outline tabular-nums">/100</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">ATS Compatibility</p>
          </div>
          <div className="card">
            <div className="text-3xl font-bold text-primary tabular-nums">
              {analysis.matchedSkills.length}
            </div>
            <p className="text-xs text-on-surface-variant mt-1">Matched Skills</p>
          </div>
          <div className="card">
            <div className="text-3xl font-bold text-secondary tabular-nums">
              {analysis.missingSkills.length}
            </div>
            <p className="text-xs text-on-surface-variant mt-1">Missing Skills</p>
          </div>
        </div>

        {/* Resume Sections Table */}
        <div className="card mb-8">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-on-surface">Resume Sections</h3>
            <p className="text-xs text-outline mt-1">
              Completeness check for each major section
            </p>
          </div>
          <div className="space-y-2">
            {analysis.sections.map((item, idx) => {
              const pct = item.max > 0 ? Math.round((item.pts / item.max) * 100) : 0;
              const color = statusColor(item.status);
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.3 }}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-container-low transition-colors"
                >
                  <span
                    className="w-6 h-6 grid place-items-center rounded-md text-[10px] font-bold shrink-0"
                    style={{ background: color.bg, color: color.text }}
                  >
                    <Icon name={item.status === 'complete' ? 'check' : 'alert-circle'} size={13} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-on-surface truncate">{item.label}</span>
                      <span className="tabular-nums text-outline shrink-0 ml-3">
                        {item.pts}/{item.max}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface-container-low overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: color.bar }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.2 + idx * 0.04, duration: 0.6 }}
                      />
                    </div>
                  </div>
                  <span
                    className="text-[10px] font-medium shrink-0 px-2 py-0.5 rounded-full"
                    style={{ background: color.bg, color: color.text }}
                  >
                    {statusLabel(item.status)}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Keyword Analysis */}
        <div className="card mb-8">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-on-surface">Keyword Analysis</h3>
            <p className="text-xs text-outline mt-1">
              Extracted and missing keywords for {selectedRole}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-tertiary uppercase tracking-wider">
                  Matched ({analysis.matchedSkills.length})
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.matchedSkills.length > 0 ? (
                  analysis.matchedSkills.map((skill, idx) => (
                    <motion.span
                      key={`${skill}-${idx}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      className="chip chip-success"
                    >
                      <Icon name="check" size={12} />
                      {skill}
                    </motion.span>
                  ))
                ) : (
                  <p className="text-xs text-outline">No matched keywords</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider">
                  Missing ({analysis.missingSkills.length})
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSkills.length > 0 ? (
                  analysis.missingSkills.map((skill, idx) => (
                    <motion.span
                      key={`${skill}-${idx}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      className="chip chip-warning"
                    >
                      <Icon name="plus" size={12} />
                      {skill}
                    </motion.span>
                  ))
                ) : (
                  <p className="text-xs text-outline">No missing keywords</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Section Scores" description="Points earned per section">
            <BarChart
              data={analysis.sections.map((s) => ({
                label: s.label,
                value: s.max > 0 ? Math.round((s.pts / s.max) * 100) : 0,
                color: s.status === 'complete' ? 'var(--tertiary)' : 'var(--secondary)',
              }))}
            />
          </ChartCard>

          <ChartCard title="Skill Match" description="Matched vs missing keywords">
            <BarChart
              data={[
                { label: 'Matched', value: analysis.matchedSkills.length, color: 'var(--tertiary)' },
                { label: 'Missing', value: analysis.missingSkills.length, color: 'var(--secondary)' },
              ]}
              showValues={false}
            />
          </ChartCard>
        </div>

        {/* Feedback */}
        {analysis.tips && analysis.tips.length > 0 && (
          <div className="card">
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-on-surface">Improvement Suggestions</h3>
              <p className="text-xs text-outline mt-1">
                Ranked by impact for the {selectedRole} role
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {analysis.tips.map((tip, idx) => (
                <motion.div
                  key={tip.number}
                  className="p-4 border border-outline-variant rounded-xl space-y-2 transition-all hover:border-outline"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.08 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="badge badge-info">{tip.category || 'Feedback'}</span>
                    <span className="text-[10px] tabular-nums text-outline">{tip.impact}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-on-surface leading-snug">{tip.title}</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{tip.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
