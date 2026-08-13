import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Icon } from './Icon';

const savedJobsKey = 'jobfirst-saved-jobs';
function readSavedJobs() {
  try { return JSON.parse(localStorage.getItem(savedJobsKey)) || []; } catch { return []; }
}
function writeSavedJobs(jobs) {
  localStorage.setItem(savedJobsKey, JSON.stringify(jobs));
}

/* ------------------------------------------------------------------ */
/*  Shared Page Wrapper                                                 */
/* ------------------------------------------------------------------ */
function Page({ title, subtitle, children }) {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 py-8 md:px-6 flex flex-col gap-6">
      <header className="border-b border-outline-variant pb-4">
        <h2 className="text-2xl font-bold text-on-surface tracking-tight">{title}</h2>
        <p className="text-sm text-on-surface-variant mt-1 max-w-2xl leading-relaxed">{subtitle}</p>
      </header>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty State                                                          */
/* ------------------------------------------------------------------ */
function EmptyState({ icon, title, text, action, onAction }) {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
      className="w-full bg-surface-container-lowest border border-outline-variant rounded-2xl py-16 px-8 shadow-sm text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary grid place-items-center mb-4 mx-auto shrink-0">
        <Icon name={icon} size={30} />
      </div>
      <h3 className="text-lg font-bold text-on-surface mb-2">{title}</h3>
      <p
        style={{
          maxWidth: '360px',
          width: '100%',
          textAlign: 'center',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          lineHeight: '1.6',
          color: 'var(--color-on-surface-variant)',
          fontSize: '0.875rem',
          margin: '0 auto',
        }}
      >
        {text}
      </p>
      {action && (
        <button type="button" onClick={onAction} className="btn-primary mt-6">
          {action}
        </button>
      )}
    </div>
  );
}

function pct(n) { return `${Math.round(n || 0)}%`; }

