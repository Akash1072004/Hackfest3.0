import React, { useState, useEffect } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import { adminService } from '../../services/adminService';
import { eventService } from '../../services/eventService';
import ProblemDetailModal from '../../components/ProblemDetailModal';
import {
  Globe,
  Calendar,
  Clock,
  MapPin,
  Bell,
  HelpCircle,
  Trophy,
  Save,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  X,
  Layers,
  Target,
  FileText,
  Eye,
  Search,
  Filter,
  Check,
  ShieldAlert,
  Flame,
} from 'lucide-react';

export default function AdminCmsPage() {
  const [activeTab, setActiveTab] = useState('settings'); // 'settings' | 'problem_categories' | 'problem_statements' | 'schedules' | 'announcements' | 'faqs' | 'competitions'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState({ text: '', type: 'success' });

  // 1. Event Settings State (Registration & Submission Controls)
  const [eventSettings, setEventSettings] = useState({
    liveModeStatus: 'REGISTRATION OPEN',
    registrationOpen: true,
    registrationStartDate: 'OCTOBER 10, 2026',
    registrationDeadline: 'October 20, 2026',
    pptSubmissionsOpen: true,
    submissionDeadline: 'OCTOBER 25, 2026, 12:00 PM',
    submissionInstructions: 'Submit your slide presentation (PDF or PPTX format, under 25MB) and provide your GitHub repository link.',
    acceptedFileTypes: '.pdf,.pptx,.ppt',
    maxFileSizeMb: 25,
    leaderboardPublished: false,
    eventDate: 'OCTOBER 24-25, 2026',
    venue: 'Campus Multipurpose Hall, REC Banda',
    contactEmail: 'sdc@recbanda.ac.in',
  });

  // 2. Problem Categories State
  const [categories, setCategories] = useState([]);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    number: '01',
    title: '',
    slug: '',
    theme: '',
    placeholder_notice: 'OFFICIAL PROBLEM STATEMENT TO BE UNVEILED AT BRIEFING',
    background: '',
    challenge: '',
    requirements: '',
    expected_outcome: '',
    technical_directions: '',
    submission_info: '',
    sort_order: 1,
    is_published: true,
  });

  // 3. Problem Statements State
  const [statements, setStatements] = useState([]);
  const [statementModalOpen, setStatementModalOpen] = useState(false);
  const [editingStatement, setEditingStatement] = useState(null);
  const [statementForm, setStatementForm] = useState({
    category_id: '',
    title: '',
    slug: '',
    track_label: '',
    description: '',
    requirements: '',
    constraints: '',
    examples: '',
    input_output_specs: '',
    reference_file_url: '',
    sort_order: 1,
    status: 'published',
    is_published: true,
  });

  // Problem Statements Search & Filtering
  const [statementSearch, setStatementSearch] = useState('');
  const [statementCategoryFilter, setStatementCategoryFilter] = useState('all');
  const [statementStatusFilter, setStatementStatusFilter] = useState('all');

  // Preview & Safe Deletion Modal States
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewProblem, setPreviewProblem] = useState(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // 4. Schedules State
  const [schedules, setSchedules] = useState([]);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    day_number: 1,
    title: '',
    description: '',
    start_time: '09:00 AM',
    end_time: '11:00 AM',
    location: 'Auditorium, REC Banda',
    speaker: '',
    badge: 'STAGE',
    is_highlight: false,
    sort_order: 1,
  });

  // 5. Announcements State
  const [announcements, setAnnouncements] = useState([]);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    message: '',
    priority: 'normal',
    published: true,
  });

  // 6. FAQs State
  const [faqs, setFaqs] = useState([]);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState({
    category: 'general',
    question: '',
    answer: '',
  });

  // 7. Competitions State
  const [competitions, setCompetitions] = useState([]);
  const [compModalOpen, setCompModalOpen] = useState(false);
  const [editingComp, setEditingComp] = useState(null);
  const [compForm, setCompForm] = useState({
    name: '',
    description: '',
    max_team_size: 4,
    min_team_size: 1,
  });

  const notify = (text, type = 'success') => {
    setBanner({ text, type });
    setTimeout(() => setBanner({ text: '', type: 'success' }), 4000);
  };

  const loadAllCmsData = async () => {
    setLoading(true);
    try {
      const [settingsData, schedData, annData, faqData, compData, catData, stmtData] = await Promise.all([
        eventService.getSettings(),
        adminService.getSchedulesAdmin(),
        adminService.getAnnouncementsAdmin(),
        adminService.getFaqsAdmin(),
        eventService.getCompetitions(),
        adminService.getProblemCategoriesAdmin(),
        adminService.getProblemStatementsAdmin(),
      ]);

      if (settingsData) {
        setEventSettings({
          liveModeStatus: settingsData.liveModeStatus || 'REGISTRATION OPEN',
          registrationOpen: settingsData.registrationOpen !== false,
          registrationStartDate: settingsData.registrationStartDate || 'OCTOBER 10, 2026',
          registrationDeadline: settingsData.registrationDeadline || 'October 20, 2026',
          pptSubmissionsOpen: settingsData.pptSubmissionsOpen !== false,
          submissionDeadline: settingsData.submissionDeadline || 'OCTOBER 25, 2026, 12:00 PM',
          submissionInstructions: settingsData.submissionInstructions || 'Submit your slide presentation (PDF or PPTX format, under 25MB) and provide your GitHub repository link.',
          acceptedFileTypes: settingsData.acceptedFileTypes || '.pdf,.pptx,.ppt',
          maxFileSizeMb: settingsData.maxFileSizeMb || 25,
          leaderboardPublished: Boolean(settingsData.leaderboardPublished),
          eventDate: settingsData.eventDate || 'OCTOBER 24-25, 2026',
          venue: settingsData.venue || 'Campus Multipurpose Hall, REC Banda',
          contactEmail: settingsData.contactEmail || 'sdc@recbanda.ac.in',
        });
      }

      setSchedules(schedData || []);
      setAnnouncements(annData || []);
      setFaqs(faqData || []);
      setCompetitions(compData || []);
      setCategories(catData || []);
      setStatements(stmtData || []);
    } catch (err) {
      console.error('Failed to load CMS data:', err);
      notify('Failed to load some CMS records: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllCmsData();
  }, []);

  // --------------------------------------------------------------------------
  // Save Event Settings (Canonical Registration & Submission Control)
  // --------------------------------------------------------------------------
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminService.updateEventSettings({
        live_mode_status: eventSettings.liveModeStatus,
        registration_open: eventSettings.registrationOpen,
        registration_status: eventSettings.registrationOpen ? 'OPEN' : 'CLOSED',
        registration_start_date: eventSettings.registrationStartDate,
        registration_deadline: eventSettings.registrationDeadline,
        ppt_submissions_open: eventSettings.pptSubmissionsOpen,
        submission_deadline: eventSettings.submissionDeadline,
        submission_instructions: eventSettings.submissionInstructions,
        accepted_file_types: eventSettings.acceptedFileTypes,
        max_file_size_mb: eventSettings.maxFileSizeMb,
        leaderboard_published: eventSettings.leaderboardPublished,
        event_date: eventSettings.eventDate,
        venue: eventSettings.venue,
        contact_email: eventSettings.contactEmail,
      });
      notify('Event parameters, registration state & PPT submission controls updated successfully!');
      // Re-fetch to reconcile with persistent database record
      const refreshed = await eventService.getSettings();
      if (refreshed) {
        setEventSettings({
          liveModeStatus: refreshed.liveModeStatus || 'REGISTRATION OPEN',
          registrationOpen: refreshed.registrationOpen !== false,
          registrationStartDate: refreshed.registrationStartDate || 'OCTOBER 10, 2026',
          registrationDeadline: refreshed.registrationDeadline || 'October 20, 2026',
          pptSubmissionsOpen: refreshed.pptSubmissionsOpen !== false,
          submissionDeadline: refreshed.submissionDeadline || 'OCTOBER 25, 2026, 12:00 PM',
          submissionInstructions: refreshed.submissionInstructions || 'Submit your slide presentation (PDF or PPTX format, under 25MB) and provide your GitHub repository link.',
          acceptedFileTypes: refreshed.acceptedFileTypes || '.pdf,.pptx,.ppt',
          maxFileSizeMb: refreshed.maxFileSizeMb || 25,
          leaderboardPublished: Boolean(refreshed.leaderboardPublished),
          eventDate: refreshed.eventDate || 'OCTOBER 24-25, 2026',
          venue: refreshed.venue || 'Campus Multipurpose Hall, REC Banda',
          contactEmail: refreshed.contactEmail || 'sdc@recbanda.ac.in',
        });
      }
    } catch (err) {
      notify('Failed to save settings: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------------------------------
  // Problem Categories Handlers (PART 2)
  // --------------------------------------------------------------------------
  const handleOpenCategoryModal = (cat = null) => {
    if (cat) {
      setEditingCategory(cat);
      setCategoryForm({
        number: cat.number || '',
        title: cat.title || '',
        slug: cat.slug || '',
        theme: cat.theme || '',
        placeholder_notice: cat.placeholder_notice || 'OFFICIAL PROBLEM STATEMENT TO BE UNVEILED AT BRIEFING',
        background: cat.background || '',
        challenge: cat.challenge || cat.description || '',
        requirements: Array.isArray(cat.requirements) ? cat.requirements.join('\n') : '',
        expected_outcome: cat.expected_outcome || '',
        technical_directions: cat.technical_directions || '',
        submission_info: cat.submission_info || '',
        sort_order: cat.sort_order ?? 1,
        is_published: cat.is_published ?? cat.is_active ?? true,
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        number: String(categories.length + 1).padStart(2, '0'),
        title: '',
        slug: '',
        theme: '',
        placeholder_notice: 'OFFICIAL PROBLEM STATEMENT TO BE UNVEILED AT BRIEFING',
        background: '',
        challenge: '',
        requirements: '',
        expected_outcome: '',
        technical_directions: '',
        submission_info: '',
        sort_order: categories.length + 1,
        is_published: true,
      });
    }
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.title.trim()) {
      notify('Track title is required', 'error');
      return;
    }
    setSaving(true);
    try {
      const reqList = categoryForm.requirements
        ? categoryForm.requirements.split('\n').map((r) => r.trim()).filter(Boolean)
        : [];

      await adminService.saveProblemCategory({
        ...categoryForm,
        id: editingCategory?.id,
        requirements: reqList,
      });
      notify(editingCategory ? 'Updated problem category successfully!' : 'Created new problem category track!');
      setCategoryModalOpen(false);
      const updated = await adminService.getProblemCategoriesAdmin();
      setCategories(updated || []);
    } catch (err) {
      notify('Failed to save category: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleCategoryPublish = async (cat) => {
    const current = cat.is_published ?? cat.is_active ?? true;
    const nextState = !current;
    try {
      await adminService.toggleProblemCategoryPublish(cat.id, nextState);
      notify(`Track "${cat.title}" is now ${nextState ? 'PUBLISHED' : 'UNPUBLISHED'}`);
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, is_active: nextState, is_published: nextState } : c))
      );
    } catch (err) {
      notify('Failed to update publication status: ' + err.message, 'error');
    }
  };

  const handlePromptDeleteCategory = async (cat) => {
    try {
      const depCheck = await adminService.checkProblemCategoryDependencies(cat.id);
      setDeleteTarget({
        type: 'category',
        item: cat,
        canDelete: depCheck.canDelete,
        message: depCheck.message,
      });
      setDeleteConfirmOpen(true);
    } catch (err) {
      notify('Failed to inspect dependencies: ' + err.message, 'error');
    }
  };

  // --------------------------------------------------------------------------
  // Problem Statements Handlers (PART 3)
  // --------------------------------------------------------------------------
  const handleOpenStatementModal = (stmt = null) => {
    if (stmt) {
      setEditingStatement(stmt);
      setStatementForm({
        category_id: stmt.category_id || (categories[0]?.id || ''),
        title: stmt.title || '',
        slug: stmt.slug || '',
        track_label: stmt.track_label || '',
        description: stmt.description || '',
        requirements: Array.isArray(stmt.requirements) ? stmt.requirements.join('\n') : '',
        constraints: stmt.constraints || '',
        examples: stmt.examples || '',
        input_output_specs: stmt.input_output_specs || '',
        reference_file_url: stmt.reference_file_url || '',
        sort_order: stmt.sort_order ?? 1,
        status: stmt.status || 'published',
        is_published: stmt.is_published !== false,
      });
    } else {
      setEditingStatement(null);
      setStatementForm({
        category_id: categories[0]?.id || '',
        title: '',
        slug: '',
        track_label: '',
        description: '',
        requirements: '',
        constraints: '',
        examples: '',
        input_output_specs: '',
        reference_file_url: '',
        sort_order: statements.length + 1,
        status: 'published',
        is_published: true,
      });
    }
    setStatementModalOpen(true);
  };

  const handleSaveStatement = async (e, asDraft = false) => {
    e.preventDefault();
    if (!statementForm.title.trim()) {
      notify('Problem statement title is required', 'error');
      return;
    }
    setSaving(true);
    try {
      const reqList = statementForm.requirements
        ? statementForm.requirements.split('\n').map((r) => r.trim()).filter(Boolean)
        : [];

      await adminService.saveProblemStatement({
        ...statementForm,
        id: editingStatement?.id,
        requirements: reqList,
        status: asDraft ? 'draft' : 'published',
        is_published: !asDraft,
      });

      notify(asDraft ? 'Draft statement saved securely!' : 'Problem statement published to public website!');
      setStatementModalOpen(false);
      const updated = await adminService.getProblemStatementsAdmin();
      setStatements(updated || []);
    } catch (err) {
      notify('Failed to save problem statement: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatementPublish = async (stmt) => {
    const nextState = !stmt.is_published;
    try {
      await adminService.toggleProblemStatementPublish(stmt.id, nextState);
      notify(`Statement "${stmt.title}" is now ${nextState ? 'PUBLISHED' : 'SAVED AS DRAFT'}`);
      setStatements((prev) =>
        prev.map((s) => (s.id === stmt.id ? { ...s, is_published: nextState, status: nextState ? 'published' : 'draft' } : s))
      );
    } catch (err) {
      notify('Failed to update publish state: ' + err.message, 'error');
    }
  };

  const handlePromptDeleteStatement = async (stmt) => {
    try {
      const depCheck = await adminService.checkProblemStatementDependencies(stmt.id);
      setDeleteTarget({
        type: 'statement',
        item: stmt,
        canDelete: depCheck.canDelete,
        message: depCheck.message,
      });
      setDeleteConfirmOpen(true);
    } catch (err) {
      notify('Failed to check dependencies: ' + err.message, 'error');
    }
  };

  const handleExecuteDelete = async () => {
    if (!deleteTarget?.item) return;
    setSaving(true);
    try {
      if (deleteTarget.type === 'category') {
        await adminService.deleteProblemCategory(deleteTarget.item.id);
        notify(`Deleted track category "${deleteTarget.item.title}"`);
        setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.item.id));
      } else if (deleteTarget.type === 'statement') {
        await adminService.deleteProblemStatement(deleteTarget.item.id);
        notify(`Deleted problem statement "${deleteTarget.item.title}"`);
        setStatements((prev) => prev.filter((s) => s.id !== deleteTarget.item.id));
      }
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      notify('Delete failed: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePreviewItem = (type, item) => {
    if (type === 'category') {
      setPreviewProblem({
        number: item.number || '01',
        title: item.title,
        theme: item.theme,
        placeholderNotice: item.placeholder_notice || 'OFFICIAL PROBLEM STATEMENT TO BE UNVEILED AT BRIEFING',
        background: item.background || item.description,
        challenge: item.challenge || item.description,
        requirements: Array.isArray(item.requirements) ? item.requirements : [],
        expectedOutcome: item.expected_outcome,
        suggestedDirection: item.technical_directions,
        submissionInfo: item.submission_info,
      });
    } else if (type === 'statement') {
      const parentCat = categories.find((c) => c.id === item.category_id) || item.category || {};
      setPreviewProblem({
        number: parentCat.number || '01',
        title: item.title,
        theme: parentCat.theme || item.track_label || 'CHALLENGE TRACK',
        placeholderNotice: 'OFFICIAL PROBLEM STATEMENT SPECIFICATION (PREVIEW)',
        background: item.description,
        challenge: item.description,
        requirements: Array.isArray(item.requirements) ? item.requirements : [],
        constraints: item.constraints,
        examples: item.examples,
        inputOutputSpecs: item.input_output_specs,
        referenceFileUrl: item.reference_file_url,
        expectedOutcome: 'Working operational prototype solving core challenge constraints.',
        suggestedDirection: 'Production-ready architecture, clear separation of concerns, live validation.',
        submissionInfo: 'Transmitted via HackFest 3.0 submission portal.',
      });
    }
    setPreviewModalOpen(true);
  };

  // --------------------------------------------------------------------------
  // Schedule Management
  // --------------------------------------------------------------------------
  const handleOpenScheduleModal = (item = null) => {
    if (item) {
      setEditingSchedule(item);
      setScheduleForm({
        day_number: item.day_number || 1,
        title: item.title || '',
        description: item.description || '',
        start_time: item.start_time || '09:00 AM',
        end_time: item.end_time || '11:00 AM',
        location: item.location || 'Auditorium, REC Banda',
        speaker: item.speaker || '',
        badge: item.badge || 'STAGE',
        is_highlight: Boolean(item.is_highlight),
        sort_order: item.sort_order || 1,
      });
    } else {
      setEditingSchedule(null);
      setScheduleForm({
        day_number: 1,
        title: '',
        description: '',
        start_time: '09:00 AM',
        end_time: '11:00 AM',
        location: 'Auditorium, REC Banda',
        speaker: '',
        badge: 'STAGE',
        is_highlight: false,
        sort_order: (schedules.length || 0) + 1,
      });
    }
    setScheduleModalOpen(true);
  };

  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    if (!scheduleForm.title.trim()) {
      notify('Schedule title is required', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...scheduleForm,
        id: editingSchedule?.id,
      };
      await adminService.saveScheduleItem(payload);
      notify(editingSchedule ? 'Schedule session updated' : 'New session added to schedule');
      setScheduleModalOpen(false);
      const updated = await adminService.getSchedulesAdmin();
      setSchedules(updated || []);
    } catch (err) {
      notify('Failed to save schedule: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSchedule = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete session "${title}"?`)) return;
    try {
      await adminService.deleteScheduleItem(id);
      notify(`Session "${title}" removed.`);
      setSchedules(schedules.filter((s) => s.id !== id));
    } catch (err) {
      notify('Failed to delete session: ' + err.message, 'error');
    }
  };

  // --------------------------------------------------------------------------
  // Announcements Management
  // --------------------------------------------------------------------------
  const handleOpenAnnouncementModal = (item = null) => {
    if (item) {
      setEditingAnnouncement(item);
      setAnnouncementForm({
        title: item.title || '',
        message: item.message || '',
        priority: item.priority || 'normal',
        published: item.published !== false,
      });
    } else {
      setEditingAnnouncement(null);
      setAnnouncementForm({
        title: '',
        message: '',
        priority: 'normal',
        published: true,
      });
    }
    setAnnouncementModalOpen(true);
  };

  const handleSaveAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcementForm.title.trim() || !announcementForm.message.trim()) {
      notify('Announcement title and message are required', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...announcementForm,
        id: editingAnnouncement?.id,
      };
      await adminService.saveAnnouncement(payload);
      notify(editingAnnouncement ? 'Announcement updated' : 'Announcement broadcasted');
      setAnnouncementModalOpen(false);
      const updated = await adminService.getAnnouncementsAdmin();
      setAnnouncements(updated || []);
    } catch (err) {
      notify('Failed to save announcement: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAnnouncement = async (id, title) => {
    if (!window.confirm(`Delete announcement "${title}"?`)) return;
    try {
      await adminService.deleteAnnouncement(id);
      notify(`Announcement "${title}" removed.`);
      setAnnouncements(announcements.filter((a) => a.id !== id));
    } catch (err) {
      notify('Failed to delete announcement: ' + err.message, 'error');
    }
  };

  // --------------------------------------------------------------------------
  // FAQs Management
  // --------------------------------------------------------------------------
  const handleOpenFaqModal = (item = null) => {
    if (item) {
      setEditingFaq(item);
      setFaqForm({
        category: item.category || 'general',
        question: item.question || '',
        answer: item.answer || '',
      });
    } else {
      setEditingFaq(null);
      setFaqForm({
        category: 'general',
        question: '',
        answer: '',
      });
    }
    setFaqModalOpen(true);
  };

  const handleSaveFaq = async (e) => {
    e.preventDefault();
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      notify('Question and answer are required', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...faqForm,
        id: editingFaq?.id,
      };
      await adminService.saveFaq(payload);
      notify(editingFaq ? 'FAQ entry updated' : 'New FAQ added');
      setFaqModalOpen(false);
      const updated = await adminService.getFaqsAdmin();
      setFaqs(updated || []);
    } catch (err) {
      notify('Failed to save FAQ: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Delete this FAQ entry?')) return;
    try {
      await adminService.deleteFaq(id);
      notify('FAQ entry removed.');
      setFaqs(faqs.filter((f) => f.id !== id));
    } catch (err) {
      notify('Failed to delete FAQ: ' + err.message, 'error');
    }
  };

  // --------------------------------------------------------------------------
  // Competitions Editor
  // --------------------------------------------------------------------------
  const handleOpenCompModal = (comp) => {
    setEditingComp(comp);
    setCompForm({
      name: comp.name || '',
      description: comp.description || '',
      max_team_size: comp.max_team_size || 4,
      min_team_size: comp.min_team_size || 1,
    });
    setCompModalOpen(true);
  };

  const handleSaveComp = async (e) => {
    e.preventDefault();
    if (!editingComp) return;
    setSaving(true);
    try {
      await adminService.updateCompetition(editingComp.dbId || editingComp.id, compForm);
      notify(`Updated competition details for "${compForm.name}"`);
      setCompModalOpen(false);
      const updated = await eventService.getCompetitions();
      setCompetitions(updated || []);
    } catch (err) {
      notify('Failed to update competition: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ paddingTop: 'calc(var(--nav-height) + 1.5rem)', paddingBottom: '6rem' }}>
      <div className="container" style={{ maxWidth: '1280px' }}>
        <AdminNav />

        {/* Banner notification */}
        {banner.text && (
          <div
            style={{
              background: banner.type === 'error' ? 'rgba(143, 48, 53, 0.25)' : 'rgba(0, 191, 255, 0.15)',
              border: `1px solid ${banner.type === 'error' ? 'var(--color-muted-crimson)' : 'var(--color-arc-blue)'}`,
              borderRadius: 'var(--radius-sm)',
              padding: '0.85rem 1.25rem',
              color: banner.type === 'error' ? '#ffb4b7' : 'var(--color-tech-white)',
              fontSize: '0.88rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>{banner.text}</span>
            <button
              onClick={() => setBanner({ text: '', type: 'success' })}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Section Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <span className="chapter-badge" style={{ margin: 0 }}>CONTENT MANAGEMENT SYSTEM</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-arc-blue)' }}>
              LIVE WEBSITE SYNC
            </span>
          </div>
          <h1 className="heading-display" style={{ fontSize: '2rem', margin: 0 }}>
            EVENT & WEBSITE CONTENT
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '0.3rem 0 0 0' }}>
            Directly modify event timelines, instructions, announcements, FAQs, and competition settings without code redeployments.
          </p>
        </div>

        {/* Sub-tabs Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '2rem',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: '0.5rem',
          }}
        >
          {[
            { id: 'settings', label: 'EVENT & SUBMISSION SETTINGS', icon: Calendar },
            { id: 'problem_categories', label: `PROBLEM CATEGORIES (${categories.length})`, icon: Target },
            { id: 'problem_statements', label: `PROBLEM STATEMENTS (${statements.length})`, icon: Layers },
            { id: 'schedules', label: `SCHEDULE SESSIONS (${schedules.length})`, icon: Clock },
            { id: 'announcements', label: `ANNOUNCEMENTS (${announcements.length})`, icon: Bell },
            { id: 'faqs', label: `FAQS (${faqs.length})`, icon: HelpCircle },
            { id: 'competitions', label: `COMPETITIONS & TRACKS (${competitions.length})`, icon: Trophy },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  flexShrink: 0,
                  gap: '0.45rem',
                  padding: '0.65rem 1.15rem',
                  borderRadius: '4px',
                  border: active ? '1px solid var(--color-arc-blue)' : '1px solid transparent',
                  background: active ? 'rgba(0, 191, 255, 0.15)' : 'transparent',
                  color: active ? 'var(--color-arc-blue)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: EVENT SETTINGS & PARAMETERS (PARTS 4 & 5)                */}
        {/* ============================================================== */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} style={{ maxWidth: '960px' }}>
            <div
              style={{
                background: 'rgba(28, 32, 38, 0.95)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '2rem',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2.5rem',
              }}
            >
              {/* SECTION A: EVENT REGISTRATION CONTROL (PART 4) */}
              <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    <ShieldAlert size={20} color={eventSettings.registrationOpen ? '#00ff77' : '#E62429'} />
                    EVENT REGISTRATION CONTROL
                  </h3>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '20px',
                    background: eventSettings.registrationOpen ? 'rgba(0, 255, 119, 0.12)' : 'rgba(230, 36, 41, 0.15)',
                    border: `1px solid ${eventSettings.registrationOpen ? 'rgba(0, 255, 119, 0.4)' : 'rgba(230, 36, 41, 0.4)'}`,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.74rem',
                    color: eventSettings.registrationOpen ? '#00ff77' : '#ffb4b7',
                    fontWeight: 600,
                  }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: eventSettings.registrationOpen ? '#00ff77' : '#E62429',
                      boxShadow: eventSettings.registrationOpen ? '0 0 8px #00ff77' : '0 0 8px #E62429',
                    }} />
                    <span>{eventSettings.registrationOpen ? 'REGISTRATIONS OPEN & ACTIVE' : 'REGISTRATIONS CLOSED // GATES SEALED'}</span>
                  </div>
                </div>

                <div style={{ background: '#111827', padding: '1.25rem', borderRadius: '6px', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={eventSettings.registrationOpen}
                      onChange={(e) => setEventSettings({ ...eventSettings, registrationOpen: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--color-arc-blue)', marginTop: '2px' }}
                    />
                    <div>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                        ENABLE PUBLIC EVENT REGISTRATIONS (OPEN / CLOSED)
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.5', marginTop: '0.2rem' }}>
                        When disabled, the public registration page immediately indicates that registrations have concluded, disables form submissions, and Supabase database-level triggers reject new registration inserts.
                      </div>
                    </div>
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.4rem' }}>
                      REGISTRATION OPENING TIMELINE
                    </label>
                    <input
                      type="text"
                      value={eventSettings.registrationStartDate}
                      onChange={(e) => setEventSettings({ ...eventSettings, registrationStartDate: e.target.value })}
                      placeholder="e.g. OCTOBER 10, 2026, 10:00 AM"
                      style={{
                        width: '100%',
                        padding: '0.7rem',
                        background: '#111827',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.4rem' }}>
                      REGISTRATION CLOSING DEADLINE
                    </label>
                    <input
                      type="text"
                      value={eventSettings.registrationDeadline}
                      onChange={(e) => setEventSettings({ ...eventSettings, registrationDeadline: e.target.value })}
                      placeholder="e.g. October 20, 2026 11:59 PM"
                      style={{
                        width: '100%',
                        padding: '0.7rem',
                        background: '#111827',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: PPT & PROJECT SUBMISSION CONTROL (PART 5) */}
              <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    <FileText size={20} color={eventSettings.pptSubmissionsOpen ? 'var(--color-arc-blue)' : '#E62429'} />
                    PPT & PROJECT SUBMISSION CONTROL
                  </h3>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '20px',
                    background: eventSettings.pptSubmissionsOpen ? 'rgba(0, 191, 255, 0.12)' : 'rgba(230, 36, 41, 0.15)',
                    border: `1px solid ${eventSettings.pptSubmissionsOpen ? 'rgba(0, 191, 255, 0.4)' : 'rgba(230, 36, 41, 0.4)'}`,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.74rem',
                    color: eventSettings.pptSubmissionsOpen ? 'var(--color-arc-blue)' : '#ffb4b7',
                    fontWeight: 600,
                  }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: eventSettings.pptSubmissionsOpen ? 'var(--color-arc-blue)' : '#E62429',
                      boxShadow: eventSettings.pptSubmissionsOpen ? '0 0 8px var(--color-arc-blue)' : '0 0 8px #E62429',
                    }} />
                    <span>{eventSettings.pptSubmissionsOpen ? 'PPT SUBMISSIONS ACTIVE' : 'PPT SUBMISSIONS DISABLED // CLOSED'}</span>
                  </div>
                </div>

                <div style={{ background: '#111827', padding: '1.25rem', borderRadius: '6px', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={eventSettings.pptSubmissionsOpen}
                      onChange={(e) => setEventSettings({ ...eventSettings, pptSubmissionsOpen: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--color-arc-blue)', marginTop: '2px' }}
                    />
                    <div>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                        ENABLE PROJECT & PPT SUBMISSIONS (OPEN / CLOSED)
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.5', marginTop: '0.2rem' }}>
                        When disabled or after deadline, the participant submission dashboard locks document uploads and final submissions, and database validation prevents status progression.
                      </div>
                    </div>
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.4rem' }}>
                      SUBMISSION CLOSING DEADLINE
                    </label>
                    <input
                      type="text"
                      value={eventSettings.submissionDeadline}
                      onChange={(e) => setEventSettings({ ...eventSettings, submissionDeadline: e.target.value })}
                      placeholder="e.g. OCTOBER 25, 2026, 12:00 PM"
                      style={{
                        width: '100%',
                        padding: '0.7rem',
                        background: '#111827',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.4rem' }}>
                      ACCEPTED FILE EXTENSIONS
                    </label>
                    <input
                      type="text"
                      value={eventSettings.acceptedFileTypes}
                      onChange={(e) => setEventSettings({ ...eventSettings, acceptedFileTypes: e.target.value })}
                      placeholder="e.g. .pdf,.pptx,.ppt"
                      style={{
                        width: '100%',
                        padding: '0.7rem',
                        background: '#111827',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.4rem' }}>
                      MAX FILE SIZE LIMIT (MB)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={100}
                      value={eventSettings.maxFileSizeMb}
                      onChange={(e) => setEventSettings({ ...eventSettings, maxFileSizeMb: Number(e.target.value) })}
                      style={{
                        width: '100%',
                        padding: '0.7rem',
                        background: '#111827',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.4rem' }}>
                    OFFICIAL SUBMISSION INSTRUCTIONS & DIRECTIVES
                  </label>
                  <textarea
                    rows={3}
                    value={eventSettings.submissionInstructions}
                    onChange={(e) => setEventSettings({ ...eventSettings, submissionInstructions: e.target.value })}
                    placeholder="Instructions shown to teams regarding repository structure, slide format, and required deliverables..."
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      background: '#111827',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
              </div>

              {/* SECTION C: GENERAL TIMELINE & WEBSITE PARAMETERS */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: '#fff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <Calendar size={20} color="var(--color-arc-blue)" />
                  GENERAL EVENT PARAMETERS & VENUE
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.4rem' }}>
                      EVENT DATES BANNER
                    </label>
                    <input
                      type="text"
                      value={eventSettings.eventDate}
                      onChange={(e) => setEventSettings({ ...eventSettings, eventDate: e.target.value })}
                      placeholder="e.g. OCTOBER 24-25, 2026"
                      style={{
                        width: '100%',
                        padding: '0.7rem',
                        background: '#111827',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.4rem' }}>
                      CAMPUS VENUE / HOST LOCATION
                    </label>
                    <input
                      type="text"
                      value={eventSettings.venue}
                      onChange={(e) => setEventSettings({ ...eventSettings, venue: e.target.value })}
                      placeholder="e.g. Campus Multipurpose Hall, REC Banda, Atarra, Uttar Pradesh"
                      style={{
                        width: '100%',
                        padding: '0.7rem',
                        background: '#111827',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.4rem' }}>
                      EVENT CYCLE STATUS
                    </label>
                    <select
                      value={eventSettings.liveModeStatus}
                      onChange={(e) => setEventSettings({ ...eventSettings, liveModeStatus: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.7rem',
                        background: '#111827',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        color: '#fff',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem',
                      }}
                    >
                      <option value="REGISTRATION OPEN">REGISTRATION OPEN</option>
                      <option value="EVENT LIVE">EVENT LIVE (HACKATHON COMMENCED)</option>
                      <option value="SUBMISSIONS OPEN">SUBMISSIONS OPEN</option>
                      <option value="JUDGING">JUDGING & EVALUATION</option>
                      <option value="RESULTS">RESULTS DEPLOYED</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.4rem' }}>
                      OFFICIAL SUPPORT EMAIL
                    </label>
                    <input
                      type="email"
                      value={eventSettings.contactEmail}
                      onChange={(e) => setEventSettings({ ...eventSettings, contactEmail: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.7rem',
                        background: '#111827',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>
                </div>

                <div style={{ background: '#111827', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={eventSettings.leaderboardPublished}
                      onChange={(e) => setEventSettings({ ...eventSettings, leaderboardPublished: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--color-stark-gold)' }}
                    />
                    <div>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>ENABLE PUBLIC LEADERBOARD</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Permit attendees and visitors to view official rankings and judging scores.</div>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
                style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2rem' }}
              >
                {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                SAVE & PUBLISH SETTINGS TO DATABASE
              </button>
            </div>
          </form>
        )}

        {/* ============================================================== */}
        {/* TAB: PROBLEM CATEGORIES MANAGEMENT (PART 2)                    */}
        {/* ============================================================== */}
        {activeTab === 'problem_categories' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#fff', margin: 0 }}>
                  HACKATHON PROBLEM TRACK CATEGORIES
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
                  Manage the six official crisis tracks, themes, background scenarios, requirements, and display sequences.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenCategoryModal()}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}
              >
                <Plus size={16} />
                ADD TRACK CATEGORY
              </button>
            </div>

            {categories.length === 0 ? (
              <div style={{ background: '#111827', padding: '3rem', textAlign: 'center', borderRadius: '8px', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                No problem categories registered. Click "Add Track Category" to initialize official tracks.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {categories.map((cat) => {
                  const isPub = cat.is_published ?? cat.is_active ?? true;
                  return (
                    <div
                      key={cat.id || cat.slug}
                      style={{
                        background: 'rgba(28, 32, 38, 0.95)',
                        border: `1px solid ${isPub ? 'rgba(0, 191, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-stark-gold)', fontWeight: 600 }}>
                            TRACK 0{cat.number} // ORDER #{cat.sort_order ?? 0}
                          </span>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.68rem',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '4px',
                              background: isPub ? 'rgba(0, 255, 119, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                              color: isPub ? '#00ff77' : 'var(--text-muted)',
                              border: `1px solid ${isPub ? 'rgba(0, 255, 119, 0.3)' : 'rgba(255, 255, 255, 0.15)'}`,
                              fontWeight: 600,
                            }}
                          >
                            {isPub ? 'PUBLISHED' : 'UNPUBLISHED'}
                          </span>
                        </div>

                        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#fff', margin: '0 0 0.4rem 0' }}>
                          {cat.title}
                        </h4>

                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-arc-blue)', marginBottom: '0.6rem' }}>
                          THEME: {cat.theme}
                        </div>

                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: '1.5', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {cat.challenge || cat.background || cat.description || 'No description provided.'}
                        </p>
                      </div>

                      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            type="button"
                            onClick={() => handlePreviewItem('category', cat)}
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                            title="Preview how this appears to participants"
                          >
                            <Eye size={13} />
                            PREVIEW
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenCategoryModal(cat)}
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                            title="Edit Category Details"
                          >
                            <Edit2 size={13} />
                            EDIT
                          </button>
                        </div>

                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleCategoryPublish(cat)}
                            style={{
                              padding: '0.35rem 0.65rem',
                              fontSize: '0.75rem',
                              borderRadius: '4px',
                              background: isPub ? 'rgba(230, 36, 41, 0.15)' : 'rgba(0, 255, 119, 0.15)',
                              border: `1px solid ${isPub ? 'rgba(230, 36, 41, 0.4)' : 'rgba(0, 255, 119, 0.4)'}`,
                              color: isPub ? '#ffb4b7' : '#00ff77',
                              cursor: 'pointer',
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 600,
                            }}
                          >
                            {isPub ? 'UNPUBLISH' : 'PUBLISH'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePromptDeleteCategory(cat)}
                            style={{
                              padding: '0.35rem 0.55rem',
                              borderRadius: '4px',
                              background: 'rgba(230, 36, 41, 0.1)',
                              border: '1px solid rgba(230, 36, 41, 0.3)',
                              color: '#ffb4b7',
                              cursor: 'pointer',
                            }}
                            title="Delete category (safe dependency check)"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: PROBLEM STATEMENTS MANAGEMENT (PART 3)                    */}
        {/* ============================================================== */}
        {activeTab === 'problem_statements' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#fff', margin: 0 }}>
                  PROBLEM STATEMENTS REPOSITORY
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
                  Author and publish comprehensive challenge specifications, constraints, synthetic datasets, and evaluation criteria.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenStatementModal()}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}
              >
                <Plus size={16} />
                ADD PROBLEM STATEMENT
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div style={{
              background: '#111827',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '0.85rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '220px' }}>
                <Search size={16} color="var(--text-muted)" />
                <input
                  type="text"
                  value={statementSearch}
                  onChange={(e) => setStatementSearch(e.target.value)}
                  placeholder="Search problem statements by title or description..."
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Filter size={14} color="var(--color-stark-gold)" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-stark-gold)' }}>TRACK:</span>
                  <select
                    value={statementCategoryFilter}
                    onChange={(e) => setStatementCategoryFilter(e.target.value)}
                    style={{
                      padding: '0.4rem 0.6rem',
                      background: '#1A1F26',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '0.78rem',
                    }}
                  >
                    <option value="all">ALL TRACKS</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        TRACK 0{c.number}: {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-stark-gold)' }}>STATUS:</span>
                  <select
                    value={statementStatusFilter}
                    onChange={(e) => setStatementStatusFilter(e.target.value)}
                    style={{
                      padding: '0.4rem 0.6rem',
                      background: '#1A1F26',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '0.78rem',
                    }}
                  >
                    <option value="all">ALL STATUSES</option>
                    <option value="published">PUBLISHED ONLY</option>
                    <option value="draft">DRAFTS ONLY</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Statements Cards Grid */}
            {(() => {
              const filtered = statements.filter((s) => {
                const matchSearch = statementSearch.trim() === '' ||
                  s.title?.toLowerCase().includes(statementSearch.toLowerCase()) ||
                  s.description?.toLowerCase().includes(statementSearch.toLowerCase());

                const matchCat = statementCategoryFilter === 'all' || s.category_id === statementCategoryFilter;
                const matchStatus = statementStatusFilter === 'all' ||
                  (statementStatusFilter === 'published' && s.is_published) ||
                  (statementStatusFilter === 'draft' && !s.is_published);

                return matchSearch && matchCat && matchStatus;
              });

              if (filtered.length === 0) {
                return (
                  <div style={{ background: '#111827', padding: '3rem', textAlign: 'center', borderRadius: '8px', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    No problem statements found matching the selected criteria. Click "Add Problem Statement" to author one.
                  </div>
                );
              }

              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
                  {filtered.map((stmt) => {
                    const parentCat = categories.find((c) => c.id === stmt.category_id) || stmt.category || {};
                    const isPub = stmt.is_published;

                    return (
                      <div
                        key={stmt.id}
                        style={{
                          background: 'rgba(28, 32, 38, 0.95)',
                          border: `1px solid ${isPub ? 'rgba(0, 191, 255, 0.3)' : 'rgba(245, 182, 66, 0.25)'}`,
                          borderRadius: 'var(--radius-md)',
                          padding: '1.5rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '1rem',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-stark-gold)', fontWeight: 600 }}>
                              {parentCat.number ? `TRACK 0${parentCat.number}` : 'TRACK'} • {parentCat.theme || stmt.track_label || 'CHALLENGE'}
                            </span>
                            <span
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.68rem',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '4px',
                                background: isPub ? 'rgba(0, 255, 119, 0.15)' : 'rgba(245, 182, 66, 0.15)',
                                color: isPub ? '#00ff77' : 'var(--color-stark-gold)',
                                border: `1px solid ${isPub ? 'rgba(0, 255, 119, 0.3)' : 'rgba(245, 182, 66, 0.3)'}`,
                                fontWeight: 600,
                              }}
                            >
                              {isPub ? 'PUBLISHED' : 'DRAFT'}
                            </span>
                          </div>

                          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#fff', margin: '0 0 0.5rem 0' }}>
                            {stmt.title}
                          </h4>

                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: '1.5', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {stmt.description}
                          </p>

                          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                            {Array.isArray(stmt.requirements) && stmt.requirements.length > 0 && (
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-arc-blue)', background: 'rgba(0, 191, 255, 0.08)', padding: '0.15rem 0.45rem', borderRadius: '3px' }}>
                                {stmt.requirements.length} Requirements
                              </span>
                            )}
                            {stmt.constraints && (
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-muted-crimson)', background: 'rgba(230, 36, 41, 0.08)', padding: '0.15rem 0.45rem', borderRadius: '3px' }}>
                                Constraints Defined
                              </span>
                            )}
                            {stmt.reference_file_url && (
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#00ff77', background: 'rgba(0, 255, 119, 0.08)', padding: '0.15rem 0.45rem', borderRadius: '3px' }}>
                                Attachment Linked
                              </span>
                            )}
                          </div>
                        </div>

                        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                              type="button"
                              onClick={() => handlePreviewItem('statement', stmt)}
                              className="btn btn-secondary"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                              title="Preview problem statement specification"
                            >
                              <Eye size={13} />
                              PREVIEW
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenStatementModal(stmt)}
                              className="btn btn-secondary"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                              title="Edit Statement Details"
                            >
                              <Edit2 size={13} />
                              EDIT
                            </button>
                          </div>

                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                              type="button"
                              onClick={() => handleToggleStatementPublish(stmt)}
                              style={{
                                padding: '0.35rem 0.65rem',
                                fontSize: '0.75rem',
                                borderRadius: '4px',
                                background: isPub ? 'rgba(245, 182, 66, 0.15)' : 'rgba(0, 255, 119, 0.15)',
                                border: `1px solid ${isPub ? 'rgba(245, 182, 66, 0.4)' : 'rgba(0, 255, 119, 0.4)'}`,
                                color: isPub ? 'var(--color-stark-gold)' : '#00ff77',
                                cursor: 'pointer',
                                fontFamily: 'var(--font-mono)',
                                fontWeight: 600,
                              }}
                            >
                              {isPub ? 'SAVE DRAFT' : 'PUBLISH'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePromptDeleteStatement(stmt)}
                              style={{
                                padding: '0.35rem 0.55rem',
                                borderRadius: '4px',
                                background: 'rgba(230, 36, 41, 0.1)',
                                border: '1px solid rgba(230, 36, 41, 0.3)',
                                color: '#ffb4b7',
                                cursor: 'pointer',
                              }}
                              title="Safely delete statement"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}
        {activeTab === 'schedules' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#fff', margin: 0 }}>
                  TIMELINE SESSIONS & AGENDAS
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
                  Define Day 1 and Day 2 chronological workshops, keynotes, hacking sprints, and evaluations.
                </p>
              </div>
              <button
                onClick={() => handleOpenScheduleModal()}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}
              >
                <Plus size={16} />
                ADD SESSION
              </button>
            </div>

            {/* List by Day */}
            {[1, 2].map((dayNum) => {
              const dayItems = schedules.filter((s) => Number(s.day_number) === dayNum);
              return (
                <div
                  key={dayNum}
                  style={{
                    background: 'rgba(28, 32, 38, 0.95)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span
                      style={{
                        background: 'rgba(245, 182, 66, 0.2)',
                        border: '1px solid var(--color-stark-gold)',
                        color: 'var(--color-stark-gold)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      DAY 0{dayNum}
                    </span>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#fff', margin: 0 }}>
                      {dayNum === 1 ? 'DAY 1: OPENING & COMMENCEMENT' : 'DAY 2: SPRINT, JUDGING & VALEDICTORY'}
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                      ({dayItems.length} sessions)
                    </span>
                  </div>

                  {dayItems.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      No sessions listed for Day {dayNum}. Click "Add Session" above to create one.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {dayItems.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            background: '#111827',
                            border: item.is_highlight ? '1px solid var(--color-stark-gold)' : '1px solid var(--border-subtle)',
                            borderRadius: '6px',
                            padding: '1rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '1rem',
                          }}
                        >
                          <div style={{ flex: '1 1 300px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                              <span
                                style={{
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '0.72rem',
                                  color: 'var(--color-arc-blue)',
                                  background: 'rgba(0, 191, 255, 0.1)',
                                  padding: '0.15rem 0.45rem',
                                  borderRadius: '3px',
                                }}
                              >
                                {item.start_time} - {item.end_time}
                              </span>
                              {item.badge && (
                                <span
                                  style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.68rem',
                                    color: 'var(--color-stark-gold)',
                                    background: 'rgba(245, 182, 66, 0.15)',
                                    padding: '0.15rem 0.4rem',
                                    borderRadius: '3px',
                                  }}
                                >
                                  {item.badge}
                                </span>
                              )}
                              {item.is_highlight && (
                                <span style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 600 }}>KEY HIGHLIGHT</span>
                              )}
                            </div>

                            <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>{item.title}</div>
                            {item.description && (
                              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                                {item.description}
                              </div>
                            )}
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', fontSize: '0.75rem', color: '#94A3B8' }}>
                              {item.location && <span>📍 {item.location}</span>}
                              {item.speaker && <span>🎙️ {item.speaker}</span>}
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                              onClick={() => handleOpenScheduleModal(item)}
                              style={{
                                padding: '0.35rem 0.65rem',
                                background: 'rgba(0, 191, 255, 0.15)',
                                border: '1px solid var(--color-arc-blue)',
                                color: 'var(--color-arc-blue)',
                                borderRadius: '4px',
                                cursor: 'pointer',
                              }}
                              title="Edit Session"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteSchedule(item.id, item.title)}
                              style={{
                                padding: '0.35rem 0.65rem',
                                background: 'rgba(143, 48, 53, 0.2)',
                                border: '1px solid var(--color-muted-crimson)',
                                color: '#ffb4b7',
                                borderRadius: '4px',
                                cursor: 'pointer',
                              }}
                              title="Delete Session"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: ANNOUNCEMENTS                                            */}
        {/* ============================================================== */}
        {activeTab === 'announcements' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#fff', margin: 0 }}>
                  ANNOUNCEMENTS & NOTICES
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
                  Push urgent alerts, schedule changes, and instructions to participants across the platform.
                </p>
              </div>
              <button
                onClick={() => handleOpenAnnouncementModal()}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}
              >
                <Plus size={16} />
                NEW BROADCAST
              </button>
            </div>

            <div
              style={{
                background: 'rgba(28, 32, 38, 0.95)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
              }}
            >
              {announcements.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Bell size={32} style={{ margin: '0 auto 0.5rem auto', display: 'block', opacity: 0.3 }} />
                  No announcements recorded yet. Create one to inform participants.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {announcements.map((ann) => (
                    <div
                      key={ann.id}
                      style={{
                        background: '#111827',
                        border: ann.priority === 'urgent' ? '1px solid var(--color-muted-crimson)' : '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        padding: '1.25rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '1rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div style={{ flex: '1 1 300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              padding: '0.15rem 0.45rem',
                              borderRadius: '3px',
                              background: ann.priority === 'urgent' ? 'rgba(143, 48, 53, 0.3)' : 'rgba(0, 191, 255, 0.15)',
                              color: ann.priority === 'urgent' ? '#ffb4b7' : 'var(--color-arc-blue)',
                              border: `1px solid ${ann.priority === 'urgent' ? 'var(--color-muted-crimson)' : 'var(--color-arc-blue)'}`,
                            }}
                          >
                            {(ann.priority || 'NORMAL').toUpperCase()}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: ann.published ? '#34D399' : 'var(--text-muted)' }}>
                            {ann.published ? '● PUBLISHED LIVE' : '○ DRAFT'}
                          </span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                            {ann.created_at ? new Date(ann.created_at).toLocaleDateString('en-IN') : ''}
                          </span>
                        </div>

                        <div style={{ fontWeight: 600, color: '#fff', fontSize: '1.05rem', marginBottom: '0.35rem' }}>
                          {ann.title}
                        </div>
                        <p style={{ color: '#CBD5E1', fontSize: '0.86rem', lineHeight: 1.5, margin: 0 }}>
                          {ann.message}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => handleOpenAnnouncementModal(ann)}
                          style={{
                            padding: '0.35rem 0.65rem',
                            background: 'rgba(0, 191, 255, 0.15)',
                            border: '1px solid var(--color-arc-blue)',
                            color: 'var(--color-arc-blue)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteAnnouncement(ann.id, ann.title)}
                          style={{
                            padding: '0.35rem 0.65rem',
                            background: 'rgba(143, 48, 53, 0.2)',
                            border: '1px solid var(--color-muted-crimson)',
                            color: '#ffb4b7',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: FAQs                                                     */}
        {/* ============================================================== */}
        {activeTab === 'faqs' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#fff', margin: 0 }}>
                  EVENT RULES & FREQUENTLY ASKED QUESTIONS
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
                  Keep rules, accommodation, transport, eligibility, and submission requirements up to date.
                </p>
              </div>
              <button
                onClick={() => handleOpenFaqModal()}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}
              >
                <Plus size={16} />
                ADD FAQ
              </button>
            </div>

            <div
              style={{
                background: 'rgba(28, 32, 38, 0.95)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
              }}
            >
              {faqs.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No FAQs listed. Click "Add FAQ" to add instructions.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {faqs.map((faq) => (
                    <div
                      key={faq.id}
                      style={{
                        background: '#111827',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        padding: '1.25rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '1rem',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.7rem',
                              color: 'var(--color-stark-gold)',
                              background: 'rgba(245, 182, 66, 0.1)',
                              padding: '0.1rem 0.45rem',
                              borderRadius: '3px',
                            }}
                          >
                            {(faq.category || 'GENERAL').toUpperCase()}
                          </span>
                        </div>
                        <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.98rem', marginBottom: '0.35rem' }}>
                          {faq.question}
                        </div>
                        <p style={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                          {faq.answer}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => handleOpenFaqModal(faq)}
                          style={{
                            padding: '0.35rem 0.65rem',
                            background: 'rgba(0, 191, 255, 0.15)',
                            border: '1px solid var(--color-arc-blue)',
                            color: 'var(--color-arc-blue)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteFaq(faq.id)}
                          style={{
                            padding: '0.35rem 0.65rem',
                            background: 'rgba(143, 48, 53, 0.2)',
                            border: '1px solid var(--color-muted-crimson)',
                            color: '#ffb4b7',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: COMPETITIONS                                             */}
        {/* ============================================================== */}
        {activeTab === 'competitions' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#fff', margin: 0 }}>
                COMPETITION TRACKS & DESCRIPTIONS
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
                Review and update track guidelines, team limits, and competition briefs.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem' }}>
              {competitions.map((comp) => (
                <div
                  key={comp.id}
                  style={{
                    background: 'rgba(28, 32, 38, 0.95)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span className="chapter-badge" style={{ margin: 0 }}>
                        {comp.slug?.toUpperCase() || 'TRACK'}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-arc-blue)' }}>
                        TEAM SIZE: {comp.min_team_size || 1} - {comp.max_team_size || 4}
                      </span>
                    </div>

                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: '#fff', margin: '0.3rem 0 0.5rem 0' }}>
                      {comp.name}
                    </h4>

                    <p style={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: 1.55 }}>
                      {comp.description || 'No description provided.'}
                    </p>
                  </div>

                  <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '1rem' }}>
                    <button
                      onClick={() => handleOpenCompModal(comp)}
                      className="btn btn-secondary"
                      style={{ width: '100%', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                    >
                      <Edit2 size={14} />
                      EDIT COMPETITION BRIEF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SCHEDULE MODAL                                                  */}
        {/* ============================================================== */}
        {scheduleModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              backdropFilter: 'blur(6px)',
            }}
          >
            <div
              style={{
                background: '#1A1F26',
                border: '1px solid var(--color-arc-blue)',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '600px',
                padding: '1.75rem',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#fff', margin: '0 0 1.25rem 0' }}>
                {editingSchedule ? 'EDIT SCHEDULE SESSION' : 'ADD SCHEDULE SESSION'}
              </h3>

              <form onSubmit={handleSaveSchedule}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                      DAY NUMBER:
                    </label>
                    <select
                      value={scheduleForm.day_number}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, day_number: Number(e.target.value) })}
                      style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                    >
                      <option value={1}>DAY 1 (OPENING)</option>
                      <option value={2}>DAY 2 (FINALE)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                      BADGE / CATEGORY:
                    </label>
                    <input
                      type="text"
                      value={scheduleForm.badge}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, badge: e.target.value })}
                      placeholder="e.g. STAGE, WORKSHOP, CEREMONY"
                      style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                    SESSION TITLE:
                  </label>
                  <input
                    type="text"
                    required
                    value={scheduleForm.title}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                    placeholder="e.g. Keynote Address & Hackathon Kickoff"
                    style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                      START TIME:
                    </label>
                    <input
                      type="text"
                      value={scheduleForm.start_time}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, start_time: e.target.value })}
                      placeholder="09:00 AM"
                      style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                      END TIME:
                    </label>
                    <input
                      type="text"
                      value={scheduleForm.end_time}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, end_time: e.target.value })}
                      placeholder="10:30 AM"
                      style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                      LOCATION / VENUE:
                    </label>
                    <input
                      type="text"
                      value={scheduleForm.location}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
                      placeholder="Auditorium, REC Banda"
                      style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                      SPEAKER / MODERATOR:
                    </label>
                    <input
                      type="text"
                      value={scheduleForm.speaker}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, speaker: e.target.value })}
                      placeholder="Guest Speaker / Faculty"
                      style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                    DESCRIPTION:
                  </label>
                  <textarea
                    rows={3}
                    value={scheduleForm.description}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, description: e.target.value })}
                    placeholder="Details about session deliverables, requirements, or agenda..."
                    style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                  />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={scheduleForm.is_highlight}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, is_highlight: e.target.checked })}
                  />
                  <span style={{ fontSize: '0.85rem', color: '#fff' }}>Highlight session on public timeline</span>
                </label>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setScheduleModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-primary"
                  >
                    {saving ? 'SAVING...' : 'COMMIT SESSION'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ANNOUNCEMENT MODAL                                              */}
        {/* ============================================================== */}
        {announcementModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              backdropFilter: 'blur(6px)',
            }}
          >
            <div
              style={{
                background: '#1A1F26',
                border: '1px solid var(--color-arc-blue)',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '550px',
                padding: '1.75rem',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#fff', margin: '0 0 1.25rem 0' }}>
                {editingAnnouncement ? 'EDIT BROADCAST' : 'DISPATCH ANNOUNCEMENT'}
              </h3>

              <form onSubmit={handleSaveAnnouncement}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                    BROADCAST TITLE:
                  </label>
                  <input
                    type="text"
                    required
                    value={announcementForm.title}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                    placeholder="e.g. Mentor Round 1 Begins at 14:00"
                    style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                      PRIORITY LEVEL:
                    </label>
                    <select
                      value={announcementForm.priority}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, priority: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                    >
                      <option value="normal">NORMAL</option>
                      <option value="high">HIGH</option>
                      <option value="urgent">URGENT (ALERT BANNER)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                      STATUS:
                    </label>
                    <select
                      value={announcementForm.published ? 'true' : 'false'}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, published: e.target.value === 'true' })}
                      style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                    >
                      <option value="true">PUBLISHED (LIVE)</option>
                      <option value="false">DRAFT (HIDDEN)</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                    BROADCAST MESSAGE:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={announcementForm.message}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                    placeholder="Detailed announcement or instructions for participants..."
                    style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setAnnouncementModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-primary"
                  >
                    {saving ? 'POSTING...' : 'POST ANNOUNCEMENT'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* FAQ MODAL                                                       */}
        {/* ============================================================== */}
        {faqModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              backdropFilter: 'blur(6px)',
            }}
          >
            <div
              style={{
                background: '#1A1F26',
                border: '1px solid var(--color-arc-blue)',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '550px',
                padding: '1.75rem',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#fff', margin: '0 0 1.25rem 0' }}>
                {editingFaq ? 'EDIT FAQ' : 'NEW FAQ'}
              </h3>

              <form onSubmit={handleSaveFaq}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                    CATEGORY:
                  </label>
                  <select
                    value={faqForm.category}
                    onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                  >
                    <option value="general">GENERAL / EVENT</option>
                    <option value="registration">REGISTRATION & ELIGIBILITY</option>
                    <option value="hackathon">HACKATHON GUIDELINES</option>
                    <option value="logistics">ACCOMMODATION & TRAVEL</option>
                  </select>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                    QUESTION:
                  </label>
                  <input
                    type="text"
                    required
                    value={faqForm.question}
                    onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                    placeholder="e.g. Will food and accommodation be provided at REC Banda?"
                    style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                    ANSWER:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={faqForm.answer}
                    onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                    placeholder="Clear and actionable answer for prospective delegates..."
                    style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setFaqModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-primary"
                  >
                    {saving ? 'SAVING...' : 'SAVE FAQ'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* COMPETITION MODAL                                               */}
        {/* ============================================================== */}
        {compModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              backdropFilter: 'blur(6px)',
            }}
          >
            <div
              style={{
                background: '#1A1F26',
                border: '1px solid var(--color-arc-blue)',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '550px',
                padding: '1.75rem',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#fff', margin: '0 0 1.25rem 0' }}>
                EDIT COMPETITION: {editingComp?.name}
              </h3>

              <form onSubmit={handleSaveComp}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                    TRACK NAME:
                  </label>
                  <input
                    type="text"
                    required
                    value={compForm.name}
                    onChange={(e) => setCompForm({ ...compForm, name: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                      MIN TEAM SIZE:
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={6}
                      value={compForm.min_team_size}
                      onChange={(e) => setCompForm({ ...compForm, min_team_size: Number(e.target.value) })}
                      style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                      MAX TEAM SIZE:
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={6}
                      value={compForm.max_team_size}
                      onChange={(e) => setCompForm({ ...compForm, max_team_size: Number(e.target.value) })}
                      style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                    COMPETITION BRIEF & DESCRIPTION:
                  </label>
                  <textarea
                    rows={4}
                    value={compForm.description}
                    onChange={(e) => setCompForm({ ...compForm, description: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setCompModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-primary"
                  >
                    {saving ? 'UPDATING...' : 'COMMIT CHANGES'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PROBLEM CATEGORY MODAL (PART 2)                                 */}
        {/* ============================================================== */}
        {categoryModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              backdropFilter: 'blur(6px)',
            }}
          >
            <div
              style={{
                background: '#1A1F26',
                border: '1px solid var(--color-arc-blue)',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '750px',
                padding: '1.75rem',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={20} color="var(--color-arc-blue)" />
                  {editingCategory ? 'EDIT PROBLEM CATEGORY TRACK' : 'ADD NEW PROBLEM CATEGORY TRACK'}
                </h3>
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveCategory}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                      TRACK NUMBER (e.g. 01):
                    </label>
                    <input
                      type="text"
                      required
                      value={categoryForm.number}
                      onChange={(e) => setCategoryForm({ ...categoryForm, number: e.target.value })}
                      placeholder="01"
                      style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                      DISPLAY SORT ORDER:
                    </label>
                    <input
                      type="number"
                      value={categoryForm.sort_order}
                      onChange={(e) => setCategoryForm({ ...categoryForm, sort_order: Number(e.target.value) })}
                      style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                      TRACK TITLE / NAME:
                    </label>
                    <input
                      type="text"
                      required
                      value={categoryForm.title}
                      onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })}
                      placeholder="e.g. AI & Machine Learning"
                      style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                      THEME / TAGLINE:
                    </label>
                    <input
                      type="text"
                      value={categoryForm.theme}
                      onChange={(e) => setCategoryForm({ ...categoryForm, theme: e.target.value })}
                      placeholder="e.g. INTELLIGENT SYSTEMS & AUTONOMOUS AGENTS"
                      style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                    URL SLUG:
                  </label>
                  <input
                    type="text"
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                    placeholder="e.g. ai-ml"
                    style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                    PLACEHOLDER / BRIEFING NOTICE:
                  </label>
                  <input
                    type="text"
                    value={categoryForm.placeholder_notice}
                    onChange={(e) => setCategoryForm({ ...categoryForm, placeholder_notice: e.target.value })}
                    placeholder="OFFICIAL PROBLEM STATEMENT TO BE UNVEILED AT BRIEFING"
                    style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                    BACKGROUND & CONTEXT:
                  </label>
                  <textarea
                    rows={3}
                    value={categoryForm.background}
                    onChange={(e) => setCategoryForm({ ...categoryForm, background: e.target.value })}
                    placeholder="Historical context, real-world relevance, industry backdrop..."
                    style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                    CORE CHALLENGE DESCRIPTION:
                  </label>
                  <textarea
                    rows={3}
                    value={categoryForm.challenge}
                    onChange={(e) => setCategoryForm({ ...categoryForm, challenge: e.target.value })}
                    placeholder="The primary problem or operational bottleneck participants must address..."
                    style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                    REQUIREMENTS (ONE PER LINE):
                  </label>
                  <textarea
                    rows={4}
                    value={categoryForm.requirements}
                    onChange={(e) => setCategoryForm({ ...categoryForm, requirements: e.target.value })}
                    placeholder="Requirement 1&#10;Requirement 2&#10;Requirement 3"
                    style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                      EXPECTED OUTCOME:
                    </label>
                    <textarea
                      rows={2}
                      value={categoryForm.expected_outcome}
                      onChange={(e) => setCategoryForm({ ...categoryForm, expected_outcome: e.target.value })}
                      placeholder="Functional, production-ready solution..."
                      style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                      TECHNICAL DIRECTIONS:
                    </label>
                    <textarea
                      rows={2}
                      value={categoryForm.technical_directions}
                      onChange={(e) => setCategoryForm({ ...categoryForm, technical_directions: e.target.value })}
                      placeholder="Recommended architectures, libraries..."
                      style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                  <input
                    type="checkbox"
                    id="cat_published"
                    checked={categoryForm.is_published}
                    onChange={(e) => setCategoryForm({ ...categoryForm, is_published: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="cat_published" style={{ color: '#fff', fontSize: '0.85rem', cursor: 'pointer' }}>
                    Publish Track on Public Problems Page Immediately
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setCategoryModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-primary"
                  >
                    {saving ? 'SAVING...' : editingCategory ? 'UPDATE CATEGORY' : 'CREATE CATEGORY'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PROBLEM STATEMENT MODAL (PART 3)                                */}
        {/* ============================================================== */}
        {statementModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              backdropFilter: 'blur(6px)',
            }}
          >
            <div
              style={{
                background: '#1A1F26',
                border: '1px solid var(--color-arc-blue)',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '800px',
                padding: '1.75rem',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Target size={20} color="var(--color-arc-blue)" />
                  {editingStatement ? 'EDIT PROBLEM STATEMENT SPECIFICATION' : 'ADD NEW PROBLEM STATEMENT'}
                </h3>
                <button
                  type="button"
                  onClick={() => setStatementModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                      ASSIGNED TRACK / CATEGORY:
                    </label>
                    <select
                      value={statementForm.category_id}
                      onChange={(e) => setStatementForm({ ...statementForm, category_id: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          [{c.number || '00'}] {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                      BADGE / TRACK LABEL:
                    </label>
                    <input
                      type="text"
                      value={statementForm.track_label}
                      onChange={(e) => setStatementForm({ ...statementForm, track_label: e.target.value })}
                      placeholder="e.g. CORE MISSION or ADVANCED"
                      style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                      SORT ORDER:
                    </label>
                    <input
                      type="number"
                      value={statementForm.sort_order}
                      onChange={(e) => setStatementForm({ ...statementForm, sort_order: Number(e.target.value) })}
                      style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                    PROBLEM STATEMENT TITLE:
                  </label>
                  <input
                    type="text"
                    required
                    value={statementForm.title}
                    onChange={(e) => setStatementForm({ ...statementForm, title: e.target.value })}
                    placeholder="e.g. Multi-Modal Emergency Dispatch Routing Engine"
                    style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                    PROBLEM DESCRIPTION & OVERVIEW:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={statementForm.description}
                    onChange={(e) => setStatementForm({ ...statementForm, description: e.target.value })}
                    placeholder="Detailed explanation of the challenge, target audience, and operational goals..."
                    style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                    TECHNICAL REQUIREMENTS (ONE PER LINE):
                  </label>
                  <textarea
                    rows={4}
                    value={statementForm.requirements}
                    onChange={(e) => setStatementForm({ ...statementForm, requirements: e.target.value })}
                    placeholder="Real-time geo-clustering within <500ms&#10;Deterministic state synchronization&#10;OAuth 2.0 authentication"
                    style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                      CONSTRAINTS & LIMITATIONS:
                    </label>
                    <textarea
                      rows={3}
                      value={statementForm.constraints}
                      onChange={(e) => setStatementForm({ ...statementForm, constraints: e.target.value })}
                      placeholder="Memory limits, disallowed libraries, offline capabilities..."
                      style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                      INPUT / OUTPUT SPECIFICATIONS:
                    </label>
                    <textarea
                      rows={3}
                      value={statementForm.input_output_specs}
                      onChange={(e) => setStatementForm({ ...statementForm, input_output_specs: e.target.value })}
                      placeholder="Input JSON schemas, output formats, REST endpoints..."
                      style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                    EXAMPLES & TEST SCENARIOS:
                  </label>
                  <textarea
                    rows={3}
                    value={statementForm.examples}
                    onChange={(e) => setStatementForm({ ...statementForm, examples: e.target.value })}
                    placeholder="Sample input/output or mock incident report payload..."
                    style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-stark-gold)', marginBottom: '0.3rem' }}>
                    REFERENCE ATTACHMENT / REPO URL:
                  </label>
                  <input
                    type="url"
                    value={statementForm.reference_file_url}
                    onChange={(e) => setStatementForm({ ...statementForm, reference_file_url: e.target.value })}
                    placeholder="https://github.com/recbanda/hackfest-starter or cloud storage link"
                    style={{ width: '100%', padding: '0.6rem', background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setStatementModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    CANCEL
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={(e) => handleSaveStatement(e, true)}
                    style={{
                      padding: '0.6rem 1.2rem',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid var(--border-medium)',
                      color: '#E2E8F0',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    SAVE AS DRAFT
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={(e) => handleSaveStatement(e, false)}
                    className="btn btn-primary"
                  >
                    {saving ? 'SAVING...' : 'PUBLISH LIVE'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SAFE DELETION CONFIRMATION MODAL (PART 2 & 3)                    */}
        {/* ============================================================== */}
        {deleteConfirmOpen && deleteTarget && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              backdropFilter: 'blur(6px)',
            }}
          >
            <div
              style={{
                background: '#1A1F26',
                border: deleteTarget.canDelete ? '1px solid var(--color-muted-crimson)' : '1px solid var(--color-stark-gold)',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '520px',
                padding: '1.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <ShieldAlert size={28} color={deleteTarget.canDelete ? '#ef4444' : '#f59e0b'} />
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: '#fff', margin: 0 }}>
                    {deleteTarget.canDelete ? 'CONFIRM SAFE DELETION' : 'DELETION BLOCKED // DEPENDENCIES DETECTED'}
                  </h3>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#94A3B8' }}>
                    TARGET: {deleteTarget.type.toUpperCase()} // "{deleteTarget.item?.title}"
                  </div>
                </div>
              </div>

              {!deleteTarget.canDelete ? (
                <div>
                  <div
                    style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      borderRadius: '6px',
                      padding: '1rem',
                      color: '#FDE68A',
                      fontSize: '0.85rem',
                      lineHeight: 1.5,
                      marginBottom: '1.25rem',
                    }}
                  >
                    <strong>Referential Integrity Protection:</strong>
                    <p style={{ margin: '0.35rem 0 0 0' }}>{deleteTarget.message}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmOpen(false)}
                      className="btn btn-secondary"
                    >
                      ACKNOWLEDGE & CLOSE
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ color: '#E2E8F0', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {deleteTarget.message}
                    <br />
                    <span style={{ color: '#ef4444', fontWeight: 600 }}>This record will be permanently purged from the database.</span>
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmOpen(false)}
                      className="btn btn-secondary"
                    >
                      CANCEL
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={handleExecuteDelete}
                      style={{
                        padding: '0.6rem 1.25rem',
                        background: '#dc2626',
                        border: '1px solid #ef4444',
                        color: '#fff',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {saving ? 'DELETING...' : 'CONFIRM PURGE'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PUBLIC PREVIEW MODAL (PART 2 & 3)                               */}
        {/* ============================================================== */}
        {previewModalOpen && previewProblem && (
          <ProblemDetailModal
            problem={previewProblem}
            onClose={() => setPreviewModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

