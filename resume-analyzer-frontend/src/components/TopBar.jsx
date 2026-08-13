import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from './Icon';

/**
 * Mobile top app bar — fixed, visible only on screens < md.
 * Hamburger opens a dropdown of the full nav list (mirrors Sidebar items).
 */
export function TopBar({ view, onViewChange, hasAnalysis, loadSampleResume, isAnalyzing, onOpenAuth, user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

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
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const handleNav = (id) => {
    if ((id === 'dashboard' || id === 'reports') && !hasAnalysis) {
      onViewChange('upload');
    } else {
      onViewChange(id);
    }
    setMenuOpen(false);
  };

  return (
    <>
      <header className="md:hidden fixed top-0 left-0 w-full z-50 bg-surface-container-lowest border-b border-outline-variant shadow-sm flex items-center justify-between px-md h-16">
        <button
          type="button"
          className="p-2 -ml-2 text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-full active:scale-95 duration-100 flex items-center justify-center cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
        </button>

        <div className="font-headline-md text-headline-md font-bold text-primary">JobFirst</div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onOpenAuth}
            className="p-2 text-primary hover:bg-primary/10 transition-colors rounded-full flex items-center justify-center cursor-pointer"
            aria-label="Account Login"
          >
            <span className="material-symbols-outlined">person</span>
          </button>
          <button
            type="button"
            onClick={() => handleNav('settings')}
            className="p-2 -mr-2 text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-full active:scale-95 duration-100 flex items-center justify-center cursor-pointer"
            aria-label="Settings"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </header>

      {/* Mobile nav dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            className="md:hidden fixed inset-x-0 top-16 z-50 bg-surface-container-lowest border-b border-outline-variant shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="px-md py-md space-y-1">
              {navItems.map((item) => {
                const isActive = view === item.id;
                const isDisabled = (item.id === 'dashboard' || item.id === 'reports') && !hasAnalysis;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNav(item.id)}
                    disabled={isDisabled}
                    className={`w-full flex items-center gap-md px-md py-sm rounded-lg text-body-md font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-primary/8 text-primary'
                        : isDisabled
                        ? 'text-on-surface-variant/50 cursor-not-allowed'
                        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <div className="border-t border-outline-variant my-2" />
              <button
                type="button"
                onClick={() => { setMenuOpen(false); loadSampleResume(); }}
                disabled={isAnalyzing}
                className="w-full flex items-center justify-center gap-2 py-sm text-body-md text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[20px]">science</span>
                <span>{isAnalyzing ? 'Analyzing…' : 'Load Sample Resume'}</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
