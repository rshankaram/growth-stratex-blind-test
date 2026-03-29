The Mirror Test — Growth StratEx
An AI-powered positioning diagnostic for IT services founders.
What it does
Three-phase guided diagnostic. Founders answer 8 questions about their positioning. After each phase, AI gives a brief observation. At the end, a full diagnosis — positioning strength card, what is working, a draft positioning statement, and one next step.
No login. No form. No backend database. Just the tool.
---
Deploy to Vercel (10 minutes)
Step 1 — Push to GitHub
Create a new repository on GitHub (e.g. `mirror-test`)
Upload these three files:
`index.html`
`api/diagnose.js`
`vercel.json`
Step 2 — Connect to Vercel
Go to vercel.com and sign in with GitHub
Click Add New Project
Select your `mirror-test` repository
Click Deploy — Vercel detects the config automatically
Step 3 — Add your API key
In your Vercel project, go to Settings → Environment Variables
Add a new variable:
Name: `ANTHROPIC_API_KEY`
Value: your Anthropic API key (from console.anthropic.com/keys)
Click Save
Go to Deployments and click Redeploy to pick up the new variable
Step 4 — Your tool is live
Your URL will be: `your-project-name.vercel.app`
You can add a custom domain in Vercel Settings → Domains if you have one.
---
Cost estimate
Each diagnosis call uses approximately 1,000–1,500 tokens.
At current Anthropic pricing, roughly ₹1–2 per complete diagnostic session.
500 uses per month ≈ ₹500–1,000.
Vercel hosting: free.
---
Files
```
mirror-test/
├── index.html          # The tool — all UI and logic
├── api/
│   └── diagnose.js     # Serverless function — API proxy
└── vercel.json         # Routing config
```
---
Built by Shankar · shankar@growthstratex.com · Growth StratEx
