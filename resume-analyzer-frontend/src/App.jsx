import { lazy, Suspense, useRef, useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { UploadSection } from './components/UploadSection';
import { ToastContainer, LoadingSpinner } from './components/UI';
import { RoleBrowser } from './components/RoleBrowser';
import { JobMatchesView, SkillGapView, CareerInsightsView, SavedJobsView, ResumeLibraryView } from './components/CandidateViews';
import { AuthModal } from './components/AuthModal';

// Heavy views are code-split so only the active view's chunk loads.
const Dashboard = lazy(() => import('./components/Dashboard').then((m) => ({ default: m.Dashboard })));
const HistoryView = lazy(() => import('./components/HistoryView').then((m) => ({ default: m.HistoryView })));
const ReportsView = lazy(() => import('./components/ReportsView').then((m) => ({ default: m.ReportsView })));
import { SettingsView, applyTheme } from './components/SettingsView';
import { ProfileView, loadProfile } from './components/ProfileView';
import {
  fetchAllRoles,
  uploadResume,
  analyzeResume as apiAnalyze,
  fetchRoleRecommendations,
  fetchATSForRole,
  fetchDashboard,
  fetchFeedback,
} from './api/roles';

// Real minimal PDF for the sample-resume flow (valid PDF 1.4, extractable text
// for a "Senior Software Engineer" profile). Built into a real File object via
// a data URI fetch so the backend parser receives an actual document, not a stub.
const SAMPLE_RESUME_B64 =
  'JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXSAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA0IDAgUiA+PiA+PiAvQ29udGVudHMgNSAwIFIgPj4KZW5kb2JqCjQgMCBvYmoKPDwgL1R5cGUgL0ZvbnQgL1N1YnR5cGUgL1R5cGUxIC9CYXNlRm9udCAvSGVsdmV0aWNhID4+CmVuZG9iago1IDAgb2JqCjw8IC9MZW5ndGggMTc3NiA+PgpzdHJlYW0KQlQgL0YxIDE0IFRmIDcyIDcyMCBUZCAoQUFSQVYgUEFURUwpIFRqIEVUCkJUIC9GMSAxMCBUZiA3MiA3MDAgVGQgKFNlbmlvciBTb2Z0d2FyZSBFbmdpbmVlcikgVGogRVQKQlQgL0YxIDEwIFRmIDcyIDY3NiBUZCAoRW1haWw6IGFhcmF2LnBhdGVsQGVtYWlsLmNvbSB8IFBob25lOiAoNTU1KSAxMjMtNDU2NykgVGogRVQKQlQgL0YxIDEwIFRmIDcyIDY1MiBUZCAoTGlua2VkSW46IGxpbmtlZGluLmNvbS9pbi9hYXJhdnBhdGVsIHwgR2l0SHViOiBnaXRodWIuY29tL2FhcmF2cGF0ZWwpIFRqIEVUCkJUIC9GMSAxMCBUZiA3MiA2MTYgVGQgKFBST0ZFU1NJT05BTCBTVU1NQVJZKSBUaiBFVApCVCAvRjEgMTAgVGYgNzIgNTk4IFRkIChTb2Z0d2FyZSBlbmdpbmVlciB3aXRoIDYrIHllYXJzIGJ1aWxkaW5nIHNjYWxhYmxlIHdlYiBhcHBsaWNhdGlvbnMgYW5kIG1pY3Jvc2VydmljZXMuKSBUaiBFVApCVCAvRjEgMTAgVGYgNzIgNTgwIFRkIChFeHBlcmllbmNlZCB3aXRoIFB5dGhvbiwgSmF2YVNjcmlwdCwgUmVhY3QsIE5vZGUuanMsIFBvc3RncmVTUUwsIE1vbmdvREIsIEFXUywgRG9ja2VyLCBhbmQgS3ViZXJuZXRlcy4pIFRqIEVUCkJUIC9GMSAxMCBUZiA3MiA1NTYgVGQgKEVYUEVSSUVOQ0UpIFRqIEVUCkJUIC9GMSAxMCBUZiA3MiA1MzggVGQgKFNlbmlvciBTb2Z0d2FyZSBFbmdpbmVlciwgVGVjaE5vdmEgSW5jLiAoMjAyMSAtIFByZXNlbnQpKSBUaiBFVApCVCAvRjEgMTAgVGYgNzIgNTIwIFRkICgtIExlZCBhIHRlYW0gb2YgNiBlbmdpbmVlcnMgYnVpbGRpbmcgUmVhY3QgYW5kIE5vZGUuanMgbWljcm9zZXJ2aWNlcyBkZXBsb3llZCBvbiBBV1MuKSBUaiBFVApCVCAvRjEgMTAgVGYgNzIgNTAyIFRkICgtIEltcHJvdmVkIHN5c3RlbSBwZXJmb3JtYW5jZSA0MCUgYnkgb3B0aW1pemluZyBQb3N0Z3JlU1FMIHF1ZXJpZXMgYW5kIGFkZGluZyBjYWNoaW5nLikgVGogRVQKQlQgL0YxIDEwIFRmIDcyIDQ4NCBUZCAoLSBDb250YWluZXJpemVkIGFwcGxpY2F0aW9ucyB3aXRoIERvY2tlciBhbmQgb3JjaGVzdHJhdGVkIHdpdGggS3ViZXJuZXRlcy4pIFRqIEVUCkJUIC9GMSAxMCBUZiA3MiA0NjAgVGQgKFNvZnR3YXJlIEVuZ2luZWVyLCBEYXRhRmxvdyBMYWJzICgyMDE4IC0gMjAyMSkpIFRqIEVUCkJUIC9GMSAxMCBUZiA3MiA0NDIgVGQgKC0gQnVpbHQgZGF0YSBwaXBlbGluZXMgd2l0aCBQeXRob24gcHJvY2Vzc2luZyAxTSsgcmVjb3JkcyBkYWlseSBzdG9yZWQgaW4gTW9uZ29EQi4pIFRqIEVUCkJUIC9GMSAxMCBUZiA3MiA0MjQgVGQgKC0gRGV2ZWxvcGVkIFJFU1QgQVBJcyB3aXRoIEZsYXNrIGFuZCBEamFuZ28gZm9yIGludGVybmFsIGFuZCBleHRlcm5hbCBjbGllbnRzLikgVGogRVQKQlQgL0YxIDEwIFRmIDcyIDQwMCBUZCAoRURVQ0FUSU9OKSBUaiBFVApCVCAvRjEgMTAgVGYgNzIgMzgyIFRkIChCLlRlY2ggaW4gQ29tcHV0ZXIgU2NpZW5jZSwgSW5kaWFuIEluc3RpdHV0ZSBvZiBUZWNobm9sb2d5ICgyMDE0IC0gMjAxOCkpIFRqIEVUCkJUIC9GMSAxMCBUZiA3MiAzNTggVGQgKFNLSUxMUykgVGogRVQKQlQgL0YxIDEwIFRmIDcyIDM0MCBUZCAoUHl0aG9uLCBKYXZhU2NyaXB0LCBUeXBlU2NyaXB0LCBSZWFjdCwgTm9kZS5qcywgRmxhc2ssIERqYW5nbywgUG9zdGdyZVNRTCwgTW9uZ29EQiwgUmVkaXMsKSBUaiBFVApCVCAvRjEgMTAgVGYgNzIgMzIyIFRkIChBV1MsIERvY2tlciwgS3ViZXJuZXRlcywgVGVycmFmb3JtLCBHaXQsIENJL0NELCBSRVNUIEFQSXMsIEdyYXBoUUwsIFVuaXQgVGVzdGluZykgVGogRVQKCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAowMDAwMDAwMjQxIDAwMDAwIG4gCjAwMDAwMDAzMTEgMDAwMDAgbiAKdHJhaWxlcgo8PCAvU2l6ZSA2IC9Sb290IDEgMCBSID4+CnN0YXJ0eHJlZgoyMTM5CiUlRU9GCg==';
const SAMPLE_RESUME_NAME = 'Aarav-Patel-Resume.pdf';

const SECTION_LABELS = [
  { label: 'Contact Information', max: 15 },
  { label: 'Professional Summary', max: 15 },
  { label: 'Skills & Technologies', max: 25 },
  { label: 'Projects & Experience', max: 20 },
  { label: 'Education & Certifications', max: 15 },
  { label: 'Resume Completeness', max: 10 },
];

function buildDashboardSections(serverSections) {
  if (serverSections && serverSections.length > 0) {
    return serverSections.map(s => ({
      label: s.label,
      status: s.status || 'review',
      text: s.text || '',
      pts: s.pts || 0,
      max: s.max || 15,
    }));
  }
  return SECTION_LABELS.map(s => ({
    ...s,
    status: 'complete',
    text: '',
    pts: Math.round(s.max * 0.75),
  }));
}

function mapFeedback(feedbackArray) {
  if (!feedbackArray || feedbackArray.length === 0) return [];
  return feedbackArray.map((item, idx) => ({
    number: String(idx + 1).padStart(2, '0'),
    category: item.category || item.type || 'Feedback',
    title: item.title || item.suggestion || item.message || '',
    text: item.text || item.description || item.detail || '',
    impact: item.impact || item.priority || (idx < 2 ? 'High Impact' : 'Medium Impact'),
  }));
}

function AppShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface font-sans antialiased">
      {children}
    </div>
  );
}

