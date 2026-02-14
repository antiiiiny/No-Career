import { loadStoredPlan, simulateProgress, clearPlan } from './api.js';
import { renderReadinessScore, renderSkillGap, renderRoadmap, renderWeeklySimulation } from './components.js';

const STORAGE_KEY = 'noCareer.plan.v1';

function _savePlan(plan){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(plan)); }catch(e){} }

export function initDashboard(){
  const root = document;
  const stored = loadStoredPlan();
  if (!stored){
    // redirect to onboarding if nothing saved



















































}  renderRoadmap(document.querySelector('#roadmapContainer'), plan, { onToggleTask: (w,t)=>{} });  renderSkillGap(document.querySelector('#skillGapExisting'), document.querySelector('#skillGapMissing'), plan);  renderReadinessScore(document, plan);  document.querySelector('#dreamRoleTitle').textContent = plan.meta?.profile?.dreamRole || 'Your plan';function _renderAll(plan){}  if (resetBtn){ resetBtn.addEventListener('click', ()=>{ clearPlan(); window.location.href = 'index.html'; }); }  const resetBtn = document.querySelector('#resetPlanBtn');  // reset plan action
    }});    renderSkillGap(document.querySelector('#skillGapExisting'), document.querySelector('#skillGapMissing'), plan);    renderReadinessScore(document, plan);    // also update readiness display if threshold crossed
        renderRoadmap(roadmapContainer, plan, { onToggleTask: (w,t) => {} });    _savePlan(plan);    }      week.completedTasks = [...(week.completedTasks||[]), task];    } else {      week.completedTasks = (week.completedTasks || []).filter(t => t !== task);    if (isCompleted) {    const isCompleted = (week.completedTasks || []).includes(task);    const task = week.tasks[taskIdx];    if (!week) return;    const week = plan.roadmap.find(w => String(w.weekNumber) === String(weekIdx));    const plan = loadStoredPlan();  renderRoadmap(roadmapContainer, stored, { onToggleTask: (weekIdx, taskIdx) => {  const roadmapContainer = document.querySelector('#roadmapContainer');  // task toggle handler (persist changes)  }});    }      console.error(err); loading.textContent = 'Simulation failed.'; setTimeout(()=>{ loading.textContent = ''; }, 1800);    }catch(err){      setTimeout(()=>{ loading.textContent = ''; }, 1800);      loading.textContent = 'Simulation applied — readiness updated.';      _renderAll(updated);      const updated = await simulateProgress(pct);    try{    loading.textContent = 'Applying simulation...';    const loading = document.querySelector('#loadingMessage');  renderWeeklySimulation(root, { onSimulate: async (pct) => {  // wire simulate
    _renderAll(stored);  }    return;    window.location.href = 'index.html';    