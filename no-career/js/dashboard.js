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


export function initDashboard(){
  const root = document;
  const stored = loadStoredPlan();
  if (!stored){
    // redirect to onboarding if nothing saved



















































}  renderRoadmap(document.querySelector('#roadmapContainer'), plan, { onToggleTask: (w,t)=>{} });  renderSkillGap(document.querySelector('#skillGapExisting'), document.querySelector('#skillGapMissing'), plan);  renderReadinessScore(document, plan);  document.querySelector('#dreamRoleTitle').textContent = plan.meta?.profile?.dreamRole || 'Your plan';function _renderAll(plan){}  if (resetBtn){ resetBtn.addEventListener('click', ()=>{ clearPlan(); window.location.href = 'index.html'; }); }  const resetBtn = document.querySelector('#resetPlanBtn');  // reset plan action
    }});    renderSkillGap(document.querySelector('#skillGapExisting'), document.querySelector('#skillGapMissing'), plan);    renderReadinessScore(document, plan);    // also update readiness display if threshold crossed
        renderRoadmap(roadmapContainer, plan, { onToggleTask: (w,t) => {} });    _savePlan(plan);    }      week.completedTasks = [...(week.completedTasks||[]), task];    } else {      week.completedTasks = (week.completedTasks || []).filter(t => t !== task);    if (isCompleted) {    const isCompleted = (week.completedTasks || []).includes(task);    const task = week.tasks[taskIdx];    if (!week) return;    const week = plan.roadmap.find(w => String(w.weekNumber) === String(weekIdx));    const plan = loadStoredPlan();  renderRoadmap(roadmapContainer, stored, { onToggleTask: (weekIdx, taskIdx) => {  const roadmapContainer = document.querySelector('#roadmapContainer');  // task toggle handler (persist changes)  }});    }      console.error(err); loading.textContent = 'Simulation failed.'; setTimeout(()=>{ loading.textContent = ''; }, 1800);    }catch(err){      setTimeout(()=>{ loading.textContent = ''; }, 1800);      loading.textContent = 'Simulation applied — readiness updated.';      _renderAll(updated);      const updated = await simulateProgress(pct);    try{    loading.textContent = 'Applying simulation...';    const loading = document.querySelector('#loadingMessage');  renderWeeklySimulation(root, { onSimulate: async (pct) => {  // wire simulate
    _renderAll(stored);  }    return;    window.location.href = 'index.html';    