const STORAGE_KEY = 'noCareer.plan.v1';

const EXPERIENCE_BASELINE = {
  beginner: 20,
  intermediate: 50,
  advanced: 75
};

// Recommended mock response (conforms to schema)
function _defaultMockPlan(profile){
  const base = EXPERIENCE_BASELINE[profile.experienceLevel] || 40;
  const hoursBoost = Math.min(profile.hoursPerWeek || 0, 40) / 40 * 10; // up to +10
  const readiness = Math.max(10, Math.min(100, Math.round(base + hoursBoost)));

  return {
    readinessScore: readiness,
    missingSkills: ["System Design","Data Structures","Behavioral Interviewing"],
    existingSkills: [
      { skillName: "JavaScript", strength: 65, category: "technical" },
      { skillName: "HTML & CSS", strength: 72, category: "technical" },
      { skillName: "Git", strength: 55, category: "technical" },
      { skillName: "Communication", strength: 60, category: "soft" }
    ],
    roadmap: [
      { weekNumber: 1, focusSkills: ["JavaScript","Data Structures"], tasks: ["Implement linked list examples","Project: small algorithm challenge"], miniProject: "Build a to-do app with state persistence", completedTasks: [] },
      { weekNumber: 2, focusSkills: ["System Design","APIs"], tasks: ["Read system design primer","Design a simple REST API"], miniProject: "Design a notes API and document endpoints", completedTasks: [] },
      { weekNumber: 3, focusSkills: ["Testing","Debugging"], tasks: ["Write unit tests for previous projects","Fix known bugs"], miniProject: "Add test coverage to the to-do app", completedTasks: [] },
      { weekNumber: 4, focusSkills: ["Behavioral Interviewing","Portfolio"], tasks: ["Prepare 5 STAR stories","Polish README and deploy"], miniProject: "Publish portfolio demo and README", completedTasks: [] }
    ],
    meta: {
      createdAt: Date.now(),
      profile: { ...profile }
    }
  };
}

function _clone(obj){
  return JSON.parse(JSON.stringify(obj));
}

export async function generatePlan(profile = {}){
  // artificial processing delay + staged loading handled by onboarding UI
  await new Promise(r => setTimeout(r, 700));
  const plan = _defaultMockPlan(profile);
  // persist canonical plan
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(plan)); } catch (e) { /* ignore */ }
  return _clone(plan);
}

export async function sendToWebhook(profile = {}, file = null){
  const WEBHOOK_URL = 'https://aliciiaa.app.n8n.cloud/webhook/3ab792de-5657-43ed-b10e-eafb13bb4b20';

  function isPlanLike(obj){
    if (!obj || typeof obj !== 'object') return false;
    if (typeof obj.readinessScore === 'number') return true;
    if (Array.isArray(obj.roadmap) && obj.roadmap.length > 0) return true;
    return false;
  }

  try {
    const form = new FormData();
    form.append('dreamRole', profile.dreamRole || '');
    form.append('experienceLevel', profile.experienceLevel || '');
    form.append('hoursPerWeek', profile.hoursPerWeek || 0);
    form.append('existingSkills', JSON.stringify(profile.existingSkills || []));
    form.append('missingSkills', JSON.stringify(profile.missingSkills || []));
    if (file) form.append('resumePdf', file, file.name);

    const resp = await fetch(WEBHOOK_URL, { method: 'POST', body: form });
    if (!resp.ok) throw new Error(`Webhook responded with ${resp.status}`);

    const ct = (resp.headers.get('content-type') || '').toLowerCase();
    if (ct.includes('application/json')){
      const data = await resp.json();
      return isPlanLike(data) ? data : null; // return plan-like object or null (fallback)
    }

    // non-JSON responses — return raw text (caller will fallback)
    const text = await resp.text();
    return null;
  } catch (err) {
    console.warn('sendToWebhook error', err);
    throw err;
  }
}

// Simulate progress globally — returns updated plan object (also persists to localStorage)
export async function simulateProgress(completionPercent = 0){
  // read stored plan
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) throw new Error('No plan available');
  const plan = JSON.parse(raw);

  // small delay to simulate compute/network
  await new Promise(r => setTimeout(r, 450));

  const pct = Math.max(0, Math.min(100, Number(completionPercent) || 0));

  // update readiness: modest gain (clamped)
  plan.readinessScore = Math.min(100, Math.round(plan.readinessScore + pct * 0.25));

  // increase existing skill strengths slightly; stronger gains for focus skills in roadmap
  plan.existingSkills = plan.existingSkills.map(s => {
    const gain = Math.round(pct * 0.12); // small proportional gain
    return { ...s, strength: Math.min(100, s.strength + gain) };
  });

  // if completion is high, mark all roadmap tasks as completed for demonstration (global behavior)
  if (pct >= 75) {
    plan.roadmap = plan.roadmap.map(w => ({ ...w, completedTasks: [...w.tasks] }));
  } else if (pct > 0) {
    // mark first week's tasks partially completed proportionally (for demo)
    const week = plan.roadmap[0];
    const toComplete = Math.round((pct / 100) * week.tasks.length);
    week.completedTasks = week.tasks.slice(0, toComplete);
    plan.roadmap[0] = week;
  }

  // remove missing skills when an existing skill crosses threshold
  const strongNames = plan.existingSkills.filter(s => s.strength >= 70).map(s => s.skillName);
  plan.missingSkills = plan.missingSkills.filter(ms => !strongNames.includes(ms));

  // persist and return clone
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(plan)); } catch (e) { /* ignore */ }
  return _clone(plan);
}

export function loadStoredPlan(){
  try{ const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; } catch(e){ return null; }
}

export function clearPlan(){ localStorage.removeItem(STORAGE_KEY); }
