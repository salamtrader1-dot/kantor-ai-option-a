# 🚀 DEPLOYMENT GUIDE — GitHub + Vercel

**Status:** Ready for deployment  
**Date:** 4 Nov 2026  
**Time required:** ~15 minutes

---

## STEP 1: Create GitHub Repository (5 min)

### Option A: Create Empty Repo on GitHub (Recommended)

1. Go to https://github.com/new
2. Fill in:
   - **Repository name:** `kantor-ai-option-a`
   - **Description:** Interactive office dashboard with real-time animated leaderboard
   - **Visibility:** Public
   - ⚠️ **DO NOT initialize** with README, .gitignore, or license (we have them)
3. Click **"Create repository"**
4. Copy the repository URL (something like `https://github.com/YOUR_USERNAME/kantor-ai-option-a.git`)

### Option B: Use GitHub CLI (Faster)

```bash
# If you have GitHub CLI installed
gh repo create kantor-ai-option-a --public --source=. --remote=origin --push
```

---

## STEP 2: Push Code to GitHub (5 min)

### From your local machine:

```bash
cd /opt/data/cache/scratch/kantor-ai-option-a

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/kantor-ai-option-a.git

# Rename branch to main (GitHub default)
git branch -M main

# Push code
git push -u origin main
```

**Expected output:**
```
Enumerating objects: 17, done.
...
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

✅ Code is now on GitHub!

---

## STEP 3: Deploy to Vercel (5 min)

### Option A: Vercel Web UI (Easiest)

1. Go to https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. **Sign in with GitHub** (if not already)
4. **Import Git Repository** → Search for `kantor-ai-option-a`
5. Click **Import**
6. **Configure Project:**
   - Framework Preset: `Next.js` (auto-detected) ✅
   - Root Directory: `.` (default) ✅
   - Environment Variables: Leave empty (optional for now)
7. Click **"Deploy"**
8. Wait ~2 minutes for deployment
9. Get your live URL: `https://kantor-ai-option-a.vercel.app`

### Option B: Vercel CLI (If you prefer CLI)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project directory
cd /opt/data/cache/scratch/kantor-ai-option-a
vercel

# Follow prompts:
# - Link to existing project? → No
# - Set up and deploy? → Yes
# - Which scope? → Your username
# - Project name? → kantor-ai-option-a
# - Detected framework? → Next.js ✅
# - Build command? → npm run build (default)
```

---

## STEP 4: Enable Auto-Deployment (Optional but Recommended)

Once deployed on Vercel:

1. Go to your Vercel project dashboard
2. **Settings** → **Git**
3. **Connect a Git repository** (should auto-detect GitHub)
4. **Production branch:** `main`
5. **Enable** "Deploy on every push to main"

✅ Now every time you `git push`, Vercel auto-deploys!

---

## 📊 YOUR LIVE LINKS (After Deployment)

- **GitHub:** `https://github.com/YOUR_USERNAME/kantor-ai-option-a`
- **Live Demo:** `https://kantor-ai-option-a.vercel.app`
- **Vercel Dashboard:** `https://vercel.com/your-username/kantor-ai-option-a`

---

## 🧪 Verify Deployment

1. Open `https://kantor-ai-option-a.vercel.app`
2. You should see:
   - ✅ "Kantor AI Virtual" header
   - ✅ Leaderboard on left (with animated counters)
   - ✅ Office placeholder on right
   - ✅ Activity feed below
   - ✅ Theme toggle (☀️ Light / 🌙 Dark)

3. Click staff cards → animations trigger
4. Watch activity feed update every 45 seconds

---

## 🔄 Daily Development Workflow

After deployment, for daily updates:

```bash
# Make changes locally
vim components/Leaderboard.tsx  # edit

# Test locally
npm run dev  # localhost:3000

# Commit & push (auto-deploys on Vercel)
git add .
git commit -m "Day 2: Add ActivityFeed animations"
git push origin main
```

✅ Changes live on Vercel in ~60 seconds!

---

## ❌ Troubleshooting

### "Repository not found" on push
```bash
# Check remote
git remote -v

# Update if wrong
git remote set-url origin https://github.com/YOUR_USERNAME/kantor-ai-option-a.git
```

### Build fails on Vercel
1. Check Vercel deployment logs
2. Common fix: Run `npm install` locally first
3. Commit & push again

### Live demo shows blank page
1. Check browser console (F12 → Console)
2. Check Vercel logs: Dashboard → Deployments → Latest
3. Likely issue: TypeScript errors (will show in logs)

### How to monitor Vercel logs
- Go to Vercel dashboard
- Click project
- **Deployments** tab
- Click latest deployment
- Scroll to **Build Logs**

---

## 📝 CHECKLIST

Before you start:

- [ ] GitHub account ready
- [ ] Vercel account ready (or create free)
- [ ] Local git configured (`git config user.name`, `user.email`)

After deployment:

- [ ] GitHub repo created & code pushed
- [ ] Vercel project deployed (live URL working)
- [ ] Auto-deployment enabled
- [ ] Live demo accessible

---

## 🎉 YOU'RE DONE!

Now you have:

✅ **Public GitHub repo** — code visible, can share with team  
✅ **Live Vercel demo** — anyone can see latest build  
✅ **Auto-deployment** — push to main = auto live  
✅ **Daily checkpoints** — track progress in real-time  

---

## NEXT: Share Your Links

Once deployed, reply with:

**GitHub URL:** `https://github.com/...`  
**Live Demo:** `https://kantor-ai-option-a.vercel.app`

Then gw terusin ke **Day 2** (Activity Feed animations)!

