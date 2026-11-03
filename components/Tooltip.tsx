'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  theme: 'dark' | 'light';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  theme,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const isDark = theme === 'dark';

  const positionClasses: Record<string, string> = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${positionClasses[position]} whitespace-nowrap z-50 px-3 py-1 rounded-lg text-sm font-semibold pointer-events-none ${
              isDark
                ? 'bg-slate-900 text-white border border-slate-700'
                : 'bg-slate-100 text-slate-900 border border-slate-300'
            }`}
          >
            {content}

            {/* Arrow */}
            <div
              className={`absolute w-2 h-2 ${
                isDark ? 'bg-slate-900' : 'bg-slate-100'
              } rotate-45 ${
                position === 'top'
                  ? '-bottom-1 left-1/2 -translate-x-1/2'
                  : position === 'bottom'
                    ? '-top-1 left-1/2 -translate-x-1/2'
                    : position === 'left'
                      ? '-right-1 top-1/2 -translate-y-1/2'
                      : '-left-1 top-1/2 -translate-y-1/2'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
