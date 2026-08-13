import React from 'react';
import { motion } from 'motion/react';
import { Icon } from './Icon';

function formatTime(ts) {
  const date = new Date(ts);
  if (Number.isNaN(date.getTime())) return '';
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOfDay(new Date()) - startOfDay(date)) / 86400000);
  const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 0) return `Today, ${time}`;
  if (diffDays === 1) return `Yesterday, ${time}`;
  return date.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function RadialScore({ score = 0 }) {
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let scoreLabel = 'Needs Optimization';
  let badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  let strokeColor = '#f59e0b';

  if (score >= 80) {
    scoreLabel = 'Strong Resume';
    badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    strokeColor = '#10b981';
  } else if (score >= 60) {
    scoreLabel = 'Good Resume';
    badgeColor = 'bg-primary/10 text-primary border-primary/30';
    strokeColor = '#3b82f6';
  }

  return (
    <div className="flex flex-col items-center justify-center p-md bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-surface-variant"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeLinecap="round"
            fill="transparent"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline">
            <span className="font-display-lg text-display-lg text-on-surface font-extrabold tabular-nums">
              {score}
            </span>
            <span className="font-headline-sm text-headline-sm text-on-surface-variant ml-1 font-medium">
              /100
            </span>
          </div>
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold mt-1">
            Resume Score
          </span>
        </div>
      </div>
      <div className={`mt-4 px-4 py-1.5 rounded-full border ${badgeColor} font-label-md text-label-md font-semibold`}>
        {scoreLabel}
      </div>
    </div>
  );
}

