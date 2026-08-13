import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from './Icon';

// Toast Notification Component
export function Toast({ message, type = 'success', duration = 3000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: 'check',
    error: 'close',
    warning: 'target',
    info: 'terminal',
  };

  const colors = {
    success: 'var(--tertiary)',
    error: 'var(--error)',
    warning: 'var(--secondary)',
    info: 'var(--primary)',
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl card border border-outline-variant shadow-xl"
        style={{ borderLeftWidth: '3px', borderLeftColor: colors[type] }}
      >
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${colors[type]}20` }}
        >
          <Icon name={icons[type]} size={14} style={{ color: colors[type] }} />
        </div>
        <span className="text-xs font-medium text-on-surface">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 p-1 hover:bg-surface-container-low rounded-lg transition-colors"
        >
          <Icon name="close" size={14} />
        </button>
      </div>
    </motion.div>
  );
}

// Toast Container
export function ToastContainer({ toasts, removeToast }) {
  return (
    <div
      className="fixed bottom-6 right-6 z-50 space-y-3"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Loading Spinner
export function LoadingSpinner({ size = 24, className = '' }) {
  return (
    <motion.div
      className={`inline-block ${className}`}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="text-surface-container-high"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="text-primary"
        />
      </svg>
    </motion.div>
  );
}
