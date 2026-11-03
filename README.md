# Kantor AI Virtual — Option A (Hybrid)

**Interactive 3D office dashboard with real-time animated leaderboard and activity feed for Hermes Agent teams.**

## 🎯 Features

- ✨ **Animated Leaderboard** — Real-time counter updates with smooth animations
- 📊 **Live Activity Feed** — Timeline of team events (lead found, approval, deal close, etc.)
- 🏢 **Isometric Office** — SVG-based 3D office visualization with animated staff avatars
- 🎨 **Dark/Light Theme** — Toggle between dark and light modes
- 📱 **Responsive Design** — Works on desktop and mobile
- 🔊 **Sound Effects** — Notification sounds for approvals, deals, typing
- ⚡ **Real-time Mock Stream** — Realistic event simulation for testing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/kantor-ai-option-a.git
cd kantor-ai-option-a

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
kantor-ai-option-a/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main dashboard
│   └── api/
│       └── mock-stream/     # Mock event API
├── components/
│   ├── Leaderboard.tsx      # Leaderboard component
│   ├── OfficeIsometric.tsx  # 3D office visualization
│   └── ActivityFeed.tsx     # Activity timeline
├── lib/
│   ├── types/               # TypeScript types
│   ├── store/               # Zustand store
│   └── mockDataGenerator.ts # Event data generation
├── public/                  # Static assets & sounds
└── tailwind.config.js       # Tailwind configuration
```

## 🎨 Animations

### Leaderboard
- **Counter Bounce** (300ms) — Number animates up with color flash
- **Progress Bar** (500ms) — Smooth fill animation
- **Status Pulse** (1000ms) — Green/red/yellow pulse effect
- **Alert Box** (400ms) — Bounce-in animation
- **Trending Arrow** (400ms) — Spin + color flash

### Activity Feed
- **Entry Animation** (500ms) — Slide in + fade + icon spin
- **Milestone Celebration** (2000ms) — Gold glow + confetti + size bump
- **Auto-scroll** (300ms) — Smooth scroll to top on new event

### Office
- **Staff Avatar** — Eyes follow cursor (search), hands move (typing), jump (celebrate)
- **Desk Light** — Pulse animation based on staff status
- **Chat Bubble** — Pop-in animation with text fade

## 🎵 Sound Effects

- ✅ **Ding** — Approval notification (300ms)
- 🎉 **Celebration Chime** — Deal close event (500ms)
- ⌨️ **Keyboard Tap** — Typing animation (50ms, repeated)
- 🔴 **Warning Beep** — Alert notification (100ms)

## 🔌 API Endpoints (Mock)

- `GET /api/mock-stream` — Server-sent events stream
- `GET /api/leaderboard` — Current leaderboard metrics
- `GET /api/activities` — Activity feed history

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **State:** Zustand
- **3D Visualization:** SVG (Isometric)

## 📊 Mock Data

The app generates realistic 7-day mock data for testing:
- FATHI: 12-20 leads per day
- QELA: 3-5 draft replies per day
- ANGEL: 5-10 lead intakes per day
- CINDY: 2-4 DMs per day, 1-2 deals per week
- CIKA: Daily reports at 07:30

## 🚀 Deployment

### Vercel (Recommended)

```bash
# 1. Push to GitHub
git push -u origin main

# 2. Go to https://vercel.com
# 3. Click "New Project"
# 4. Select your repository
# 5. Click "Deploy"
# 6. Your live URL: https://kantor-ai-option-a.vercel.app
```

### Docker

```bash
docker build -t kantor-ai .
docker run -p 3000:3000 kantor-ai
```

## 📈 Build Timeline

- **Days 1-4:** Leaderboard + counter animations ✅
- **Days 5-8:** Office isometric + staff animations
- **Days 9-10:** Activity feed + milestone animations
- **Days 11-12:** Integration + testing

## 🧪 Testing

```bash
# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm run start
```

## 📝 Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_MOCK_STREAM_INTERVAL=30000  # 30 seconds
NEXT_PUBLIC_THEME=dark                   # dark or light
NEXT_PUBLIC_SOUND_ENABLED=true           # Enable sound effects
```

## 🐛 Development

### Hot Reload
Changes to components auto-reload in browser.

### Mock Data Generation
```typescript
import { generateMockData } from '@/lib/mockDataGenerator';

const events = generateMockData(new Date(), 7); // 7 days
```

### State Management
```typescript
import { useKantorStore } from '@/lib/store/kantorStore';

const { leaderboard, addActivity } = useKantorStore();
```

## 🤝 Contributing

1. Create a branch for your feature
2. Commit changes with clear messages
3. Push to GitHub
4. Open a Pull Request

## 📄 License

MIT License — See LICENSE file for details

## 📞 Support

For issues or questions:
- Open a GitHub issue
- Check the documentation in `/docs`
- Daily checkpoint updates in `/CHECKPOINTS`

---

**Current Status:** Day 1/12 ✅  
**Next Update:** Day 2 (5 Nov 2026)  
**Live Demo:** [https://kantor-ai-option-a.vercel.app](https://kantor-ai-option-a.vercel.app) (coming soon)

