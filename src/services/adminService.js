import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const adminService = {
  // Get system counts for admin overview
  async getStats() {
    if (!isSupabaseConfigured) {
      return {
        participantsCount: 142,
        teamsCount: 38,
        registrationsCount: 142,
        submissionsCount: 29,
        evaluationsCount: 18,
      };
    }

    try {
      const [profiles, teams, registrations, submissions, scores] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('teams').select('*', { count: 'exact', head: true }),
        supabase.from('registrations').select('*', { count: 'exact', head: true }),
        supabase.from('submissions').select('*', { count: 'exact', head: true }),
        supabase.from('scores').select('*', { count: 'exact', head: true }),
      ]);

      return {
        participantsCount: profiles.count || 0,
        teamsCount: teams.count || 0,
        registrationsCount: registrations.count || 0,
        submissionsCount: submissions.count || 0,
        evaluationsCount: scores.count || 0,
      };
    } catch {
      return {
        participantsCount: 0,
        teamsCount: 0,
        registrationsCount: 0,
        submissionsCount: 0,
        evaluationsCount: 0,
      };
    }
  },

  // Get all participants
  async getAllParticipants() {
    if (!isSupabaseConfigured) return [];
    const { data } = await supabase
      .from('profiles')
      .select('*, registrations(*, competition:competitions(name))')
      .order('created_at', { ascending: false });
    return data || [];
  },

  // Get all teams
  async getAllTeams() {
    if (!isSupabaseConfigured) return [];
    const { data } = await supabase
      .from('teams')
      .select('*, competition:competitions(name), leader:profiles!teams_leader_id_fkey(full_name, email), members:team_members(id, role, profile:profiles(full_name, email))')
      .order('created_at', { ascending: false });
    return data || [];
  },

  // Update registration status
  async updateRegistrationStatus(id, status) {
    if (!isSupabaseConfigured) return;
    const { data, error } = await supabase
      .from('registrations')
      .update({ registration_status: status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Update event live mode or settings
  async updateEventSettings(settings) {
    if (!isSupabaseConfigured) return;
    const { data, error } = await supabase
      .from('event_settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
