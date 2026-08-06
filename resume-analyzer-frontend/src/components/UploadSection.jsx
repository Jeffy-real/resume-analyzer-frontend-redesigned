import React from 'react';
import { Icon } from './Icon';
import { Reveal } from './Reveal';

export function UploadSection({
  inputRef,
  file,
  setFile,
  chooseFile,
  isDragging,
  setIsDragging,
  selectedRole,
  setSelectedRole,
  roles,
  isAnalyzing,
  analyzeResume,
  setHasAnalysis,
  loadSampleResume,
}) {
  return (
    <section className="py-16 sm:py-20 border-t border-[var(--border-hair)]" id="upload">
      <div className="shell">
        <Reveal className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-mono font-medium text-[var(--accent-cyan)] uppercase tracking-wider">
            MODULE 1 &amp; 3
          </span>
          <span className="text-[var(--text-muted)]">•</span>
          <span className="text-xs text-[var(--text-secondary)] font-medium">Resume File Handling &amp; Role Selection</span>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-4">
          {/* Left Instructions */}
          <Reveal delay={60} className="lg:col-span-5 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[var(--text-primary)] leading-snug">
              Upload resume &amp; <br className="hidden sm:block" />
              select target role
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Upload a PDF or DOCX file to extract text content, evaluate section structure, and compare technical keywords against industry role expectations.
            </p>

            <div className="p-4 card-solid space-y-2.5">
              <div className="text-xs font-semibold text-[var(--text-primary)] flex items-center justify-between">
                <span>Fast testing option</span>
                <span className="text-[10px] font-mono" style={{ color: 'var(--color-success)' }}>Sample included</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Don't have a PDF ready? Click below to instantly load a pre-formatted candidate resume for evaluation.
              </p>
              <button
                type="button"
                onClick={loadSampleResume}
                className="w-full py-2 px-3 inline-flex items-center justify-center gap-2 text-xs btn-ghost cursor-pointer"
              >
                <Icon name="refresh" size={14} />
                <span>Load pre-populated sample resume</span>
              </button>
            </div>
          </Reveal>

          {/* Right Upload Controls */}
          <Reveal delay={120} className="lg:col-span-7 card-glass p-6 sm:p-7 space-y-5">
            {/* Drag & Drop File Zone */}
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                1. Upload resume document (PDF / DOCX)
              </label>
              <div
                className={`relative min-h-[168px] p-6 flex flex-col items-center justify-center border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? 'border-[var(--accent-violet)] bg-[rgba(124,92,255,0.08)] scale-[1.01]'
                    : file
                    ? 'border-[var(--border-strong)] bg-white/[0.03]'
                    : 'border-[var(--border-hair)] hover:border-[var(--border-strong)] bg-white/[0.015]'
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
              >
                <input
                  ref={inputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => chooseFile(e.target.files?.[0])}
                />

                {file ? (
                  <div className="flex flex-col items-center">
                    <span
                      className="w-11 h-11 mb-2.5 grid place-items-center rounded-xl text-[#04050c]"
                      style={{ backgroundImage: 'var(--gradient-signal)' }}
                    >
                      <Icon name="file" size={20} />
                    </span>
                    <strong className="text-xs font-semibold text-[var(--text-primary)] max-w-[300px] truncate">
                      {file.name}
                    </strong>
                    <small className="text-[10px] text-[var(--text-muted)] font-mono mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB · PDF/DOCX Document
                    </small>
                    <button
                      type="button"
                      className="mt-2 text-[11px] font-semibold text-[var(--accent-cyan)] hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setHasAnalysis(false);
                      }}
                    >
                      Change or remove file
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="w-11 h-11 mb-2.5 grid place-items-center rounded-xl bg-white/5 text-[var(--text-secondary)] border border-[var(--border-hair)]">
                      <Icon name="upload" size={20} />
                    </span>
                    <strong className="text-xs font-semibold text-[var(--text-primary)]">
                      Click to choose file or drag &amp; drop here
                    </strong>
                    <span className="text-xs text-[var(--text-muted)] mt-0.5">
                      Supports standard PDF and Word DOCX formats (Max 10MB)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Target Role Selector */}
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                2. Select target job role for keyword analysis
              </label>
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full appearance-none py-2.5 pl-3.5 pr-10 border border-[var(--border-hair)] rounded-lg bg-[var(--bg-surface-solid)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-violet)] transition-colors cursor-pointer"
                >
                  {roles.map((role) => (
                    <option value={role} key={role} className="bg-[var(--bg-surface-solid)] text-[var(--text-primary)]">
                      {role}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
                  <Icon name="chevron" size={16} />
                </div>
              </div>
            </div>

            {/* Run Analysis Button */}
            <button
              className="w-full py-3.5 px-4 inline-flex items-center justify-center gap-2 text-xs btn-signal cursor-pointer"
              type="button"
              onClick={analyzeResume}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#04050c]/30 border-t-[#04050c] rounded-full animate-spin" />
                  <span>Processing document text &amp; skill matching…</span>
                </>
              ) : (
                <>
                  <Icon name="terminal" size={16} />
                  <span>Run resume analysis engine</span>
                </>
              )}
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
