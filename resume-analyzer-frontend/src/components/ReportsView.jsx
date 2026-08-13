import React from 'react';
import { motion } from 'motion/react';
import { Icon } from './Icon';
import { ResultsSection } from './ResultsSection';

// Reports page. Reuses the full report markup from ResultsSection so the
// existing print stylesheet (which targets `.results-section` and hides all
// other sections) produces a clean PDF with no page chrome.
export function ReportsView({ analysis, selectedRole }) {
  const hasReport = analysis && analysis.score > 0;

  return (
    <div>
      {/* Page header is excluded from print output via .no-print */}
      <div className="shell py-8 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
              Reports
            </h1>
            <p className="mt-1 text-on-surface-variant">
              Detailed ATS report for your resume — print it or save as a PDF
            </p>
          </div>
          {hasReport && (
            <button
              type="button"
              onClick={() => window.print()}
              className="btn-primary inline-flex items-center justify-center gap-2 shrink-0"
            >
              <Icon name="download" size={16} />
              Print / PDF
            </button>
          )}
        </div>
      </div>

      {hasReport ? (
        <ResultsSection
          hasAnalysis
          visibleName={analysis.resumeName}
          analysis={analysis}
          selectedRole={selectedRole}
          title="ATS Analysis Report"
        />
      ) : (
        <div className="shell pb-12">
          <motion.div
            className="card-flat max-w-3xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface-container-low text-outline grid place-items-center shrink-0">
                <Icon name="file-text" size={20} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-on-surface">No report yet</h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Upload a resume to generate an analysis report. Your most recent report will
                  appear here.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
