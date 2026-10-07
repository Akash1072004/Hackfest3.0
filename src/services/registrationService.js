import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const registrationService = {
  // Register for a competition
  async createRegistration({
    userId,
    competitionId,
    teamId = null,
    problemCategoryId = null,
    experienceLevel = 'intermediate',
    notes = '',
  }) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured.');
    }

    // Check if already registered
    const { data: existing } = await supabase
      .from('registrations')
      .select('id, registration_status')
      .eq('user_id', userId)
      .eq('competition_id', competitionId)
      .maybeSingle();

    if (existing) {
      throw new Error('You have already registered for this competition.');
    }

    const { data, error } = await supabase
      .from('registrations')
      .insert({
        user_id: userId,
        competition_id: competitionId,
        team_id: teamId,
        problem_category_id: problemCategoryId,
        registration_status: 'confirmed',
        experience_level: experienceLevel,
        notes: notes,
      })
      .select(`
        *,
        competition:competitions(id, name, slug),
        team:teams(id, name, code),
        problem_category:problem_categories(id, title, number, theme)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Get all registrations for a user
  async getUserRegistrations(userId) {
    if (!isSupabaseConfigured || !userId) return [];

    try {
      const { data, error } = await supabase
        .from('registrations')
        .select(`
          *,
          competition:competitions (id, name, slug, duration, format),
          team:teams (id, name, code, members:team_members(id, user_id)),
          problem_category:problem_categories (id, title, number, theme)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching registrations:', err);
      return [];
    }
  },
};
