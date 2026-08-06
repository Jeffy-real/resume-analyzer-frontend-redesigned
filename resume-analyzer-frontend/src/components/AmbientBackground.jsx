import React from 'react';

/**
 * Fixed decorative backdrop: a faint dot grid plus two slow-floating
 * gradient orbs in the signature violet/cyan duotone. Pure CSS, no JS
 * animation loop, so it stays GPU-cheap.
 */
export function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-noise" aria-hidden="true">
      <div className="absolute inset-0" style={{ backgroundColor: 'var(--bg-void)' }} />
      <div
        className="orb orb-float-a"
        style={{
          top: '-10%',
          left: '-6%',
          width: '46vw',
          height: '46vw',
          background: 'radial-gradient(circle, rgba(124,92,255,0.35) 0%, rgba(124,92,255,0) 70%)',
        }}
      />
      <div
        className="orb orb-float-b"
        style={{
          top: '18%',
          right: '-10%',
          width: '38vw',
          height: '38vw',
          background: 'radial-gradient(circle, rgba(52,224,234,0.24) 0%, rgba(52,224,234,0) 70%)',
        }}
      />
      <div
        className="orb orb-float-a"
        style={{
          bottom: '-14%',
          left: '30%',
          width: '40vw',
          height: '40vw',
          animationDelay: '-6s',
          background: 'radial-gradient(circle, rgba(124,92,255,0.18) 0%, rgba(124,92,255,0) 70%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(5,7,15,0) 0%, rgba(5,7,15,0.6) 60%, rgba(5,7,15,0.95) 100%)',
        }}
      />
    </div>
  );
}
