import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from './Icon';

/* ------------------------------------------------------------------ */
/*  Sort + date-range options for the filter dropdowns                 */
/* ------------------------------------------------------------------ */
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'score', label: 'Highest Score' },
];

const RANGE_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: '7', label: 'Last 7 Days' },
  { value: '30', label: 'Last 30 Days' },
];

const PAGE_SIZE = 10;

/* ------------------------------------------------------------------ */
/*  Formatting helpers                                                 */
/* ------------------------------------------------------------------ */
function formatDate(ts) {
  const date = new Date(ts);
  if (Number.isNaN(date.getTime())) return { date: '—', time: '' };
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  };
}

// Short stable-ish ID shown next to the resume name (matches Stitch's "#8492A").
function shortId(id) {
  if (id == null) return '';
  return `#${String(id).slice(-6).toUpperCase()}`;
}

// Score circle colors. ATS ring: green high / blue mid / grey low.
function atsCircleClass(value) {
  if (value == null) return 'border-outline-variant text-on-surface-variant';
  if (value >= 70) return 'border-tertiary-fixed text-tertiary-fixed bg-tertiary-fixed/10';
  if (value >= 40) return 'border-secondary text-secondary bg-secondary/10';
  return 'border-outline-variant text-on-surface-variant';
}

// Resume score ring mirrors Stitch: indigo high / green mid / grey low.
function scoreCircleClass(value) {
  if (value == null) return 'border-outline-variant text-on-surface-variant';
  if (value >= 70) return 'border-primary-container text-primary-container bg-primary-container/10';
  if (value >= 40) return 'border-tertiary text-tertiary bg-tertiary/10';
  return 'border-outline-variant text-on-surface-variant';
}

function ScoreCircle({ value, className }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-10 h-10 rounded-full border-2 font-headline-sm text-headline-sm tabular-nums ${className}`}
    >
      {value == null ? '--' : Math.round(value)}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Dropdown menu body (anchored under the Filter / Date Range buttons)*/
/* ------------------------------------------------------------------ */
function FilterMenu({ options, value, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg p-1 z-50"
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-label-md text-label-md text-left transition-colors cursor-pointer ${
            value === opt.value
              ? 'text-primary bg-primary-fixed/50'
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
          }`}
        >
          {opt.label}
          {value === opt.value && <Icon name="check" size={16} />}
        </button>
      ))}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  CSV export of the currently visible history                        */
