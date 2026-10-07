import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, profile, role, loading, isConfigured } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', paddingTop: 'var(--nav-height)' }}>
        <Loader2 size={36} className="animate-spin" color="var(--color-warm-amber)" />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-soft-gray)', letterSpacing: '0.1em' }}>
          VERIFYING ACCESS PROTOCOL...
        </span>
      </div>
    );
  }

  // If Supabase is not configured yet, allow viewing dashboard with banner
  if (!isConfigured) {
    return children;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.2rem', padding: '4rem 1.5rem', textAlign: 'center', paddingTop: 'calc(var(--nav-height) + 2rem)' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(143, 48, 53, 0.2)', border: '1px solid var(--color-muted-crimson)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted-crimson)' }}>
          <ShieldAlert size={32} />
        </div>
        <h2 className="heading-display" style={{ fontSize: '1.8rem' }}>ACCESS RESTRICTED</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', lineHeight: '1.6' }}>
          Your clearance tier (<strong>{role.toUpperCase()}</strong>) does not have authorization to enter this sector.
        </p>
        <a href="/dashboard" className="btn btn-secondary">RETURN TO DASHBOARD</a>
      </div>
    );
  }

  return children;
}
