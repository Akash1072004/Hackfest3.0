import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { eventService } from '../../services/eventService';
import AdminNav from '../../components/admin/AdminNav';
import { Users, Trophy, UploadCloud, Scale, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    participantsCount: 0,
    teamsCount: 0,
    registrationsCount: 0,
    submissionsCount: 0,
    evaluationsCount: 0,
  });

  const [settings, setSettings] = useState({
    liveModeStatus: 'REGISTRATION OPEN',
    leaderboardPublished: false,
  });

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [msg, setMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, cfg] = await Promise.all([
        adminService.getStats(),
        eventService.getSettings(),
      ]);
      setStats(s);
      setSettings({
        liveModeStatus: cfg.liveModeStatus || 'REGISTRATION OPEN',
        leaderboardPublished: cfg.leaderboardPublished || false,
      });
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateMode = async (newMode) => {
    setSavingSettings(true);
    setMsg('');
    try {
      await adminService.updateEventSettings({ live_mode_status: newMode });
      setSettings((prev) => ({ ...prev, liveModeStatus: newMode }));
      setMsg(`System state shifted to: ${newMode}`);
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleToggleLeaderboard = async () => {
    setSavingSettings(true);
    try {
      const next = !settings.leaderboardPublished;
      await adminService.updateEventSettings({ leaderboard_published: next });
      setSettings((prev) => ({ ...prev, leaderboardPublished: next }));
    } catch (err) {
      alert(err.message || 'Failed to toggle leaderboard');
    } finally {
      setSavingSettings(false);
    }
  };

  const modes = ['REGISTRATION OPEN', 'EVENT LIVE', 'SUBMISSIONS OPEN', 'JUDGING', 'RESULTS'];

  return (
    <div style={{ paddingTop: 'calc(var(--nav-height) + 1.5rem)', paddingBottom: '6rem' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        <AdminNav />

        {msg && (
          <div style={{ background: 'rgba(185, 133, 69, 0.15)', border: '1px solid var(--border-accent-amber)', borderRadius: 'var(--radius-sm)', padding: '0.8rem 1rem', color: 'var(--color-warm-amber)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            {msg}
          </div>
        )}

        {/* Global Event Live Mode Controller */}
        <div style={{ background: 'rgba(37, 42, 49, 0.85)', border: '1px solid var(--border-accent-crimson)', borderRadius: 'var(--radius-md)', padding: '1.8rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
            <div>
              <span className="chapter-badge" style={{ margin: '0 0 0.3rem 0' }}>SYSTEM PROTOCOL STATE</span>
              <h3 className="heading-display" style={{ fontSize: '1.4rem' }}>
                CURRENT EVENT PHASE: <span style={{ color: 'var(--color-warm-amber)' }}>{settings.liveModeStatus}</span>
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--color-soft-gray)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.leaderboardPublished}
                  onChange={handleToggleLeaderboard}
                  disabled={savingSettings}
                />
                <span>PUBLIC LEADERBOARD LIVE</span>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {modes.map((m) => (
              <button
                key={m}
                onClick={() => handleUpdateMode(m)}
                disabled={savingSettings}
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  border: settings.liveModeStatus === m ? '1px solid var(--color-warm-amber)' : '1px solid var(--border-subtle)',
                  background: settings.liveModeStatus === m ? 'rgba(185, 133, 69, 0.25)' : '#111827',
                  color: settings.liveModeStatus === m ? 'var(--color-warm-amber)' : 'var(--color-soft-gray)',
                  transition: 'var(--transition-fast)',
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* System Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
          <div style={{ background: 'rgba(37, 42, 49, 0.75)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-soft-gray)' }}>TOTAL ENLISTED BUILDERS</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--color-warm-off-white)', margin: '0.4rem 0' }}>
              {stats.participantsCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Registered accounts</div>
          </div>

          <div style={{ background: 'rgba(37, 42, 49, 0.75)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-soft-gray)' }}>TACTICAL SQUADS</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--color-steel-blue)', margin: '0.4rem 0' }}>
              {stats.teamsCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Created teams</div>
          </div>

          <div style={{ background: 'rgba(37, 42, 49, 0.75)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-soft-gray)' }}>ARENA PASSES</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--color-warm-amber)', margin: '0.4rem 0' }}>
              {stats.registrationsCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Active registrations</div>
          </div>

          <div style={{ background: 'rgba(37, 42, 49, 0.75)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-soft-gray)' }}>REPOSITORIES DEPLOYED</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--color-muted-crimson)', margin: '0.4rem 0' }}>
              {stats.submissionsCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Project submissions</div>
          </div>

          <div style={{ background: 'rgba(37, 42, 49, 0.75)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-soft-gray)' }}>JURY VERDICTS</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: '#ffb4b7', margin: '0.4rem 0' }}>
              {stats.evaluationsCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Scores entered</div>
          </div>
        </div>
      </div>
    </div>
  );
}
