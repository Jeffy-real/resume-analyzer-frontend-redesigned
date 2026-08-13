import React from 'react';

const tabs = [
  { id: 'dashboard', label: 'Home',     icon: 'home' },
  { id: 'job-matches', label: 'Matches',  icon: 'target' },
  { id: 'upload',    label: 'Analyze',  icon: 'psychology' },
  { id: 'history',   label: 'History',  icon: 'history' },
  { id: 'profile',   label: 'Profile',  icon: 'person' },
];

export function BottomNav({ view, onViewChange, hasAnalysis }) {
  const handleTab = (id) => {
    if ((id === 'dashboard' || id === 'reports') && !hasAnalysis) {
      onViewChange('upload');
    } else {
      onViewChange(id);
    }
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface-container-lowest border-t border-outline-variant shadow-[0_-1px_3px_rgba(0,0,0,0.05)]"
      aria-label="Bottom navigation"
    >
      <div className="flex justify-around items-center py-2 pb-safe">
        {tabs.map((tab) => {
          const isActive = view === tab.id;
          const isDisabled = (tab.id === 'dashboard' || tab.id === 'reports') && !hasAnalysis;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTab(tab.id)}
              disabled={isDisabled}
              className={`flex flex-col items-center justify-center transition-all duration-150 p-sm rounded-lg active:scale-90 ${
                isActive
                  ? 'text-primary font-semibold'
                  : isDisabled
                  ? 'text-on-surface-variant/40 cursor-not-allowed'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className="material-symbols-outlined mb-xs text-[22px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {tab.icon}
              </span>
              <span className="font-label-md text-label-md">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
