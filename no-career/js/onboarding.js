import { generatePlan, sendToWebhook } from './api.js';
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

  // show selected PDF filename (optional)
  const resumeInput = document.querySelector('#resumePdf');
  const resumeNote = document.querySelector('#resumeFileNote');
  if (resumeInput) {
    resumeInput.addEventListener('change', () => {
      if (resumeInput.files && resumeInput.files[0]) resumeNote.textContent = `Selected: ${resumeInput.files[0].name}`;
      else resumeNote.textContent = 'PDF will be uploaded to the workflow if provided (optional).';
    });
  }

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

    // call API (mock + optional webhook)
    try {
      const profile = { dreamRole, hoursPerWeek: hours, experienceLevel, resumeText };
      const resumeFile = (document.querySelector('#resumePdf')?.files || [])[0] || null;

      // if a PDF is attached, attempt to POST to the n8n webhook (graceful fallback)
      if (resumeFile) {
        if (resumeFile.type !== 'application/pdf') {
          alert('Please attach a PDF file for your resume.');
          submitBtn.disabled = false; loading.classList.add('hidden'); return;
        }
        if (resumeFile.size > 5 * 1024 * 1024) {
          alert('Resume PDF must be smaller than 5MB.');
          submitBtn.disabled = false; loading.classList.add('hidden'); return;
        }

n        loadingText.textContent = 'Uploading resume...';
        await _sleep(400);
        try {
          const webhookResp = await sendToWebhook(profile, resumeFile);
          // if webhook returns a plan-like object, use it
          if (webhookResp && typeof webhookResp === 'object' && (webhookResp.readinessScore !== undefined || webhookResp.roadmap !== undefined)) {
            const plan = webhookResp;
            plan.meta = plan.meta || {};
            plan.meta.profile = profile;
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(plan)); } catch(e){}
            loadingText.textContent = 'Plan received — redirecting...';
            await _sleep(600);
            window.location.href = 'dashboard.html';
            return;
          }
          // otherwise continue to local generation
        } catch (weErr) {
          console.warn('Webhook failed — continuing locally', weErr);
        }
      }

      // fallback/local generation
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
