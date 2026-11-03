// Triggering production rebuild
'use client';

import React, { useEffect, useState } from 'react';
import { Leaderboard } from '@/components/Leaderboard';
import { ActivityFeed } from '@/components/ActivityFeed';
import { OfficeIsometric } from '@/components/OfficeIsometric';
import { ChatBubble } from '@/components/ChatBubble';
import { StaffProfileModal } from '@/components/StaffProfileModal';
import { FilterSidebar, FilterState } from '@/components/FilterSidebar';
import { useKantorStore } from '@/lib/store/kantorStore';
import { generateMockData, getLeaderboardMetrics } from '@/lib/mockDataGenerator';
import { playSound } from '@/lib/soundEffects';
import { exportActivitiesToCSV, exportLeaderboardToCSV, generateReport } from '@/lib/exportUtils';
import { StafMetric } from '@/lib/types';

type ActivityStatus = 'idle' | 'searching' | 'typing' | 'on_call' | 'celebrating';

export default function Home() {
  const [stafList, setStafList] = useState<StafMetric[]>([]);
  const [mounted, setMounted] = useState(false);
  const [selectedStaf, setSelectedStaf] = useState<string | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [chatBubbles, setChatBubbles] = useState<Record<string, string>>({});
  const [stafActivities, setStafActivities] = useState<Record<string, ActivityStatus>>({
    fathi: 'searching',
    qela: 'typing',
    angel: 'idle',
    cindy: 'on_call',
    faza: 'idle',
    nana: 'idle',
    cika: 'idle',
    salam: 'idle',
  });
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    department: null,
    status: null,
    sortBy: 'performance',
  });
  const { theme, toggleTheme } = useKantorStore();

  useEffect(() => {
    setMounted(true);

    // Generate initial mock data
    const mockEvents = generateMockData(new Date(), 7);
    const today = mockEvents.filter((e) => {
      const eventDate = new Date(e.timestamp);
      const now = new Date();
      return (
        eventDate.getDate() === now.getDate() &&
        eventDate.getMonth() === now.getMonth() &&
        eventDate.getFullYear() === now.getFullYear()
      );
    });

    const metrics = getLeaderboardMetrics(today);
    const stafArray: StafMetric[] = Object.entries(metrics).map(
      ([key, value], idx) => ({
        role_key: key,
        rank: idx + 1,
        name: value.name,
        emoji: value.emoji,
        primaryCount: value.primaryCount,
        primaryLabel: value.primaryLabel,
        status: value.status,
        statusLabel: value.statusLabel,
        subMetrics: value.subMetrics,
        trending: value.trending,
        alert:
          value.primaryCount > 18
            ? {
                type: 'positive',
                text: `EXCEEDING TARGET! 🎯`,
              }
            : undefined,
      })
    );

    setStafList(stafArray);

    // Simulate random activities every 10 seconds
    const activityInterval = setInterval(() => {
      const roles = Object.keys(stafActivities);
      const randomRole = roles[Math.floor(Math.random() * roles.length)];
      const activities = ['idle', 'searching', 'typing', 'on_call', 'celebrating'];
      const randomActivity =
        activities[Math.floor(Math.random() * activities.length)];

      setStafActivities((prev: Record<string, ActivityStatus>) => ({
        ...prev,
        [randomRole]: randomActivity as ActivityStatus,
      }));

      // Play sound on activity change
      if (randomActivity === 'celebrating') {
        playSound('celebrate');
      } else if (randomActivity === 'typing') {
        playSound('typing');
      }

      // Add chat bubble
      const messages: Record<string, string> = {
        fathi: '🔎 Found leads!',
        qela: '💬 Replying...',
        angel: '📥 New lead!',
        cindy: '📱 Following up...',
        faza: '✍️ Creating content',
        nana: '🧑‍💼 Planning...',
        cika: '📊 Analyzing...',
        salam: '👑 Reviewing...',
      };

      setChatBubbles((prev: Record<string, string>) => ({
        ...prev,
        [randomRole]: messages[randomRole] || 'Working...',
      }));

      // Remove chat bubble after 2 seconds
      setTimeout(() => {
        setChatBubbles((prev: Record<string, string>) => {
          const updated = { ...prev };
          delete updated[randomRole];
          return updated;
        });
      }, 2000);
    }, 10000);

    return () => clearInterval(activityInterval);
  }, []);

  if (!mounted) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const handleStafClick = (roleKey: string) => {
    setSelectedStaf(roleKey);
    setProfileModalOpen(true);
    playSound('approval');

    // Trigger celebration animation
    setStafActivities((prev: Record<string, ActivityStatus>) => ({
      ...prev,
      [roleKey]: 'celebrating',
    }));

    // Reset after 2 seconds
    setTimeout(() => {
      setStafActivities((prev: Record<string, ActivityStatus>) => ({
        ...prev,
        [roleKey]: 'idle',
      }));
    }, 2000);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' ? 'bg-slate-950' : 'bg-slate-100'
      }`}
    >
      {/* Header */}
      <header
        className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-b sticky top-0 z-50`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏢</span>
            <div>
              <h1
                className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
              >
                Kantor AI Virtual
              </h1>
              <p
                className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Real-time team performance dashboard — Day 6+ ✅
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Export buttons */}
            <button
              onClick={() => exportLeaderboardToCSV(stafList)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                theme === 'dark'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
              title="Export leaderboard as CSV"
            >
              📊 Export CSV
            </button>

            <button
              onClick={() => {
                const report = generateReport(stafList, []);
                const blob = new Blob([report], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `kantor-report-${new Date().toISOString().split('T')[0]}.txt`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
              title="Generate daily report"
            >
              📄 Report
            </button>

            <button
              onClick={toggleTheme}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700 text-yellow-300'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
              }`}
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Filter Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar theme={theme} onFilterChange={setFilters} />
          </div>

          {/* Center-Right: Leaderboard + Office + Feed */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Leaderboard */}
              <div className="lg:col-span-1">
                <div
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    const target = e.target as HTMLElement;
                    const card = target.closest('[data-staf]');
                    if (card) {
                      const roleKey = card.getAttribute('data-staf');
                      if (roleKey) handleStafClick(roleKey);
                    }
                  }}
                  className="card-hover"
                >
                  <Leaderboard
                    stafList={stafList.map((s: StafMetric) => ({
                      ...s,
                      animating: selectedStaf === s.role_key,
                    }))}
                    theme={theme}
                  />
                </div>
              </div>

              {/* Right: Office + Feed */}
              <div className="lg:col-span-2 space-y-4 lg:space-y-6">
                {/* Office Isometric with Chat Bubbles */}
                <div className="relative card-hover rounded-lg overflow-hidden">
                  <OfficeIsometric
                    theme={theme}
                    stafActivities={stafActivities}
                  />

                  {/* Chat Bubbles Overlay */}
                  {Object.entries(chatBubbles).map(([roleKey, message]) => (
                    <ChatBubble
                      key={`bubble-${roleKey}`}
                      message={message}
                      actor={roleKey}
                      theme={theme}
                      position={{
                        x: Math.random() * 200 + 100,
                        y: Math.random() * 150 + 80,
                      }}
                    />
                  ))}
                </div>

                {/* Activity Feed */}
                <div className="card-hover">
                  <ActivityFeed theme={theme} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Staff Profile Modal */}
      <StaffProfileModal
        roleKey={selectedStaf}
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        theme={theme}
      />

      {/* Footer */}
      <footer
        className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'} border-t mt-12`}
      >
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>Kantor AI Virtual — Production Ready ✅ | Filters • Modals • Export • Real-time Updates | Built with Next.js + Tailwind + Framer Motion</p>
        </div>
      </footer>
    </div>
  );
}
