import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, Globe, MapPin } from 'lucide-react';
import { eventMeta } from '../data/eventData';

export default function Footer() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand & Organization */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
              <svg viewBox="0 0 40 40" width="32" height="32">
                <polygon points="20,2 38,12 33,34 20,39 7,34 2,12" fill="#8F3035" stroke="#B98545" strokeWidth="1.8" />
                <path d="M14 14 L14 26 M14 20 L22 20 M22 14 L22 26" stroke="#ECE8DF" strokeWidth="2" strokeLinecap="square" />
                <circle cx="28" cy="24" r="2" fill="#B98545" />
              </svg>
              <h3 className="heading-display" style={{ fontSize: '1.45rem', letterSpacing: '0.05em' }}>
                {eventMeta.name}
              </h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.2rem', lineHeight: '1.6' }}>
              Organized by <strong>{eventMeta.organizer}</strong> at {eventMeta.institution}.
              A crucible for student developers, system builders, and technological problem solvers.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              <MapPin size={15} color="var(--color-warm-amber)" />
              <span>{eventMeta.venueShort}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="footer-col-title">NAVIGATION</h4>
            <ul className="footer-links">
              <li><Link to="/" onClick={() => scrollTo('hero')}>Home</Link></li>
              <li><Link to="/about" onClick={() => scrollTo('about')}>About Event</Link></li>
              <li><Link to="/competitions" onClick={() => scrollTo('competitions')}>Competitions</Link></li>
              <li><Link to="/missions" onClick={() => scrollTo('problems')}>Problem Statements</Link></li>
              <li><Link to="/schedule" onClick={() => scrollTo('schedule')}>Schedule</Link></li>
              <li><Link to="/prizes" onClick={() => scrollTo('prizes')}>Prizes</Link></li>
              <li><Link to="/faq" onClick={() => scrollTo('faq')}>FAQ & Rules</Link></li>
            </ul>
          </div>

          {/* Col 3: Arenas */}
          <div>
            <h4 className="footer-col-title">THE THREE ARENAS</h4>
            <ul className="footer-links">
              <li><Link to="/codeathon">Codeathon (1.5h)</Link></li>
              <li><Link to="/ideathon">Ideathon (Pitch)</Link></li>
              <li><Link to="/hackathon">Flagship Hackathon</Link></li>
              <li><Link to="/register">Registration Portal</Link></li>
              <li><Link to="/sponsors">Sponsors & Partners</Link></li>
            </ul>
          </div>

          {/* Col 4: Community & Connect */}
          <div>
            <h4 className="footer-col-title">SDC COMMUNITY</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.5' }}>
              Connect with the Student Developer Club for queries, updates, and collaboration.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {/* Instagram SVG */}
              <a
                href={eventMeta.socials.instagram}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '0.55rem',
                  background: 'rgba(37, 42, 49, 0.7)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--color-soft-gray)',
                  display: 'flex',
                  alignItems: 'center'
                }}
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>

              {/* LinkedIn SVG */}
              <a
                href={eventMeta.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '0.55rem',
                  background: 'rgba(37, 42, 49, 0.7)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--color-soft-gray)',
                  display: 'flex',
                  alignItems: 'center'
                }}
                aria-label="LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect width="4" height="12" x="2" y="9"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>

              {/* X / Twitter SVG */}
              <a
                href={eventMeta.socials.x}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '0.55rem',
                  background: 'rgba(37, 42, 49, 0.7)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--color-soft-gray)',
                  display: 'flex',
                  alignItems: 'center'
                }}
                aria-label="X / Twitter"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* Email */}
              <a
                href={`mailto:${eventMeta.contactEmail}`}
                style={{
                  padding: '0.55rem',
                  background: 'rgba(37, 42, 49, 0.7)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--color-soft-gray)',
                  display: 'flex',
                  alignItems: 'center'
                }}
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Inquiries: <a href={`mailto:${eventMeta.contactEmail}`} style={{ color: 'var(--color-warm-amber)' }}>{eventMeta.contactEmail}</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} {eventMeta.name} • Student Developer Club, REC Banda. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
            <span>RAJKIYA ENGINEERING COLLEGE BANDA</span>
            <span style={{ color: 'var(--color-warm-amber)' }}>BUILD WHAT COMES NEXT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
