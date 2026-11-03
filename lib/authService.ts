/**
 * Supabase Auth Helper
 * Email/Password authentication
 */

import { supabaseClient } from './supabaseAPI';

export class AuthService {
  /**
   * Sign up new user
   */
  static async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
  }

  /**
   * Sign in with email/password
   */
  static async signIn(email: string, password: string) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }

    // Store session
    localStorage.setItem('kantor_session', JSON.stringify(data.session));

    return { success: true, user: data.user, session: data.session };
  }

  /**
   * Sign out
   */
  static async signOut() {
    const { error } = await supabaseClient.auth.signOut();
    localStorage.removeItem('kantor_session');
    return !error;
  }

  /**
   * Get current user
   */
  static async getCurrentUser() {
    const { data, error } = await supabaseClient.auth.getUser();
    return data?.user || null;
  }

  /**
   * Get session
   */
  static async getSession() {
    const { data } = await supabaseClient.auth.getSession();
    return data?.session || null;
  }

  /**
   * Auth state listener
   */
  static onAuthStateChange(callback: (user: any) => void) {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        callback(session?.user || null);
      }
    );

    return authListener?.subscription.unsubscribe;
  }

  /**
   * Magic link sign in (passwordless)
   */
  static async signInWithMagicLink(email: string) {
    const { error } = await supabaseClient.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, message: 'Check your email for sign in link' };
  }
}

export default AuthService;
