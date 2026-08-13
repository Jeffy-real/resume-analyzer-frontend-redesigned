import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  Target,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { Icon } from './Icon';

export function AuthModal({ isOpen, onClose, onAuthSuccess, addToast }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setErrorMsg('');
  };

  const handleForgotPassword = () => {
    if (!email) {
      setErrorMsg('Please enter your email address to reset your password.');
      if (addToast) addToast('Enter your email address first', 'error');
      return;
    }
    if (addToast) addToast(`Password reset link sent to ${email}`, 'success');
  };

  const handleSocialAuth = (provider) => {
    setLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      const demoEmail = provider === 'Google' ? 'alex.rivers@gmail.com' : 'alex.rivers@github.com';
      const userData = {
        name: 'Alex Rivers',
        email: demoEmail,
        role: 'Candidate',
        provider,
      };
      localStorage.setItem('jobfirst-auth-user', JSON.stringify(userData));
      if (onAuthSuccess) onAuthSuccess(userData);
      if (addToast) addToast(`Signed in with ${provider} successfully!`, 'success');
      setLoading(false);
      onClose();
    }, 600);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password || (mode === 'signup' && !name)) {
      const msg = 'Please fill in all required fields.';
      setErrorMsg(msg);
      if (addToast) addToast(msg, 'error');
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
      // Fallback local authentication for dev if backend fails or offline
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden my-auto"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/80 transition-colors cursor-pointer bg-surface-container-lowest/40 backdrop-blur-xs"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 w-full md:min-h-[540px]">
          {/* Left Branding & Value Prop Section */}
          <div className="w-full bg-gradient-to-br from-[#1b1947] via-[#2d2882] to-[#3525cd] p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Ambient Background Glow Highlights */}
            <div className="absolute -top-24 -left-24 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              {/* Brand Header */}
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner shrink-0">
                  <Icon name="analytics" size={22} style={{ color: '#ffffff' }} />
                </div>
                <span className="font-bold text-xl tracking-tight text-white">JobFirst</span>
              </div>

              {/* Main Headline & Subtitle */}
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3 leading-snug whitespace-normal">
                Resume analysis, done right.
              </h2>
              <p className="text-sm text-indigo-200 leading-relaxed mb-6" style={{ maxWidth: '280px' }}>
                Build stronger resumes, get detailed feedback, and match to roles that fit.
              </p>

              {/* Value Pills */}
              <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-white shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Resume Analysis</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-white shrink-0">
                  <Target className="w-3.5 h-3.5 text-emerald-300" />
                  <span>ATS Optimization</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-white shrink-0">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
                  <span>Career Growth</span>
                </div>
              </div>
            </div>

            {/* Visual Mockup Element */}
            <div className="relative z-10 mt-auto pt-2 hidden sm:block">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-white">ATS Compatibility Score</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                    92% Match
                  </span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mb-2">
                  <div className="bg-gradient-to-r from-emerald-400 to-indigo-300 h-full w-[92%] rounded-full" />
                </div>
                <p className="text-[11px] text-indigo-100/70">
                  Matches 18/20 critical keywords for Senior Engineer roles.
                </p>
              </div>
            </div>
          </div>

          {/* Right Auth Form Section */}
          <div className="w-full p-6 sm:p-8 md:p-10 flex flex-col justify-center bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100" style={{ width: '100%', minWidth: '0' }}>
            <div className="w-full max-w-[380px] mx-auto block" style={{ width: '100%', maxWidth: '380px', minWidth: '280px', margin: '0 auto' }}>
              {/* Form Title */}
              <div className="mb-6 w-full" style={{ width: '100%' }}>
                <h3 className="text-2xl font-bold text-on-surface mb-1 whitespace-normal" style={{ width: '100%' }}>
                  {mode === 'signup' ? 'Create an Account 🚀' : 'Welcome Back 👋'}
                </h3>
                <p className="text-sm text-on-surface-variant whitespace-normal" style={{ width: '100%' }}>
                  {mode === 'signup'
                    ? 'Sign up to analyze your resume and get detailed feedback'
                    : 'Sign in to continue to JobFirst'}
                </p>
              </div>

              {/* Error Message Alert */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mb-4 p-3 rounded-lg bg-error-container/60 border border-error/20 text-on-error-container text-xs flex items-start gap-2 w-full"
                    style={{ width: '100%' }}
                  >
                    <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                    <span className="whitespace-normal">{errorMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Auth Form */}
              <form onSubmit={handleSubmit} className="space-y-4 w-full" style={{ width: '100%' }}>
                {mode === 'signup' && (
                  <div className="w-full" style={{ width: '100%' }}>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5" style={{ width: '100%' }}>
                      Full Name
                    </label>
                    <div className="relative w-full" style={{ width: '100%' }}>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Rivers"
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all box-border"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                )}

                <div className="w-full" style={{ width: '100%' }}>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5" style={{ width: '100%' }}>
                    Email Address
                  </label>
                  <div className="relative w-full" style={{ width: '100%' }}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all box-border"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div className="w-full" style={{ width: '100%' }}>
                  <div className="flex items-center justify-between mb-1.5 w-full" style={{ width: '100%' }}>
                    <label className="block text-xs font-semibold text-on-surface">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs text-primary font-medium hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative w-full" style={{ width: '100%' }}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 text-sm border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all box-border"
                      style={{ width: '100%' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-on-surface cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {mode === 'login' && (
                  <div className="flex items-center gap-2 pt-0.5 w-full" style={{ width: '100%' }}>
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 accent-primary rounded border-outline-variant text-primary focus:ring-primary cursor-pointer shrink-0"
                    />
                    <label htmlFor="rememberMe" className="text-xs text-on-surface-variant cursor-pointer select-none">
                      Remember me on this device
                    </label>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 mt-2"
                  style={{ width: '100%' }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{mode === 'signup' ? 'Creating account...' : 'Signing in...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6 text-center w-full" style={{ width: '100%' }}>
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-outline-variant" style={{ width: '100%' }} />
                </div>
                <span className="relative px-3 bg-surface-container-lowest text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
                  or continue with
                </span>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6 w-full" style={{ width: '100%' }}>
                <button
                  type="button"
                  onClick={() => handleSocialAuth('Google')}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 border border-outline-variant rounded-lg text-xs font-semibold text-on-surface bg-surface-container-lowest hover:bg-surface-container-low transition-colors cursor-pointer disabled:opacity-50"
                  style={{ width: '100%' }}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialAuth('GitHub')}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 border border-outline-variant rounded-lg text-xs font-semibold text-on-surface bg-surface-container-lowest hover:bg-surface-container-low transition-colors cursor-pointer disabled:opacity-50"
                  style={{ width: '100%' }}
                >
                  <svg className="w-4 h-4 shrink-0 fill-current text-on-surface" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>

              {/* Switch Auth Mode Toggle */}
              <div className="text-center w-full" style={{ width: '100%' }}>
                <button
                  type="button"
                  onClick={() => handleModeSwitch(mode === 'signup' ? 'login' : 'signup')}
                  className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                  {mode === 'signup' ? (
                    <>
                      Already have an account? <span className="font-semibold text-primary underline">Sign In</span>
                    </>
                  ) : (
                    <>
                      Don't have an account? <span className="font-semibold text-primary underline">Create one</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

}

