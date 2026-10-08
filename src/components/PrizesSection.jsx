import React from 'react';
import { Trophy, Medal, Sparkles, Flame, Shield } from 'lucide-react';
import { prizesData } from '../data/eventData';
import InfinityVault3D from './3d/InfinityVault3D';
import SuperheroPanel from './ui/SuperheroPanel';
import HoloBadge from './ui/HoloBadge';

export default function PrizesSection() {
  return (
    <section id="prizes" className="section prizes-section infinity-vault-section">
      <div className="section-transition-top" />
      <div className="container">
        {/* Header */}
        <div className="section-header center">
          <HoloBadge variant="gold" icon={Trophy}>
            COSMIC ARTIFACTS // CHAPTER 09
          </HoloBadge>
          <h2 className="heading-section marvel-section-title">
            INFINITY POWER VAULT: REWARDS
          </h2>
          <p className="section-lead">
            {prizesData.subtitle}. Celebrating algorithmic supremacy, conceptual brilliance, and full-stack engineering resilience.
          </p>
        </div>

        {/* 3D Infinity Power Cores Showcase */}
        <div className="infinity-3d-vault-card">
          <div className="vault-telemetry-strip">
            <span className="marvel-tag-pulse" />
            <span>COSMIC VAULT // CHAMPION CORE • VANGUARD CORE • HERO CORE</span>
          </div>

          <InfinityVault3D />

          <div className="vault-pedestal-labels">
            <div className="vault-podium-label left" style={{ borderColor: 'rgba(0, 191, 255, 0.4)' }}>
              <span className="podium-rank" style={{ color: 'var(--color-arc-blue)' }}>2ND PLACE</span>
              <span className="podium-title">VANGUARD CORE // SPACE STONE</span>
            </div>
            <div className="vault-podium-label center" style={{ borderColor: 'rgba(245, 182, 66, 0.6)' }}>
              <span className="podium-rank champion" style={{ color: 'var(--color-stark-gold)' }}>1ST PLACE APEX</span>
              <span className="podium-title">CHAMPION CORE // SOLAR FLARE</span>
            </div>
            <div className="vault-podium-label right" style={{ borderColor: 'rgba(230, 36, 41, 0.4)' }}>
              <span className="podium-rank" style={{ color: 'var(--color-energy-red)' }}>3RD PLACE</span>
              <span className="podium-title">HERO CORE // REALITY CRIMSON</span>
            </div>
          </div>
        </div>

        {/* Featured Recognition Details Comic Box */}
        <div className="prizes-featured-box marvel-vault-summary">
          <div className="prizes-img-wrap marvel-vault-img-wrap">
            <img
              src="/images/prizes-verdict.jpg"
              alt="HackFest 3.0 Championship Trophy Sculpture"
              className="prizes-img"
              loading="lazy"
            />
          </div>

          <div>
            <HoloBadge variant="gold" style={{ marginBottom: '0.8rem' }}>
              OFFICIAL RECOGNITION STRUCTURE
            </HoloBadge>
            <h3 className="heading-display" style={{ fontSize: '2.1rem', color: '#FFFFFF', marginBottom: '0.8rem', letterSpacing: '0.04em' }}>
              CHAMPIONSHIP HONORS & VERIFIED CREDS
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.98rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              Every winning operative receives distinguished official honors ratified by Rajkiya Engineering College Banda. Recognition packages include original geometric metallic trophies, commemorative medal sets, blockchain-verifiable digital certificates, and sponsor tech hardware hampers.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
              <SuperheroPanel variant="gold" tag="APEX CHAMPION" issueNumber="1ST PLACE">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-stark-gold)', fontWeight: 700, fontSize: '0.92rem' }}>
                  <Trophy size={20} />
                  <span>1ST PLACE PINNACLE</span>
                </div>
                <div style={{ color: '#F5F7FA', fontSize: '0.94rem', marginTop: '6px', fontWeight: 600 }}>
                  Custom Metallic Trophy + Shield + Citations
                </div>
              </SuperheroPanel>

              <SuperheroPanel variant="blue" tag="VANGUARD" issueNumber="2ND & 3RD">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-arc-blue)', fontWeight: 700, fontSize: '0.92rem' }}>
                  <Medal size={20} />
                  <span>2ND & 3RD PLACE</span>
                </div>
                <div style={{ color: '#F5F7FA', fontSize: '0.94rem', marginTop: '6px', fontWeight: 600 }}>
                  Commemorative Medals + Verified Hampers
                </div>
              </SuperheroPanel>
            </div>
          </div>
        </div>

        {/* 3 Arenas Detailed Breakdown */}
        <div className="prizes-arenas-grid" style={{ marginTop: '3.5rem' }}>
          {prizesData.arenas.map((arena) => {
            const v = arena.arenaId === 'hackathon' ? 'red' : arena.arenaId === 'codeathon' ? 'blue' : 'gold';

            return (
              <SuperheroPanel
                key={arena.arenaId}
                variant={v}
                tag={arena.arenaName.toUpperCase()}
                issueNumber="ARENA PRIZES"
                className="prize-arena-card"
              >
                <h4 className="prize-arena-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: '#FFFFFF' }}>
                  {arena.arenaName}
                </h4>
                <div className="prize-arena-tag" style={{ color: v === 'red' ? 'var(--color-energy-red)' : v === 'blue' ? 'var(--color-arc-blue)' : 'var(--color-stark-gold)', fontWeight: 600 }}>
                  {arena.tagline}
                </div>

                <div className="prize-tier-list" style={{ marginTop: '1.2rem' }}>
                  {arena.awards.map((tier, idx) => (
                    <div
                      key={idx}
                      className={`prize-tier-item ${tier.featured ? 'champion stark-champion-tier' : ''}`}
                    >
                      <div className="prize-tier-label">{tier.tier}</div>
                      <div className="prize-tier-name">{tier.prize}</div>
                      <p className="prize-tier-desc">{tier.details}</p>
                    </div>
                  ))}
                </div>
              </SuperheroPanel>
            );
          })}
        </div>
      </div>
    </section>
  );
}
