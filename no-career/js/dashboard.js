import { loadStoredPlan, simulateProgress, clearPlan } from './api.js';
import { renderReadinessScore, renderSkillGap, renderRoadmap, renderWeeklySimulation } from './components.js';

const STORAGE_KEY = 'noCareer.plan.v1';

function _savePlan(plan) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(plan)); } catch (e) { /* ignore */ }
}

function handleToggleTask(weekNumber, taskIdx) {
  const plan = loadStoredPlan();
  if (!plan) return;
  const week = plan.roadmap.find(w => String(w.weekNumber) === String(weekNumber));
  if (!week) return;
  const task = week.tasks[taskIdx];
  if (!task) return;
  const completed = week.completedTasks || [];
  const isCompleted = completed.includes(task);
  if (isCompleted) {
    week.completedTasks = completed.filter(t => t !== task);
  } else {
    week.completedTasks = [...completed, task];
  }
  _savePlan(plan);
  _renderAll(plan);
}

function _renderAll(plan) {
  document.querySelector('#dreamRoleTitle').textContent = plan.meta?.profile?.dreamRole || 'Your plan';
  renderReadinessScore(document, plan);
  renderSkillGap(document.querySelector('#skillGapExisting'), document.querySelector('#skillGapMissing'), plan);
  renderRoadmap(document.querySelector('#roadmapContainer'), plan, { onToggleTask: handleToggleTask });
}

async function handleSimulate(pct) {
  const loading = document.querySelector('#loadingMessage');
  if (loading) loading.textContent = 'Applying simulation...';
  try {
    const updated = await simulateProgress(pct);
    _renderAll(updated);
    if (loading) loading.textContent = 'Simulation applied — readiness updated.';
  } catch (err) {
    console.error(err);
    if (loading) loading.textContent = 'Simulation failed.';
  } finally {
    setTimeout(() => { const el = document.querySelector('#loadingMessage'); if (el) el.textContent = ''; }, 1800);
  }
}

export function initDashboard() {
  const plan = loadStoredPlan();
  if (!plan) {
    window.location.href = 'index.html';
    return;
  }

  _renderAll(plan);

  // wire simulation control
  renderWeeklySimulation(document, { onSimulate: handleSimulate });

  // reset plan action
  const resetBtn = document.querySelector('#resetPlanBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => { clearPlan(); window.location.href = 'index.html'; });
  }
}
