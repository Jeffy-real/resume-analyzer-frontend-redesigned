import React from 'react';
import { Icon } from './Icon';

const STORAGE_KEY = 'resume-analyzer-profile';
function loadName() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY))?.name || ''; } catch { return ''; }
}

const NAV_GROUPS = [
  {
    label: 'Analysis',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
      { id: 'upload', label: 'Analyze Resume', icon: 'psychology' },
      { id: 'history', label: 'History', icon: 'history' },
      { id: 'reports', label: 'Reports', icon: 'description' },
    ],
  },
  {
    label: 'Career',
    items: [
      { id: 'job-matches', label: 'Job Matches', icon: 'target' },
      { id: 'skill-gap', label: 'Skill Gap', icon: 'layers' },
      { id: 'career-insights', label: 'Career Insights', icon: 'trending_up' },
      { id: 'saved-jobs', label: 'Saved Jobs', icon: 'bookmark' },
      { id: 'resume-library', label: 'Resume Library', icon: 'folder_open' },
    ],
  },
  {
    label: 'Account',
    items: [
      { id: 'profile', label: 'Profile', icon: 'person' },
    ],
  },
];

export function Sidebar({ view, onViewChange, hasAnalysis, profile, onOpenAuth, authUser, onLogout }) {
  const userName = authUser?.name || profile?.name || loadName() || 'Alex Rivers';
  const userRole = profile?.currentRole || profile?.headline || 'Candidate';
  const initials = userName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AR';

  const handleNav = (id) => {
    if ((id === 'dashboard' || id === 'reports') && !hasAnalysis) {
      onViewChange('upload');
    } else {
      onViewChange(id);
    }
  };

  return (
    <aside className="hidden md:flex fixed inset-y-0 left-0 w-[240px] flex-col bg-surface-container-lowest border-r border-outline-variant z-40">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-outline-variant shrink-0">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0 shadow-sm">
          <Icon name="analytics" size={18} style={{ color: 'var(--color-on-primary)' }} />
        </div>
        <span className="text-lg font-bold text-primary tracking-tight">
          JobFirst
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 overflow-y-auto" aria-label="Sidebar navigation">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-1">
            <div className="sidebar-section-label">{group.label}</div>
            <div className="flex flex-col gap-px">
              {group.items.map((item) => {
                const isActive = view === item.id;
                const isDisabled = (item.id === 'dashboard' || item.id === 'reports') && !hasAnalysis;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNav(item.id)}
                    disabled={isDisabled}
                    className={`relative w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer text-left ${
                      isActive
                        ? 'bg-primary/8 text-primary font-semibold'
                        : isDisabled
                        ? 'text-on-surface-variant/40 cursor-not-allowed'
                        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] bg-primary rounded-r-sm" />
                    )}
                    <Icon name={item.icon} size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Settings & Auth */}
      <div className="px-2 pb-2 space-y-px">
        <button
          type="button"
          onClick={() => handleNav('settings')}
          className={`relative w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
            view === 'settings'
              ? 'bg-primary/8 text-primary font-semibold'
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
          }`}
          aria-current={view === 'settings' ? 'page' : undefined}
        >
          {view === 'settings' && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] bg-primary rounded-r-sm" />
          )}
          <Icon name="settings" size={18} />
          <span>Settings</span>
        </button>

        {!authUser ? (
          <button
            type="button"
            onClick={onOpenAuth}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium border border-primary/25 text-primary hover:bg-primary/8 transition-all cursor-pointer"
          >
            <Icon name="person_add" size={18} />
            <span>Login / Sign Up</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-error hover:bg-error/8 transition-all cursor-pointer"
          >
            <Icon name="logout" size={18} />
            <span>Sign Out</span>
          </button>
        )}
      </div>

      {/* User */}
      <div
        className="px-4 py-3 border-t border-outline-variant shrink-0 cursor-pointer hover:bg-surface-container-low transition-colors"
        onClick={() => handleNav('profile')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNav('profile'); }}
        aria-label="Open profile"
      >
        <div className="flex items-center gap-3">
          {profile?.avatarUrl ? (
            <img src={profile.avatarUrl} alt={userName} className="w-9 h-9 rounded-full object-cover shrink-0 border border-primary/20" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm shrink-0">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <div className="text-sm font-semibold text-on-surface truncate">{userName}</div>
            <div className="text-xs text-on-surface-variant truncate">{userRole}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
