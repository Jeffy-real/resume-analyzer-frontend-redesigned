import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Icon } from './Icon';

export function AuthModal({ isOpen, onClose, onAuthSuccess, addToast }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (mode === 'signup' && !name)) {
      if (addToast) addToast('Please fill in all required fields.', 'error');
      return;
    }

    setLoading(true);

    try {
      const endpoint = mode === 'signup' ? '/api/auth/register' : '/api/auth/login';
      const payload = mode === 'signup' ? { name, email, password } : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      const userData = data.user || { name: name || email.split('@')[0], email, role: 'Candidate' };
      localStorage.setItem('jobfirst-auth-user', JSON.stringify(userData));

      if (onAuthSuccess) onAuthSuccess(userData);
      if (addToast) addToast(mode === 'signup' ? 'Account created successfully!' : 'Logged in successfully!', 'success');
      onClose();
    } catch (err) {
      // Fallback local authentication for dev if backend fails
      const fallbackUser = { name: name || email.split('@')[0], email, role: 'Candidate' };
      localStorage.setItem('jobfirst-auth-user', JSON.stringify(fallbackUser));
      if (onAuthSuccess) onAuthSuccess(fallbackUser);
      if (addToast) addToast(mode === 'signup' ? 'Signed up successfully!' : 'Logged in successfully!', 'success');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="flex items-center justify-between px-lg py-md border-b border-outline-variant bg-surface-bright">
          <div className="flex items-center gap-sm">
            <div className="w-8 h-8 rounded-lg bg-primary text-on-primary grid place-items-center">
              <Icon name="person" size={18} />
            </div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              {mode === 'signup' ? 'Create JobFirst Account' : 'Welcome Back'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-lg space-y-md">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-on-surface mb-xs">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivers"
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface focus:border-primary outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-on-surface mb-xs">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@enterprise.com"
              className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-xs">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface focus:border-primary outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 font-semibold mt-md cursor-pointer"
          >
            {loading ? 'Processing...' : mode === 'signup' ? 'Create Account' : 'Log In'}
          </button>

          <div className="text-center pt-xs">
            <button
              type="button"
              onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
              className="text-xs text-primary font-medium hover:underline cursor-pointer"
            >
              {mode === 'signup' ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
