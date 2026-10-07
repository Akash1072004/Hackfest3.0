import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { eventService } from '../services/eventService';
import { Trophy, ArrowLeft, Award, Lock, Sparkles } from 'lucide-react';
import { eventMeta } from '../data/eventData';

export default function LeaderboardPage() {
  const [published, setPublished] = useState(false);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      const cfg = await eventService.getSettings();
      setPublished(Boolean(cfg.leaderboardPublished));

      if (isSupabaseConfigured && cfg.leaderboardPublished) {
        try {
          const { data: rpcData, error: rpcErr } = await supabase.rpc('get_leaderboard');
          if (!rpcErr && Array.isArray(rpcData) && rpcData.length > 0) {
            const mapped = rpcData.map((sub) => ({
              id: sub.submission_id,
              title: sub.title,
              team: { name: sub.team_name },
              competition: { name: sub.competition_name },
              avgScore: Number(sub.average_score) || 0,
            }));
            setStandings(mapped);
            setLoading(false);
            return;
          }
        } catch {
          // Fallback to direct query
        }

        const { data } = await supabase
          .from('submissions')
          .select('*, team:teams(name), competition:competitions(name), scores:scores(score)')
          .eq('status', 'evaluated');

        const scored = (data || []).map((sub) => {
          const count = sub.scores?.length || 0;
          const avg = count > 0 ? sub.scores.reduce((a, b) => a + Number(b.score || 0), 0) / count : 0;
          return { ...sub, avgScore: avg };
        });

        scored.sort((a, b) => b.avgScore - a.avgScore);
        setStandings(scored);
      }
      setLoading(false);
    }
    loadLeaderboard();
  }, []);

  return (
    <div style={{ paddingTop: 'calc(var(--nav-height) + 2rem)', paddingBottom: '6rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <Link
          to="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-warm-amber)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', marginBottom: '1.5rem' }}
        >
          <ArrowLeft size={16} />
          RETURN TO HOME
        </Link>

        <span className="chapter-badge">CHAMPIONSHIP HALL</span>
        <h1 className="heading-display" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', marginBottom: '0.4rem' }}>
          OFFICIAL LEADERBOARD
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2.5rem' }}>
          Final rankings and honors compiled across all three arenas of {eventMeta.name}.
        </p>

        {!published ? (
          <div style={{ background: 'rgba(37, 42, 49, 0.75)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-lg)', padding: '3.5rem 2rem', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(185, 133, 69, 0.15)', border: '1px solid var(--color-warm-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', color: 'var(--color-warm-amber)' }}>
              <Lock size={32} />
            </div>
            <h2 className="heading-display" style={{ fontSize: '1.8rem', marginBottom: '0.6rem' }}>
              LEADERBOARD UNDER SEAL
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 1.5rem auto', lineHeight: '1.6' }}>
              Final scoring is currently in active deliberation by the evaluation jury. Official standings will be unveiled during the Grand Awards Ceremony in the Multipurpose Hall.
            </p>
            <Link to="/schedule" className="btn btn-secondary">
              VIEW CEREMONY SCHEDULE
            </Link>
          </div>
        ) : (
          <div style={{ background: 'rgba(37, 42, 49, 0.75)', border: '1px solid var(--border-accent-amber)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#111827', borderBottom: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-warm-amber)' }}>
                  <th style={{ padding: '1.2rem' }}>POSITION</th>
                  <th style={{ padding: '1.2rem' }}>SQUAD / PROJECT</th>
                  <th style={{ padding: '1.2rem' }}>ARENA</th>
                  <th style={{ padding: '1.2rem', textAlign: 'right' }}>FINAL SCORE</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((s, idx) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '1.2rem', fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: idx === 0 ? 'var(--color-warm-amber)' : 'var(--color-warm-off-white)' }}>
                      #{idx + 1}
                    </td>
                    <td style={{ padding: '1.2rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-warm-off-white)', fontSize: '1.05rem' }}>{s.title}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-soft-gray)' }}>{s.team?.name || 'Individual'}</div>
                    </td>
                    <td style={{ padding: '1.2rem', color: 'var(--text-secondary)' }}>
                      {s.competition?.name || 'HACKATHON'}
                    </td>
                    <td style={{ padding: '1.2rem', textAlign: 'right', fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-warm-amber)' }}>
                      {s.avgScore.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
