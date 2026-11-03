'use client';

import React, { useEffect, useState } from 'react';
import { Leaderboard } from '@/components/Leaderboard';
import { ActivityFeed } from '@/components/ActivityFeed';
import Office3D from '@/components/Office3D';
import { StaffProfileModal } from '@/components/StaffProfileModal';
import { FilterSidebar, FilterState } from '@/components/FilterSidebar';
import { useKantorStore } from '@/lib/store/kantorStore';
import { generateMockData, getLeaderboardMetrics } from '@/lib/mockDataGenerator';
import { playSound } from '@/lib/soundEffects';
import { exportLeaderboardToCSV, generateReport } from '@/lib/exportUtils';
import { StafMetric } from '@/lib/types';

export default function Home() {
  const [stafList, setStafList] = useState<StafMetric[]>([]);
  const [mounted, setMounted] = useState(false);
  const [selectedStaf, setSelectedStaf] = useState<string | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    department: null,
    status: null,
    sortBy: 'performance',
  });
  const { theme, toggleTheme } = useKantorStore();

  useEffect(() => {
    setMounted(true);
    const mockEvents = generateMockData(new Date(), 7);
    const metrics = getLeaderboardMetrics(mockEvents);
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
      })
    );
    setStafList(stafArray);
  }, []);

  if (!mounted) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-100'}`}>
      <header className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-b sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Kantor AI Virtual</h1>
          <button onClick={toggleTheme} className="px-4 py-2 rounded-lg bg-slate-800 text-white">Toggle Theme</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <FilterSidebar theme={theme} onFilterChange={setFilters} />
          <div className="lg:col-span-3">
            <Leaderboard stafList={stafList} theme={theme} />
            <Office3D />
            <ActivityFeed theme={theme} />
          </div>
        </div>
      </main>
      <StaffProfileModal roleKey={selectedStaf} isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} theme={theme} />
    </div>
  );
}
