import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from './Icon';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'bar-chart-3' },
  { id: 'upload', label: 'Upload Resume', icon: 'upload' },
  { id: 'history', label: 'Analysis History', icon: 'clock' },
  { id: 'reports', label: 'Reports', icon: 'file-text' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
  { id: 'profile', label: 'Profile', icon: 'user' },
];

export function Navbar({ view, onViewChange, hasAnalysis, loadSampleResume, isAnalyzing = false }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuButtonRef = useRef(null);
  const drawerRef = useRef(null);

  // Keep Tab / Shift+Tab within the drawer.
  const handleDrawerKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    const nodes = drawerRef.current?.querySelectorAll(
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

  // When the drawer opens: focus its first control, lock background scroll,
  // and close on Escape. On close: restore scroll and return focus to the menu button.
  useEffect(() => {
    if (!showMenu) return;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => {
      const firstControl = drawerRef.current?.querySelector('button:not([disabled])');
      firstControl?.focus();
    }, 30);
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowMenu(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
      menuButtonRef.current?.focus();
    };
  }, [showMenu]);

  const handleNavClick = (itemId) => {
    if ((itemId === 'dashboard' || itemId === 'reports') && !hasAnalysis) {
      onViewChange('upload');
      return;
    }
    onViewChange(itemId);
    setShowMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant bg-surface-container-lowest/95 backdrop-blur-sm">
      <div className="shell h-[72px] flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#top" className="inline-flex items-center gap-3 group" aria-label="Resume Analyzer Home">
          <span className="w-9 h-9 grid place-items-center rounded-xl bg-primary text-on-primary">
            <Icon name="file-text" size={18} />
          </span>
          <span className="text-base font-semibold text-on-surface tracking-tight">
            JobFirst
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary navigation" role="navigation">
          {navItems.map((item) => {
            const isActive = view === item.id;
            const isDisabled = (item.id === 'dashboard' || item.id === 'reports') && !hasAnalysis;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                disabled={isDisabled}
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                  isActive
                    ? 'bg-primary text-on-primary'
                    : isDisabled
                    ? 'text-outline cursor-not-allowed'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden sm:inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm btn-secondary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={loadSampleResume}
            disabled={isAnalyzing}
          >
            <Icon name="file" size={14} />
            <span>{isAnalyzing ? 'Analyzing…' : 'Load Sample'}</span>
          </button>

          <button
            type="button"
            ref={menuButtonRef}
            className="lg:hidden p-2.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Toggle navigation"
            aria-expanded={showMenu}
          >
            <Icon name={showMenu ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            ref={drawerRef}
            onKeyDown={handleDrawerKeyDown}
            className="lg:hidden border-t border-outline-variant bg-surface-container-lowest px-6 py-5 space-y-2 shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {navItems.map((item) => {
              const isActive = view === item.id;
              const isDisabled = (item.id === 'dashboard' || item.id === 'reports') && !hasAnalysis;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  disabled={isDisabled}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-all duration-150 ${
                    isActive
                      ? 'bg-primary text-on-primary'
                      : isDisabled
                      ? 'text-outline cursor-not-allowed'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon name={item.icon} size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setShowMenu(false);
                loadSampleResume();
              }}
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center gap-2 mt-2 py-3 text-sm btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="file" size={16} />
              <span>{isAnalyzing ? 'Analyzing…' : 'Load Sample Resume'}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}