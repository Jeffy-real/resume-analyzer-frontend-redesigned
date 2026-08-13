import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Icon } from './Icon';

const STORAGE_KEY = 'resume-analyzer-profile';
const SAVED_JOBS_KEY = 'jobfirst-saved-jobs';

export const DEFAULT_PROFILE = {
  name: 'Alex Rivers',
  headline: 'Senior Full Stack Engineer & Cloud Architect',
  email: 'alex.rivers@enterprise.com',
  phone: '+1 (555) 382-9102',
  location: 'San Francisco, CA',
  avatarUrl: '',
  linkedin: 'https://linkedin.com/in/alexrivers',
  github: 'https://github.com/alexrivers',
  portfolio: 'https://alexrivers.dev',
  summary: 'Passionate Senior Full Stack Engineer with 7+ years of experience building scalable cloud applications, React dashboards, and high-performance backend microservices. Skilled in modern JavaScript, Python, cloud orchestration, and team leadership.',
  currentRole: 'Senior Software Engineer',
  currentCompany: 'TechNova Solutions',
  industry: 'Software & Technology',
  yearsExperience: '7 years',

  skills: [
    { id: 'sk-1', name: 'React.js', proficiency: 94, level: 'Expert' },
    { id: 'sk-2', name: 'Node.js', proficiency: 90, level: 'Expert' },
    { id: 'sk-3', name: 'TypeScript', proficiency: 86, level: 'Advanced' },
    { id: 'sk-4', name: 'Python', proficiency: 84, level: 'Advanced' },
    { id: 'sk-5', name: 'PostgreSQL', proficiency: 80, level: 'Advanced' },
    { id: 'sk-6', name: 'AWS Cloud', proficiency: 78, level: 'Intermediate' },
  ],

  experience: [
    {
      id: 'exp-1',
      company: 'TechNova Solutions',
      role: 'Senior Software Engineer',
      dates: '2021 - Present',
      location: 'San Francisco, CA',
      achievements: 'Architected React frontend & microservices handling 2M+ monthly users. Optimized PostgreSQL queries reducing latency by 40%.',
    },
    {
      id: 'exp-2',
      company: 'DataFlow Systems',
      role: 'Full Stack Engineer',
      dates: '2018 - 2021',
      location: 'Austin, TX',
      achievements: 'Engineered real-time analytics streaming pipelines using Node.js, Python, and MongoDB.',
    },
  ],

  education: [
    {
      id: 'edu-1',
      degree: 'B.S. in Computer Science',
      institution: 'University of California, Berkeley',
      dates: '2014 - 2018',
      gpa: '3.8 / 4.0',
    },
  ],

  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2023',
      credentialUrl: 'https://aws.amazon.com',
    },
    {
      id: 'cert-2',
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Linux Foundation',
      date: '2022',
      credentialUrl: 'https://cncf.io',
    },
  ],

  projects: [
    {
      id: 'proj-1',
      title: 'JobFirst Resume & Career Suite',
      description: 'AI-driven resume parsing and ATS matching platform with interactive skill gap visualization.',
      technologies: 'React, Vite, Node.js, TailwindCSS',
      link: 'https://github.com/alexrivers/jobfirst',
    },
    {
      id: 'proj-2',
      title: 'Cloud Metric Insights Engine',
      description: 'Distributed streaming metrics engine for monitoring serverless infrastructure.',
      technologies: 'Python, Docker, Redis, WebSocket',
      link: 'https://github.com/alexrivers/metrics-engine',
    },
  ],

  languages: [
    { id: 'lang-1', language: 'English', proficiency: 'Native / Fluent' },
    { id: 'lang-2', language: 'Spanish', proficiency: 'Professional Working' },
  ],

  preferences: {
    desiredRole: 'Lead / Staff Software Engineer',
    desiredIndustry: 'Enterprise SaaS / AI',
    desiredLocation: 'San Francisco, CA / Remote',
    workMode: 'Hybrid or Remote',
    expectedSalary: '$170,000 - $210,000',
    relocation: 'Open to relocation',
  },
};

export function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}

export function calculateProfileCompletion(profile) {
  if (!profile) return 0;
  let score = 0;

  // 1. Personal & Contact (15%)
  if (profile.name && profile.email && profile.phone && profile.location) score += 15;
  else if (profile.name && profile.email) score += 8;

  // 2. Headline & Socials (10%)
  if (profile.headline && (profile.linkedin || profile.github || profile.portfolio)) score += 10;
  else if (profile.headline) score += 5;

  // 3. Professional Summary (10%)
  if (profile.summary && profile.summary.trim().length > 20) score += 10;

  // 4. Current Role & Industry (15%)
  if (profile.currentRole && profile.currentCompany && profile.industry) score += 15;
  else if (profile.currentRole) score += 8;

  // 5. Skills (15%)
  if (profile.skills && profile.skills.length >= 3) score += 15;
  else if (profile.skills && profile.skills.length > 0) score += 8;

  // 6. Experience (15%)
  if (profile.experience && profile.experience.length >= 1) score += 15;

  // 7. Education (10%)
  if (profile.education && profile.education.length >= 1) score += 10;

  // 8. Career Preferences (10%)
  if (profile.preferences && profile.preferences.desiredRole) score += 10;

  return Math.min(score, 100);
}

