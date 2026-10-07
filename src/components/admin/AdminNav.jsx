import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Trophy, FileText, CheckSquare, Scale, ArrowLeft } from 'lucide-react';

export default function AdminNav() {
  const links = [
    { to: '/admin', label: 'OVERVIEW', icon: LayoutDashboard, end: true },
    { to: '/admin/participants', label: 'PARTICIPANTS', icon: Users },
    { to: '/admin/teams', label: 'TEAMS', icon: Users },
    { to: '/admin/registrations', label: 'REGISTRATIONS', icon: Trophy },
    { to: '/admin/submissions', label: 'SUBMISSIONS', icon: FileText },
    { to: '/admin/judging', label: 'JUDGING PROGRESS', icon: Scale },
  ];

  return (
    <div style={{ background: 'rgba(28, 32, 38, 0.85)', border: '1px solid var(--border-accent-crimson)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <div>
          <span className="chapter-badge" style={{ background: 'rgba(143, 48, 53, 0.25)', borderColor: 'var(--color-muted-crimson)', color: '#ffb4b7', margin: '0 0 0.3rem 0' }}>
            COMMAND CONSOLE • ADMIN CLEARANCE
          </span>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--color-warm-off-white)' }}>
            HACKFEST 3.0 ORGANIZING COMMITTEE
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <NavLink to="/dashboard" className="btn btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.78rem' }}>
            <ArrowLeft size={14} />
            BACK TO PORTAL
          </NavLink>
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
                gap: '0.5rem',
                padding: '0.6rem 1.1rem',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                letterSpacing: '0.05em',
                textDecoration: 'none',
                background: isActive ? 'rgba(143, 48, 53, 0.3)' : 'rgba(37, 42, 49, 0.5)',
                color: isActive ? '#ffb4b7' : 'var(--color-soft-gray)',
                border: isActive ? '1px solid var(--border-accent-crimson)' : '1px solid var(--border-subtle)',
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