/* ------------------------------------------------------------------ */
function exportHistory(entries) {
  if (entries.length === 0) return;
  const header = ['Resume Name', 'Role Targeted', 'Resume Score', 'ATS Score', 'Date Analyzed'];
  const rows = entries.map((e) => [
    `"${(e.resumeName || '').replace(/"/g, '""')}"`,
    `"${(e.selectedRole || '').replace(/"/g, '""')}"`,
    e.score ?? '',
    e.ats ?? '',
    new Date(e.timestamp).toLocaleString('en-US'),
  ]);
  const csv = [header.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'resume-analysis-history.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/* ================================================================== */
/*  Analysis History (Stitch screen)                                  */
/* ================================================================== */
export function HistoryView({ history = [], onSelect, allRoles = {}, onDelete }) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const [range, setRange] = useState('all');
  const [openMenu, setOpenMenu] = useState(null); // 'filter' | 'date' | null
  const [page, setPage] = useState(0);

  // Reset pagination whenever the filtered set changes.
  useEffect(() => {
    setPage(0);
  }, [query, sort, range]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = history;

    if (q) {
      list = list.filter((e) =>
        (e.resumeName || '').toLowerCase().includes(q) ||
        (e.selectedRole || '').toLowerCase().includes(q) ||
        String(e.id).includes(q)
      );
    }

    if (range !== 'all') {
      const cutoff = Date.now() - Number(range) * 86400000;
      list = list.filter((e) => new Date(e.timestamp).getTime() >= cutoff);
    }

    const sorted = [...list];
    if (sort === 'oldest') sorted.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    else if (sort === 'score') sorted.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    else sorted.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return sorted;
  }, [history, query, sort, range]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const paged = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);
  const resultStart = filtered.length === 0 ? 0 : safePage * PAGE_SIZE + 1;
  const resultEnd = Math.min(filtered.length, (safePage + 1) * PAGE_SIZE);

  const closeMenu = () => setOpenMenu(null);

  const roleCategory = (role) => {
    if (!role) return '';
    return allRoles[role]?.category || '';
  };

  /* ---- Empty state (no analyses at all) ---- */
  if (!history || history.length === 0) {
    return (
      <section className="w-full max-w-container-max mx-auto px-md py-xl md:px-lg flex flex-col gap-lg">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl text-center py-16 shadow-sm">
          <Icon name="history" size={48} className="mx-auto text-outline" />
          <h2 className="mt-4 font-headline-md text-headline-md text-on-surface">No Analysis History</h2>
          <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
            Upload a resume and run an analysis to see it here
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-container-max mx-auto px-md py-xl md:px-lg flex flex-col gap-lg">
      {/* Header */}
      <header>
        <h2 className="font-headline-md text-headline-md text-on-surface">Analysis History</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {history.length} {history.length === 1 ? 'analysis' : 'analyses'} completed
        </p>
      </header>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/50 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="relative w-full sm:w-96">
          <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by candidate, role, or ID..."
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-colors placeholder:text-on-surface-variant"
            aria-label="Search history"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 relative z-50">
          {openMenu && <div className="fixed inset-0 z-40" onClick={closeMenu} aria-hidden="true" />}

          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === 'filter' ? null : 'filter')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors whitespace-nowrap cursor-pointer"
            >
              <Icon name="filter_list" size={18} />
              <span className="font-label-md text-label-md">Filter</span>
            </button>
            <AnimatePresence>
              {openMenu === 'filter' && (
                <FilterMenu options={SORT_OPTIONS} value={sort} onChange={setSort} />
              )}
            </AnimatePresence>
          </div>

          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === 'date' ? null : 'date')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors whitespace-nowrap cursor-pointer"
            >
              <Icon name="calendar_today" size={18} />
              <span className="font-label-md text-label-md">Date Range</span>
            </button>
            <AnimatePresence>
              {openMenu === 'date' && (
                <FilterMenu options={RANGE_OPTIONS} value={range} onChange={setRange} />
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={() => exportHistory(filtered)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors whitespace-nowrap cursor-pointer"
          >
            <Icon name="download" size={18} />
            <span className="font-label-md text-label-md">Export</span>
          </button>
        </div>
      </div>

      {/* Data Table (Desktop) & Cards (Mobile) */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Icon name="search" size={40} className="mx-auto text-outline" />
            <h3 className="mt-4 font-headline-sm text-headline-sm text-on-surface">No matching results</h3>
            <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            {/* ---- Desktop Table View ---- */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/50">
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant font-semibold w-1/4">Resume</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant font-semibold">Role Targeted</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant font-semibold text-center">ATS Score</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant font-semibold text-center">Resume Score</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant font-semibold">Date Analyzed</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant font-semibold">Status</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {paged.map((entry) => {
                    const { date, time } = formatDate(entry.timestamp);
                    const category = roleCategory(entry.selectedRole);
                    return (
                      <tr
                        key={entry.id}
                        onClick={() => onSelect && onSelect(entry)}
                        className="hover:bg-surface-container-low/50 transition-colors group cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                              <Icon name="description" size={18} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-body-md text-body-md font-medium text-on-surface truncate">{entry.resumeName}</p>
                              <p className="font-mono-sm text-mono-sm text-on-surface-variant">ID: {shortId(entry.id)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-body-md text-body-md text-on-surface">{entry.selectedRole || '—'}</p>
                          {category && <p className="font-label-md text-label-md text-on-surface-variant">{category}</p>}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <ScoreCircle value={entry.ats} className={atsCircleClass(entry.ats)} />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <ScoreCircle value={entry.score} className={scoreCircleClass(entry.score)} />
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-body-md text-body-md text-on-surface">{date}</p>
                          <p className="font-label-md text-label-md text-on-surface-variant">{time}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-container/10 text-tertiary-container font-label-md text-label-md border border-tertiary-container/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container" />
                            Completed
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              title="View Details"
                              aria-label={`View ${entry.resumeName}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelect && onSelect(entry);
                              }}
                              className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-surface-container-high cursor-pointer"
                            >
                              <Icon name="visibility" size={20} />
                            </button>
                            {onDelete && (
                              <button
                                type="button"
                                title="Delete"
                                aria-label={`Delete ${entry.resumeName}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`Remove "${entry.resumeName}" from history?`)) onDelete(entry);
                                }}
                                className="p-2 text-on-surface-variant hover:text-error transition-colors rounded-lg hover:bg-error-container/50 cursor-pointer"
                              >
                                <Icon name="delete" size={20} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ---- Mobile Card View ---- */}
            <div className="md:hidden flex flex-col divide-y divide-outline-variant/30">
              {paged.map((entry) => {
                const { date, time } = formatDate(entry.timestamp);
                const category = roleCategory(entry.selectedRole);
                return (
                  <div key={entry.id} className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <Icon name="description" size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-body-md text-body-md font-medium text-on-surface truncate max-w-[180px]">{entry.resumeName}</p>
                          <p className="font-mono-sm text-mono-sm text-on-surface-variant truncate max-w-[180px]">{entry.selectedRole || category || shortId(entry.id)}</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-tertiary-container/10 text-tertiary-container font-label-md text-label-md border border-tertiary-container/20 shrink-0">
                        Completed
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-surface-container-low rounded-lg p-3">
                      <div className="text-center flex-1">
                        <p className="font-label-md text-label-md text-on-surface-variant mb-1">ATS Match</p>
                        <span className="font-headline-sm text-headline-sm text-tertiary-fixed tabular-nums">
                          {entry.ats == null ? '--' : `${Math.round(entry.ats)}%`}
                        </span>
                      </div>
                      <div className="w-px h-8 bg-outline-variant/50" />
                      <div className="text-center flex-1">
                        <p className="font-label-md text-label-md text-on-surface-variant mb-1">Resume Score</p>
                        <span className="font-headline-sm text-headline-sm text-primary-container tabular-nums">
                          {entry.score == null ? '--' : `${Math.round(entry.score)}/100`}
                        </span>
                      </div>
                      <div className="w-px h-8 bg-outline-variant/50" />
                      <div className="text-right flex-1">
                        <p className="font-label-md text-label-md text-on-surface-variant mb-1">{date} {time}</p>
                        <button
                          type="button"
                          onClick={() => onSelect && onSelect(entry)}
                          className="text-primary font-label-md text-label-md hover:underline cursor-pointer"
                        >
                          View
                        </button>
                        {onDelete && (
                          <>
                            <span className="text-outline-variant mx-1">·</span>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Remove "${entry.resumeName}" from history?`)) onDelete(entry);
                              }}
                              className="text-error font-label-md text-label-md hover:underline cursor-pointer"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ---- Pagination Footer ---- */}
            <div className="px-6 py-4 border-t border-outline-variant/30 bg-surface-container-lowest flex items-center justify-between flex-wrap gap-3">
              <p className="font-label-md text-label-md text-on-surface-variant">
                Showing {resultStart} to {resultEnd} of {filtered.length} results
              </p>
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={safePage === 0}
                  aria-label="Previous page"
                  className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Icon name="chevron_left" size={18} />
                </button>
                {Array.from({ length: pageCount }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPage(i)}
                    aria-current={i === safePage ? 'page' : undefined}
                    className={`w-8 h-8 rounded font-body-md text-body-md flex items-center justify-center cursor-pointer transition-colors ${
                      i === safePage
                        ? 'bg-primary text-on-primary'
                        : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                  disabled={safePage >= pageCount - 1}
                  aria-label="Next page"
                  className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Icon name="chevron_right" size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
