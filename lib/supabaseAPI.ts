/**
 * Real Supabase Client for Kantor AI
 * Replace mock with live Postgres + Real-time
 */

import { createClient } from '@supabase/supabase-js';
import { Activity, StafMetric } from './types';

// Environment variables (set in .env.local)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase credentials missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
}

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface StaffProfile {
  role_key: string;
  name: string;
  emoji: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  join_date: string;
  total_score: number;
}

/**
 * Real Supabase Implementation
 */
export class SupabaseAPI {
  private realtime: any = null;

  async getAllStaff(): Promise<StaffProfile[]> {
    const { data, error } = await supabaseClient
      .from('staff_profiles')
      .select('*');

    if (error) {
      console.error('Error fetching staff:', error);
      return [];
    }

    return data || [];
  }

  async getActivities(limit: number = 100): Promise<Activity[]> {
    const { data, error } = await supabaseClient
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching activities:', error);
      return [];
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      timestamp: new Date(item.created_at),
      actor: item.actor_key,
      type: item.activity_type,
      data: item.details || {},
      animate: true,
    }));
  }

  async getPerformanceScores(date: Date): Promise<Record<string, number>> {
    const dateStr = date.toISOString().split('T')[0];

    const { data, error } = await supabaseClient
      .from('performance_scores')
      .select('*')
      .eq('date', dateStr);

    if (error) {
      console.error('Error fetching scores:', error);
      return {};
    }

    const scores: Record<string, number> = {};
    (data || []).forEach((row: any) => {
      scores[row.staff_key] = row.total_score;
    });

    return scores;
  }

  async addActivity(actor: string, type: string, title: string, details: any) {
    const { error } = await supabaseClient
      .from('activities')
      .insert({
        actor_key: actor,
        activity_type: type,
        title,
        details,
      });

    if (error) {
      console.error('Error adding activity:', error);
    }
  }

  async updateScore(staffKey: string, date: Date, scoreData: any) {
    const dateStr = date.toISOString().split('T')[0];

    const { error } = await supabaseClient
      .from('performance_scores')
      .upsert(
        {
          staff_key: staffKey,
          date: dateStr,
          ...scoreData,
        },
        { onConflict: 'staff_key,date' }
      );

    if (error) {
      console.error('Error updating score:', error);
    }
  }

  /**
   * Subscribe to real-time activities
   */
  subscribeToActivities(callback: (activity: Activity) => void) {
    const subscription = supabaseClient
      .from('activities')
      .on('INSERT', (payload: any) => {
        const activity: Activity = {
          id: payload.new.id,
          timestamp: new Date(payload.new.created_at),
          actor: payload.new.actor_key,
          type: payload.new.activity_type,
          data: payload.new.details || {},
          animate: true,
        };
        callback(activity);
      })
      .subscribe((status) => {
        console.log(`Real-time subscription: ${status}`);
      });

    return subscription;
  }

  /**
   * Subscribe to performance score updates
   */
  subscribeToScores(callback: (data: any) => void) {
    const subscription = supabaseClient
      .from('performance_scores')
      .on('*', (payload: any) => {
        callback(payload.new);
      })
      .subscribe((status) => {
        console.log(`Scores subscription: ${status}`);
      });

    return subscription;
  }

  /**
   * Log Telegram message
   */
  async logTelegramMessage(
    telegramId: number,
    userName: string,
    message: string,
    action: string,
    status: string
  ) {
    const { error } = await supabaseClient
      .from('telegram_logs')
      .insert({
        telegram_id: telegramId,
        user_name: userName,
        message,
        action,
        status,
      });

    if (error) {
      console.error('Error logging Telegram message:', error);
    }
  }

  /**
   * Unsubscribe from all
   */
  async unsubscribeAll() {
    await supabaseClient.removeAllSubscriptions();
  }
}

// Export singleton
export const supabaseAPI = new SupabaseAPI();
