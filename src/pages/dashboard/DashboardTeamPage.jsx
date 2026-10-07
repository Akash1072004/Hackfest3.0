import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardNav from '../../components/dashboard/DashboardNav';
import { teamService } from '../../services/teamService';
import { eventService } from '../../services/eventService';
import { Users, Copy, Check, Plus, LogIn, AlertCircle, Loader2, ShieldCheck, UserMinus } from 'lucide-react';
import { competitions } from '../../data/eventData';

export default function DashboardTeamPage() {
  const { user, isConfigured } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal / form states
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newCompId, setNewCompId] = useState('hackathon');
  const [joinCode, setJoinCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadTeams = async () => {
    if (!user) return;
    try {
      const data = await teamService.getUserTeams(user.id);
      setTeams(data);
    } catch (err) {
      console.error('Failed to load teams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, [user]);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setActionLoading(true);

    try {
      await teamService.createTeam({
        name: newTeamName.trim(),
        competitionId: newCompId,
        userId: user.id,
      });
      setSuccess(`Team "${newTeamName}" created successfully! Share your invite code.`);
      setNewTeamName('');
      setShowCreate(false);
      await loadTeams();
    } catch (err) {
      setError(err.message || 'Failed to create team.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setActionLoading(true);

    try {
      const res = await teamService.joinTeam({
        code: joinCode.trim(),
        userId: user.id,
      });
      setSuccess(`Joined team "${res.name}" successfully!`);
      setJoinCode('');
      setShowJoin(false);
      await loadTeams();
    } catch (err) {
      setError(err.message || 'Failed to join team.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveTeam = async (teamId) => {
    if (!window.confirm('Are you sure you want to withdraw from this team?')) return;
    try {
      await teamService.leaveTeam({ teamId, userId: user.id });
      await loadTeams();
    } catch (err) {
      alert(err.message || 'Failed to leave team.');
    }
  };

  return (
    <div style={{ paddingTop: 'calc(var(--nav-height) + 1.5rem)', paddingBottom: '6rem' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        <DashboardNav />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <span className="chapter-badge">TACTICAL SQUAD</span>
            <h2 className="heading-display" style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>
              TEAM FORMATION & ROSTER
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Collaborate in teams of 2 to 4 for Hackathon, or 1 to 3 for Ideathon.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button
              onClick={() => { setShowCreate(true); setShowJoin(false); setError(''); }}
              className="btn btn-primary"
              style={{ padding: '0.6rem 1.1rem', fontSize: '0.82rem' }}
            >
              <Plus size={16} />
              CREATE SQUAD
            </button>
            <button
              onClick={() => { setShowJoin(true); setShowCreate(false); setError(''); }}
              className="btn btn-secondary"
              style={{ padding: '0.6rem 1.1rem', fontSize: '0.82rem' }}
            >
              <LogIn size={16} />
              JOIN BY CODE
            </button>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(143, 48, 53, 0.2)', border: '1px solid var(--border-accent-crimson)', borderRadius: 'var(--radius-sm)', padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ffb4b7', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{ background: 'rgba(185, 133, 69, 0.15)', border: '1px solid var(--border-accent-amber)', borderRadius: 'var(--radius-sm)', padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-warm-amber)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            <ShieldCheck size={18} />
            <span>{success}</span>
          </div>
        )}

        {/* Create Team Form Modal */}
        {showCreate && (
          <div style={{ background: 'rgba(37, 42, 49, 0.95)', border: '1px solid var(--border-accent-amber)', borderRadius: 'var(--radius-md)', padding: '1.8rem', marginBottom: '2rem' }}>
            <h3 className="heading-display" style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
              REGISTER NEW SQUAD
            </h3>
            <form onSubmit={handleCreateTeam} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-soft-gray)', marginBottom: '0.35rem' }}>
                  SQUAD / TEAM NAME *
                </label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="e.g. Apex Rebuilders"
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem', background: '#111827', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', color: 'var(--color-warm-off-white)', fontSize: '0.92rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-soft-gray)', marginBottom: '0.35rem' }}>
                  ARENA SECTOR *
                </label>
                <select
                  value={newCompId}
                  onChange={(e) => setNewCompId(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', background: '#111827', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', color: 'var(--color-warm-off-white)', fontSize: '0.92rem' }}
                >
                  <option value="hackathon">Flagship Hackathon (Team 2-4)</option>
                  <option value="ideathon">Ideathon (Team 1-3)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                  {actionLoading ? <Loader2 size={16} className="animate-spin" /> : 'GENERATE SQUAD'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Join Team Form Modal */}
        {showJoin && (
          <div style={{ background: 'rgba(37, 42, 49, 0.95)', border: '1px solid var(--border-accent-steel)', borderRadius: 'var(--radius-md)', padding: '1.8rem', marginBottom: '2rem' }}>
            <h3 className="heading-display" style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
              JOIN EXISTING SQUAD
            </h3>
            <form onSubmit={handleJoinTeam} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-soft-gray)', marginBottom: '0.35rem' }}>
                  ENTER INVITE CODE *
                </label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="e.g. HF3-XXXXXX"
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem', background: '#111827', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', color: 'var(--color-warm-off-white)', fontSize: '0.92rem', textTransform: 'uppercase' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                  {actionLoading ? <Loader2 size={16} className="animate-spin" /> : 'VERIFY & JOIN'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowJoin(false)}>
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Teams List */}
        {teams.length === 0 ? (
          <div style={{ background: 'rgba(37, 42, 49, 0.6)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '3rem 1.5rem', textAlign: 'center' }}>
            <Users size={48} color="var(--color-steel-blue)" style={{ margin: '0 auto 1.2rem auto' }} />
            <h3 className="heading-display" style={{ fontSize: '1.4rem', marginBottom: '0.6rem' }}>
              NO TEAMS AFFILIATED YET
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem auto', lineHeight: '1.6' }}>
              You are currently operating solo. Form a squad or request a team code from your teammates to collaborate.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {teams.map((tm) => (
              <div key={tm.id} style={{ background: 'rgba(37, 42, 49, 0.75)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '1.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div>
                    <span className="chapter-badge" style={{ margin: '0 0 0.4rem 0' }}>
                      {tm.competition?.name || 'HACKATHON'}
                    </span>
                    <h3 className="heading-display" style={{ fontSize: '1.5rem', color: 'var(--color-warm-off-white)' }}>
                      {tm.name}
                    </h3>
                  </div>

                  {/* Team Code Pill */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#111827', border: '1px solid var(--border-accent-amber)', borderRadius: 'var(--radius-sm)', padding: '0.4rem 0.8rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: 'var(--color-warm-amber)', fontWeight: 700 }}>
                      {tm.code}
                    </span>
                    <button
                      onClick={() => handleCopyCode(tm.code)}
                      style={{ background: 'none', border: 'none', color: 'var(--color-soft-gray)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      title="Copy squad code"
                    >
                      {copiedCode === tm.code ? <Check size={16} color="var(--color-warm-amber)" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                {/* Team Members List */}
                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-soft-gray)', marginBottom: '0.8rem', letterSpacing: '0.08em' }}>
                  ROSTER MEMBERS ({tm.members?.length || 1} / {tm.competition?.max_team_size || 4})
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.8rem', marginBottom: '1.4rem' }}>
                  {(tm.members || []).map((m) => (
                    <div key={m.id} style={{ background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--color-warm-off-white)' }}>
                          {m.profile?.full_name || 'Member'}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {m.profile?.college || 'REC Banda'}
                        </div>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: m.role === 'leader' ? 'var(--color-warm-amber)' : 'var(--color-soft-gray)' }}>
                        {m.role?.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>

                {tm.userRole !== 'leader' && (
                  <button
                    onClick={() => handleLeaveTeam(tm.id)}
                    style={{ background: 'none', border: 'none', color: '#ff8b90', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
                  >
                    <UserMinus size={14} />
                    WITHDRAW FROM SQUAD
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
