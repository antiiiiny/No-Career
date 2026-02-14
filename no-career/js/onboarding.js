import { generatePlan } from './api.js';
const FORM_ID = '#onboardingForm';
const LOADING_ID = '#onboardLoading';
const STORAGE_KEY = 'noCareer.plan.v1';

function _sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

export function initOnboarding(){
  const form = document.querySelector(FORM_ID);
  const loading = document.querySelector(LOADING_ID);
  const loadingText = loading ? loading.querySelector('.loading-text') : null;
  const submitBtn = document.querySelector('#startPlanBtn');

  if (!form) return;

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    // basic validation
    const dreamRole = document.querySelector('#dreamRole').value.trim();
    const hours = Number(document.querySelector('#hoursPerWeek').value || 0);
    const experienceLevel = document.querySelector('#experienceLevel').value;
    const resumeText = document.querySelector('#resumeText').value.trim();

    if (!dreamRole || !hours || hours < 1){
      alert('Please enter a dream role and valid hours per week.');
      return;
    }

    submitBtn.disabled = true;
    loading.classList.remove('hidden');

    // staged messages (matches spec)
    loadingText.textContent = 'Analyzing Market Demand...';
    await _sleep(700);
    loadingText.textContent = 'Mapping Skill Gaps...';
    await _sleep(700);
    loadingText.textContent = 'Generating 30-Day Plan...';
    await _sleep(700);

    // call API (mock)
    try {
      const profile = { dreamRole, hoursPerWeek: hours, experienceLevel, resumeText };
      const plan = await generatePlan(profile);
      // ensure dream role is persisted at top-level meta for UI
      plan.meta = plan.meta || {};
      plan.meta.profile = profile;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(plan)); } catch(e) { /* ignore */ }
      // short delay so user sees final message
      loadingText.textContent = 'Plan ready — redirecting...';
      await _sleep(600);
      window.location.href = 'dashboard.html';
    } catch (err) {
      console.error(err);
      alert('Failed to generate plan. Please try again.');
      submitBtn.disabled = false;
      loading.classList.add('hidden');
    }
  });
}
