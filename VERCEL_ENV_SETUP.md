# Kantor AI Virtual - Vercel Environment Setup

## 🚀 ADD ENVIRONMENT VARIABLES TO VERCEL

**Jangan commit `.env.local`!** Gunakan Vercel dashboard untuk prod credentials.

---

## STEP 1: Go to Vercel Dashboard

1. Open: https://vercel.com/salamtrader1-dot/kantor-ai-option-a/settings/environment-variables
2. Login if needed

---

## STEP 2: Add Environment Variables

Click "Add New" and paste these 4 variables:

### Variable 1: Supabase URL
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://kfbyjbcktnbvhmblcnhg.supabase.co
Environment: Production, Preview, Development
```

### Variable 2: Supabase Anon Key
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: sb_publishable_cXhz56uJ1t9Gal6odSPnWQ_JpUBmMJ1
Environment: Production, Preview, Development
```

### Variable 3: Telegram Bot Token
```
Name: TELEGRAM_BOT_TOKEN
Value: 9222280811:AAG-CeFAU8m44XQhfqKwhkVYgwS1aB5L59w
Environment: Production, Preview, Development
```

### Variable 4: Telegram Webhook URL
```
Name: TELEGRAM_WEBHOOK_URL
Value: https://kantor-ai-option-a.vercel.app/api/telegram/webhook
Environment: Production, Preview, Development
```

---

## STEP 3: Save & Redeploy

1. After adding all 4 variables, click "Save"
2. Go to Deployments: https://vercel.com/salamtrader1-dot/kantor-ai-option-a/deployments
3. Click the 3-dot menu on latest deployment
4. Select "Redeploy"
5. Wait ~3 min for green ✅ status

---

## ✅ DONE!

Dashboard will now have:
- ✅ Real Supabase connection
- ✅ Telegram bot working
- ✅ All features live

---

## 📋 Local Development

For local `npm run dev`:

1. Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://kfbyjbcktnbvhmblcnhg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_cXhz56uJ1t9Gal6odSPnWQ_JpUBmMJ1
TELEGRAM_BOT_TOKEN=9222280811:AAG-CeFAU8m44XQhfqKwhkVYgwS1aB5L59w
TELEGRAM_WEBHOOK_URL=https://kantor-ai-option-a.vercel.app/api/telegram/webhook
```

2. `.env.local` is in `.gitignore` → won't commit to git ✅

---

**NEXT:** Add vars to Vercel + redeploy!