function formatTime(ts) {
  const date = new Date(ts);
  if (Number.isNaN(date.getTime())) return 'Recently';
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOfDay(new Date()) - startOfDay(date)) / 86400000);
  const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 0) return `Today, ${time}`;
  if (diffDays === 1) return `Yesterday, ${time}`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between px-lg py-md border-b border-outline-variant bg-surface-bright">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="p-lg overflow-y-auto flex-1">{children}</div>
      </motion.div>
    </div>
  );
}

export function ProfileView({ history = [], onViewAllHistory, onOpenHistory, onProfileUpdate, addToast }) {
  const [profile, setProfileState] = useState(() => loadProfile());
  const [activeModal, setActiveModal] = useState(null); // 'basic' | 'summary' | 'skill' | 'exp' | 'edu' | 'cert' | 'proj' | 'lang' | 'pref'
  const [editingItem, setEditingItem] = useState(null);

  // Form states for modals
  const [basicForm, setBasicForm] = useState({});
  const [summaryForm, setSummaryForm] = useState('');
  const [skillForm, setSkillForm] = useState({ name: '', proficiency: 80, level: 'Advanced' });
  const [expForm, setExpForm] = useState({ company: '', role: '', dates: '', location: '', achievements: '' });
  const [eduForm, setEduForm] = useState({ degree: '', institution: '', dates: '', gpa: '' });
  const [certForm, setCertForm] = useState({ name: '', issuer: '', date: '', credentialUrl: '' });
  const [projForm, setProjForm] = useState({ title: '', description: '', technologies: '', link: '' });
  const [langForm, setLangForm] = useState({ language: '', proficiency: 'Native / Fluent' });
  const [prefForm, setPrefForm] = useState({});

  const updateProfile = (updatedProfile, activityMessage) => {
    setProfileState(updatedProfile);
    saveProfile(updatedProfile);
    if (onProfileUpdate) onProfileUpdate(updatedProfile);

    // Write activity log
    if (activityMessage) {
      try {
        const stored = JSON.parse(localStorage.getItem('resume-analyzer-history')) || [];
        const newAct = {
          id: Date.now() + Math.random(),
          resumeName: activityMessage,
          selectedRole: 'Profile Event',
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem('resume-analyzer-history', JSON.stringify([newAct, ...stored].slice(0, 30)));
      } catch {
        // ignore
      }
    }

    if (addToast) addToast(activityMessage || 'Profile saved successfully', 'success');
  };

  /* ----- Modal Openers ----- */
  const openBasicModal = () => {
    setBasicForm({
      name: profile.name || '',
      headline: profile.headline || '',
      email: profile.email || '',
      phone: profile.phone || '',
      location: profile.location || '',
      avatarUrl: profile.avatarUrl || '',
      linkedin: profile.linkedin || '',
      github: profile.github || '',
      portfolio: profile.portfolio || '',
      currentRole: profile.currentRole || '',
      currentCompany: profile.currentCompany || '',
      industry: profile.industry || '',
      yearsExperience: profile.yearsExperience || '',
    });
    setActiveModal('basic');
  };

  const saveBasic = (e) => {
    e.preventDefault();
    const updated = { ...profile, ...basicForm };
    updateProfile(updated, 'Updated contact info & professional details');
    setActiveModal(null);
  };

  const openSummaryModal = () => {
    setSummaryForm(profile.summary || '');
    setActiveModal('summary');
  };

  const saveSummary = (e) => {
    e.preventDefault();
    const updated = { ...profile, summary: summaryForm };
    updateProfile(updated, 'Updated professional summary');
    setActiveModal(null);
  };

  /* Skills */
  const openSkillModal = (item = null) => {
    setEditingItem(item);
    setSkillForm(item ? { ...item } : { name: '', proficiency: 80, level: 'Advanced' });
    setActiveModal('skill');
  };

  const saveSkill = (e) => {
    e.preventDefault();
    if (!skillForm.name.trim()) return;
    let nextSkills;
    if (editingItem) {
      nextSkills = profile.skills.map((s) => (s.id === editingItem.id ? { ...skillForm, id: s.id } : s));
    } else {
      nextSkills = [...(profile.skills || []), { ...skillForm, id: `sk-${Date.now()}` }];
    }
    updateProfile({ ...profile, skills: nextSkills }, editingItem ? `Updated skill: ${skillForm.name}` : `Added skill: ${skillForm.name}`);
    setActiveModal(null);
  };

  const deleteSkill = (id, name) => {
    const next = profile.skills.filter((s) => s.id !== id);
    updateProfile({ ...profile, skills: next }, `Removed skill: ${name}`);
  };

  /* Experience */
  const openExpModal = (item = null) => {
    setEditingItem(item);
    setExpForm(item ? { ...item } : { company: '', role: '', dates: '', location: '', achievements: '' });
    setActiveModal('exp');
  };

  const saveExp = (e) => {
    e.preventDefault();
    if (!expForm.role.trim() || !expForm.company.trim()) return;
    let nextExp;
    if (editingItem) {
      nextExp = profile.experience.map((x) => (x.id === editingItem.id ? { ...expForm, id: x.id } : x));
    } else {
      nextExp = [{ ...expForm, id: `exp-${Date.now()}` }, ...(profile.experience || [])];
    }
    updateProfile({ ...profile, experience: nextExp }, editingItem ? `Updated experience: ${expForm.role}` : `Added experience: ${expForm.role}`);
    setActiveModal(null);
  };

  const deleteExp = (id, role) => {
    const next = profile.experience.filter((x) => x.id !== id);
    updateProfile({ ...profile, experience: next }, `Removed experience: ${role}`);
  };

  /* Education */
  const openEduModal = (item = null) => {
    setEditingItem(item);
    setEduForm(item ? { ...item } : { degree: '', institution: '', dates: '', gpa: '' });
    setActiveModal('edu');
  };

  const saveEdu = (e) => {
    e.preventDefault();
    if (!eduForm.degree.trim()) return;
    let nextEdu;
    if (editingItem) {
      nextEdu = profile.education.map((x) => (x.id === editingItem.id ? { ...eduForm, id: x.id } : x));
    } else {
      nextEdu = [{ ...eduForm, id: `edu-${Date.now()}` }, ...(profile.education || [])];
    }
    updateProfile({ ...profile, education: nextEdu }, editingItem ? `Updated education: ${eduForm.degree}` : `Added education: ${eduForm.degree}`);
    setActiveModal(null);
  };

  const deleteEdu = (id, degree) => {
    const next = profile.education.filter((x) => x.id !== id);
    updateProfile({ ...profile, education: next }, `Removed education: ${degree}`);
  };

  /* Certifications */
  const openCertModal = (item = null) => {
    setEditingItem(item);
    setCertForm(item ? { ...item } : { name: '', issuer: '', date: '', credentialUrl: '' });
    setActiveModal('cert');
  };

  const saveCert = (e) => {
    e.preventDefault();
    if (!certForm.name.trim()) return;
    let nextCert;
    if (editingItem) {
      nextCert = profile.certifications.map((x) => (x.id === editingItem.id ? { ...certForm, id: x.id } : x));
    } else {
      nextCert = [{ ...certForm, id: `cert-${Date.now()}` }, ...(profile.certifications || [])];
    }
    updateProfile({ ...profile, certifications: nextCert }, editingItem ? `Updated certification: ${certForm.name}` : `Added certification: ${certForm.name}`);
    setActiveModal(null);
  };

  const deleteCert = (id, name) => {
    const next = profile.certifications.filter((x) => x.id !== id);
    updateProfile({ ...profile, certifications: next }, `Removed certification: ${name}`);
  };

  /* Projects */
  const openProjModal = (item = null) => {
    setEditingItem(item);
    setProjForm(item ? { ...item } : { title: '', description: '', technologies: '', link: '' });
    setActiveModal('proj');
  };

  const saveProj = (e) => {
    e.preventDefault();
    if (!projForm.title.trim()) return;
    let nextProj;
    if (editingItem) {
      nextProj = profile.projects.map((x) => (x.id === editingItem.id ? { ...projForm, id: x.id } : x));
    } else {
      nextProj = [{ ...projForm, id: `proj-${Date.now()}` }, ...(profile.projects || [])];
    }
    updateProfile({ ...profile, projects: nextProj }, editingItem ? `Updated project: ${projForm.title}` : `Added project: ${projForm.title}`);
    setActiveModal(null);
  };

  const deleteProj = (id, title) => {
    const next = profile.projects.filter((x) => x.id !== id);
    updateProfile({ ...profile, projects: next }, `Removed project: ${title}`);
  };

  /* Languages */
  const openLangModal = (item = null) => {
    setEditingItem(item);
    setLangForm(item ? { ...item } : { language: '', proficiency: 'Native / Fluent' });
    setActiveModal('lang');
  };

  const saveLang = (e) => {
    e.preventDefault();
    if (!langForm.language.trim()) return;
    let nextLang;
    if (editingItem) {
      nextLang = profile.languages.map((x) => (x.id === editingItem.id ? { ...langForm, id: x.id } : x));
    } else {
      nextLang = [...(profile.languages || []), { ...langForm, id: `lang-${Date.now()}` }];
    }
    updateProfile({ ...profile, languages: nextLang }, editingItem ? `Updated language: ${langForm.language}` : `Added language: ${langForm.language}`);
    setActiveModal(null);
  };

  const deleteLang = (id, language) => {
    const next = profile.languages.filter((x) => x.id !== id);
    updateProfile({ ...profile, languages: next }, `Removed language: ${language}`);
  };

  /* Preferences */
  const openPrefModal = () => {
    setPrefForm({ ...(profile.preferences || {}) });
    setActiveModal('pref');
  };

  const savePref = (e) => {
    e.preventDefault();
    updateProfile({ ...profile, preferences: prefForm }, 'Updated career preferences');
    setActiveModal(null);
  };

  /* Metrics & KPIs */
  const completionPct = calculateProfileCompletion(profile);
  const resumeCount = history.length;
  const scored = history.filter((h) => typeof h.ats === 'number' || typeof h.score === 'number');
  const avgAts = scored.length ? Math.round(scored.reduce((sum, h) => sum + (h.ats ?? h.score), 0) / scored.length) : 0;
  const skillsCount = profile.skills ? profile.skills.length : 0;

  let savedJobsCount = 0;
  try {
    savedJobsCount = (JSON.parse(localStorage.getItem(SAVED_JOBS_KEY)) || []).length;
  } catch {
    savedJobsCount = 0;
  }

  const initials = profile.name
    ? profile.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : 'AR';

  const activityList = history.slice(0, 6);

  return (
    <section className="w-full max-w-container-max mx-auto px-md py-xl md:px-lg flex flex-col gap-lg min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface font-bold">Candidate Profile</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-xs">
            Manage your professional details, skills, experience, and career preferences for JobFirst ATS optimization.
          </p>
        </div>
        <button
          type="button"
          onClick={openBasicModal}
          className="btn-primary shrink-0 self-start md:self-auto flex items-center gap-2 cursor-pointer"
        >
          <Icon name="edit" size={18} />
          Edit Profile Details
        </button>
      </div>

      {/* Primary Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg md:p-xl shadow-sm flex flex-col lg:flex-row items-start gap-lg justify-between"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-lg text-center sm:text-left w-full lg:w-auto">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-primary/20 shadow-sm shrink-0"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-primary-container text-primary font-bold text-headline-lg flex items-center justify-center border-2 border-primary/20 shadow-sm shrink-0">
              {initials}
            </div>
          )}

          <div className="space-y-xs min-w-0 flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-sm flex-wrap">
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">{profile.name}</h3>
              <span className="badge badge-info">{profile.currentRole || 'Candidate'}</span>
            </div>
            <p className="font-body-md text-body-md font-medium text-primary">{profile.headline}</p>
            <p className="font-label-md text-label-md text-on-surface-variant flex items-center justify-center sm:justify-start gap-md flex-wrap pt-xs">
              {profile.email && <span className="flex items-center gap-1"><Icon name="email" size={16} />{profile.email}</span>}
              {profile.phone && <span className="flex items-center gap-1"><Icon name="call" size={16} />{profile.phone}</span>}
              {profile.location && <span className="flex items-center gap-1"><Icon name="location_on" size={16} />{profile.location}</span>}
            </p>

            {/* Social Links */}
            <div className="flex items-center justify-center sm:justify-start gap-sm pt-sm flex-wrap">
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="chip chip-info hover:bg-primary/15 transition-colors"
                >
                  <Icon name="link" size={14} /> LinkedIn
                </a>
              )}
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="chip chip-info hover:bg-primary/15 transition-colors"
                >
                  <Icon name="code" size={14} /> GitHub
                </a>
              )}
              {profile.portfolio && (
                <a
                  href={profile.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="chip chip-info hover:bg-primary/15 transition-colors"
                >
                  <Icon name="language" size={14} /> Portfolio
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className="w-full lg:w-72 bg-surface-container-low border border-outline-variant rounded-xl p-md flex flex-col justify-between shrink-0">
          <div className="flex justify-between items-center mb-xs">
            <span className="font-label-md text-label-md font-semibold text-on-surface-variant">Profile Completion</span>
            <span className="font-headline-sm text-headline-sm font-bold text-primary">{completionPct}%</span>
          </div>
          <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden mb-sm">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPct}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            />
          </div>
          <p className="font-label-md text-label-md text-on-surface-variant">
            {completionPct === 100
              ? '🎉 Profile is 100% complete!'
              : 'Add skills, experience, & education to reach 100% completion.'}
          </p>
        </div>
      </motion.div>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-md">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-xs">
          <p className="font-label-md text-label-md text-on-surface-variant">Completion</p>
          <p className="font-display-lg text-display-lg font-bold text-primary mt-xs">{completionPct}%</p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-xs">
          <p className="font-label-md text-label-md text-on-surface-variant">Resumes</p>
          <p className="font-display-lg text-display-lg font-bold text-on-surface mt-xs">{resumeCount}</p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-xs">
          <p className="font-label-md text-label-md text-on-surface-variant">Avg ATS Score</p>
          <p className="font-display-lg text-display-lg font-bold text-tertiary mt-xs">{avgAts}%</p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-xs">
          <p className="font-label-md text-label-md text-on-surface-variant">Skills</p>
          <p className="font-display-lg text-display-lg font-bold text-on-surface mt-xs">{skillsCount}</p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-xs">
          <p className="font-label-md text-label-md text-on-surface-variant">Saved Jobs</p>
          <p className="font-display-lg text-display-lg font-bold text-on-surface mt-xs">{savedJobsCount}</p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-xs">
          <p className="font-label-md text-label-md text-on-surface-variant">Versions</p>
          <p className="font-display-lg text-display-lg font-bold text-secondary mt-xs">{resumeCount || 1}</p>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid lg:grid-cols-3 gap-lg">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-lg">
          {/* Summary Section */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <div className="flex items-center justify-between mb-md">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-2">
                <Icon name="description" size={20} className="text-primary" />
                Professional Summary
              </h3>
              <button
                type="button"
                onClick={openSummaryModal}
                className="btn-ghost text-xs text-primary py-1 px-2 cursor-pointer"
              >
                <Icon name="edit" size={14} /> Edit
              </button>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {profile.summary || 'No summary added yet. Click edit to write a brief summary.'}
            </p>
          </div>

          {/* Work Experience Section */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <div className="flex items-center justify-between mb-md">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-2">
                <Icon name="work" size={20} className="text-primary" />
                Work Experience
              </h3>
              <button
                type="button"
                onClick={() => openExpModal()}
                className="btn-secondary text-xs py-1 px-3 cursor-pointer"
              >
                <Icon name="plus" size={14} /> Add Experience
              </button>
            </div>

            {profile.experience && profile.experience.length ? (
              <div className="space-y-md divide-y divide-outline-variant/40">
                {profile.experience.map((item, idx) => (
                  <div key={item.id || idx} className={idx > 0 ? 'pt-md' : ''}>
                    <div className="flex items-start justify-between gap-sm">
                      <div>
                        <h4 className="font-headline-sm text-headline-sm font-semibold text-on-surface">{item.role}</h4>
                        <p className="font-body-md text-body-md font-medium text-primary">{item.company}</p>
                        <p className="font-label-md text-label-md text-on-surface-variant mt-xs">
                          {item.dates} {item.location ? `· ${item.location}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => openExpModal(item)}
                          className="p-1 rounded text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                        >
                          <Icon name="edit" size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteExp(item.id, item.role)}
                          className="p-1 rounded text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                        >
                          <Icon name="delete" size={16} />
                        </button>
                      </div>
                    </div>
                    {item.achievements && (
                      <p className="font-body-md text-body-md text-on-surface-variant mt-sm bg-surface-container-low p-sm rounded-lg border border-outline-variant/50">
                        {item.achievements}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-md text-center text-on-surface-variant text-sm">
                No work experience entries added yet.
              </div>
            )}
          </div>

          {/* Education Section */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <div className="flex items-center justify-between mb-md">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-2">
                <Icon name="school" size={20} className="text-primary" />
                Education
              </h3>
              <button
                type="button"
                onClick={() => openEduModal()}
                className="btn-secondary text-xs py-1 px-3 cursor-pointer"
              >
                <Icon name="plus" size={14} /> Add Education
              </button>
            </div>

            {profile.education && profile.education.length ? (
              <div className="space-y-md">
                {profile.education.map((item, idx) => (
                  <div key={item.id || idx} className="flex items-start justify-between gap-sm p-sm rounded-lg bg-surface-container-low border border-outline-variant">
                    <div>
                      <h4 className="font-headline-sm text-headline-sm font-semibold text-on-surface">{item.degree}</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant">{item.institution}</p>
                      <p className="font-label-md text-label-md text-outline mt-xs">
                        {item.dates} {item.gpa ? `· GPA: ${item.gpa}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEduModal(item)}
                        className="p-1 rounded text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                      >
                        <Icon name="edit" size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteEdu(item.id, item.degree)}
                        className="p-1 rounded text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                      >
                        <Icon name="delete" size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-md text-center text-on-surface-variant text-sm">
                No education history added yet.
              </div>
            )}
          </div>

          {/* Projects Section */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <div className="flex items-center justify-between mb-md">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-2">
                <Icon name="folder_open" size={20} className="text-primary" />
                Featured Projects
              </h3>
              <button
                type="button"
                onClick={() => openProjModal()}
                className="btn-secondary text-xs py-1 px-3 cursor-pointer"
              >
                <Icon name="plus" size={14} /> Add Project
              </button>
            </div>

            {profile.projects && profile.projects.length ? (
              <div className="grid md:grid-cols-2 gap-md">
                {profile.projects.map((proj, idx) => (
                  <div key={proj.id || idx} className="p-md rounded-xl bg-surface-container-low border border-outline-variant flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-xs">
                        <h4 className="font-headline-sm text-headline-sm font-semibold text-on-surface">{proj.title}</h4>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openProjModal(proj)}
                            className="p-1 rounded text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                          >
                            <Icon name="edit" size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProj(proj.id, proj.title)}
                            className="p-1 rounded text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                          >
                            <Icon name="delete" size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-xs line-clamp-3">
                        {proj.description}
                      </p>
                    </div>
                    <div className="mt-md pt-sm border-t border-outline-variant/50 flex items-center justify-between">
                      <span className="font-label-md text-label-md text-primary font-medium truncate max-w-[70%]">
                        {proj.technologies}
                      </span>
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 shrink-0"
                        >
                          Link <Icon name="open_in_new" size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-md text-center text-on-surface-variant text-sm">
                No projects added yet.
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-lg">
          {/* Skills & Proficiency Section */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <div className="flex items-center justify-between mb-md">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-2">
                <Icon name="psychology" size={20} className="text-primary" />
                Skills & Proficiency
              </h3>
              <button
                type="button"
                onClick={() => openSkillModal()}
                className="btn-secondary text-xs py-1 px-3 cursor-pointer"
              >
                <Icon name="plus" size={14} /> Add Skill
              </button>
            </div>

            {profile.skills && profile.skills.length ? (
              <div className="space-y-md">
                {profile.skills.map((s, idx) => (
                  <div key={s.id || idx} className="space-y-xs">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-on-surface">{s.name}</span>
                      <div className="flex items-center gap-sm">
                        <span className="badge badge-info">{s.level || 'Advanced'}</span>
                        <button
                          type="button"
                          onClick={() => openSkillModal(s)}
                          className="text-on-surface-variant hover:text-primary cursor-pointer"
                        >
                          <Icon name="edit" size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSkill(s.id, s.name)}
                          className="text-on-surface-variant hover:text-error cursor-pointer"
                        >
                          <Icon name="delete" size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${s.proficiency || 80}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">No skills listed yet.</p>
            )}
          </div>

          {/* Certifications Section */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <div className="flex items-center justify-between mb-md">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-2">
                <Icon name="verified" size={20} className="text-primary" />
                Certifications
              </h3>
              <button
                type="button"
                onClick={() => openCertModal()}
                className="btn-secondary text-xs py-1 px-3 cursor-pointer"
              >
                <Icon name="plus" size={14} /> Add Cert
              </button>
            </div>

            {profile.certifications && profile.certifications.length ? (
              <div className="space-y-sm">
                {profile.certifications.map((c, idx) => (
                  <div key={c.id || idx} className="p-sm rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-between">
                    <div>
                      <h4 className="font-headline-sm text-headline-sm font-semibold text-on-surface">{c.name}</h4>
                      <p className="font-label-md text-label-md text-on-surface-variant">{c.issuer} · {c.date}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openCertModal(c)}
                        className="p-1 text-on-surface-variant hover:text-primary cursor-pointer"
                      >
                        <Icon name="edit" size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCert(c.id, c.name)}
                        className="p-1 text-on-surface-variant hover:text-error cursor-pointer"
                      >
                        <Icon name="delete" size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">No certifications added.</p>
            )}
          </div>

          {/* Languages Section */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <div className="flex items-center justify-between mb-md">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-2">
                <Icon name="translate" size={20} className="text-primary" />
                Languages
              </h3>
              <button
                type="button"
                onClick={() => openLangModal()}
                className="btn-secondary text-xs py-1 px-3 cursor-pointer"
              >
                <Icon name="plus" size={14} /> Add
              </button>
            </div>

            {profile.languages && profile.languages.length ? (
              <div className="space-y-xs">
                {profile.languages.map((l, idx) => (
                  <div key={l.id || idx} className="flex justify-between items-center text-sm py-1 border-b border-outline-variant/40 last:border-0">
                    <span className="font-medium text-on-surface">{l.language}</span>
                    <div className="flex items-center gap-xs">
                      <span className="text-xs text-on-surface-variant">{l.proficiency}</span>
                      <button type="button" onClick={() => openLangModal(l)} className="text-on-surface-variant hover:text-primary cursor-pointer">
                        <Icon name="edit" size={14} />
                      </button>
                      <button type="button" onClick={() => deleteLang(l.id, l.language)} className="text-on-surface-variant hover:text-error cursor-pointer">
                        <Icon name="delete" size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">No languages specified.</p>
            )}
          </div>

          {/* Career Preferences Section */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <div className="flex items-center justify-between mb-md">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-2">
                <Icon name="target" size={20} className="text-primary" />
                Career Preferences
              </h3>
              <button
                type="button"
                onClick={openPrefModal}
                className="btn-ghost text-xs text-primary py-1 px-2 cursor-pointer"
              >
                <Icon name="edit" size={14} /> Edit
              </button>
            </div>

            <div className="space-y-sm text-sm">
              <div>
                <span className="text-on-surface-variant font-medium block text-xs">Desired Role</span>
                <span className="text-on-surface font-semibold">{profile.preferences?.desiredRole || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-on-surface-variant font-medium block text-xs">Target Industry</span>
                <span className="text-on-surface font-semibold">{profile.preferences?.desiredIndustry || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-on-surface-variant font-medium block text-xs">Preferred Location & Mode</span>
                <span className="text-on-surface font-semibold">{profile.preferences?.desiredLocation || 'Not specified'} · {profile.preferences?.workMode || 'Remote'}</span>
              </div>
              <div>
                <span className="text-on-surface-variant font-medium block text-xs">Expected Compensation</span>
                <span className="text-primary font-semibold">{profile.preferences?.expectedSalary || 'Negotiable'}</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-lg py-md border-b border-outline-variant flex justify-between items-center bg-surface-bright">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Recent Activity</h3>
              {activityList.length > 0 && (
                <button
                  type="button"
                  onClick={onViewAllHistory}
                  className="text-primary font-label-md text-label-md hover:underline cursor-pointer"
                >
                  View All
                </button>
              )}
            </div>

            {activityList.length > 0 ? (
              <div className="divide-y divide-outline-variant/40">
                {activityList.map((entry, idx) => (
                  <div
                    key={entry.id || idx}
                    onClick={() => onOpenHistory && onOpenHistory(entry)}
                    className="p-md flex items-center gap-md hover:bg-surface-bright transition-colors cursor-pointer text-left"
                  >
                    <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Icon name="history" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body-md text-body-md text-on-surface truncate font-medium">
                        {entry.resumeName}
                      </p>
                      <p className="font-label-md text-label-md text-on-surface-variant truncate">
                        {entry.selectedRole ? `${entry.selectedRole}` : 'Analysis Event'}
                      </p>
                    </div>
                    <span className="font-label-md text-label-md text-outline shrink-0">
                      {formatTime(entry.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-lg text-center text-on-surface-variant text-sm">
                No recent activity logged.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===================== MODALS FOR EDITING ===================== */}

      {/* 1. Basic & Contact Info Modal */}
      <Modal isOpen={activeModal === 'basic'} onClose={() => setActiveModal(null)} title="Edit Basic & Contact Information">
        <form onSubmit={saveBasic} className="space-y-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Full Name</label>
              <input
                type="text"
                required
                value={basicForm.name}
                onChange={(e) => setBasicForm({ ...basicForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Professional Headline</label>
              <input
                type="text"
                value={basicForm.headline}
                onChange={(e) => setBasicForm({ ...basicForm, headline: e.target.value })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
                placeholder="e.g. Senior Software Engineer & Cloud Architect"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Email</label>
              <input
                type="email"
                required
                value={basicForm.email}
                onChange={(e) => setBasicForm({ ...basicForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Phone</label>
              <input
                type="text"
                value={basicForm.phone}
                onChange={(e) => setBasicForm({ ...basicForm, phone: e.target.value })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Location</label>
              <input
                type="text"
                value={basicForm.location}
                onChange={(e) => setBasicForm({ ...basicForm, location: e.target.value })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
                placeholder="e.g. San Francisco, CA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Avatar Image URL (Optional)</label>
              <input
                type="url"
                value={basicForm.avatarUrl}
                onChange={(e) => setBasicForm({ ...basicForm, avatarUrl: e.target.value })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">LinkedIn Profile</label>
              <input
                type="text"
                value={basicForm.linkedin}
                onChange={(e) => setBasicForm({ ...basicForm, linkedin: e.target.value })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">GitHub Profile</label>
              <input
                type="text"
                value={basicForm.github}
                onChange={(e) => setBasicForm({ ...basicForm, github: e.target.value })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-on-surface mb-1">Portfolio Website</label>
              <input
                type="text"
                value={basicForm.portfolio}
                onChange={(e) => setBasicForm({ ...basicForm, portfolio: e.target.value })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="flex justify-end gap-sm pt-md border-t border-outline-variant">
            <button type="button" onClick={() => setActiveModal(null)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Changes</button>
          </div>
        </form>
      </Modal>

      {/* 2. Professional Summary Modal */}
      <Modal isOpen={activeModal === 'summary'} onClose={() => setActiveModal(null)} title="Edit Professional Summary">
        <form onSubmit={saveSummary} className="space-y-md">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Summary</label>
            <textarea
              rows={6}
              required
              value={summaryForm}
              onChange={(e) => setSummaryForm(e.target.value)}
              className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
              placeholder="Highlight your core expertise, career achievements, and leadership philosophy..."
            />
          </div>
          <div className="flex justify-end gap-sm pt-md border-t border-outline-variant">
            <button type="button" onClick={() => setActiveModal(null)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Summary</button>
          </div>
        </form>
      </Modal>

      {/* 3. Skill Modal */}
      <Modal isOpen={activeModal === 'skill'} onClose={() => setActiveModal(null)} title={editingItem ? 'Edit Skill' : 'Add New Skill'}>
        <form onSubmit={saveSkill} className="space-y-md">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Skill Name</label>
            <input
              type="text"
              required
              value={skillForm.name}
              onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
              placeholder="e.g. React.js, Python, AWS"
            />
          </div>
          <div className="grid grid-cols-2 gap-md">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Proficiency % ({skillForm.proficiency}%)</label>
              <input
                type="range"
                min="10"
                max="100"
                value={skillForm.proficiency}
                onChange={(e) => setSkillForm({ ...skillForm, proficiency: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Level</label>
              <select
                value={skillForm.level}
                onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-sm pt-md border-t border-outline-variant">
            <button type="button" onClick={() => setActiveModal(null)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Skill</button>
          </div>
        </form>
      </Modal>

      {/* 4. Experience Modal */}
      <Modal isOpen={activeModal === 'exp'} onClose={() => setActiveModal(null)} title={editingItem ? 'Edit Experience' : 'Add Experience'}>
        <form onSubmit={saveExp} className="space-y-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Role Title</label>
              <input
                type="text"
                required
                value={expForm.role}
                onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
                placeholder="e.g. Senior Software Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Company Name</label>
              <input
                type="text"
                required
                value={expForm.company}
                onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Dates</label>
              <input
                type="text"
                value={expForm.dates}
                onChange={(e) => setExpForm({ ...expForm, dates: e.target.value })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
                placeholder="e.g. 2021 - Present"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Location</label>
              <input
                type="text"
                value={expForm.location}
                onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
                placeholder="e.g. San Francisco, CA (Remote)"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Key Achievements & Responsibilities</label>
            <textarea
              rows={4}
              value={expForm.achievements}
              onChange={(e) => setExpForm({ ...expForm, achievements: e.target.value })}
              className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
              placeholder="Quantifiable achievements, systems built, team impact..."
            />
          </div>
          <div className="flex justify-end gap-sm pt-md border-t border-outline-variant">
            <button type="button" onClick={() => setActiveModal(null)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Experience</button>
          </div>
        </form>
      </Modal>

      {/* 5. Education Modal */}
      <Modal isOpen={activeModal === 'edu'} onClose={() => setActiveModal(null)} title={editingItem ? 'Edit Education' : 'Add Education'}>
        <form onSubmit={saveEdu} className="space-y-md">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Degree / Qualification</label>
            <input
              type="text"
              required
              value={eduForm.degree}
              onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
              className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
              placeholder="e.g. B.S. in Computer Science"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Institution / University</label>
            <input
              type="text"
              required
              value={eduForm.institution}
              onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
              className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-md">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Dates</label>
              <input
                type="text"
                value={eduForm.dates}
                onChange={(e) => setEduForm({ ...eduForm, dates: e.target.value })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
                placeholder="e.g. 2014 - 2018"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">GPA / Grade (Optional)</label>
              <input
                type="text"
                value={eduForm.gpa}
                onChange={(e) => setEduForm({ ...eduForm, gpa: e.target.value })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
                placeholder="e.g. 3.8 / 4.0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-sm pt-md border-t border-outline-variant">
            <button type="button" onClick={() => setActiveModal(null)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Education</button>
          </div>
        </form>
      </Modal>

      {/* 6. Certification Modal */}
      <Modal isOpen={activeModal === 'cert'} onClose={() => setActiveModal(null)} title={editingItem ? 'Edit Certification' : 'Add Certification'}>
        <form onSubmit={saveCert} className="space-y-md">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Certification Name</label>
            <input
              type="text"
              required
              value={certForm.name}
              onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
              placeholder="e.g. AWS Solutions Architect"
            />
          </div>
          <div className="grid grid-cols-2 gap-md">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Issuing Organization</label>
              <input
                type="text"
                value={certForm.issuer}
                onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Year / Date</label>
              <input
                type="text"
                value={certForm.date}
                onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="flex justify-end gap-sm pt-md border-t border-outline-variant">
            <button type="button" onClick={() => setActiveModal(null)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Certification</button>
          </div>
        </form>
      </Modal>

      {/* 7. Project Modal */}
      <Modal isOpen={activeModal === 'proj'} onClose={() => setActiveModal(null)} title={editingItem ? 'Edit Project' : 'Add Project'}>
        <form onSubmit={saveProj} className="space-y-md">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Project Title</label>
            <input
              type="text"
              required
              value={projForm.title}
              onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
              className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Description</label>
            <textarea
              rows={3}
              value={projForm.description}
              onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
              className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Technologies Used</label>
              <input
                type="text"
                value={projForm.technologies}
                onChange={(e) => setProjForm({ ...projForm, technologies: e.target.value })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
                placeholder="e.g. React, Node.js, AWS"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Project / Demo Link</label>
              <input
                type="text"
                value={projForm.link}
                onChange={(e) => setProjForm({ ...projForm, link: e.target.value })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-sm pt-md border-t border-outline-variant">
            <button type="button" onClick={() => setActiveModal(null)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Project</button>
          </div>
        </form>
      </Modal>

      {/* 8. Language Modal */}
      <Modal isOpen={activeModal === 'lang'} onClose={() => setActiveModal(null)} title={editingItem ? 'Edit Language' : 'Add Language'}>
        <form onSubmit={saveLang} className="space-y-md">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Language</label>
            <input
              type="text"
              required
              value={langForm.language}
              onChange={(e) => setLangForm({ ...langForm, language: e.target.value })}
              className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
              placeholder="e.g. English, Spanish, German"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Proficiency Level</label>
            <select
              value={langForm.proficiency}
              onChange={(e) => setLangForm({ ...langForm, proficiency: e.target.value })}
              className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
            >
              <option value="Elementary">Elementary</option>
              <option value="Limited Working">Limited Working</option>
              <option value="Professional Working">Professional Working</option>
              <option value="Full Professional">Full Professional</option>
              <option value="Native / Fluent">Native / Fluent</option>
            </select>
          </div>
          <div className="flex justify-end gap-sm pt-md border-t border-outline-variant">
            <button type="button" onClick={() => setActiveModal(null)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Language</button>
          </div>
        </form>
      </Modal>

      {/* 9. Career Preferences Modal */}
      <Modal isOpen={activeModal === 'pref'} onClose={() => setActiveModal(null)} title="Edit Career Preferences">
        <form onSubmit={savePref} className="space-y-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Desired Role</label>
              <input
                type="text"
                value={prefForm.desiredRole || ''}
                onChange={(e) => setPrefForm({ ...prefForm, desiredRole: e.target.value })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
                placeholder="e.g. Lead Software Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Target Industry</label>
              <input
                type="text"
                value={prefForm.desiredIndustry || ''}
                onChange={(e) => setPrefForm({ ...prefForm, desiredIndustry: e.target.value })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
                placeholder="e.g. Enterprise SaaS / Fintech"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Desired Location</label>
              <input
                type="text"
                value={prefForm.desiredLocation || ''}
                onChange={(e) => setPrefForm({ ...prefForm, desiredLocation: e.target.value })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
                placeholder="e.g. San Francisco, CA / Remote"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Work Mode</label>
              <select
                value={prefForm.workMode || 'Hybrid or Remote'}
                onChange={(e) => setPrefForm({ ...prefForm, workMode: e.target.value })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
              >
                <option value="Remote Only">Remote Only</option>
                <option value="Hybrid or Remote">Hybrid or Remote</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Expected Salary Range</label>
              <input
                type="text"
                value={prefForm.expectedSalary || ''}
                onChange={(e) => setPrefForm({ ...prefForm, expectedSalary: e.target.value })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
                placeholder="e.g. $170,000 - $210,000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Relocation Preference</label>
              <select
                value={prefForm.relocation || 'Open to relocation'}
                onChange={(e) => setPrefForm({ ...prefForm, relocation: e.target.value })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface outline-none focus:border-primary"
              >
                <option value="Open to relocation">Open to relocation</option>
                <option value="Local only">Local only</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-sm pt-md border-t border-outline-variant">
            <button type="button" onClick={() => setActiveModal(null)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Preferences</button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
