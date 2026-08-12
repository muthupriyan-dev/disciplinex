# DisciplineX (Web)

Fitness accountability app — pose detection, motion-sensor rep tracking, streaks, and a leaderboard. Runs entirely in the browser (no app build step), so it deploys straight from GitHub with no Codemagic/APK compile step to fail.

## What's inside
- `frontend/index.html` — the whole app (camera pose tracking via MoveNet/TensorFlow.js, phone motion-sensor rep counting, streak tally, AI-style coach feedback). One file, no build tools, no `npm install` needed for this part.
- `backend/` — small Express API that stores reps/streaks in a JSON file, so the leaderboard works across users. Deploys to Render like your other backends.

## Why this won't fail like last time
Last time (Flutter) needed a native Android build via Codemagic, which is where things broke. This version has **no compile step for the frontend at all** — it's plain HTML/CSS/JS, so "deploying" it is just uploading the file. The only build step left is the tiny backend, and Render builds Node projects automatically from `package.json` — nothing to configure.

## Deploy steps (phone-only)

### 1. Frontend → Netlify
1. Create a new GitHub repo (e.g. `disciplinex-web`), upload `frontend/index.html` using the GitHub web upload button.
2. In Netlify: **Add new site → Import from GitHub** → pick the repo.
3. Build command: leave blank. Publish directory: `frontend` (or move `index.html` to repo root, then leave publish directory blank).
4. Deploy. Netlify gives you a URL like `disciplinex.netlify.app`.

### 2. Backend → Render
1. Upload the `backend/` folder (`server.js`, `package.json`) to the same repo (or a second repo).
2. In Render: **New → Web Service** → connect the repo.
3. Root directory: `backend` (if same repo). Build command: `npm install`. Start command: `npm start`.
4. Deploy. Render gives you a URL like `disciplinex-api.onrender.com`.

### 3. Connect them
Open `frontend/index.html` on GitHub, edit this line near the top of the `<script>` block:
```js
const API_BASE = window.DISCIPLINEX_API || "https://your-backend.onrender.com";
```
Replace with your real Render URL, commit the change. Netlify redeploys automatically.

## Notes
- Camera and motion-sensor access require HTTPS — Netlify gives you that by default.
- On iPhone, motion sensor needs a one-time permission prompt (handled in code already).
- The "AI coach" currently gives rule-based feedback from pose angles — swap in a real LLM call inside `backend/server.js` later if you want generated coaching text instead.
- Leaderboard data lives in a flat JSON file on Render's disk — fine for a demo/portfolio project, but resets on redeploy since Render's free tier disk isn't persistent. Fine to leave as-is unless you want it permanent.

- ## live demo 💻
- https://disciplinex-web.netlify.app/

- ---
