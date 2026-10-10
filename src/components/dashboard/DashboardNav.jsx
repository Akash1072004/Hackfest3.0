import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, User, Users, Trophy, UploadCloud, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DashboardNav() {
  const { profile, role, signOut, isConfigured } = useAuth();

  const links = [
    { to: '/dashboard', label: 'OVERVIEW', icon: LayoutDashboard, end: true },
    { to: '/dashboard/team', label: 'MY TEAM', icon: Users },
    { to: '/dashboard/registration', label: 'REGISTRATIONS', icon: Trophy },
    { to: '/dashboard/submission', label: 'SUBMISSION', icon: UploadCloud },
    { to: '/dashboard/profile', label: 'PROFILE', icon: User },
  ];

  return (
    <div style={{ background: 'rgba(28, 32, 38, 0.75)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-lg)', padding: 'clamp(0.75rem, 2.5vw, 1.25rem)', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <div>
          <span className="chapter-badge" style={{ margin: '0 0 0.3rem 0' }}>ROLE: {role.toUpperCase()}</span>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.05rem, 3.2vw, 1.3rem)', color: 'var(--color-warm-off-white)', wordBreak: 'break-word' }}>
            {profile?.full_name || 'Participant'}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-warm-amber)', wordBreak: 'break-word' }}>
            {profile?.college || 'Rajkiya Engineering College Banda'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {(role === 'admin' || role === 'organizer') && (
            <NavLink to="/admin" className="btn btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.78rem' }}>
              ADMIN CONSOLE
            </NavLink>
          )}
          {(role === 'judge' || role === 'admin') && (
            <NavLink to="/judge" className="btn btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.78rem' }}>
              JUDGE PORTAL
            </NavLink>
          )}
          <button
            onClick={signOut}
            className="btn btn-secondary"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <LogOut size={14} />
            SIGN OUT
          </button>
        </div>
      </div>

      <nav style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              style={({ isActive }) => ({
                display: 'inline-flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                gap: '0.5rem',
                padding: '0.6rem 1.1rem',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                letterSpacing: '0.05em',
                textDecoration: 'none',
                background: isActive ? 'rgba(185, 133, 69, 0.18)' : 'rgba(37, 42, 49, 0.5)',
                color: isActive ? 'var(--color-warm-amber)' : 'var(--color-soft-gray)',
                border: isActive ? '1px solid var(--border-accent-amber)' : '1px solid var(--border-subtle)',
                transition: 'var(--transition-fast)',
              })}
            >
              <Icon size={16} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
