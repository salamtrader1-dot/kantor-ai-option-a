'use client';

import React, { useEffect, useState } from 'react';
import { Leaderboard } from '@/components/Leaderboard';
import { ActivityFeed } from '@/components/ActivityFeed';
import { useKantorStore } from '@/lib/store/kantorStore';
import { generateMockData, getLeaderboardMetrics } from '@/lib/mockDataGenerator';
import { StafMetric, Activity } from '@/lib/types';

export default function Home() {
  const [stafList, setStafList] = useState<StafMetric[]>([]);
  const [mounted, setMounted] = useState(false);
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
  }, []);

  if (!mounted) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

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
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Kantor AI Virtual
              </h1>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Real-time team performance dashboard
              </p>
            </div>
          </div>

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
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Leaderboard */}
          <div className="lg:col-span-1">
            <Leaderboard stafList={stafList} theme={theme} />
          </div>

          {/* Right: Office + Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Office Placeholder (Day 5+) */}
            <div
              className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 min-h-64 flex items-center justify-center border-2 border-dashed ${theme === 'dark' ? 'border-slate-700' : 'border-slate-300'}`}
            >
              <div className="text-center">
                <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  🏢 3D Isometric Office
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'} mt-2`}>
                  (Coming Day 5-8)
                </p>
              </div>
            </div>

            {/* Activity Feed */}
            <ActivityFeed theme={theme} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'} border-t mt-12`}
      >
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>Kantor AI Virtual — Option A | Day 1/12 ✅ | Mock data stream active</p>
        </div>
      </footer>
    </div>
  );
}
