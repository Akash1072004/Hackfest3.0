import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Calendar, MapPin, Users, ShieldCheck } from 'lucide-react';
import { eventMeta } from '../data/eventData';

export default function RegisterSection() {
  return (
    <section id="register" className="section register-cta-section">
      <div className="section-transition-top" />
      <div className="container">
        <div className="register-cta-box">
          <span className="chapter-badge" style={{ marginBottom: '1.2rem' }}>
            <span style={{ color: 'var(--color-warm-amber)', fontWeight: 700 }}>FINAL INVOCATION</span>
            <span>SECTOR 12</span>
          </span>

          <h2 className="heading-display" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', marginBottom: '1rem', lineHeight: '1.05' }}>
            ENTER THE BATTLE
          </h2>

          <p style={{ color: 'var(--color-warm-off-white)', fontSize: 'clamp(1.05rem, 1.4vw, 1.25rem)', maxWidth: '680px', margin: '0 auto 1.5rem auto', lineHeight: '1.6' }}>
            The disruption has begun. Legacy paradigms have yielded.
            Claim your seat in the arena and build what comes next at <strong>HackFest 3.0</strong>.
          </p>

          {/* Quick Meta Pills */}
          <div className="register-meta-pills">
            <div className="register-meta-pill">
              <Calendar size={15} color="var(--color-warm-amber)" />
              <span>{eventMeta.datesDisplay}</span>
            </div>
            <div className="register-meta-pill">
              <MapPin size={15} color="var(--color-steel-blue)" />
              <span>{eventMeta.venueShort}</span>
            </div>
            <div className="register-meta-pill">
              <Users size={15} color="var(--color-muted-crimson)" />
              <span>OPEN TO ALL COLLEGES</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/register"
              className="btn btn-primary"
              style={{ padding: '1.1rem 2.8rem', fontSize: '1.05rem' }}
              id="final-register-btn"
            >
              REGISTER NOW FOR HACKFEST 3.0
              <ArrowUpRight size={20} />
            </Link>
          </div>

          <div style={{ marginTop: '1.8rem', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            STATUS: {eventMeta.registrationStatus} • ZERO REGISTRATION FEE • VERIFIED CERTIFICATES PROVIDED
          </div>
        </div>
      </div>
    </section>
  );
}
