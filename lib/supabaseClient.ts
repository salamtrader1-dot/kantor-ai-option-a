/**
 * Mock Supabase Client
 * Simulates real Supabase for development
 * Swap with real client when DB ready
 */

import { generateMockData, getLeaderboardMetrics } from './mockDataGenerator';
import { Activity, StafMetric } from './types';

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

class MockSupabaseClient {
  private activities: Activity[] = [];
  private stafProfiles: Record<string, StaffProfile> = {};

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Generate 7 days of mock data
    const mockEvents = generateMockData(new Date(), 7);
    this.activities = mockEvents;

    // Create staff profiles
    const staffData = [
      {
        role_key: 'fathi',
        name: 'FATHI',
        emoji: '🔍',
        email: 'fathi@kantor.ai',
        phone: '+62-812-1234567',
        position: 'Lead Researcher',
        department: 'Research',
        joinDate: '2024-01-15',
        totalScore: 156,
      },
      {
        role_key: 'qela',
        name: 'QELA',
        emoji: '💬',
        email: 'qela@kantor.ai',
        phone: '+62-812-2345678',
        position: 'Content Manager',
        department: 'Reply/Content',
        joinDate: '2024-02-10',
        totalScore: 142,
      },
      {
        role_key: 'angel',
        name: 'ANGEL',
        emoji: '📥',
        email: 'angel@kantor.ai',
        phone: '+62-812-3456789',
        position: 'Sales Lead',
        department: 'Sales',
        joinDate: '2024-01-20',
        totalScore: 138,
      },
      {
        role_key: 'cindy',
        name: 'CINDY',
        emoji: '📱',
        email: 'cindy@kantor.ai',
        phone: '+62-812-4567890',
        position: 'Account Manager',
        department: 'Sales',
        joinDate: '2024-03-05',
        totalScore: 125,
      },
      {
        role_key: 'faza',
        name: 'FAZA',
        emoji: '✍️',
        email: 'faza@kantor.ai',
        phone: '+62-812-5678901',
        position: 'Content Creator',
        department: 'Reply/Content',
        joinDate: '2024-02-28',
        totalScore: 119,
      },
      {
        role_key: 'nana',
        name: 'NANA',
        emoji: '🧑‍💼',
        email: 'nana@kantor.ai',
        phone: '+62-812-6789012',
        position: 'Operations Manager',
        department: 'Management',
        joinDate: '2023-12-01',
        totalScore: 185,
      },
      {
        role_key: 'cika',
        name: 'CIKA',
        emoji: '📊',
        email: 'cika@kantor.ai',
        phone: '+62-812-7890123',
        position: 'Data Analyst',
        department: 'Research',
        joinDate: '2024-01-25',
        totalScore: 132,
      },
      {
        role_key: 'salam',
        name: 'SALAM',
        emoji: '👑',
        email: 'salam@kantor.ai',
        phone: '+62-812-8901234',
        position: 'CEO',
        department: 'Management',
        joinDate: '2023-01-01',
        totalScore: 198,
      },
    ];

    staffData.forEach((staff) => {
      this.stafProfiles[staff.role_key] = staff;
    });
  }

  // Get all activities
  async getActivities(limit: number = 100): Promise<Activity[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.activities.slice(0, limit));
      }, 300);
    });
  }

  // Get activities for specific date
  async getActivitiesByDate(date: Date): Promise<Activity[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.activities.filter((a) => {
          const aDate = new Date(a.timestamp);
          return (
            aDate.getDate() === date.getDate() &&
            aDate.getMonth() === date.getMonth() &&
            aDate.getFullYear() === date.getFullYear()
          );
        });
        resolve(filtered);
      }, 300);
    });
  }

  // Get staff profile
  async getStaffProfile(roleKey: string): Promise<StaffProfile | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.stafProfiles[roleKey] || null);
      }, 200);
    });
  }

  // Get all staff profiles
  async getAllStaffProfiles(): Promise<StaffProfile[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Object.values(this.stafProfiles));
      }, 300);
    });
  }

  // Filter activities
  async filterActivities(
    filters: {
      type?: string;
      actor?: string;
      dateFrom?: Date;
      dateTo?: Date;
    }
  ): Promise<Activity[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [...this.activities];

        if (filters.type) {
          result = result.filter((a) => a.type === filters.type);
        }

        if (filters.actor) {
          result = result.filter((a) => a.actor === filters.actor);
        }

        if (filters.dateFrom) {
          result = result.filter((a) => new Date(a.timestamp) >= filters.dateFrom!);
        }

        if (filters.dateTo) {
          result = result.filter((a) => new Date(a.timestamp) <= filters.dateTo!);
        }

        resolve(result);
      }, 300);
    });
  }

  // Search activities
  async searchActivities(query: string): Promise<Activity[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowerQuery = query.toLowerCase();
        const filtered = this.activities.filter(
          (a) =>
            a.actor.toLowerCase().includes(lowerQuery) ||
            a.title.toLowerCase().includes(lowerQuery) ||
            (a.details && a.details.toLowerCase().includes(lowerQuery))
        );
        resolve(filtered);
      }, 300);
    });
  }

  // Get staff performance stats
  async getStaffStats(
    roleKey: string
  ): Promise<{
    totalActivities: number;
    avgPerformance: number;
    trend: 'up' | 'down' | 'stable';
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const staffActivities = this.activities.filter((a) => a.actor === roleKey);
        resolve({
          totalActivities: staffActivities.length,
          avgPerformance: 75 + Math.random() * 25,
          trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as any,
        });
      }, 300);
    });
  }

  // Export data as CSV
  async exportToCSV(data: any[], filename: string): Promise<Blob> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const headers = Object.keys(data[0] || {});
        const csv = [
          headers.join(','),
          ...data.map((row) =>
            headers.map((h) => `"${row[h] || ''}"`).join(',')
          ),
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        resolve(blob);
      }, 500);
    });
  }
}

// Export singleton instance
export const supabase = new MockSupabaseClient();
