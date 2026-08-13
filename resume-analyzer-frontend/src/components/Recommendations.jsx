import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from './Icon';

export function Recommendations({ tips = [] }) {
  if (!tips.length) return null;

  return (
    <div className="card">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-on-surface">Recommendations</h3>
        <p className="text-xs text-outline mt-1">
          Actionable suggestions to improve your resume for the selected role
        </p>
      </div>

      <div className="space-y-3">
        {tips.map((tip, idx) => (
          <motion.div
            key={tip.number || idx}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            className="group"
          >
            <RecommendationCard tip={tip} index={idx} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RecommendationCard({ tip, index }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border border-outline-variant rounded-xl overflow-hidden transition-all duration-200 hover:border-outline">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="w-8 h-8 grid place-items-center rounded-lg bg-primary/10 text-primary font-bold tabular-nums text-sm shrink-0">
          {tip.number || String(index + 1).padStart(2, '0')}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-on-surface">{tip.category}</span>
            <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-primary/10 text-primary">
              {tip.impact}
            </span>
          </div>
          <p className="mt-1 text-xs text-on-surface-variant line-clamp-1">{tip.title}</p>
        </div>
        <Icon
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={18}
          className="text-outline transition-transform duration-200 shrink-0"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 pb-4 border-t border-outline-variant bg-surface-container-lowest"
          >
            <p className="text-sm text-on-surface-variant leading-relaxed">{tip.text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
