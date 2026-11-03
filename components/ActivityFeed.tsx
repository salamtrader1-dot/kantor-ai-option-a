'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity } from '@/lib/types';
import { generateMockData } from '@/lib/mockDataGenerator';

interface ActivityFeedProps {
  theme: 'dark' | 'light';
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ theme }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-slate-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const borderColor = isDark ? 'border-slate-700' : 'border-slate-300';

  useEffect(() => {
    // Generate initial activities from mock data
    const mockEvents = generateMockData(new Date(), 1);
    const activitiesList: Activity[] = mockEvents
      .slice(0, 8)
      .map((event, idx) => ({
        id: `${event.timestamp.getTime()}-${idx}`,
        timestamp: event.timestamp,
        actor: event.actor,
        type: event.type,
        data: event.data,
        animate: true,
      }));

    setActivities(activitiesList);

    // Simulate new events every 45 seconds
    const interval = setInterval(() => {
      const newEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
      const newActivity: Activity = {
        id: `${Date.now()}`,
        timestamp: new Date(),
        actor: newEvent.actor,
        type: newEvent.type,
        data: newEvent.data,
        animate: true,
      };

      setActivities((prev) => {
        const updated = [newActivity, ...prev];
        // Keep only last 20 activities
        return updated.slice(0, 20);
      });
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (actor: string, type: string) => {
    const icons: Record<string, string> = {
      fathi: '🔎',
      qela: '💬',
      angel: '📥',
      cindy: '📱',
      faza: '✍️',
      nana: '🧑‍💼',
      cika: '📊',
      salam: '👑',
    };

    const typeIcons: Record<string, string> = {
      lead_found: '🔍',
      draft_created: '📝',
      approved: '✅',
      deal_closed: '🎉',
      report: '📊',
      on_call: '📞',
      typing: '⌨️',
    };

    return icons[actor] || '👤';
  };

  const getActivityDescription = (activity: Activity) => {
    switch (activity.type) {
      case 'lead_found':
        return `Found ${activity.data.count || 1} lead (Quality: ${activity.data.quality}%)`;
      case 'draft_created':
        return `Created ${activity.data.count || 1} draft reply`;
      case 'approved':
        return `Approved ${activity.data.count || 1} draft from ${activity.data.actor}`;
      case 'deal_closed':
        return `🎉 DEAL CLOSED! ${activity.data.amount}`;
      case 'report':
        return `Submitted daily report`;
      case 'on_call':
        return `On call with lead`;
      case 'typing':
        return `Typing reply...`;
      default:
        return 'Activity recorded';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'lead_found':
        return isDark ? 'border-blue-500' : 'border-blue-400';
      case 'approved':
        return isDark ? 'border-green-500' : 'border-green-400';
      case 'deal_closed':
        return isDark ? 'border-amber-500' : 'border-amber-400';
      case 'report':
        return isDark ? 'border-purple-500' : 'border-purple-400';
      default:
        return isDark ? 'border-slate-600' : 'border-slate-400';
    }
  };

  const timeAgo = (date: Date) => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className={`${bgColor} rounded-lg border ${borderColor} overflow-hidden`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-slate-900' : 'bg-slate-50'} px-4 py-3 border-b ${borderColor}`}>
        <h2 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <span>📋</span> LIVE ACTIVITY
        </h2>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Real-time team events
        </p>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-slate-700 max-h-96 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              No activities yet
            </p>
          </div>
        ) : (
          activities.map((activity, idx) => (
            <motion.div
              key={activity.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`px-4 py-3 border-l-4 ${getActivityColor(activity.type)} hover:${isDark ? 'bg-slate-700/50' : 'bg-slate-50'} transition-colors`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 + 0.1 }}
                  className="text-xl flex-shrink-0"
                >
                  {getActivityIcon(activity.actor, activity.type)}
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-semibold ${textColor}`}>
                      {activity.actor.toUpperCase()}
                    </span>
                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {timeAgo(activity.timestamp)}
                    </span>
                  </div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 + 0.2 }}
                    className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {getActivityDescription(activity)}
                  </motion.p>
                </div>

                {/* Milestone Badge */}
                {activity.type === 'deal_closed' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 20,
                    }}
                    className="flex-shrink-0 px-2 py-1 bg-amber-500/20 border border-amber-500 rounded text-xs font-bold text-amber-300"
                  >
                    MILESTONE
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Footer */}
      <div
        className={`${isDark ? 'bg-slate-900' : 'bg-slate-50'} px-4 py-2 border-t ${borderColor} text-xs text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
      >
        Updating every 45 seconds (mock stream)
      </div>
    </div>
  );
};
