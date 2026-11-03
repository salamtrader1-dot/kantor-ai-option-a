# Kantor AI Virtual - Environment Setup

## STEP 1: Create .env.local file
Copy this and fill in YOUR values:

```env
# Supabase (REQUIRED - Get from https://supabase.com/dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...YOUR_KEY...

# Telegram Bot (Your credentials)
TELEGRAM_BOT_TOKEN=9222280811:AAG-CeFAU8m44XQhfqKwhkVYgwS1aB5L59w
TELEGRAM_WEBHOOK_URL=https://kantor-ai-option-a.vercel.app/api/telegram/webhook

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## STEP 2: Supabase Setup

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill form:
   - Name: `kantor-ai`
   - Database Password: (secure password)
   - Region: Southeast Asia (Singapore)
4. Wait ~5 min for project to build
5. Copy **Project URL** and **Anon Key** to .env.local

---

## STEP 3: Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Create new query
3. Copy-paste content from `/DATABASE_SCHEMA.sql`
4. Run it (green play button)
5. ✅ Done! Tables created with sample data

---

## STEP 4: Telegram Webhook Setup

1. Go to BotFather: https://t.me/BotFather
2. Send `/setwebhook`
3. Follow prompts to set webhook URL:
   ```
   https://kantor-ai-option-a.vercel.app/api/telegram/webhook
   ```

---

## STEP 5: Install Dependencies

```bash
npm install @supabase/supabase-js
npm install next-auth  # if using OAuth
```

Already in package.json:
- framer-motion ✅
- zustand ✅
- tailwindcss ✅

---

## STEP 6: Deploy & Test

```bash
# Local test
npm run dev
# Visit http://localhost:3000

# Push to production
git add .env.local
git commit -m "Add Supabase + Telegram integration"
git push
# Vercel auto-deploys
```

---

## ✅ Quick Checklist

- [ ] Supabase project created
- [ ] .env.local filled with credentials
- [ ] Database schema imported
- [ ] Telegram webhook setup
- [ ] npm install completed
- [ ] Local test passed (http://localhost:3000)
- [ ] Pushed to GitHub
- [ ] Vercel deployment successful
- [ ] Real-time updates working

---

**NEXT: Send your Supabase URL + Anon Key!**