/* ------------------------------------------------------------------ */
/*  Job Matches                                                          */
/* ------------------------------------------------------------------ */
export function JobMatchesView({ recommendations = [], analysis = {}, selectedRole, onSelectRole, onOpenReports }) {
  const [savedJobs, setSavedJobs] = useState(() => readSavedJobs());

  const jobs = useMemo(() => {
    const recs = recommendations.length ? recommendations : [
      { role: selectedRole || 'Frontend Engineer', match_percentage: analysis.ats || 72, matched_keywords: 5, missing_keywords: 3 },
      { role: 'React Developer', match_percentage: 68, matched_keywords: 6, missing_keywords: 4 },
      { role: 'Product Engineer', match_percentage: 61, matched_keywords: 5, missing_keywords: 5 },
      { role: 'Full Stack Developer', match_percentage: 55, matched_keywords: 4, missing_keywords: 6 },
    ];
    return recs.slice(0, 10).map((r, i) => ({
      id: r.role || `job-${i}`,
      title: r.role || 'Recommended Role',
      company: ['NimbusWorks', 'Indigo Labs', 'Northstar Systems', 'Orbit Cloud'][i % 4],
      location: ['Remote', 'Bengaluru · Hybrid', 'Pune · On-site', 'Mumbai · Hybrid'][i % 4],
      match: r.match_percentage ?? r.score ?? 0,
      skills: (analysis.matchedSkills || ['React', 'JavaScript', 'REST APIs', 'Git']).slice(0, 5),
      missing: (analysis.missingSkills || ['TypeScript', 'Testing', 'AWS']).slice(0, 4),
    }));
  }, [recommendations, analysis, selectedRole]);

  const saveJob = (job) => {
    const exists = savedJobs.some((j) => j.id === job.id);
    const next = exists
      ? savedJobs.filter((j) => j.id !== job.id)
      : [{ ...job, savedAt: new Date().toISOString() }, ...savedJobs];
    setSavedJobs(next);
    writeSavedJobs(next);
  };

  const matchColor = (pct) => {
    if (pct >= 75) return 'bg-tertiary/10 text-tertiary border border-tertiary/20';
    if (pct >= 55) return 'bg-primary/10 text-primary border border-primary/20';
    return 'bg-outline/10 text-on-surface-variant border border-outline-variant';
  };

  return (
    <Page title="Job Matches" subtitle="Recommended jobs and roles ranked by resume match, skills coverage, and missing skill gaps.">
      <div className="flex flex-col gap-4">
        {jobs.map((job, idx) => {
          const saved = savedJobs.some((j) => j.id === job.id);
          return (
            <motion.article
              key={job.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-base font-bold text-on-surface">{job.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${matchColor(job.match)}`}>
                      {pct(job.match)} match
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant mt-1">{job.company} · {job.location}</p>

                  <div className="mt-4 grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2">Matched skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {job.skills.map((s) => (
                          <span key={s} className="chip chip-success">
                            <Icon name="check" size={11} />{s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2">Missing skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {job.missing.length
                          ? job.missing.map((s) => <span key={s} className="chip chip-warning"><Icon name="add" size={11} />{s}</span>)
                          : <span className="text-xs text-on-surface-variant italic">No major gaps</span>
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 lg:flex-col xl:flex-row">
                  <button
                    type="button"
                    onClick={() => saveJob(job)}
                    className={saved ? 'btn-primary' : 'btn-secondary'}
                  >
                    <Icon name={saved ? 'check' : 'bookmark'} size={15} />
                    {saved ? 'Saved' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { onSelectRole?.(job.title); onOpenReports?.(); }}
                    className="btn-secondary"
                  >
                    <Icon name="open_in_new" size={15} />
                    View Report
                  </button>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/*  Skill Gap                                                            */
/* ------------------------------------------------------------------ */
export function SkillGapView({ analysis = {} }) {
  const matched = analysis.matchedSkills || [];
  const missing = analysis.missingSkills || [];
  const total = matched.length + missing.length;
  const coveragePct = total ? Math.round((matched.length / total) * 100) : 0;

  return (
    <Page title="Skill Gap" subtitle="Track current skills, missing skills, proficiency priorities, and recommendations.">
      {/* Summary bar */}
      {total > 0 && (
        <div className="bg-primary text-on-primary rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium opacity-90">Overall Coverage</p>
            <p className="text-3xl font-bold mt-0.5">{coveragePct}%</p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold">{matched.length}</p>
              <p className="opacity-80">Matched</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{missing.length}</p>
              <p className="opacity-80">Missing</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Skills Coverage */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-on-surface mb-4">Skills Coverage</h3>
          {matched.length ? (
            <div className="flex flex-col gap-3">
              {matched.map((s, i) => {
                const proficiency = 85 - (i % 4) * 7;
                return (
                  <div key={s}>
                    <div className="flex justify-between text-sm font-medium mb-1">
                      <span className="text-on-surface">{s}</span>
                      <span className="text-primary font-semibold">{proficiency}%</span>
                    </div>
                    <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <motion.div
                        className="h-2 bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${proficiency}%` }}
                        transition={{ duration: 0.6, delay: i * 0.05 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon="psychology"
              title="No skill data yet"
              text="Analyze a resume to populate your current skills and proficiency levels."
            />
          )}
        </div>

        {/* Priority Gaps */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-on-surface mb-4">Priority Gaps</h3>
          {missing.length ? (
            <div className="flex flex-col gap-3">
              {missing.map((s, i) => (
                <div key={s} className="p-3 rounded-xl bg-surface-container-low border border-outline-variant">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-on-surface">{s}</span>
                    <span className={i < 3 ? 'badge badge-danger' : 'badge badge-warning'}>
                      {i < 3 ? 'High' : 'Medium'}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Add quantified project evidence or coursework for this skill.
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-on-surface-variant text-center py-8 italic">
              No priority skill gaps detected.
            </div>
          )}
        </div>
      </div>

      {/* Recommendation Banner */}
      {total === 0 && (
        <EmptyState
          icon="layers"
          title="Upload a resume to see your skill gap"
          text="Once you analyze a resume, you'll see a breakdown of matched and missing skills with proficiency levels and recommended actions."
        />
      )}
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/*  Career Insights                                                      */
/* ------------------------------------------------------------------ */
export function CareerInsightsView({ analysis = {}, recommendations = [] }) {
  const strengths = (analysis.matchedSkills || []).slice(0, 8);
  const weaknesses = (analysis.missingSkills || []).slice(0, 8);
  const roles = recommendations.slice(0, 5).map((r) => r.role || 'Recommended Role');
  const atsScore = analysis.ats || 0;

  return (
    <Page title="Career Insights" subtitle="Strengths, weaknesses, recommended roles, and ATS/resume insights in one place.">
      {/* ATS Score hero */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-1 bg-primary text-on-primary rounded-2xl p-5 flex flex-col justify-between">
          <p className="text-sm font-medium opacity-90">ATS Compatibility</p>
          <p className="text-5xl font-black mt-2">{atsScore}%</p>
          <p className="text-xs opacity-75 mt-2">
            {atsScore >= 75 ? 'Strong match' : atsScore >= 50 ? 'Moderate match' : 'Needs improvement'}
          </p>
        </div>
        <div className="sm:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-on-surface mb-3">ATS / Resume Tips</h3>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            <li className="flex gap-2">
              <Icon name="check_circle" size={16} className="text-tertiary shrink-0 mt-0.5" />
              <span>Align keywords to the target job description</span>
            </li>
            <li className="flex gap-2">
              <Icon name="check_circle" size={16} className="text-tertiary shrink-0 mt-0.5" />
              <span>Add measurable achievements (numbers, %s, impact)</span>
            </li>
            <li className="flex gap-2">
              <Icon name="check_circle" size={16} className="text-tertiary shrink-0 mt-0.5" />
              <span>Keep profile sections complete and consistent</span>
            </li>
            <li className="flex gap-2">
              <Icon name="check_circle" size={16} className="text-tertiary shrink-0 mt-0.5" />
              <span>Use standard section headings for parser compatibility</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Strengths */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-on-surface mb-4 flex items-center gap-2">
            <Icon name="thumb_up" size={18} className="text-tertiary" /> Strengths
          </h3>
          {strengths.length ? (
            <div className="flex flex-wrap gap-2">
              {strengths.map((s) => (
                <span key={s} className="chip chip-success"><Icon name="check" size={12} />{s}</span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant italic">Run an analysis to identify strengths.</p>
          )}
        </div>

        {/* Weaknesses */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-on-surface mb-4 flex items-center gap-2">
            <Icon name="warning" size={18} className="text-warning" /> Areas to Improve
          </h3>
          {weaknesses.length ? (
            <div className="flex flex-wrap gap-2">
              {weaknesses.map((s) => (
                <span key={s} className="chip chip-warning"><Icon name="add" size={12} />{s}</span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant italic">No weakness data yet. Analyze a resume first.</p>
          )}
        </div>
      </div>

      {/* Recommended Roles */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm">
        <h3 className="text-base font-bold text-on-surface mb-4 flex items-center gap-2">
          <Icon name="trending_up" size={18} className="text-primary" /> Recommended Roles
        </h3>
        {roles.length ? (
          <div className="flex flex-col gap-2">
            {roles.map((r, i) => (
              <div key={r} className="flex justify-between items-center p-3 rounded-xl bg-surface-container-low border border-outline-variant hover:border-primary/30 transition-colors">
                <span className="text-sm font-medium text-on-surface">{r}</span>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  #{i + 1}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-on-surface-variant italic">Analyze a resume to unlock role recommendations.</p>
        )}
      </div>
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/*  Saved Jobs                                                           */
/* ------------------------------------------------------------------ */
export function SavedJobsView({ onOpenMatches }) {
  const [jobs, setJobs] = useState(() => readSavedJobs());
  const remove = (id) => {
    const next = jobs.filter((j) => j.id !== id);
    setJobs(next);
    writeSavedJobs(next);
  };

  return (
    <Page title="Saved Jobs" subtitle="Your shortlisted roles and job listings for follow-up and applications.">
      {jobs.length ? (
        <div className="flex flex-col gap-4">
          {jobs.map((job) => (
            <article
              key={job.id}
              className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow"
            >
              <div className="min-w-0">
                <h3 className="text-base font-bold text-on-surface">{job.title}</h3>
                <p className="text-sm text-on-surface-variant mt-0.5">
                  {job.company} · {job.location} · <span className="text-primary font-semibold">{pct(job.match)} match</span>
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button type="button" className="btn-secondary" onClick={() => onOpenMatches?.()}>
                  <Icon name="visibility" size={15} /> View
                </button>
                <button type="button" onClick={() => remove(job.id)} className="btn-ghost text-error">
                  <Icon name="delete" size={15} /> Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="bookmark"
          title="No saved jobs yet"
          text="Save matched roles from the Job Matches page to build a focused application shortlist."
          action="Explore Job Matches"
          onAction={onOpenMatches}
        />
      )}
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/*  Resume Library                                                       */
/* ------------------------------------------------------------------ */
export function ResumeLibraryView({ history = [], onOpenHistory, onDelete }) {
  return (
    <Page title="Resume Library" subtitle="Uploaded resumes, ATS scores, dates, versions, and actions.">
      {history.length ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-surface-container-low border-b border-outline-variant text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
            <span>Resume</span>
            <span>ATS Score</span>
            <span>Date</span>
            <span>Version</span>
            <span className="text-right">Actions</span>
          </div>
          {history.map((entry, i) => (
            <div
              key={entry.id || i}
              className="grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 border-t border-outline-variant items-center hover:bg-surface-container-low/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">
                  <Icon name="description" size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-on-surface truncate">{entry.resumeName}</p>
                  <p className="text-xs text-on-surface-variant">{entry.selectedRole || 'General'}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-primary">{entry.ats ?? 0}%</span>
              <span className="text-sm text-on-surface-variant">
                {entry.timestamp ? new Date(entry.timestamp).toLocaleDateString() : '—'}
              </span>
              <span className="badge badge-info">v{history.length - i}</span>
              <div className="flex justify-start md:justify-end gap-2">
                <button type="button" onClick={() => onOpenHistory?.(entry)} className="btn-secondary py-1.5 text-xs">
                  <Icon name="visibility" size={14} /> View
                </button>
                <button type="button" onClick={() => onOpenHistory?.(entry)} className="btn-secondary py-1.5 text-xs">
                  Analyze
                </button>
                {onDelete && (
                  <button type="button" onClick={() => onDelete(entry)} className="btn-ghost text-error py-1.5">
                    <Icon name="delete" size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="folder_open"
          title="Your resume library is empty"
          text="Upload and analyze resumes to see ATS scores, versions, dates, and quick actions here."
        />
      )}
    </Page>
  );
}
