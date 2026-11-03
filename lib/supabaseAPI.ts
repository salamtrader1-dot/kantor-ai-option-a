/**
 * Real Supabase Client for Kantor AI
 * Simplified, production-ready version
 */

import { createClient } from '@supabase/supabase-js';

// Lazy initialization to avoid build-time errors
let supabaseClientInstance: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseClientInstance) {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn('⚠️ Supabase env vars missing - using mock');
      // Return a mock client that won't crash
      return {
        from: () => ({
          select: () => Promise.resolve({ data: [], error: null }),
          insert: () => Promise.resolve({ data: [], error: null }),
          upsert: () => Promise.resolve({ data: [], error: null }),
          eq: function() { return this; },
          order: function() { return this; },
          limit: function() { return this; },
        }),
        channel: () => ({
          on: function() { return this; },
          subscribe: () => {},
        }),
      } as any;
    }

    supabaseClientInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseClientInstance;
}

/**
 * Core Supabase API
 */
export class SupabaseAPI {
  // Get all staff
  async getAllStaff() {
    const client = getSupabaseClient();
    const { data } = await client.from('staff_profiles').select('*');
    return data || [];
  }

  // Get activities
  async getActivities(limit = 100) {
    const client = getSupabaseClient();
    const { data } = await client
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
    const client = getSupabaseClient();
    const dateStr = date.toISOString().split('T')[0];
    const { data } = await client
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
    const client = getSupabaseClient();
    await client.from('activities').insert({
      actor_key: actor,
      activity_type: type,
      title,
      details,
    });
  }

  // Update score
  async updateScore(staffKey: string, date: Date, scoreData: any) {
    const client = getSupabaseClient();
    const dateStr = date.toISOString().split('T')[0];
    await client.from('performance_scores').upsert({
      staff_key: staffKey,
      date: dateStr,
      ...scoreData,
    });
  }

  // Real-time subscribe to activities
  subscribeToActivities(callback: (activity: any) => void) {
    const client = getSupabaseClient();
    return client
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
    const client = getSupabaseClient();
    return client
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
    const client = getSupabaseClient();
    await client.from('telegram_logs').insert({
      telegram_id: telegramId,
      user_name: userName,
      message,
      action,
      status,
    });
  }
}

export const supabaseAPI = new SupabaseAPI();
