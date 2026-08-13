import React from 'react';
import { motion } from 'motion/react';
import { Icon } from './Icon';

// Memoized row so role re-selection / unrelated state changes don't re-render
// the whole 20-row list.
const RoleRecommendationRow = React.memo(function RoleRecommendationRow({
  rec,
  idx,
  isSelected,
  onSelectRole,
}) {
  const matchPercent = rec.match_percentage ?? rec.score ?? 0;
  const atsScore = rec.ats_score ?? Math.round(matchPercent);
  const missingCount = Array.isArray(rec.missing_required_skills)
    ? rec.missing_required_skills.length
    : null;
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.03, duration: 0.3 }}
    >
      <button
        type="button"
        onClick={() => onSelectRole(rec.role)}
        className={`w-full flex items-center gap-4 p-3 rounded-lg text-left transition-all duration-150 ${
          isSelected
            ? 'bg-primary/10 border border-primary/20'
            : 'hover:bg-surface-container-low border border-transparent'
        }`}
      >
        <span className="w-6 shrink-0 text-xs tabular-nums text-outline">
          {String(idx + 1).padStart(2, '0')}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-on-surface truncate">
              {rec.role}
            </span>
            {isSelected && (
              <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-primary/10 text-primary">
                Selected
              </span>
            )}
          </div>
          <span className="text-[11px] text-outline">{rec.category}</span>
          <div className="mt-1 min-w-0">
            {missingCount !== null ? (
              missingCount > 0 ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-secondary">
                  <Icon name="alert-circle" size={12} />
                  <span className="truncate">
                    Missing {missingCount} required {missingCount === 1 ? 'skill' : 'skills'}
                  </span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-tertiary">
                  <Icon name="check" size={12} />
                  <span className="truncate">All required skills matched</span>
                </span>
              )
            ) : (
              <span className="text-[11px] text-outline tabular-nums truncate">
                {rec.matched_keywords}/{rec.total_keywords} keywords
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="w-12 text-right shrink-0">
            <span className="tabular-nums font-semibold text-on-surface">{matchPercent}%</span>
          </div>
          <div className="w-24 shrink-0 hidden sm:block">
            <div className="h-1.5 rounded-full bg-surface-container-low overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'var(--primary)' }}
                initial={{ width: 0 }}
                animate={{ width: `${matchPercent}%` }}
                transition={{ delay: 0.2 + idx * 0.04, duration: 0.6 }}
              />
            </div>
          </div>
          <span className="w-14 text-center shrink-0 px-2 py-1 rounded-md text-[11px] font-medium tabular-nums bg-primary/10 text-primary">
            ATS {atsScore}
          </span>
          <Icon name="chevron-right" size={16} className="text-outline shrink-0" />
        </div>
      </button>
    </motion.div>
  );
});

export function RoleRecommendations({ recommendations, selectedRole, onSelectRole, loading = false, allRoles }) {
  if (!recommendations || recommendations.length === 0) return null;

  const topRecommendations = recommendations.slice(0, 20);

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-on-surface">Top Role Matches</h3>
        <p className="text-xs text-outline mt-1">
          Ranked by skill/keyword match against your resume. Click a role to run detailed ATS analysis.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3" role="status" aria-label="Loading recommendations">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-14 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {topRecommendations.map((rec, idx) => (
            <RoleRecommendationRow
              key={rec.role}
              rec={rec}
              idx={idx}
              isSelected={selectedRole === rec.role}
              onSelectRole={onSelectRole}
            />
          ))}

          {recommendations.length > 20 && (
            <div className="pt-4 border-t border-outline-variant">
              <p className="text-center text-xs text-outline">
                Showing top 20 of {recommendations.length} roles. Use the Role Browser to explore all supported roles.
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
