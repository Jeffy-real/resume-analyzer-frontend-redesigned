import React from 'react';
import { Icon } from './Icon';

const STORAGE_KEY = 'resume-analyzer-profile';
function loadName() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY))?.name || ''; } catch { return ''; }
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'upload', label: 'Analyze', icon: 'psychology' },
  { id: 'history', label: 'History', icon: 'history' },
  { id: 'reports', label: 'Reports', icon: 'description' },
  { id: 'job-matches', label: 'Job Matches', icon: 'target' },
  { id: 'skill-gap', label: 'Skill Gap', icon: 'layers' },
  { id: 'career-insights', label: 'Career Insights', icon: 'trending_up' },
  { id: 'saved-jobs', label: 'Saved Jobs', icon: 'bookmark' },
  { id: 'resume-library', label: 'Resume Library', icon: 'folder_open' },
  { id: 'profile', label: 'Profile', icon: 'person' },
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
      <div className="flex items-center gap-md px-lg h-16 border-b border-outline-variant shrink-0">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
          <Icon name="analytics" size={22} style={{ color: 'var(--color-on-primary)' }} />
        </div>
        <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">
          JobFirst
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-sm py-md overflow-y-auto" aria-label="Sidebar navigation">
        <div className="flex flex-col gap-xs">
          {navItems.map((item) => {
            const isActive = view === item.id;
            const isDisabled = (item.id === 'dashboard' || item.id === 'reports') && !hasAnalysis;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                disabled={isDisabled}
                className={`w-full flex items-center gap-md px-md py-sm rounded-lg text-body-md font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-primary/8 text-primary'
                    : isDisabled
                    ? 'text-on-surface-variant/50 cursor-not-allowed'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon name={item.icon} size={22} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Settings & Auth */}
      <div className="px-sm pb-sm space-y-xs">
        <button
          type="button"
          onClick={() => handleNav('settings')}
          className={`w-full flex items-center gap-md px-md py-sm rounded-lg text-body-md font-medium transition-all duration-150 cursor-pointer ${
            view === 'settings'
              ? 'bg-primary/8 text-primary'
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
          }`}
          aria-current={view === 'settings' ? 'page' : undefined}
        >
          <Icon name="settings" size={22} />
          <span>Settings</span>
        </button>

        {!authUser ? (
          <button
            type="button"
            onClick={onOpenAuth}
            className="w-full flex items-center gap-md px-md py-sm rounded-lg text-body-md font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-all cursor-pointer"
          >
            <Icon name="person_add" size={22} />
            <span>Login / Sign Up</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-md px-md py-sm rounded-lg text-body-md font-medium text-error hover:bg-error/10 transition-all cursor-pointer"
          >
            <Icon name="logout" size={22} />
            <span>Sign Out</span>
          </button>
        )}
      </div>

      {/* User */}
      <div className="px-lg py-md border-t border-outline-variant shrink-0 cursor-pointer" onClick={() => handleNav('profile')}>
        <div className="flex items-center gap-md">
          {profile?.avatarUrl ? (
            <img src={profile.avatarUrl} alt={userName} className="w-10 h-10 rounded-full object-cover shrink-0 border border-primary/20" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm shrink-0">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <div className="font-body-md text-body-md font-medium text-on-surface truncate">{userName}</div>
            <div className="font-label-md text-label-md text-on-surface-variant truncate">{userRole}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

