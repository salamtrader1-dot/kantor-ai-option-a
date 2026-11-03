'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FilterSidebarProps {
  theme: 'dark' | 'light';
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  searchQuery: string;
  department: string | null;
  status: string | null;
  sortBy: 'name' | 'performance' | 'joined';
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  theme,
  onFilterChange,
}) => {
  const isDark = theme === 'dark';
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    department: null,
    status: null,
    sortBy: 'performance',
  });

  const departments = [
    'Research',
    'Sales',
    'Reply/Content',
    'Management',
  ];

  const statuses = ['Active', 'Idle', 'Busy', 'Offline'];
  const sortOptions = [
    { value: 'performance', label: '⭐ Performance' },
    { value: 'name', label: '📝 Name' },
    { value: 'joined', label: '📅 Joined' },
  ];

  const handleChange = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 border ${
        isDark ? 'border-slate-700' : 'border-slate-300'
      } h-fit sticky top-6`}
    >
      {/* Header */}
      <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
        isDark ? 'text-white' : 'text-slate-900'
      }`}>
        <span>🔍</span> Filters
      </h3>

      {/* Search */}
      <div className="mb-5">
        <label className={`text-sm font-semibold block mb-2 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Search
        </label>
        <input
          type="text"
          placeholder="Name or email..."
          value={filters.searchQuery}
          onChange={(e) => handleChange({ searchQuery: e.target.value })}
          className={`w-full px-3 py-2 rounded-lg border transition ${
            isDark
              ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500 focus:border-blue-500'
              : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-gray-400 focus:border-blue-500'
          } focus:outline-none`}
        />
      </div>

      {/* Department */}
      <div className="mb-5">
        <label className={`text-sm font-semibold block mb-2 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Department
        </label>
        <div className="space-y-2">
          <button
            onClick={() => handleChange({ department: null })}
            className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
              filters.department === null
                ? 'bg-blue-600 text-white'
                : isDark
                  ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => handleChange({ department: dept })}
              className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                filters.department === dept
                  ? 'bg-blue-600 text-white'
                  : isDark
                    ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="mb-5">
        <label className={`text-sm font-semibold block mb-2 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Status
        </label>
        <div className="space-y-2">
          <button
            onClick={() => handleChange({ status: null })}
            className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
              filters.status === null
                ? 'bg-blue-600 text-white'
                : isDark
                  ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => handleChange({ status })}
              className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                filters.status === status
                  ? 'bg-blue-600 text-white'
                  : isDark
                    ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="mb-5">
        <label className={`text-sm font-semibold block mb-2 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Sort By
        </label>
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleChange({ sortBy: option.value as any })}
              className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                filters.sortBy === option.value
                  ? 'bg-blue-600 text-white'
                  : isDark
                    ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => {
          setFilters({
            searchQuery: '',
            department: null,
            status: null,
            sortBy: 'performance',
          });
          onFilterChange({
            searchQuery: '',
            department: null,
            status: null,
            sortBy: 'performance',
          });
        }}
        className={`w-full px-3 py-2 rounded-lg font-semibold transition text-sm ${
          isDark
            ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
            : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
        }`}
      >
        Reset Filters
      </button>
    </motion.div>
  );
};
