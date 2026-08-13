import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from './Icon';

/* ------------------------------------------------------------------ */
/*  Score badge coloring (mirrors Stitch match badges)                 */
/* ------------------------------------------------------------------ */
function matchBadge(pct) {
  if (pct == null) {
    return {
      className: 'bg-surface-container-high text-on-surface-variant',
      icon: 'remove',
      label: 'Not evaluated',
    };
  }
  if (pct >= 80) return { className: 'bg-tertiary-container/10 text-tertiary-container', icon: 'verified', label: `${pct}% Match` };
  if (pct >= 55) return { className: 'bg-primary/10 text-primary', icon: 'check_circle', label: `${pct}% Match` };
  return { className: 'bg-surface-container-high text-on-surface-variant', icon: 'remove', label: `${pct}% Match` };
}

// Memoized card so typing in search doesn't re-render every card.
const RoleCard = React.memo(function RoleCard({ role, rec, idx, isSelected, onSelectRole, onClose }) {
  const pct = rec ? (rec.match_percentage ?? rec.score ?? null) : null;
  const ats = rec ? (rec.ats_score ?? null) : null;
  const missing = rec ? (rec.missing_required_skills && rec.missing_required_skills.length ? rec.missing_required_skills : null) : null;
  const badge = matchBadge(pct);

  const select = () => {
    onSelectRole(role.name);
    onClose();
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(idx, 12) * 0.02, duration: 0.25 }}
      className="bg-surface-container-lowest rounded-lg border border-outline-variant p-lg flex flex-col gap-md hover:shadow-[0_10px_20px_-5px_rgba(0,0,0,0.08)] transition-shadow group cursor-pointer"
    >
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-xs mb-xs">
            <span className="font-label-md text-label-md text-secondary">{role.category || 'General'}</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors leading-tight">
            {role.name}
          </h3>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded font-label-md text-label-md ${badge.className}`}>
            <Icon name={badge.icon} size={16} />
            {badge.label}
          </span>
          {ats != null && (
            <span className="font-mono-sm text-mono-sm text-secondary">ATS: {Math.round(ats)}/100</span>
          )}
        </div>
      </div>

      <div className="flex-grow">
        <h4 className="font-label-md text-label-md text-on-surface mb-sm">Key Skills</h4>
        <div className="flex flex-wrap gap-xs mb-md">
          {(role.required_skills || []).slice(0, 6).map((s) => (
            <span key={s} className="px-2 py-1 bg-surface-container-low text-on-surface-variant font-mono-sm text-mono-sm rounded">
              {s}
            </span>
          ))}
          {role.required_skills && role.required_skills.length > 6 && (
            <span className="px-2 py-1 bg-surface-container-low text-on-surface-variant font-mono-sm text-mono-sm rounded">
              +{role.required_skills.length - 6}
            </span>
          )}
        </div>

        {missing && missing.length > 0 && (
          <>
            <h4 className="font-label-md text-label-md text-on-surface mb-sm">Missing Skills</h4>
            <div className="flex flex-wrap gap-xs">
              {missing.slice(0, 4).map((s) => (
                <span key={s} className="px-2 py-1 bg-error-container/30 text-error font-mono-sm text-mono-sm rounded border border-error-container/60">
                  {s}
                </span>
              ))}
              {missing.length > 4 && (
                <span className="px-2 py-1 font-mono-sm text-mono-sm text-outline">+{missing.length - 4}</span>
              )}
            </div>
          </>
        )}
        {!missing && (
          <p className="font-label-md text-label-md text-outline">
            Run an analysis to see skill coverage for this role.
          </p>
        )}
      </div>

      <div className="pt-4 border-t border-surface-container-high mt-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span
            role="checkbox"
            aria-checked={isSelected}
            tabIndex={0}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                onSelectRole(role.name);
                onClose();
              }
            }}
            className={`w-4 h-4 rounded grid place-items-center border transition-colors cursor-pointer ${
              isSelected ? 'bg-primary border-primary text-on-primary' : 'border-outline-variant bg-surface-container-lowest'
            }`}
          >
            {isSelected && <Icon name="check" size={13} />}
          </span>
          <span className={`font-label-md text-label-md ${isSelected ? 'text-primary' : 'text-secondary'}`}>
            {isSelected ? 'Selected for analysis' : 'Target role'}
          </span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            select();
          }}
          className="text-primary font-label-md text-label-md hover:underline flex items-center gap-1 cursor-pointer"
        >
          View Role
          <Icon name="arrow_forward" size={16} />
        </button>
      </div>
    </motion.article>
  );
});

export function RoleBrowser({ allRoles, onSelectRole, selectedRole, onClose, recommendations = [] }) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('match');
  const dialogRef = useRef(null);

  // Lookup map so cards can pull live match/ATS data from the last analysis.
  const recMap = useMemo(() => {
    const m = new Map();
    (recommendations || []).forEach((r) => m.set(r.role, r));
    return m;
  }, [recommendations]);

  // Lock background scroll while the dialog is open.
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Close on Escape.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  // Keep Tab / Shift+Tab within the dialog.
  const handleDialogKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    const nodes = dialogRef.current?.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!nodes || nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const categories = useMemo(() => {
    const cats = new Set(Object.values(allRoles).map((r) => r.category).filter(Boolean));
    return ['all', ...Array.from(cats).sort()];
  }, [allRoles]);

  const roleCount = Object.keys(allRoles).length;
  const hasRecommendations = recommendations.length > 0;

  const filteredRoles = useMemo(() => {
    const q = search.trim().toLowerCase();
    const roles = Object.values(allRoles).filter((role) => {
      const matchesSearch =
        q === '' ||
        role.name.toLowerCase().includes(q) ||
        (role.category || '').toLowerCase().includes(q) ||
        (role.required_skills || []).some((s) => s.toLowerCase().includes(q)) ||
        (role.preferred_skills || []).some((s) => s.toLowerCase().includes(q));
      const matchesCategory = categoryFilter === 'all' || role.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    const recOf = (role) => recMap.get(role.name);
    const pctOf = (role) => {
      const rec = recOf(role);
      return rec ? (rec.match_percentage ?? rec.score ?? -1) : -1;
    };

    roles.sort((a, b) => {
      if (sortBy === 'category') {
        return (a.category || '').localeCompare(b.category || '') || a.name.localeCompare(b.name);
      }
      if (sortBy === 'match' && hasRecommendations) {
        const pa = pctOf(a);
        const pb = pctOf(b);
        if ((pa < 0) !== (pb < 0)) return pa < 0 ? 1 : -1;
        if (pa !== pb) return pb - pa;
        return a.name.localeCompare(b.name);
      }
      return a.name.localeCompare(b.name);
    });
    return roles;
  }, [allRoles, search, categoryFilter, sortBy, hasRecommendations, recMap]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/45 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="role-browser-title"
    >
      <motion.div
        ref={dialogRef}
        onKeyDown={handleDialogKeyDown}
        className="w-full max-w-6xl max-h-[88vh] flex flex-col bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-2xl"
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 16 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-lg py-md border-b border-outline-variant bg-surface flex items-start justify-between gap-4">
          <div>
            <h2 id="role-browser-title" className="font-headline-md text-headline-md text-on-surface">Job Role Intelligence</h2>
            <p className="font-body-md text-body-md text-secondary mt-xs">
              {roleCount} predefined roles to target your analysis.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close role browser"
            className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors cursor-pointer"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="px-lg pt-lg pb-md border-b border-outline-variant flex flex-col md:flex-row gap-md items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-md w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Icon name="search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
              <input
                type="text"
                placeholder="Search job roles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded pl-10 pr-4 py-2 font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline text-on-surface"
                aria-label="Search job roles"
                autoFocus
              />
            </div>
            <div className="flex gap-sm overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full font-label-md text-label-md border transition-colors cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container-lowest text-secondary border-outline-variant hover:bg-surface-container-low'
                  }`}
                >
                  {cat === 'all' ? 'All Roles' : cat}
                </button>
              ))}
            </div>
          </div>
          <div className="relative w-full md:w-48 shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded pl-3 pr-8 py-2 font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer text-on-surface"
              aria-label="Sort roles"
            >
              <option value="match">Sort by: Match %</option>
              <option value="alpha">Sort by: Alphabetical</option>
              <option value="category">Sort by: Category</option>
            </select>
            <Icon name="expand_more" size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-lg py-lg">
          {filteredRoles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Icon name="search_off" size={48} className="text-outline mb-4" />
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">No roles found</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-gutter">
              {filteredRoles.map((role, idx) => (
                <RoleCard
                  key={role.name}
                  role={role}
                  rec={recMap.get(role.name) || null}
                  idx={idx}
                  isSelected={selectedRole === role.name}
                  onSelectRole={onSelectRole}
                  onClose={onClose}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-lg py-md border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between">
          <p className="font-label-md text-label-md text-on-surface-variant">
            Showing {filteredRoles.length} of {roleCount} roles{hasRecommendations ? ' · ranked by real analysis data' : ''}
          </p>
          <span className="font-mono-sm text-mono-sm text-outline">v1.2.0</span>
        </div>
      </motion.div>
    </motion.div>
  );
}