import React from 'react';
import { motion } from 'motion/react';
import { Charts } from './Charts';
import { Icon } from './Icon';

export function SkillAnalysis({ matchedSkills = [], missingSkills = [] }) {
  if (!matchedSkills.length && !missingSkills.length) return null;

  return (
    <div className="card">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-on-surface">Skill Analysis</h3>
        <p className="text-xs text-outline mt-1">
          Detailed breakdown of matched and missing skills for the selected role
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-tertiary uppercase tracking-wider">
              Matched Skills ({matchedSkills.length})
            </h4>
            <Icon name="check-circle-2" size={14} className="text-tertiary" />
          </div>
          <div className="flex flex-wrap gap-2">
            {matchedSkills.slice(0, 20).map((skill, idx) => (
              <motion.span
                key={`${skill}-${idx}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.02 }}
                className="chip chip-success"
              >
                {skill}
              </motion.span>
            ))}
            {matchedSkills.length > 20 && (
              <span className="chip badge-info">
                +{matchedSkills.length - 20} more
              </span>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider">
              Missing Skills ({missingSkills.length})
            </h4>
            <Icon name="alert-circle" size={14} className="text-secondary" />
          </div>
          <div className="flex flex-wrap gap-2">
            {missingSkills.slice(0, 20).map((skill, idx) => (
              <motion.span
                key={`${skill}-${idx}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.02 }}
                className="chip chip-warning"
              >
                {skill}
              </motion.span>
            ))}
            {missingSkills.length > 20 && (
              <span className="chip badge-warning">
                +{missingSkills.length - 20} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Distribution Chart */}
      <Charts.SkillDistribution matched={matchedSkills} missing={missingSkills} />
    </div>
  );
}
