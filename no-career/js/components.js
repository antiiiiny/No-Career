export function renderReadinessScore(root, plan){
  const scoreEl = root.querySelector('#readinessScore');
  const bar = root.querySelector('#readinessProgress .progress-fill');
  if (!scoreEl || !bar) return;
  const score = Math.max(0, Math.min(100, Number(plan.readinessScore || 0)));
  scoreEl.textContent = `${score}%`;
  bar.style.width = `${score}%`;
  const progressContainer = root.querySelector('#readinessProgress');
  if (progressContainer) progressContainer.setAttribute('aria-valuenow', String(score));
}

export function renderSkillGap(existingContainer, missingContainer, plan){
  existingContainer.innerHTML = '';
  missingContainer.innerHTML = '';
  (plan.existingSkills || []).forEach(s => {
    const li = document.createElement('li');
    li.className = 'skill';
    li.innerHTML = `<div class="skill-name">${escapeHtml(s.skillName)}</div><div class="chips"><span class="chip ${s.category==='technical'?'tag-tech':''}">${s.category}</span><span class="chip">Strength ${s.strength}%</span></div>`;
    existingContainer.appendChild(li);
  });
  (plan.missingSkills || []).forEach(ms => {
    const li = document.createElement('li');
    li.className = 'skill';
    li.innerHTML = `<div class="skill-name">${escapeHtml(ms)}</div><div class="chips"><span class="chip">Required</span></div>`;
    missingContainer.appendChild(li);
  });
}

export function renderRoadmap(container, plan, handlers = {}){
  container.innerHTML = '';
  (plan.roadmap || []).forEach(week => {
    const card = document.createElement('div');
    card.className = 'week-card';
    card.setAttribute('data-week', String(week.weekNumber));

    const completedCount = (week.completedTasks || []).length;
    card.innerHTML = `
      <div class="week-head">
        <div><strong>Week ${week.weekNumber}</strong></div>
        <div class="muted small">Focus: ${week.focusSkills.join(', ')}</div>
      </div>
      <div class="mini-project"><strong>Mini project</strong><div>${escapeHtml(week.miniProject)}</div></div>
      <ul class="week-tasks">
        ${week.tasks.map((t,i)=>`<li data-week="${week.weekNumber}" data-task="${i}"><button class="checkbox ${ (week.completedTasks||[]).includes(t) ? 'checked' : ''}" aria-pressed="${(week.completedTasks||[]).includes(t)}">${(week.completedTasks||[]).includes(t) ? '✓' : ''}</button><div class="task-text">${escapeHtml(t)}</div></li>`).join('')}
      </ul>
    `;

    container.appendChild(card);
  });

  // attach handlers for task toggle
  container.querySelectorAll('.week-tasks li').forEach(li => {
    const btn = li.querySelector('.checkbox');
    btn.addEventListener('click', (e) => {
      if (handlers.onToggleTask) handlers.onToggleTask(li.dataset.week, Number(li.dataset.task));
    });
  });
}

export function renderWeeklySimulation(root, handlers = {}){
  const slider = root.querySelector('#simulationSlider');
  const value = root.querySelector('#simulationValue');
  const btn = root.querySelector('#simulateBtn');
  if (!slider || !value || !btn) return;
  value.textContent = `${slider.value}%`;
  slider.addEventListener('input', () => { value.textContent = `${slider.value}%`; slider.setAttribute('aria-valuenow', slider.value); });
  btn.addEventListener('click', () => {
    const pct = Number(slider.value);
    btn.disabled = true;
    if (handlers.onSimulate) handlers.onSimulate(pct).finally(()=>{ btn.disabled = false; });
  });
}

function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
