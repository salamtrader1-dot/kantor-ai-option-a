'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { StafMetric } from '@/lib/types';

interface LeaderboardCardProps {
  staf: StafMetric;
  rank: number;
  theme: 'dark' | 'light';
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  staf,
  rank,
  theme,
}) => {
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-slate-800' : 'bg-slate-100';
  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const borderColor = isDark ? 'border-slate-700' : 'border-slate-300';

  // Status color mapping
  const statusColors = {
    idle: 'border-gray-500',
    working: 'border-green-500 shadow-lg shadow-green-500/20',
    pending: 'border-yellow-500',
    complete: 'border-blue-500',
  };

  const statusBg = {
    idle: isDark ? 'bg-gray-900/50' : 'bg-gray-100/50',
    working: isDark ? 'bg-green-900/20' : 'bg-green-100/50',
    pending: isDark ? 'bg-yellow-900/20' : 'bg-yellow-100/50',
    complete: isDark ? 'bg-blue-900/20' : 'bg-blue-100/50',
  };

  const progressBarColor = {
    idle: 'bg-gray-400',
    working: 'bg-green-500',
    pending: 'bg-yellow-500',
    complete: 'bg-blue-500',
  };

  // Calculate progress percentage (mock)
  const progressPercent = Math.min((staf.primaryCount / 25) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${bgColor} ${borderColor} border rounded-lg p-4 mb-3 transition-all duration-200 ${
        statusColors[staf.status]
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-amber-500">{rank}️⃣</span>
          <span className="text-2xl">{staf.emoji}</span>
          <span className={`font-bold text-lg ${textColor}`}>{staf.name}</span>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded ${statusBg[staf.status]} ${textColor}`}>
          {staf.statusLabel}
        </span>
      </div>

      {/* Primary metric */}
      <div className="mb-3">
        <div className={`text-sm ${textColor} opacity-75 mb-1`}>
          {staf.primaryLabel}
        </div>
        <div className="flex items-center gap-3">
          <motion.div
            key={staf.primaryCount}
            className="text-2xl font-bold text-amber-300"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.3 }}
          >
            {staf.primaryCount}
          </motion.div>
          <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className={`h-full ${progressBarColor[staf.status]} rounded-full`}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <span className={`text-sm font-semibold ${textColor}`}>
            {Math.round(progressPercent)}%
          </span>
        </div>
      </div>

      {/* Sub-metrics */}
      {staf.subMetrics.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {staf.subMetrics.map((metric, idx) => (
            <div
              key={idx}
              className={`text-xs ${isDark ? 'bg-slate-700/50' : 'bg-slate-200/50'} rounded p-2`}
            >
              <div className="opacity-75">{metric.label}</div>
              <div className={`font-semibold ${metric.color === 'green' ? 'text-green-400' : 'text-amber-300'}`}>
                {metric.value} {metric.icon}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trending */}
      {staf.trending && (
        <div className="flex items-center gap-2 mb-3">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="text-lg"
          >
            {staf.trending.direction === 'up'
              ? '📈'
              : staf.trending.direction === 'down'
                ? '📉'
                : '→'}
          </motion.span>
          <span className={`text-xs ${staf.trending.change > 0 ? 'text-green-400' : staf.trending.change < 0 ? 'text-red-400' : 'text-gray-400'}`}>
            {staf.trending.change > 0 ? '+' : ''}
            {staf.trending.change} ({staf.trending.percent}%)
          </span>
        </div>
      )}

      {/* Alert */}
      {staf.alert && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`text-xs font-semibold px-2 py-1 rounded ${
            staf.alert.type === 'positive'
              ? 'bg-green-500/30 text-green-300 border border-green-500/50'
              : staf.alert.type === 'warning'
                ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50'
                : 'bg-red-500/30 text-red-300 border border-red-500/50'
          }`}
        >
          ⚠️ {staf.alert.text}
        </motion.div>
      )}
    </motion.div>
  );
};

interface LeaderboardProps {
  stafList: StafMetric[];
  theme: 'dark' | 'light';
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ stafList, theme }) => {
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-slate-900' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-slate-900';

  // Sort by rank
  const sorted = [...stafList].sort((a, b) => (a.rank || 99) - (b.rank || 99));

  return (
    <div className={`${bgColor} rounded-lg p-4 h-full overflow-y-auto`}>
      <div className="mb-4">
        <h2 className={`text-xl font-bold ${textColor} flex items-center gap-2`}>
          <span>🏆</span> TODAY'S RANKING
        </h2>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Real-time performance metrics
        </p>
      </div>

      <div className="space-y-1">
        {sorted.map((staf, idx) => (
          <LeaderboardCard
            key={staf.role_key}
            staf={staf}
            rank={idx + 1}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
};
