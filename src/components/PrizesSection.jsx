import React from 'react';
import { Award, Trophy, Medal, Gift, Sparkles } from 'lucide-react';
import { prizesData } from '../data/eventData';

export default function PrizesSection() {
  return (
    <section id="prizes" className="section prizes-section">
      <div className="section-transition-top" />
      <div className="container">
        <div className="section-header center">
          <span className="chapter-badge">
            <span style={{ color: 'var(--color-warm-amber)', fontWeight: 700 }}>CHAPTER 09</span>
            <span>RECOGNITION & HONORS</span>
          </span>
          <h2 className="heading-section">{prizesData.sectionTitle}</h2>
          <p className="section-lead">
            {prizesData.subtitle}. Celebrating technical depth, resilience, and problem-solving mastery across all three arenas.
          </p>
        </div>

        {/* Featured Hero Box with Trophy Art */}
        <div className="prizes-featured-box">
          <div className="prizes-img-wrap">
            <img
              src="/images/prizes-verdict.jpg"
              alt="HackFest 3.0 Championship Trophy Sculpture"
              className="prizes-img"
              loading="lazy"
            />
          </div>

          <div>
            <span className="chapter-badge" style={{ marginBottom: '0.8rem' }}>
              OFFICIAL RECOGNITION STRUCTURE
            </span>
            <h3 className="heading-display" style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>
              CHAMPIONSHIP HONORS
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              Every winning team and participant receives distinguished official recognition ratified by the institute.
              In adherence to official event policy, honors comprise custom metallic trophies, commemorative medals, verified certificates of excellence, and specialized developer hampers.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(28, 32, 38, 0.7)', border: '1px solid var(--border-subtle)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-warm-amber)', fontWeight: 700, fontSize: '0.85rem' }}>
                  <Trophy size={16} />
                  <span>1ST PLACE</span>
                </div>
                <div style={{ color: 'var(--color-warm-off-white)', fontSize: '0.9rem', marginTop: '4px' }}>
                  Custom Trophy + Certificate
                </div>
              </div>

              <div style={{ background: 'rgba(28, 32, 38, 0.7)', border: '1px solid var(--border-subtle)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-soft-gray)', fontWeight: 700, fontSize: '0.85rem' }}>
                  <Medal size={16} />
                  <span>2ND & 3RD PLACE</span>
                </div>
                <div style={{ color: 'var(--color-warm-off-white)', fontSize: '0.9rem', marginTop: '4px' }}>
                  Medal + Certificate + Goodies
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Arenas Detailed Breakdown */}
        <div className="prizes-arenas-grid">
          {prizesData.arenas.map((arena) => (
            <div key={arena.arenaId} className="prize-arena-card">
              <div className="corner-accent corner-tl" />
              <div className="corner-accent corner-tr" />

              <h4 className="prize-arena-title">{arena.arenaName}</h4>
              <div className="prize-arena-tag">{arena.tagline}</div>

              <div className="prize-tier-list">
                {arena.awards.map((tier, idx) => (
                  <div
                    key={idx}
                    className={`prize-tier-item ${tier.featured ? 'champion' : ''}`}
                  >
                    <div className="prize-tier-label">{tier.tier}</div>
                    <div className="prize-tier-name">{tier.prize}</div>
                    <p className="prize-tier-desc">{tier.details}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
