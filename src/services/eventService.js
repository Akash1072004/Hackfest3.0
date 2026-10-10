import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  eventMeta as fallbackEventMeta,
  competitions as fallbackCompetitions,
  problemCategories as fallbackProblemCategories,
  scheduleData as fallbackScheduleData,
  mentorsAndJudges as fallbackMentorsAndJudges,
  sponsorsData as fallbackSponsorsData,
  faqsData as fallbackFaqsData,
} from '../data/eventData';

export const eventService = {
  // Get active event settings
  async getSettings() {
    if (!isSupabaseConfigured) return fallbackEventMeta;
    try {
      const { data, error } = await supabase
        .from('event_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error || !data) return fallbackEventMeta;

      const eventDateStr = data.event_date || (data.event_start ? new Date(data.event_start).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : fallbackEventMeta.dates);
      const isRegOpen = data.registration_open !== undefined ? data.registration_open : (data.registration_status !== 'CLOSED');
      const isPptOpen = data.ppt_submissions_open !== undefined ? Boolean(data.ppt_submissions_open) : true;

      return {
        ...fallbackEventMeta,
        name: data.event_name || fallbackEventMeta.name,
        tagline: data.tagline || fallbackEventMeta.tagline,
        venue: data.venue || fallbackEventMeta.venue,
        venueShort: data.venue ? data.venue.split(',')[0].trim() : fallbackEventMeta.venueShort,
        eventDate: eventDateStr,
        dates: eventDateStr,
        datesDisplay: eventDateStr,
        registrationStatus: data.registration_status || (isRegOpen ? 'OPEN' : 'CLOSED'),
        registrationOpen: isRegOpen,
        registrationStartDate: data.registration_start_date || 'OCTOBER 10, 2026',
        registrationDeadline: data.registration_deadline || fallbackEventMeta.registrationDeadline,
        contactEmail: data.contact_email || fallbackEventMeta.contactEmail,
        liveModeStatus: data.live_mode_status || 'REGISTRATION OPEN',
        leaderboardPublished: Boolean(data.leaderboard_published),
        pptSubmissionsOpen: isPptOpen,
        submissionDeadline: data.submission_deadline || 'OCTOBER 25, 2026, 12:00 PM',
        submissionInstructions: data.submission_instructions || 'Submit your slide presentation (PDF or PPTX format, under 25MB) and provide your GitHub repository link.',
        acceptedFileTypes: data.accepted_file_types || '.pdf,.pptx,.ppt',
        maxFileSizeMb: data.max_file_size_mb || 25,
      };
    } catch {
      return fallbackEventMeta;
    }
  },

  // Get active competitions
  async getCompetitions() {
    if (!isSupabaseConfigured) return fallbackCompetitions;
    try {
      const { data, error } = await supabase
        .from('competitions')
        .select('*')
        .eq('status', 'active');

      if (error || !data || data.length === 0) return fallbackCompetitions;

      // Merge DB fields with existing rich theme styles & media
      return fallbackCompetitions.map((fb) => {
        const dbMatch = data.find((d) => d.slug === fb.id);
        if (!dbMatch) return fb;
        return {
          ...fb,
          dbId: dbMatch.id,
          title: dbMatch.name || fb.title,
          shortDescription: dbMatch.short_description || fb.shortDescription,
          fullOverview: dbMatch.description || fb.fullOverview,
          duration: dbMatch.duration || fb.duration,
          format: dbMatch.format || fb.format,
          maxTeamSize: dbMatch.max_team_size || 4,
          minTeamSize: dbMatch.min_team_size || 1,
          registrationOpen: dbMatch.registration_open,
        };
      });
    } catch {
      return fallbackCompetitions;
    }
  },

  // Get problem categories
  async getProblemCategories() {
    if (!isSupabaseConfigured) return fallbackProblemCategories;
    try {
      const { data, error } = await supabase
        .from('problem_categories')
        .select('*')
        .or('is_active.eq.true,is_published.eq.true')
        .order('sort_order', { ascending: true });

      if (error || !data || data.length === 0) return fallbackProblemCategories;

      return data.map((d, index) => ({
        id: d.id,
        number: d.number || String(index + 1).padStart(2, '0'),
        title: d.title,
        slug: d.slug,
        theme: d.theme,
        placeholderNotice: d.placeholder_notice || 'OFFICIAL PROBLEM STATEMENT TO BE UNVEILED AT BRIEFING',
        background: d.background || d.description,
        challenge: d.challenge || d.description,
        requirements: Array.isArray(d.requirements) ? d.requirements : [],
        expectedOutcome: d.expected_outcome,
        suggestedDirection: d.technical_directions,
        submissionInfo: d.submission_info,
        isActive: d.is_active ?? d.is_published ?? true,
        sortOrder: d.sort_order ?? index,
      }));
    } catch {
      return fallbackProblemCategories;
    }
  },

  // Get problem statements (published statements linked to categories)
  async getProblemStatements(categoryId = null) {
    if (!isSupabaseConfigured) return [];
    try {
      let query = supabase
        .from('problem_statements')
        .select(`
          *,
          category:problem_categories(*)
        `)
        .eq('is_published', true)
        .order('sort_order', { ascending: true });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;
      if (error) {
        console.warn('Failed to fetch problem statements from DB:', error.message);
        return [];
      }
      return data || [];
    } catch (err) {
      console.warn('Error fetching problem statements:', err);
      return [];
    }
  },

  // Get schedule
  async getSchedules() {
    if (!isSupabaseConfigured) return fallbackScheduleData;
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error || !data || data.length === 0) return fallbackScheduleData;

      const day1Items = data.filter((d) => d.day_number === 1).map((d, i) => ({
        order: String(i + 1).padStart(2, '0'),
        time: d.start_time || '[TO BE DECIDED]',
        title: d.title,
        location: d.location,
        speaker: d.speaker,
        description: d.description,
        badge: d.badge,
        highlight: d.is_highlight,
      }));

      const day2Items = data.filter((d) => d.day_number === 2).map((d, i) => ({
        order: String(i + 1).padStart(2, '0'),
        time: d.start_time || '[TO BE DECIDED]',
        title: d.title,
        location: d.location,
        speaker: d.speaker,
        description: d.description,
        badge: d.badge,
        highlight: d.is_highlight,
      }));

      return {
        day1: { ...fallbackScheduleData.day1, items: day1Items.length > 0 ? day1Items : fallbackScheduleData.day1.items },
        day2: { ...fallbackScheduleData.day2, items: day2Items.length > 0 ? day2Items : fallbackScheduleData.day2.items },
      };
    } catch {
      return fallbackScheduleData;
    }
  },

  // Get FAQs
  async getFaqs() {
    if (!isSupabaseConfigured) return fallbackFaqsData;
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error || !data || data.length === 0) return fallbackFaqsData;
      return data.map((d) => ({ q: d.question, a: d.answer, category: d.category }));
    } catch {
      return fallbackFaqsData;
    }
  },

  // Get Mentors & Judges
  async getMentorsAndJudges() {
    if (!isSupabaseConfigured) return fallbackMentorsAndJudges;
    try {
      const [mentorsRes, judgesRes] = await Promise.all([
        supabase.from('mentors').select('*').order('sort_order', { ascending: true }),
        supabase.from('judges').select('*').order('sort_order', { ascending: true }),
      ]);

      const mentors = mentorsRes.data?.length ? mentorsRes.data : fallbackMentorsAndJudges.mentors;
      const judges = judgesRes.data?.length ? judgesRes.data : fallbackMentorsAndJudges.judges;

      return { mentors, judges };
    } catch {
      return fallbackMentorsAndJudges;
    }
  },

  // Get Announcements
  async getAnnouncements() {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) return [];
      return data || [];
    } catch {
      return [];
    }
  },
};
