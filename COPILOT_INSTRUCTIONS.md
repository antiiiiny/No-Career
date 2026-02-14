# NoCareer Frontend – Copilot Implementation Instructions

You are helping build the frontend for a hackathon project called:

NoCareer – Adaptive Career Intelligence Engine

This project uses:

- HTML
- CSS
- Vanilla JavaScript (ES6 modules)
- No frameworks
- No libraries

This is NOT a chatbot.
This is a structured professional dashboard interface.

The UI must look clean, modern, and enterprise-grade.

------------------------------------------------------------
PROJECT GOAL
------------------------------------------------------------

Build a professional frontend that:

1. Collects user career information
2. Displays skill gap analysis
3. Displays readiness score
4. Displays 30-day roadmap
5. Allows weekly progress simulation
6. Updates UI dynamically

The backend returns structured JSON.

------------------------------------------------------------
PROJECT STRUCTURE (STRICTLY FOLLOW THIS)
------------------------------------------------------------

/no-career
│
├── index.html
├── dashboard.html
│
├── /css
│   └── styles.css
│
├── /js
│   ├── main.js
│   ├── api.js
│   ├── onboarding.js
│   ├── dashboard.js
│   ├── components.js
│
└── /assets

Use ES6 modules with type="module".

------------------------------------------------------------
STRICT RULES
------------------------------------------------------------

1. No frameworks.
2. No inline styles.
3. No inline JavaScript.
4. Keep JavaScript modular.
5. Keep CSS structured and clean.
6. Use semantic HTML.
7. Use modern flexbox and grid.
8. Keep UI minimal and professional.
9. No flashy gradients.
10. No excessive animations.

------------------------------------------------------------
PAGES
------------------------------------------------------------

1️⃣ index.html → Onboarding Page
2️⃣ dashboard.html → Dashboard Page

------------------------------------------------------------
ONBOARDING PAGE REQUIREMENTS
------------------------------------------------------------

Form Fields:

- Dream Role (text)
- Hours per Week (number)
- Experience Level (dropdown)
- Resume Text (textarea)

On Submit:

- Prevent default
- Show loading state
- Call api.generatePlan()
- Store result in localStorage
- Redirect to dashboard.html

Use:

- Centered card layout
- Clean spacing
- Clear labels
- Professional button styling

------------------------------------------------------------
DASHBOARD PAGE REQUIREMENTS
------------------------------------------------------------

Sections:

1. Header
   - Dream role title
   - Readiness score display
   - Progress bar

2. Skill Gap Section
   - Existing skills
   - Missing skills

3. Roadmap Section
   - 4 week cards
   - Focus skills
   - Tasks
   - Mini project

4. Weekly Simulation Section
   - Slider (0–100)
   - Button
   - Calls api.simulateProgress()
   - Updates UI dynamically

------------------------------------------------------------
DATA STRUCTURE (EXPECTED FROM BACKEND)
------------------------------------------------------------

{
  readinessScore: number,
  missingSkills: string[],
  existingSkills: [
    {
      skillName: string,
      strength: number,
      category: "technical" | "soft"
    }
  ],
  roadmap: [
    {
      weekNumber: number,
      focusSkills: string[],
      tasks: string[],
      miniProject: string
    }
  ]
}

------------------------------------------------------------
UI STYLE GUIDE
------------------------------------------------------------

Design must feel like:

Modern SaaS Dashboard

Use:

- Max width container (1100px)
- White background
- Soft box shadows
- 8px spacing system
- Neutral colors
- Deep blue or purple primary color
- Clean typography
- No clutter

------------------------------------------------------------
COMPONENTIZATION STRATEGY
------------------------------------------------------------

Use JS functions to render UI:

- renderReadinessScore()
- renderSkillGap()
- renderRoadmap()
- renderWeeklySimulation()

Keep logic separate from DOM queries.

------------------------------------------------------------
LOADING STATE
------------------------------------------------------------

Show messages like:

"Analyzing Market Demand..."
"Mapping Skill Gaps..."
"Generating 30-Day Plan..."

Use spinner animation in CSS.

------------------------------------------------------------
FINAL GOAL
------------------------------------------------------------

The frontend should feel:

Clean.
Structured.
Professional.
Presentable to judges.

No unnecessary complexity.
No messy styling.
No chatbot UI.
