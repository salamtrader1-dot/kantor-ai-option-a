'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface StaffProfile {
  role_key: string;
  name: string;
  emoji: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  joinDate: string;
  totalScore: number;
}

interface StaffProfileModalProps {
  roleKey: string | null;
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export const StaffProfileModal: React.FC<StaffProfileModalProps> = ({
  roleKey,
  isOpen,
  onClose,
  theme,
}) => {
  const [profile, setProfile] = React.useState<StaffProfile | null>(null);
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (isOpen && roleKey) {
      loadProfile();
    }
  }, [isOpen, roleKey]);

  const loadProfile = async () => {
    setLoading(true);
    const prof = await supabase.getStaffProfile(roleKey!);
    const stat = await supabase.getStaffStats(roleKey!);
    setProfile(prof);
    setStats(stat);
    setLoading(false);
  };

  const isDark = theme === 'dark';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4`}
          >
            <div
              className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-md w-full border ${
                isDark ? 'border-slate-700' : 'border-slate-200'
              }`}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-2xl hover:scale-110 transition"
              >
                ✕
              </button>

              {loading ? (
                <div className="p-8 text-center">
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Loading profile...
                  </p>
                </div>
              ) : profile ? (
                <div className="p-8">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-3">{profile.emoji}</div>
                    <h2
                      className={`text-2xl font-bold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {profile.name}
                    </h2>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {profile.position}
                    </p>
                  </div>

                  {/* Details grid */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-3 mb-6"
                  >
                    <div
                      className={`p-3 rounded-lg ${
                        isDark ? 'bg-slate-700/50' : 'bg-slate-100/50'
                      }`}
                    >
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Email
                      </p>
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {profile.email}
                      </p>
                    </div>

                    <div
                      className={`p-3 rounded-lg ${
                        isDark ? 'bg-slate-700/50' : 'bg-slate-100/50'
                      }`}
                    >
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Phone
                      </p>
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {profile.phone}
                      </p>
                    </div>

                    <div
                      className={`p-3 rounded-lg ${
                        isDark ? 'bg-slate-700/50' : 'bg-slate-100/50'
                      }`}
                    >
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Department
                      </p>
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {profile.department}
                      </p>
                    </div>

                    <div
                      className={`p-3 rounded-lg ${
                        isDark ? 'bg-slate-700/50' : 'bg-slate-100/50'
                      }`}
                    >
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Join Date
                      </p>
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {new Date(profile.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>

                  {/* Stats */}
                  {stats && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className={`p-4 rounded-lg ${isDark ? 'bg-blue-500/20' : 'bg-blue-100/50'} border ${
                        isDark ? 'border-blue-500/30' : 'border-blue-200'
                      } mb-6`}
                    >
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Total Activities
                          </p>
                          <p className="text-2xl font-bold text-blue-500">
                            {stats.totalActivities}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Performance
                          </p>
                          <p className="text-2xl font-bold text-blue-500">
                            {Math.round(stats.avgPerformance)}%
                          </p>
                        </div>
                      </div>
                      <div className="text-center mt-2">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            stats.trend === 'up'
                              ? 'bg-green-500/30 text-green-400'
                              : stats.trend === 'down'
                                ? 'bg-red-500/30 text-red-400'
                                : 'bg-gray-500/30 text-gray-400'
                          }`}
                        >
                          Trend: {stats.trend === 'up' ? '📈' : stats.trend === 'down' ? '📉' : '→'}{' '}
                          {stats.trend}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Action buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-2"
                  >
                    <button
                      onClick={onClose}
                      className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                        isDark
                          ? 'bg-slate-700 hover:bg-slate-600 text-white'
                          : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                      }`}
                    >
                      Close
                    </button>
                    <button
                      className={`flex-1 px-4 py-2 rounded-lg font-semibold transition bg-blue-600 hover:bg-blue-700 text-white`}
                    >
                      Send Message
                    </button>
                  </motion.div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Profile not found
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
