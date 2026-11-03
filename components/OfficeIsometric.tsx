'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { OfficeFloor } from '@/lib/types';

type ActivityStatus = 'idle' | 'searching' | 'typing' | 'on_call' | 'celebrating';

interface OfficeIsometricProps {
  theme: 'dark' | 'light';
  stafActivities?: Record<string, ActivityStatus>; // role_key -> activity type
}

export const OfficeIsometric: React.FC<OfficeIsometricProps> = ({
  theme,
  stafActivities = {},
}) => {
  const isDark = theme === 'dark';

  // Isometric floor layout (SVG coordinates)
  const floors: OfficeFloor[] = useMemo(
    () => [
      {
        name: 'Floor 4 (Management)',
        level: 4,
        staf: [
          {
            role_key: 'salam',
            name: 'SALAM',
            position: { x: 120, y: 40 },
            desk: { x: 100, y: 30, width: 40, height: 25 },
            activity: stafActivities['salam'] || 'idle',
            currentMessage: 'Reviewing...',
          },
          {
            role_key: 'nana',
            name: 'NANA',
            position: { x: 280, y: 40 },
            desk: { x: 260, y: 30, width: 40, height: 25 },
            activity: stafActivities['nana'] || 'idle',
            currentMessage: 'Planning...',
          },
        ],
      },
      {
        name: 'Floor 3 (Sales)',
        level: 3,
        staf: [
          {
            role_key: 'angel',
            name: 'ANGEL',
            position: { x: 120, y: 130 },
            desk: { x: 100, y: 120, width: 40, height: 25 },
            activity: stafActivities['angel'] || 'idle',
            currentMessage: 'Intake...',
          },
          {
            role_key: 'cindy',
            name: 'CINDY',
            position: { x: 280, y: 130 },
            desk: { x: 260, y: 120, width: 40, height: 25 },
            activity: stafActivities['cindy'] || 'idle',
            currentMessage: 'Follow-up...',
          },
        ],
      },
      {
        name: 'Floor 2 (Reply/Content)',
        level: 2,
        staf: [
          {
            role_key: 'qela',
            name: 'QELA',
            position: { x: 120, y: 220 },
            desk: { x: 100, y: 210, width: 40, height: 25 },
            activity: stafActivities['qela'] || 'idle',
            currentMessage: 'Typing...',
          },
          {
            role_key: 'faza',
            name: 'FAZA',
            position: { x: 280, y: 220 },
            desk: { x: 260, y: 210, width: 40, height: 25 },
            activity: stafActivities['faza'] || 'idle',
            currentMessage: 'Creating...',
          },
        ],
      },
      {
        name: 'Floor 1 (Research)',
        level: 1,
        staf: [
          {
            role_key: 'fathi',
            name: 'FATHI',
            position: { x: 120, y: 310 },
            desk: { x: 100, y: 300, width: 40, height: 25 },
            activity: stafActivities['fathi'] || 'idle',
            currentMessage: 'Searching...',
          },
          {
            role_key: 'cika',
            name: 'CIKA',
            position: { x: 280, y: 310 },
            desk: { x: 260, y: 300, width: 40, height: 25 },
            activity: stafActivities['cika'] || 'idle',
            currentMessage: 'Reporting...',
          },
        ],
      },
    ],
    [stafActivities]
  );

  // Get activity color
  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'searching':
        return isDark ? '#3b82f6' : '#1e40af';
      case 'typing':
        return isDark ? '#10b981' : '#047857';
      case 'on_call':
        return isDark ? '#f59e0b' : '#d97706';
      case 'celebrating':
        return isDark ? '#ec4899' : '#be185d';
      default:
        return isDark ? '#6b7280' : '#4b5563';
    }
  };

  // Get light intensity based on activity
  const getLightIntensity = (activity: string) => {
    switch (activity) {
      case 'idle':
        return 0.1;
      case 'searching':
      case 'typing':
      case 'on_call':
        return 0.5;
      case 'celebrating':
        return 1;
      default:
        return 0.2;
    }
  };

  return (
    <div
      className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 border ${
        isDark ? 'border-slate-700' : 'border-slate-300'
      }`}
    >
      {/* Header */}
      <div className="mb-4">
        <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <span>🏢</span> KANTOR VIRTUAL (Isometric)
        </h2>
      </div>

      {/* Isometric SVG Office */}
      <svg
        viewBox="0 0 400 400"
        className="w-full h-auto"
        style={{ minHeight: '400px' }}
      >
        {/* Background */}
        <rect width="400" height="400" fill={isDark ? '#1e293b' : '#f8fafc'} />

        {/* Render floors from top to bottom */}
        {floors.map((floor, floorIdx) => (
          <g key={`floor-${floorIdx}`}>
            {/* Floor label */}
            <text
              x="20"
              y={60 + floorIdx * 90}
              fontSize="12"
              fontWeight="bold"
              fill={isDark ? '#cbd5e1' : '#64748b'}
            >
              {floor.name}
            </text>

            {/* Render staff desks on this floor */}
            {floor.staf.map((staff, staffIdx) => {
              const activity = staff.activity || 'idle';
              const lightColor = getActivityColor(activity);
              const lightIntensity = getLightIntensity(activity);

              return (
                <g key={`staff-${staffIdx}`}>
                  {/* Desk */}
                  <rect
                    x={staff.desk.x}
                    y={staff.desk.y}
                    width={staff.desk.width}
                    height={staff.desk.height}
                    fill={isDark ? '#334155' : '#e2e8f0'}
                    stroke={isDark ? '#475569' : '#cbd5e1'}
                    strokeWidth="1"
                    rx="2"
                  />

                  {/* Desk light glow */}
                  <motion.circle
                    cx={staff.desk.x + staff.desk.width / 2}
                    cy={staff.desk.y + staff.desk.height / 2}
                    r={staff.desk.width / 2 + 5}
                    fill={lightColor}
                    opacity={lightIntensity * 0.3}
                    animate={{
                      opacity: [lightIntensity * 0.2, lightIntensity * 0.5, lightIntensity * 0.2],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />

                  {/* Staff avatar (simple circle) */}
                  <motion.g
                    animate={{
                      y: activity === 'celebrating' ? -5 : 0,
                    }}
                    transition={{
                      duration: activity === 'celebrating' ? 0.3 : 0,
                      repeat: activity === 'celebrating' ? Infinity : 0,
                      repeatType: 'reverse',
                    }}
                  >
                    {/* Head */}
                    <circle
                      cx={staff.position.x}
                      cy={staff.position.y}
                      r="8"
                      fill={lightColor}
                    />

                    {/* Body */}
                    <rect
                      x={staff.position.x - 5}
                      y={staff.position.y + 8}
                      width="10"
                      height="12"
                      fill={lightColor}
                    />
                  </motion.g>

                  {/* Staff name label */}
                  <text
                    x={staff.position.x}
                    y={staff.position.y + 28}
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    fill={isDark ? '#e2e8f0' : '#334155'}
                  >
                    {staff.name}
                  </text>

                  {/* Activity label */}
                  <motion.text
                    x={staff.position.x}
                    y={staff.position.y + 40}
                    fontSize="8"
                    textAnchor="middle"
                    fill={lightColor}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activity}
                  </motion.text>
                </g>
              );
            })}
          </g>
        ))}

        {/* Stairs connector */}
        <line
          x1="30"
          y1="80"
          x2="30"
          y2="380"
          stroke={isDark ? '#475569' : '#cbd5e1'}
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      </svg>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Searching</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Typing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
          <span>On Call</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
          <span>Celebrate</span>
        </div>
      </div>
    </div>
  );
};