function ScoreBar({ label, weight, score }) {
  let barColor = 'bg-primary';
  if (score >= 80) barColor = 'bg-emerald-500';
  else if (score < 60) barColor = 'bg-amber-500';

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3 shadow-sm flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div>
          <span className="font-body-md text-body-md text-on-surface font-medium">{label}</span>
          <span className="font-label-md text-label-md text-outline ml-2">({weight})</span>
        </div>
        <span className="font-headline-sm text-headline-sm text-on-surface font-bold tabular-nums">
          {score}<span className="text-body-md text-outline font-normal">/100</span>
        </span>
      </div>
      <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
        <motion.div
          className={`h-2 rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(score, 100)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export function Dashboard({
  analysis,
  recommendations,
  selectedRole,
  onSelectRole,
  allRoles,
  recommendationsLoading,
  isAnalyzing,
  history = [],
  onOpenReports,
  onOpenHistory,
  onQuickUpload,
}) {
  if (!analysis || !analysis.resumeName) {
    return (
      <section className="w-full max-w-container-max mx-auto px-md py-xl md:px-lg">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl text-center py-16 shadow-sm">
          <Icon name="file-text" size={48} className="mx-auto text-outline" />
          <h2 className="mt-4 font-headline-md text-headline-md text-on-surface">No Analysis Yet</h2>
          <p className="mt-2 font-body-md text-body-md text-on-surface-variant">Upload a resume to view your evaluation results</p>
        </div>
      </section>
    );
  }

  const overallScore = analysis.score ?? 0;
  const targetRole = selectedRole || analysis.targetRole || 'Software Engineer';
  const roleNames = allRoles ? Object.keys(allRoles) : [];

  const breakdownItems = [
    { label: 'ATS Compatibility', weight: '20%', score: analysis.ats ?? 0 },
    { label: 'Skills Match', weight: '25%', score: analysis.skillsScore ?? 75 },
    { label: 'Experience Relevance', weight: '20%', score: analysis.experienceScore ?? 75 },
    { label: 'Projects & Achievements', weight: '15%', score: analysis.projectsScore ?? 75 },
    { label: 'Education', weight: '10%', score: analysis.educationScore ?? 75 },
    { label: 'Resume Quality & Clarity', weight: '10%', score: analysis.qualityScore ?? 75 },
  ];

  const matchedSkills = analysis.matchedSkills || [];
  const missingSkills = analysis.missingSkills || [];
  const strengths = analysis.strengths || [
    'Strong overall resume structure and readability.',
    'Clear breakdown of technical skills.'
  ];
  const weaknesses = analysis.weaknesses || [
    'Missing target role keyword density.',
    'Work experience could include more quantified metrics.'
  ];
  const recommendationsList = analysis.recommendations || [
    `Incorporate missing skills for ${targetRole} into work experience bullets.`,
    'Use metrics like percentages, scale, or performance numbers to quantify impacts.'
  ];
  const keywords = analysis.keywords || [];

  return (
    <section className="w-full max-w-container-max mx-auto px-md py-xl md:px-lg flex flex-col gap-lg">
      {/* Top Header & Role Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md border-b border-outline-variant pb-lg">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">Resume Dashboard</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Evaluated for <span className="text-primary font-semibold">{targetRole}</span>
          </p>
        </div>

        {/* Target Role Selector */}
        <div className="flex items-center gap-sm bg-surface-container-lowest border border-outline-variant rounded-lg p-2 shadow-sm">
          <label htmlFor="dashboard-role-select" className="font-label-md text-label-md text-on-surface-variant font-medium whitespace-nowrap">
            Target Role:
          </label>
          <select
            id="dashboard-role-select"
            value={targetRole}
            onChange={(e) => onSelectRole(e.target.value)}
            className="bg-transparent font-body-md text-body-md text-on-surface font-semibold focus:outline-none cursor-pointer pr-4"
          >
            {roleNames.map((r) => (
              <option key={r} value={r} className="bg-surface text-on-surface">
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Row 1: Large Circular Score Gauge & 6-Dimension Score Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-stretch">
        <div className="lg:col-span-4 flex flex-col">
          <RadialScore score={overallScore} />
        </div>

        <div className="lg:col-span-8 flex flex-col justify-between gap-md bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Score Breakdown</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">
              Evaluation across 6 weighted dimensions tuned for {targetRole}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {breakdownItems.map((item) => (
              <ScoreBar key={item.label} label={item.label} weight={item.weight} score={item.score} />
            ))}
          </div>
        </div>
      </div>

      {/* Grid Row 2: Insights (Strengths, Areas to Improve, Skills, Recommendations) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* Left Column: Strengths & Weaknesses */}
        <div className="lg:col-span-6 flex flex-col gap-lg">
          {/* Strengths */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <h3 className="font-headline-sm text-headline-sm text-emerald-400 flex items-center gap-2 mb-md">
              <Icon name="check_circle" size={22} className="text-emerald-400" />
              Strengths
            </h3>
            <ul className="flex flex-col gap-sm">
              {strengths.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-body-md text-on-surface bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-lg">
                  <span className="text-emerald-400 font-bold mt-0.5">&check;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas to Improve */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <h3 className="font-headline-sm text-headline-sm text-amber-400 flex items-center gap-2 mb-md">
              <Icon name="warning" size={22} className="text-amber-400" />
              Areas to Improve
            </h3>
            <ul className="flex flex-col gap-sm">
              {weaknesses.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-body-md text-on-surface bg-amber-500/5 border border-amber-500/10 p-3 rounded-lg">
                  <span className="text-amber-400 font-bold mt-0.5">&excl;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Missing Skills, Keywords & Suggestions */}
        <div className="lg:col-span-6 flex flex-col gap-lg">
          {/* Missing Skills & Recommended Keywords */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm flex flex-col gap-md">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs flex items-center gap-2">
                <Icon name="layers" size={20} className="text-error" />
                Missing Skills for {targetRole}
              </h3>
              {missingSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {missingSkills.map((s) => (
                    <span key={s} className="font-mono-sm text-mono-sm text-error bg-error-container/40 border border-error/30 px-2.5 py-1 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">All required skills present in resume!</p>
              )}
            </div>

            {keywords.length > 0 && (
              <div className="pt-md border-t border-outline-variant">
                <h4 className="font-headline-sm text-headline-sm text-on-surface mb-xs flex items-center gap-2">
                  <Icon name="tag" size={20} className="text-primary" />
                  Recommended Keywords
                </h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {keywords.map((kw) => (
                    <span key={kw} className="font-mono-sm text-mono-sm text-primary bg-primary-container/20 border border-primary/30 px-2.5 py-1 rounded">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Improvement Suggestions */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 mb-md">
              <Icon name="lightbulb" size={22} className="text-tertiary" />
              Improvement Suggestions
            </h3>
            <ul className="flex flex-col gap-2">
              {recommendationsList.map((rec, idx) => (
                <li key={idx} className="font-body-md text-body-md text-on-surface-variant bg-surface p-3 rounded-lg border border-outline-variant flex items-start gap-2">
                  <span className="text-primary font-bold">{idx + 1}.</span>
                  <span>{typeof rec === 'string' ? rec : rec.text || rec.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-md pt-lg border-t border-outline-variant">
        <button
          type="button"
          onClick={onQuickUpload}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-outline-variant text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors cursor-pointer"
        >
          <Icon name="cloud_upload" size={18} />
          Upload Another Resume
        </button>

        {onOpenReports && (
          <button
            type="button"
            onClick={onOpenReports}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-medium hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
          >
            <Icon name="download" size={18} />
            Download Detailed Report
          </button>
        )}
      </div>
    </section>
  );
}
