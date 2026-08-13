import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from './Icon';

/* ------------------------------------------------------------------ */
/*  Local settings storage (auto-save — same contract as before)       */
/* ------------------------------------------------------------------ */
const STORAGE_KEY = 'resume-analyzer-settings';

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function applyTheme(mode) {
  const root = document.documentElement;
  const targetTheme = mode || localStorage.getItem('jobfirst-theme') || 'light';
  if (targetTheme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    root.classList.add('dark');
  } else if (targetTheme === 'light') {
    root.setAttribute('data-theme', 'light');
    root.classList.remove('dark');
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
    } else {
      root.setAttribute('data-theme', 'light');
      root.classList.remove('dark');
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Tabs (mirror the Stitch Settings screen)                           */
/* ------------------------------------------------------------------ */
const TABS = [
  { id: 'general', label: 'General' },
  { id: 'analysis', label: 'Analysis' },
  { id: 'reports', label: 'Reports' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'advanced', label: 'Advanced' },
];

/* ================================================================== */
/*  Settings (Stitch Settings screen)                                  */
/* ================================================================== */
export function SettingsView({ allRoles }) {
  const [settings, setSettings] = useState(() => loadSettings());
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState('general');

  // Auto-save + flash confirmation on every change.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    const t = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(t);
  }, [settings]);

  const update = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  const roleCount = allRoles ? Object.keys(allRoles).length : 0;

  /* Shared input classes from the Stitch export */
  const inputCls =
    'bg-surface-container-low border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded p-sm font-body-md text-on-surface w-full transition-colors outline-none cursor-pointer';
  const labelCls = 'font-label-md text-label-md text-on-surface-variant mb-xs';

  const fieldCardCls =
    'bg-surface-container-lowest rounded-lg border border-outline-variant p-lg shadow-[0_1px_3px_rgba(0,0,0,0.02)]';

  const unavailable = (
    <div className={`${fieldCardCls} flex flex-col items-center justify-center text-center py-xl`}>
      <Icon name="tune" size={40} className="text-outline mb-md" />
      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">Nothing to configure here yet</h2>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-[360px]">
        This section has no available options in the current build.
      </p>
    </div>
  );

  return (
    <section className="w-full max-w-3xl mx-auto px-md py-xl md:px-lg">
      {/* Page Header */}
      <div className="mb-lg">
        <h2 className="font-headline-md text-headline-md text-on-surface">Settings</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
          Manage your account preferences and application settings.
        </p>
      </div>

      {/* Horizontal Tabs */}
      <nav className="flex overflow-x-auto hide-scrollbar border-b border-outline-variant mb-xl" aria-label="Settings sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? 'page' : undefined}
            className={`font-label-md text-label-md px-4 py-3 whitespace-nowrap border-b-2 -mb-px transition-all active:scale-95 duration-100 cursor-pointer ${
              tab === t.id
                ? 'text-primary border-primary'
                : 'text-on-surface-variant border-transparent hover:text-on-surface hover:border-surface-variant'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          className="flex flex-col gap-gutter"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {/* General */}
          {tab === 'general' && (
            <section className={fieldCardCls}>
              <div className="mb-md">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Analysis Preferences</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Choose which role your resume is compared against by default.
                </p>
              </div>
              <div className="flex flex-col">
                <label className={labelCls} htmlFor="settings-target-role">
                  Default Target Role
                </label>
                <div className="relative">
                  <select
                    id="settings-target-role"
                    value={settings.defaultRole || ''}
                    onChange={(e) => update('defaultRole', e.target.value)}
                    className={`${inputCls} appearance-none pr-10`}
                  >
                    <option value="">Auto-select top match</option>
                    {(allRoles && Object.keys(allRoles).length > 0) ? (
                      Object.keys(allRoles).map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))
                    ) : (
                      <option value="" disabled>Loading roles…</option>
                    )}
                  </select>
                  <Icon name="expand_more" size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
                </div>
                {roleCount > 0 && (
                  <p className="font-mono-sm text-mono-sm text-on-surface-variant mt-sm">
                    {roleCount} roles available
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Analysis */}
          {tab === 'analysis' && (
            <section className={fieldCardCls}>
              <div className="mb-md">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Role Comparison Depth</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  How many top roles your resume is compared against during analysis.
                </p>
              </div>
              <div className="flex flex-col">
                <label className={labelCls} htmlFor="settings-depth">
                  Comparison Depth
                </label>
                <div className="relative">
                  <select
                    id="settings-depth"
                    value={settings.roleComparisonDepth ?? 20}
                    onChange={(e) => update('roleComparisonDepth', parseInt(e.target.value, 10))}
                    className={`${inputCls} appearance-none pr-10`}
                  >
                    {[10, 20, 50, 157].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 157 ? '(all roles)' : 'top roles'}
                      </option>
                    ))}
                  </select>
                  <Icon name="expand_more" size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
                </div>
                <p className="font-mono-sm text-mono-sm text-on-surface-variant mt-sm">
                  Higher values are slower but compare against more roles.
                </p>
              </div>
            </section>
          )}

          {/* Reports */}
          {tab === 'reports' && (
            <section className={fieldCardCls}>
              <div className="mb-md">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Export Format</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Preferred format when downloading analysis reports.
                </p>
              </div>
              <div className="flex gap-sm">
                {[
                  { value: 'print', label: 'Print / PDF', icon: 'printer' },
                  { value: 'json', label: 'JSON Data', icon: 'file-text' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => update('exportFormat', opt.value)}
                    aria-pressed={(settings.exportFormat || 'print') === opt.value}
                    className={`flex items-center gap-2 px-md py-sm text-body-md rounded-lg border transition-all cursor-pointer ${
                      (settings.exportFormat || 'print') === opt.value
                        ? 'bg-primary text-on-primary border-primary shadow-sm'
                        : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:border-primary hover:text-on-surface'
                    }`}
                  >
                    <Icon name={opt.icon} size={16} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Appearance */}
          {tab === 'appearance' && (
            <section className={fieldCardCls}>
              <div className="mb-md">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Theme & Appearance</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Customize the interface theme for light and dark environments.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-md">
                {[
                  { value: 'light', label: 'Light', icon: 'light_mode' },
                  { value: 'dark', label: 'Dark', icon: 'dark_mode' },
                  { value: 'system', label: 'System', icon: 'desktop_windows' },
                ].map((opt) => {
                  const currentTheme = settings.theme || 'light';
                  const isSelected = currentTheme === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        update('theme', opt.value);
                        localStorage.setItem('jobfirst-theme', opt.value);
                        applyTheme(opt.value);
                      }}
                      className={`flex flex-col items-center justify-center p-md rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary/10 text-primary border-primary font-semibold shadow-xs'
                          : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:border-outline hover:text-on-surface'
                      }`}
                    >
                      <Icon name={opt.icon} size={24} className="mb-xs" />
                      <span className="font-label-md text-label-md">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Not-yet-implemented tabs */}
          {['notifications', 'advanced'].includes(tab) && unavailable}
        </motion.div>
      </AnimatePresence>

      {/* Saved indicator */}
      <div className="h-8 flex items-center mt-md">
        <AnimatePresence>
          {saved && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="font-label-md text-label-md text-tertiary"
            >
              <Icon name="check_circle" size={14} className="inline mr-xs align-[-2px]" />
              Settings saved to this browser
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
