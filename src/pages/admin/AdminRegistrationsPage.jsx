import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { adminService } from '../../services/adminService';
import AdminNav from '../../components/admin/AdminNav';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from('registrations')
      .select('*, profile:profiles!registrations_user_id_fkey(full_name, email, college), competition:competitions(name), team:teams(name)')
      .order('created_at', { ascending: false });
    setRegistrations(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminService.updateRegistrationStatus(id, newStatus);
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to update registration status');
    }
  };

  return (
    <div style={{ paddingTop: 'calc(var(--nav-height) + 1.5rem)', paddingBottom: '6rem' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        <AdminNav />

        <div style={{ marginBottom: '2rem' }}>
          <span className="chapter-badge">ACCESS VERIFICATION</span>
          <h2 className="heading-display" style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>
            REGISTRATION RECORDS ({registrations.length})
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Review, confirm, cancel, or reject participant arena passes.
          </p>
        </div>

        <div style={{ background: 'rgba(37, 42, 49, 0.75)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '760px' }}>
            <thead>
              <tr style={{ background: '#111827', borderBottom: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-warm-amber)' }}>
                <th style={{ padding: '1rem' }}>BUILDER</th>
                <th style={{ padding: '1rem' }}>ARENA</th>
                <th style={{ padding: '1rem' }}>SQUAD</th>
                <th style={{ padding: '1rem' }}>STATUS</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No registrations recorded yet.
                  </td>
                </tr>
              ) : (
                registrations.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.88rem' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-warm-off-white)' }}>{r.profile?.full_name || 'Anonymous'}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.profile?.email}</div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--color-warm-off-white)' }}>
                      {r.competition?.name || 'ARENA'}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--color-soft-gray)' }}>
                      {r.team?.name || 'Individual'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', background: r.registration_status === 'confirmed' ? 'rgba(185, 133, 69, 0.15)' : 'rgba(143, 48, 53, 0.2)', border: `1px solid ${r.registration_status === 'confirmed' ? 'var(--color-warm-amber)' : 'var(--color-muted-crimson)'}`, color: r.registration_status === 'confirmed' ? 'var(--color-warm-amber)' : '#ffb4b7', fontFamily: 'var(--font-mono)', fontSize: '0.74rem' }}>
                        {r.registration_status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        {r.registration_status !== 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(r.id, 'confirmed')}
                            style={{ padding: '0.3rem 0.6rem', background: 'rgba(185, 133, 69, 0.2)', border: '1px solid var(--color-warm-amber)', color: 'var(--color-warm-amber)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}
                          >
                            CONFIRM
                          </button>
                        )}
                        {r.registration_status !== 'rejected' && (
                          <button
                            onClick={() => handleStatusChange(r.id, 'rejected')}
                            style={{ padding: '0.3rem 0.6rem', background: 'rgba(143, 48, 53, 0.2)', border: '1px solid var(--color-muted-crimson)', color: '#ffb4b7', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}
                          >
                            REJECT
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
