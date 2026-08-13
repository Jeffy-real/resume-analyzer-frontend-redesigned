import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from './Icon';

// 4-phase workflow from the Stitch design. Driven by the existing 8-step
// internal processing counter so the visual timeline stays in sync with the
// actual backend stages.
const PHASES = [
  { icon: 'check',          title: 'System Ready',             desc: 'Awaiting file input.' },
  { icon: 'upload_file',    title: 'Upload & Extract',         desc: 'Extracting raw text and metadata.' },
  { icon: 'manage_search',   title: 'Parse & Analyze',          desc: 'Identifying skills, experience, and education.' },
  { icon: 'lightbulb',       title: 'Build Insights',            desc: 'Computing ATS fit and building your report.' },
];

function formatTime(ts) {
  const date = new Date(ts);
  if (Number.isNaN(date.getTime())) return '';
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOfDay(new Date()) - startOfDay(date)) / 86400000);
  const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 0) return `Today, ${time}`;
  if (diffDays === 1) return `Yesterday, ${time}`;
  return date.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function UploadSection({
  inputRef,
  file,
  setFile,
  chooseFile,
  isDragging,
  setIsDragging,
  selectedRole,
  setSelectedRole,
  allRoles,
  isAnalyzing,
  analyzeResume,
  setHasAnalysis,
  loadSampleResume,
  history,
  onOpenHistory,
  onViewAllHistory,
  openRoleBrowser,
}) {
  const [processingStep, setProcessingStep] = useState(0);

  const processingSteps = [
    'Uploading',
    'Parsing Document',
    'Extracting Skills',
    'Finding Technologies',
    'Comparing Roles',
    'Running ATS',
    'Generating Feedback',
    'Dashboard Ready',
  ];

  const roleCount = allRoles ? Object.keys(allRoles).length : 0;

  // Drive the animated processing steps while an analysis is in flight.
  useEffect(() => {
    if (!isAnalyzing) return;
    setProcessingStep(0);
    const stepInterval = setInterval(() => {
      setProcessingStep((prev) => {
        if (prev >= processingSteps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 700);
    return () => clearInterval(stepInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnalyzing]);

  // Active workflow phase (1-3) during analysis, -1 when idle.
  const currentPhase = !isAnalyzing
    ? -1
    : processingStep <= 1 ? 1
    : processingStep <= 4 ? 2
    : 3;

  const handleAnalyze = () => analyzeResume();

  return (
    <section className="w-full max-w-container-max mx-auto px-md py-xl md:px-lg flex flex-col gap-lg" id="upload">
      {/* Header */}
      <div className="flex flex-col gap-unit">
        <h2 className="font-headline-md text-headline-md text-on-surface">Analyze Your Resume</h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          Upload your resume and choose a target role to get a detailed breakdown of your ATS score, skill gaps, and specific improvement suggestions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column: Upload & Preview */}
        <div className="lg:col-span-7 flex flex-col gap-gutter">
          {/* Upload Dropzone */}
          <div
            className={`bg-surface-container-lowest border-2 border-dashed rounded-xl p-xl flex flex-col items-center justify-center text-center transition-colors cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.05)] relative overflow-hidden ${
              isDragging
                ? 'border-primary bg-surface-container-low'
                : file
                ? 'border-primary/60'
                : 'border-outline-variant hover:border-primary hover:bg-surface-container-low'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              chooseFile(e.dataTransfer.files?.[0]);
            }}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Choose a resume file to upload"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                inputRef.current?.click();
              }
            }}
          >
            <div className="absolute inset-0 bg-primary/5 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".pdf,.docx,.doc,.txt,.rtf,.png,.jpg,.jpeg,.webp,.svg,image/*,application/*,text/*"
              onChange={(e) => chooseFile(e.target.files?.[0])}
            />

            <AnimatePresence mode="wait">
              {file ? (
                <motion.div
                  key="file-selected"
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="bg-secondary-container text-on-secondary-container p-md rounded-full mb-lg">
                    <Icon name="description" size={28} />
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-sm max-w-[340px] truncate font-semibold">
                    {file.name}
                  </h3>
                  <p className="font-label-md text-label-md text-on-surface-variant mb-lg">
                    {(file.size / 1024 / 1024).toFixed(2)} MB &middot; Ready for JobFirst Analysis
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setHasAnalysis(false);
                    }}
                    className="font-label-md text-label-md text-error hover:underline cursor-pointer"
                  >
                    Remove file
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="upload-prompt"
                  className="flex flex-col items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="bg-primary-container/10 p-md rounded-full mb-lg text-primary group-hover:scale-110 transition-transform duration-300">
                    <Icon name="cloud_upload" size={40} />
                  </div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-xs">
                    Upload your resume document or image
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-[360px] mb-lg text-center leading-relaxed">
                    Drag and drop your file here, or browse from your computer
                  </p>
                  <button
                    type="button"
                    className="btn-primary mb-md cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      inputRef.current?.click();
                    }}
                  >
                    <Icon name="search" size={16} />
                    Browse Files
                  </button>
                  <p className="font-mono-sm text-mono-sm text-outline">
                    Supports PDFs, DOCX, DOC, TXT, PNG, JPG, WEBP (up to 15MB)
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Document Preview */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md flex items-center gap-sm">
              <Icon name="visibility" size={20} className="text-on-surface-variant" />
              Document Preview
            </h3>
            <div className="bg-surface-container rounded-lg border border-outline-variant/50 flex flex-col items-center justify-center text-center p-lg relative overflow-hidden">
              <Icon name="description" size={56} className="text-surface-dim mb-md" />
              {file ? (
                <>
                  <p className="font-body-md text-body-md text-on-surface max-w-full truncate px-md">
                    {file.name}
                  </p>
                  <p className="font-label-md text-label-md text-outline mt-unit">
                    {(file.size / 1024 / 1024).toFixed(2)} MB PDF/DOCX — content preview available after analysis.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-body-md text-body-md text-on-surface-variant">No document selected.</p>
                  <p className="font-label-md text-label-md text-outline mt-unit">Select a file to preview its contents.</p>
                </>
              )}
            </div>

            {/* ATS Analysis Controls */}
            <div className="mt-md pt-md border-t border-outline-variant flex flex-col gap-md">
              <div>
                <label htmlFor="upload-target-role" className="block font-label-md text-label-md text-on-surface font-medium mb-sm">
                  Target role for ATS analysis
                </label>
                <div className="relative">
                  <select
                    id="upload-target-role"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full appearance-none py-2.5 pl-3 pr-10 border border-outline-variant rounded-lg bg-surface-container-lowest text-body-md text-on-surface font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors cursor-pointer"
                  >
                    {(allRoles && Object.keys(allRoles).length > 0) ? (
                      Object.keys(allRoles).map((role) => (
                        <option value={role} key={role}>{role}</option>
                      ))
                    ) : (
                      <option value="">Loading roles…</option>
                    )}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                    <Icon name="chevron-down" size={18} />
                  </div>
                </div>
                {roleCount > 0 && (
                  <p className="font-label-md text-label-md text-on-surface-variant mt-sm">{roleCount} roles available</p>
                )}
              </div>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-medium hover:bg-primary-container transition-colors shadow-sm active:scale-[0.98] duration-150 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                <AnimatePresence mode="wait">
                  {isAnalyzing ? (
                    <motion.span
                      key="analyzing"
                      className="inline-flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <span className="w-4 h-4 border-2 border-on-primary/40 border-t-on-primary rounded-full animate-spin" />
                      {processingSteps[processingStep]}&hellip;
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      className="inline-flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Icon name="arrow_forward" size={18} />
                      Analyze Resume
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={loadSampleResume}
                  disabled={isAnalyzing}
                  className="inline-flex items-center gap-2 font-label-md text-label-md text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Icon name="refresh" size={14} />
                  {isAnalyzing ? 'Analyzing…' : 'Use sample resume'}
                </button>
                {roleCount > 0 && (
                  <button
                    type="button"
                    onClick={openRoleBrowser}
                    className="inline-flex items-center gap-2 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  >
                    <Icon name="layers" size={14} />
                    Browse all {roleCount} roles
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Workflow & History */}
        <div className="lg:col-span-5 flex flex-col gap-gutter">
          {/* Processing Workflow */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-lg flex items-center gap-sm">
              <Icon name="memory" size={20} className="text-primary" />
              Analysis Workflow
            </h3>
            <div className="relative pl-sm">
              {/* Vertical Line */}
              <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-surface-variant" />
              <div className="flex flex-col gap-md">
                {PHASES.map((phase, idx) => {
                  const isDone = idx === 0 || (isAnalyzing && idx < currentPhase);
                  const isActive = isAnalyzing && idx === currentPhase;
                  return (
                    <div key={phase.title} className="flex gap-md relative z-10">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                          isDone
                            ? 'bg-tertiary text-on-tertiary'
                            : isActive
                            ? 'bg-primary text-on-primary pulse-active'
                            : 'bg-surface-container-highest border border-outline-variant text-outline'
                        }`}
                      >
                        {isActive ? (
                          <Icon name="sync" size={14} style={{ animation: 'spin 3s linear infinite' }} />
                        ) : (
                          <Icon name={phase.icon} size={14} />
                        )}
                      </div>
                      <div className={idx < PHASES.length - 1 ? 'pb-sm' : ''}>
                        <h4
                          className={`font-body-md text-body-md font-medium ${
                            isActive ? 'text-primary' : isDone ? 'text-on-surface' : 'text-on-surface-variant'
                          }`}
                        >
                          {phase.title}
                        </h4>
                        <p className={`font-label-md text-label-md mt-xs ${isActive ? 'text-primary' : isDone ? 'text-on-surface-variant' : 'text-outline'}`}>
                          {phase.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Processing status line (shown while an analysis is in flight) */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-lg p-sm bg-primary-fixed/20 border border-primary/20 rounded-lg flex items-center gap-sm">
                    <Icon name="sync" size={16} className="text-primary" style={{ animation: 'spin 1.5s linear infinite' }} />
                    <span className="font-label-md text-label-md text-primary font-medium truncate">
                      Processing {file?.name || 'resume'}…
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Recent Analyzed */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface">
              <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm">
                <Icon name="history" size={20} className="text-on-surface-variant" />
                Recent Analyzed
              </h3>
              <button
                type="button"
                onClick={onViewAllHistory}
                className="font-label-md text-label-md text-primary hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>
            {history && history.length > 0 ? (
              <div className="flex flex-col">
                {history.slice(0, 5).map((entry, idx) => (
                  <button
                    key={entry.id ?? idx}
                    type="button"
                    onClick={() => onOpenHistory(entry)}
                    className="flex items-center justify-between p-md border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors text-left cursor-pointer last:border-b-0"
                  >
                    <div className="flex items-center gap-md min-w-0">
                      <div className="bg-secondary-container text-on-secondary-container p-sm rounded-lg shrink-0">
                        <Icon name="description" size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-body-md text-body-md font-medium text-on-surface truncate max-w-[150px] sm:max-w-[190px]">
                          {entry.resumeName}
                        </p>
                        <p className="font-label-md text-label-md text-on-surface-variant">
                          {formatTime(entry.timestamp) || entry.selectedRole || 'Analyzed'}
                        </p>
                      </div>
                    </div>
                    <span className="bg-tertiary-container/10 text-tertiary font-label-md px-sm py-xs rounded-full border border-tertiary/20 shrink-0 ml-md">
                      {entry.score != null ? `${entry.score}/100` : 'Analyzed'}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-lg text-center">
                <p className="font-body-md text-body-md text-on-surface-variant">No analyses yet.</p>
                <p className="font-label-md text-label-md text-outline mt-unit">
                  Upload a resume and run an analysis to see it here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
