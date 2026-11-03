/**
 * Real Supabase Client for Kantor AI
 * Simplified, production-ready version
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase env vars missing');
}

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Core Supabase API
 */
export class SupabaseAPI {
  // Get all staff
  async getAllStaff() {
    const { data } = await supabaseClient.from('staff_profiles').select('*');
    return data || [];
  }

  // Get activities
  async getActivities(limit = 100) {
    const { data } = await supabaseClient
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    return (data || []).map((item: any) => ({
      id: item.id,
      timestamp: new Date(item.created_at),
      actor: item.actor_key,
      type: item.activity_type,
      data: item.details || {},
      animate: true,
    }));
  }

  // Get performance scores
  async getPerformanceScores(date: Date) {
    const dateStr = date.toISOString().split('T')[0];
    const { data } = await supabaseClient
      .from('performance_scores')
      .select('*')
      .eq('date', dateStr);

    const scores: Record<string, number> = {};
    (data || []).forEach((row: any) => {
      scores[row.staff_key] = row.total_score;
    });
    return scores;
  }

  // Add activity
  async addActivity(actor: string, type: string, title: string, details: any) {
    await supabaseClient.from('activities').insert({
      actor_key: actor,
      activity_type: type,
      title,
      details,
    });
  }

  // Update score
  async updateScore(staffKey: string, date: Date, scoreData: any) {
    const dateStr = date.toISOString().split('T')[0];
    await supabaseClient.from('performance_scores').upsert({
      staff_key: staffKey,
      date: dateStr,
      ...scoreData,
    });
  }

  // Real-time subscribe to activities
  subscribeToActivities(callback: (activity: any) => void) {
    return supabaseClient
      .channel('activities')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'activities' },
        (payload: any) => {
          callback({
            id: payload.new.id,
            timestamp: new Date(payload.new.created_at),
            actor: payload.new.actor_key,
            type: payload.new.activity_type,
            data: payload.new.details || {},
            animate: true,
          });
        }
      )
      .subscribe();
  }

  // Real-time subscribe to scores
  subscribeToScores(callback: (data: any) => void) {
    return supabaseClient
      .channel('scores')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'performance_scores' },
        (payload: any) => callback(payload.new)
      )
      .subscribe();
  }

  // Log Telegram message
  async logTelegramMessage(
    telegramId: number,
    userName: string,
    message: string,
    action: string,
    status: string
  ) {
    await supabaseClient.from('telegram_logs').insert({
      telegram_id: telegramId,
      user_name: userName,
      message,
      action,
      status,
    });
  }
}

export const supabaseAPI = new SupabaseAPI();
