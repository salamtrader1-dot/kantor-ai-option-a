import { create } from 'zustand';
import { LeaderboardState, StafMetric, Activity } from '@/lib/types';

interface KantorStore {
  // Leaderboard state
  leaderboard: Map<string, StafMetric>;
  lastUpdated: Date;
  
  // Activity feed state
  activities: Activity[];
  
  // Control state
  isLive: boolean;
  theme: 'dark' | 'light';
  
  // Actions
  updateStafMetric: (roleKey: string, metric: Partial<StafMetric>) => void;
  addActivity: (activity: Activity) => void;
  clearActivities: () => void;
  setLive: (live: boolean) => void;
  toggleTheme: () => void;
}

export const useKantorStore = create<KantorStore>((set) => ({
  leaderboard: new Map(),
  lastUpdated: new Date(),
  activities: [],
  isLive: true,
  theme: 'dark',

  updateStafMetric: (roleKey, metric) =>
    set((state) => {
      const updated = new Map(state.leaderboard);
      const current = updated.get(roleKey) || {
        role_key: roleKey,
        name: '',
        emoji: '🤖',
        rank: 0,
        primaryCount: 0,
        primaryLabel: '',
        subMetrics: [],
        status: 'idle' as const,
        statusLabel: '',
      };
      updated.set(roleKey, { ...current, ...metric });
      return { leaderboard: updated, lastUpdated: new Date() };
    }),

  addActivity: (activity) =>
    set((state) => ({
      activities: [activity, ...state.activities].slice(0, 100), // Keep last 100
    })),

  clearActivities: () => set({ activities: [] }),

  setLive: (live) => set({ isLive: live }),

  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'dark' ? 'light' : 'dark',
    })),
}));