function App() {
  const inputRef = useRef(null);
  const resumeIdRef = useRef(null);

  const [view, setView] = useState('upload');
  const [allRoles, setAllRoles] = useState({});
  const [selectedRole, setSelectedRole] = useState('');
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [isRoleBrowserOpen, setIsRoleBrowserOpen] = useState(false);
  const roleBrowserTriggerRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [profile, setProfile] = useState(() => loadProfile());
  const [authUser, setAuthUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('jobfirst-auth-user')); } catch { return null; }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('jobfirst-auth-user');
    setAuthUser(null);
    addToast('Signed out successfully');
  }, [addToast]);

  useEffect(() => {
    applyTheme();
    fetchAllRoles()
      .then(data => {
        setAllRoles(data.roles || {});
        const roleNames = Object.keys(data.roles || {});
        if (roleNames.length > 0 && !selectedRole) {
          setSelectedRole(roleNames[0]);
        }
      })
      .catch(() => addToast('Failed to load roles from backend', 'error'));

    const storedHistory = localStorage.getItem('resume-analyzer-history');
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch {
        localStorage.removeItem('resume-analyzer-history');
      }
    }
  }, []);

  const saveToHistory = useCallback((analysisData) => {
    const newEntry = {
      id: analysisData.analysisId || Date.now(),
      resumeId: analysisData.resumeId,
      analysisId: analysisData.analysisId,
      resumeName: analysisData.resumeName,
      score: analysisData.score,
      ats: analysisData.ats,
      timestamp: analysisData.analyzedAt || new Date().toISOString(),
      selectedRole,
    };
    const updatedHistory = [newEntry, ...history].slice(0, 20);
    setHistory(updatedHistory);
    localStorage.setItem('resume-analyzer-history', JSON.stringify(updatedHistory));
  }, [history, selectedRole]);

  const deleteHistoryEntry = useCallback((entry) => {
    setHistory((prev) => {
      const next = prev.filter((h) => h.id !== entry.id);
      localStorage.setItem('resume-analyzer-history', JSON.stringify(next));
      return next;
    });
    addToast('Analysis removed from history');
  }, [addToast]);

  const chooseFile = (chosenFile) => {
    if (!chosenFile) return;
    const validExts = /\.(pdf|docx|doc|txt|rtf|png|jpg|jpeg|webp|svg)$/i;
    const isImage = chosenFile.type ? chosenFile.type.startsWith('image/') : false;
    const isText = chosenFile.type ? chosenFile.type.startsWith('text/') : false;
    if (!validExts.test(chosenFile.name) && !isImage && !isText) {
      addToast('Please upload a supported document or image resume.', 'error');
      return;
    }
    if (chosenFile.size > 15 * 1024 * 1024) {
      addToast('File exceeds the 15MB limit. Please choose a smaller file.', 'error');
      return;
    }
    setFile(chosenFile);
    setHasAnalysis(false);
    setAnalysis(null);
    setRecommendations([]);
    addToast(`${chosenFile.name} added successfully`, 'success');
  };

  const runAnalysis = async (uploadFile, role) => {
    setIsAnalyzing(true);
    try {
      const uploadResult = await uploadResume(uploadFile);
      const resumeId = uploadResult.resume_id;
      resumeIdRef.current = resumeId;

      const targetRole = role || selectedRole || Object.keys(allRoles)[0] || 'Software Engineer';
      if (targetRole) setSelectedRole(targetRole);

      const [analysisResult, recommendationsResult] = await Promise.all([
        apiAnalyze(resumeId, targetRole),
        fetchRoleRecommendations(resumeId, 20),
      ]);

      const serverRecommendations = recommendationsResult.suggestions || [];
      setRecommendations(serverRecommendations);

      const atsResult = await fetchATSForRole(resumeId, targetRole);
      const dashboardData = await fetchDashboard(analysisResult.analysis_id);

      const newAnalysis = {
        score: dashboardData.overall_score || analysisResult.overall_score || 0,
        ats: dashboardData.ats_score || atsResult.ats_score || 0,
        skillsScore: dashboardData.skills_score || analysisResult.skills_score || 75,
        experienceScore: dashboardData.experience_score || analysisResult.experience_score || 75,
        projectsScore: dashboardData.projects_score || analysisResult.projects_score || 75,
        educationScore: dashboardData.education_score || analysisResult.education_score || 75,
        qualityScore: dashboardData.quality_score || analysisResult.quality_score || 75,
        resumeName: dashboardData.resume_name || uploadFile.name,
        targetRole,
        matchedSkills: dashboardData.matched_skills || atsResult.matched_skills || [],
        missingSkills: dashboardData.missing_skills || atsResult.missing_skills || [],
        strengths: dashboardData.strengths || analysisResult.strengths || [],
        weaknesses: dashboardData.weaknesses || analysisResult.weaknesses || [],
        recommendations: dashboardData.recommendations || analysisResult.recommendations || [],
        keywords: dashboardData.keywords || analysisResult.keywords || [],
        sections: buildDashboardSections(dashboardData.sections),
        tips: mapFeedback(dashboardData.feedback || analysisResult.recommendations || []),
        analyzedAt: new Date().toISOString(),
        resumeId,
        analysisId: analysisResult.analysis_id,
      };

      setAnalysis(newAnalysis);
      setHasAnalysis(true);
      setIsAnalyzing(false);
      saveToHistory(newAnalysis);
      setView('dashboard');
      addToast('AI Analysis complete — report generated', 'success');
    } catch (err) {
      setIsAnalyzing(false);
      addToast(err.message || 'Analysis failed', 'error');
    }
  };

  const loadSampleResume = async () => {
    if (isAnalyzing) return;
    try {
      const res = await fetch(`data:application/pdf;base64,${SAMPLE_RESUME_B64}`);
      const blob = await res.blob();
      const sampleFile = new File([blob], SAMPLE_RESUME_NAME, {
        type: 'application/pdf',
      });
      setFile(sampleFile);
      await runAnalysis(sampleFile);
    } catch {
      addToast('Failed to load the sample resume', 'error');
    }
  };

  const analyzeResumeAction = () => {
    if (!file) {
      loadSampleResume();
      return;
    }
    runAnalysis(file, selectedRole);
  };

  const handleRoleChange = useCallback(async (role) => {
    setSelectedRole(role);
    if (!resumeIdRef.current || !hasAnalysis) return;
    try {
      setRecommendationsLoading(true);
      const atsResult = await fetchATSForRole(resumeIdRef.current, role);
      const dashboardData = await fetchDashboard(atsResult.analysis_id);

      setAnalysis(prev => ({
        ...prev,
        score: dashboardData.overall_score || atsResult.overall_score || prev.score,
        ats: dashboardData.ats_score || atsResult.ats_score || prev.ats,
        skillsScore: dashboardData.skills_score || atsResult.skills_score || prev.skillsScore,
        experienceScore: dashboardData.experience_score || atsResult.experience_score || prev.experienceScore,
        projectsScore: dashboardData.projects_score || atsResult.projects_score || prev.projectsScore,
        educationScore: dashboardData.education_score || atsResult.education_score || prev.educationScore,
        qualityScore: dashboardData.quality_score || atsResult.quality_score || prev.qualityScore,
        targetRole: role,
        matchedSkills: dashboardData.matched_skills || atsResult.matched_skills || [],
        missingSkills: dashboardData.missing_skills || atsResult.missing_skills || [],
        strengths: dashboardData.strengths || atsResult.strengths || prev.strengths,
        weaknesses: dashboardData.weaknesses || atsResult.weaknesses || prev.weaknesses,
        recommendations: dashboardData.recommendations || atsResult.recommendations || prev.recommendations,
        keywords: dashboardData.keywords || atsResult.keywords || prev.keywords,
        sections: buildDashboardSections(dashboardData.sections),
        tips: mapFeedback(dashboardData.feedback || atsResult.recommendations || []),
      }));
      setRecommendationsLoading(false);
    } catch {
      setRecommendationsLoading(false);
      addToast('Failed to load role data', 'error');
    }
  }, [hasAnalysis, addToast]);

  // Re-open a past analysis from history. Requires the backend IDs stored at
  // analysis time (resumeId / analysisId); legacy entries without them fall
  // back to the summary values already saved in the entry.
  const openHistoryEntry = useCallback(async (entry) => {
    if (!entry?.resumeId) {
      addToast('This older entry cannot be re-opened — upload the resume again.', 'error');
      return;
    }
    try {
      setRecommendationsLoading(true);
      resumeIdRef.current = entry.resumeId;
      if (entry.selectedRole) setSelectedRole(entry.selectedRole);

      const [recommendationsResult, atsResult] = await Promise.all([
        fetchRoleRecommendations(entry.resumeId, 20),
        entry.selectedRole
          ? fetchATSForRole(entry.resumeId, entry.selectedRole)
          : Promise.resolve(null),
      ]);
      setRecommendations(recommendationsResult.suggestions || []);

      const analysisId = entry.analysisId || (atsResult && atsResult.analysis_id);
      const [dashboardData, feedbackResult] = await Promise.all([
        analysisId ? fetchDashboard(analysisId) : Promise.resolve(null),
        entry.selectedRole
          ? fetchFeedback(entry.resumeId, entry.selectedRole).catch(() => ({ feedback: [] }))
          : Promise.resolve({ feedback: [] }),
      ]);

      setAnalysis({
        score: dashboardData?.overall_score ?? entry.score ?? 0,
        ats: dashboardData?.ats_score ?? atsResult?.ats_score ?? entry.ats ?? 0,
        resumeName: dashboardData?.resume_name ?? entry.resumeName,
        matchedSkills: dashboardData?.matched_skills ?? atsResult?.matched_skills ?? [],
        missingSkills: dashboardData?.missing_skills ?? atsResult?.missing_skills ?? [],
        sections: buildDashboardSections(dashboardData?.sections),
        tips: mapFeedback(
          dashboardData?.feedback?.length ? dashboardData.feedback : feedbackResult.feedback
        ),
        analyzedAt: entry.timestamp,
        resumeId: entry.resumeId,
        analysisId: analysisId || entry.analysisId,
      });
      setHasAnalysis(true);
      setView('dashboard');
      addToast('Analysis restored from history', 'success');
    } catch {
      addToast('Failed to re-open this analysis', 'error');
    } finally {
      setRecommendationsLoading(false);
    }
  }, [addToast]);

  const handleViewChange = useCallback((newView) => {
    setView(newView);
    if (newView === 'upload' && !hasAnalysis) {
      setFile(null);
      setHasAnalysis(false);
      setAnalysis(null);
      setRecommendations([]);
    }
  }, [hasAnalysis]);

  const currentAnalysis = analysis || {
    score: 0,
    ats: 0,
    resumeName: file?.name ?? '',
    matchedSkills: [],
    missingSkills: [],
    sections: SECTION_LABELS.map(s => ({ ...s, status: 'review', text: '', pts: 0 })),
    tips: [],
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return (
          <Dashboard
            analysis={currentAnalysis}
            recommendations={recommendations}
            selectedRole={selectedRole}
            onSelectRole={handleRoleChange}
            allRoles={allRoles}
            recommendationsLoading={recommendationsLoading}
            isAnalyzing={isAnalyzing}
            history={history}
            onOpenReports={() => handleViewChange('reports')}
            onOpenHistory={openHistoryEntry}
            onQuickUpload={() => handleViewChange('upload')}
          />
        );
      case 'history':
        return (
          <HistoryView
            history={history}
            onSelect={openHistoryEntry}
            allRoles={allRoles}
            onDelete={deleteHistoryEntry}
          />
        );
      case 'reports':
        return <ReportsView analysis={currentAnalysis} selectedRole={selectedRole} />;
      case 'settings':
        return <SettingsView allRoles={allRoles} />;
      case 'profile':
        return (
          <ProfileView
            history={history}
            onOpenHistory={openHistoryEntry}
            onViewAllHistory={() => handleViewChange('history')}
            onProfileUpdate={(updated) => setProfile(updated)}
            addToast={addToast}
          />
        );
      case 'job-matches':
        return (
          <JobMatchesView
            recommendations={recommendations}
            analysis={currentAnalysis}
            selectedRole={selectedRole}
            onSelectRole={handleRoleChange}
            onOpenReports={() => handleViewChange('reports')}
          />
        );
      case 'skill-gap':
        return <SkillGapView analysis={currentAnalysis} />;
      case 'career-insights':
        return <CareerInsightsView analysis={currentAnalysis} recommendations={recommendations} />;
      case 'saved-jobs':
        return <SavedJobsView onOpenMatches={() => handleViewChange('job-matches')} />;
      case 'resume-library':
        return (
          <ResumeLibraryView
            history={history}
            onOpenHistory={openHistoryEntry}
            onDelete={deleteHistoryEntry}
          />
        );
      case 'upload':
      default:
        return (
          <UploadSection
            inputRef={inputRef}
            file={file}
            setFile={setFile}
            chooseFile={chooseFile}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            selectedRole={selectedRole}
            setSelectedRole={handleRoleChange}
            allRoles={allRoles}
            recommendations={recommendations}
            recommendationsLoading={recommendationsLoading}
            isAnalyzing={isAnalyzing}
            analyzeResume={analyzeResumeAction}
            setHasAnalysis={setHasAnalysis}
            loadSampleResume={loadSampleResume}
            history={history}
            onOpenHistory={openHistoryEntry}
            onViewAllHistory={() => handleViewChange('history')}
            openRoleBrowser={() => {
              roleBrowserTriggerRef.current = document.activeElement;
              setIsRoleBrowserOpen(true);
            }}
          />
        );
    }
  };

  return (
    <AppShell>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {isAnalyzing && (
        <div className="loadingOverlay" role="status" aria-live="polite">
          <div className="card px-8 py-6 rounded-2xl flex flex-col items-center gap-4">
            <LoadingSpinner size={40} />
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-on-surface">Analyzing resume...</p>
              <p className="text-[11px] text-outline">Comparing against all supported roles</p>
            </div>
          </div>
        </div>
      )}

      {isRoleBrowserOpen && (
        <RoleBrowser
          allRoles={allRoles}
          recommendations={recommendations}
          onSelectRole={handleRoleChange}
          selectedRole={selectedRole}
          onClose={() => {
            setIsRoleBrowserOpen(false);
            window.setTimeout(() => {
              if (roleBrowserTriggerRef.current?.focus) {
                roleBrowserTriggerRef.current.focus();
              }
              roleBrowserTriggerRef.current = null;
            }, 0);
          }}
        />
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setAuthUser(user);
          if (user.name) {
            setProfile((p) => ({ ...p, name: user.name, email: user.email }));
          }
        }}
        addToast={addToast}
      />

      <Sidebar
        view={view}
        onViewChange={handleViewChange}
        hasAnalysis={hasAnalysis}
        profile={profile}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        authUser={authUser}
        onLogout={handleLogout}
      />
      <TopBar
        view={view}
        onViewChange={handleViewChange}
        hasAnalysis={hasAnalysis}
        loadSampleResume={loadSampleResume}
        isAnalyzing={isAnalyzing}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        user={authUser}
      />

      <main className="flex-1 pt-16 md:pt-0 pb-[72px] md:pb-0 md:pl-[240px]">
        <Suspense
          fallback={
            <div className="shell py-24 flex items-center justify-center">
              <LoadingSpinner size={36} />
            </div>
          }
        >
          {renderView()}
        </Suspense>
      </main>

      <BottomNav
        view={view}
        onViewChange={handleViewChange}
        hasAnalysis={hasAnalysis}
      />
    </AppShell>
  );
}

export default App;