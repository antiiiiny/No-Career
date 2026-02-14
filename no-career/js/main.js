import { initOnboarding } from './onboarding.js';
import { initDashboard } from './dashboard.js';

// Entry point: detect which page is loaded by querying DOM hooks.
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#onboardingForm')) {
    initOnboarding();
    return;
  }
  if (document.querySelector('#readinessScore')) {
    initDashboard();
    return;
  }
});
