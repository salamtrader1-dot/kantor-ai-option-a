'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tooltip } from './Tooltip';
import { StafMetric } from '@/lib/types';

interface StaffCardProps {
  staf: StafMetric & { animating?: boolean };
  theme: 'dark' | 'light';
  onHover?: (roleKey: string, isHovering: boolean) => void;
  onClick?: () => void;
}

export const StaffCard: React.FC<StaffCardProps> = ({
  staf,
  theme,
  onHover,
  onClick,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const isDark = theme === 'dark';

  const statusColors: Record<string, string> = {
    active: 'bg-green-500',
    idle: 'bg-gray-500',
    busy: 'bg-amber-500',
    offline: 'bg-red-500',
  };

  return (
    <Tooltip
      content={`${staf.name} • Rank #${staf.rank}`}
      position="top"
      theme={theme}
    >
      <motion.div
        data-staf={staf.role_key}
        onHoverStart={() => {
          setIsHovering(true);
          onHover?.(staf.role_key, true);
        }}
        onHoverEnd={() => {
          setIsHovering(false);
          onHover?.(staf.role_key, false);
        }}
        onClick={onClick}
        className={`p-4 rounded-lg border-2 cursor-pointer ${
          isDark
            ? 'bg-slate-800 border-slate-700 hover:border-blue-500'
            : 'bg-white border-slate-200 hover:border-blue-500'
        }`}
        whileHover={{ scale: 1.02, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}
        whileTap={{ scale: 0.98 }}
        animate={{
          y: staf.animating ? -5 : 0,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{staf.emoji}</span>
            <div>
              <h3
                className={`font-bold text-sm ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {staf.name}
              </h3>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                #{staf.rank}
              </p>
            </div>
          </div>

          {/* Status indicator */}
          <motion.div
            className={`w-3 h-3 rounded-full ${statusColors[staf.status] || 'bg-gray-500'}`}
            animate={
              staf.animating
                ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }
                : { scale: 1 }
            }
            transition={{ duration: 0.6, repeat: staf.animating ? Infinity : 0 }}
          />
        </div>

        {/* Primary metric */}
        <motion.div
          className="mb-3"
          animate={isHovering ? { x: 5 } : { x: 0 }}
        >
          <p
            className={`text-xs font-semibold ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {staf.primaryLabel}
          </p>
          <motion.p
            className="text-2xl font-bold text-blue-500"
            animate={isHovering ? { scale: 1.1 } : { scale: 1 }}
          >
            {staf.primaryCount}
          </motion.p>
        </motion.div>

        {/* Progress bar */}
        <div
          className={`h-2 rounded-full overflow-hidden ${
            isDark ? 'bg-slate-700' : 'bg-slate-200'
          }`}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((staf.primaryCount / 20) * 100, 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        {/* Hover reveal: Sub metrics */}
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 pt-3 border-t border-slate-700/50"
          >
            {staf.subMetrics?.slice(0, 2).map((metric, idx) => (
              <motion.div
                key={idx}
                className="flex justify-between text-xs mb-2"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {metric.label}
                </span>
                <span className="font-bold text-blue-400">{metric.value}</span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Alert badge */}
        {staf.alert && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="mt-3 px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-bold text-center"
          >
            {staf.alert.text}
          </motion.div>
        )}
      </motion.div>
    </Tooltip>
  );
};
