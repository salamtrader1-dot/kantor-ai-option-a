'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ChatBubbleProps {
  message: string;
  actor: string;
  theme: 'dark' | 'light';
  position?: { x: number; y: number };
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  actor,
  theme,
  position = { x: 0, y: 0 },
}) => {
  const isDark = theme === 'dark';

  const getActorColor = (role: string) => {
    const colors: Record<string, string> = {
      fathi: '#3b82f6',
      qela: '#10b981',
      angel: '#f59e0b',
      cindy: '#ec4899',
      faza: '#8b5cf6',
      nana: '#06b6d4',
      cika: '#ef4444',
      salam: '#f97316',
    };
    return colors[role] || '#6b7280';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
      className="absolute"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <div
        className={`${isDark ? 'bg-slate-700' : 'bg-slate-200'} rounded-lg px-3 py-2 shadow-lg border-2`}
        style={{ borderColor: getActorColor(actor) }}
      >
        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {message}
        </p>

        {/* Chat bubble tail */}
        <div
          className={`absolute -bottom-2 left-3 w-0 h-0 border-l-8 border-r-0 border-t-8`}
          style={{
            borderLeftColor: 'transparent',
            borderTopColor: getActorColor(actor),
          }}
        />
      </div>
    </motion.div>
  );
};
