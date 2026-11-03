'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StaffCard } from './StaffCard';
import { StafMetric } from '@/lib/types';

interface LeaderboardProps {
  stafList: (StafMetric & { animating?: boolean })[];
  theme: 'dark' | 'light';
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  stafList,
  theme,
}) => {
  const isDark = theme === 'dark';

  // Sort by rank
  const sorted = [...stafList].sort((a, b) => (a.rank || 99) - (b.rank || 99));

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={`${isDark ? 'bg-slate-900' : 'bg-white'} rounded-lg p-6 border ${
        isDark ? 'border-slate-700' : 'border-slate-300'
      } h-full overflow-y-auto`}
    >
      {/* Header */}
      <div className="mb-6">
        <h2
          className={`text-2xl font-bold flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          <span>🏆</span> Today's Ranking
        </h2>
        <p
          className={`text-sm mt-1 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Real-time performance leaderboard
        </p>
      </div>

      {/* Staff cards */}
      <div className="space-y-3">
        {sorted.map((staf, idx) => (
          <motion.div
            key={staf.role_key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
          >
            <StaffCard staf={staf} theme={theme} />
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`mt-6 pt-4 border-t ${
          isDark ? 'border-slate-700' : 'border-slate-200'
        }`}
      >
        <p
          className={`text-xs text-center ${
            isDark ? 'text-gray-500' : 'text-gray-500'
          }`}
        >
          💡 Click any card to celebrate! • Hover for details
        </p>
      </motion.div>
    </motion.div>
  );
};
