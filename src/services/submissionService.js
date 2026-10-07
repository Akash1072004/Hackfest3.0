import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const submissionService = {
  // Get submissions for user's team or user
  async getUserSubmissions(userId) {
    if (!isSupabaseConfigured || !userId) return [];

    try {
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          competition:competitions(id, name, slug),
          team:teams(id, name, code),
          problem_category:problem_categories(id, title, number, theme),
          scores:scores(id, score, comments, criterion:judging_criteria(title, weight))
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching submissions:', err);
      return [];
    }
  },

  // Save or update draft submission
  async saveSubmission({
    id = null,
    userId,
    teamId = null,
    competitionId,
    problemCategoryId = null,
    title,
    description,
    githubUrl,
    demoUrl,
    videoUrl,
    documentUrl,
    status = 'draft',
  }) {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured.');

    const payload = {
      user_id: userId,
      team_id: teamId,
      competition_id: competitionId,
      problem_category_id: problemCategoryId,
      title,
      description,
      github_url: githubUrl,
      demo_url: demoUrl,
      video_url: videoUrl,
      document_url: documentUrl,
      status,
      submitted_at: status === 'submitted' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    if (id) {
      const { data, error } = await supabase
        .from('submissions')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('submissions')
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },

  // Upload file to Supabase storage bucket 'submissions'
  async uploadFile(file, path) {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured.');

    const cleanPath = `${Date.now()}_${path.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const { data, error } = await supabase.storage
      .from('submissions')
      .upload(cleanPath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('submissions')
      .getPublicUrl(cleanPath);

    return publicUrl;
  },
};
