import React, { useState } from 'react';
import { Icon } from './Icon';

const navLinks = [
  { href: '#overview', label: 'Overview' },
  { href: '#upload', label: 'Upload & Parse' },
  { href: '#features', label: 'ATS Evaluation' },
  { href: '#results', label: 'Dashboard' },
];

export function Navbar({ loadSampleResume }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 nav-glass">
      <div className="shell h-[72px] flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#top" className="inline-flex items-center gap-3 group">
          <span
            className="w-9 h-9 grid place-items-center rounded-xl text-[#04050c] shadow-[0_0_20px_-4px_rgba(124,92,255,0.65)] transition-transform group-hover:scale-105"
            style={{ backgroundImage: 'var(--gradient-signal)' }}
          >
            <Icon name="sparkle" size={17} />
          </span>
          <div className="flex flex-col">
            <span className="text-base font-heading font-bold text-[var(--text-primary)] tracking-tight leading-none">
              Smart Resume Analyzer
            </span>
            <span className="text-[10px] font-mono text-[var(--accent-cyan)] font-medium mt-1 tracking-wide">
              AI CAPSTONE PROJECT
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-[var(--text-secondary)] text-xs font-semibold" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="relative py-1 group transition-colors hover:text-[var(--text-primary)]">
              {link.label}
              <span className="absolute left-0 -bottom-0.5 h-[1.5px] w-0 group-hover:w-full transition-all duration-300" style={{ backgroundImage: 'var(--gradient-signal)' }} />
            </a>
          ))}
        </nav>

        {/* Action Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadSampleResume}
            className="hidden sm:inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs btn-ghost cursor-pointer"
          >
            <Icon name="file" size={14} />
            <span>Load Sample Resume</span>
          </button>

          <a
            href="#upload"
            className="hidden sm:inline-flex items-center justify-center gap-2 px-4 py-2 text-xs btn-signal"
          >
            <Icon name="upload" size={14} />
            <span>Analyze Resume</span>
          </a>

          <button
            type="button"
            className="md:hidden p-2 text-[var(--text-secondary)] hover:bg-white/5 rounded-lg transition-colors"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Toggle navigation"
          >
            <Icon name={showMenu ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {showMenu && (
        <div className="md:hidden border-t border-[var(--border-hair)] bg-[var(--bg-deep)]/95 px-6 py-4 space-y-3 shadow-2xl">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setShowMenu(false)}
              className="block text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setShowMenu(false);
              loadSampleResume();
            }}
            className="flex items-center justify-center gap-2 w-full mt-2 py-2 text-xs btn-ghost"
          >
            <Icon name="file" size={14} />
            <span>Load Sample Resume</span>
          </button>
        </div>
      )}
    </header>
  );
}
