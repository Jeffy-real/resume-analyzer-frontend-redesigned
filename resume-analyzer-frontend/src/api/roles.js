const BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export async function fetchAllRoles() {
  const res = await fetch(`${BASE}/roles`);
  if (!res.ok) throw new Error(`Failed to fetch roles: ${res.status}`);
  return res.json();
}

async function getErrorMessage(res, defaultMsg) {
  try {
    const data = await res.json();
    return data.error || data.message || `${defaultMsg} (${res.status})`;
  } catch {
    const text = await res.text().catch(() => '');
    return text || `${defaultMsg} (${res.status})`;
  }
}

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${BASE}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errMsg = await getErrorMessage(res, 'Upload failed');
    throw new Error(errMsg);
  }
  return res.json();
}

export async function analyzeResume(resumeId, targetRole) {
  const res = await fetch(`${BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume_id: resumeId, target_role: targetRole }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Analysis failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchRoleRecommendations(resumeId, topN = 20) {
  const res = await fetch(`${BASE}/analyze-all-roles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume_id: resumeId, top_n: topN }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Role comparison failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchATSForRole(resumeId, targetRole) {
  const res = await fetch(`${BASE}/ats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume_id: resumeId, target_role: targetRole }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `ATS check failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchDashboard(analysisId) {
  const res = await fetch(`${BASE}/dashboard/${analysisId}`);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Dashboard fetch failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchFeedback(resumeId, targetRole) {
  const res = await fetch(`${BASE}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume_id: resumeId, target_role: targetRole }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Feedback failed: ${res.status}`);
  }
  return res.json();
}
