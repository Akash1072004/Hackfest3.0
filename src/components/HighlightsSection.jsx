import React from 'react';
import { Award, Compass, Sparkles, Terminal, Users2, ShieldCheck, Hammer, Lightbulb } from 'lucide-react';
import { eventHighlights, additionalHighlights } from '../data/eventData';

export default function HighlightsSection() {
  const highlightIcons = [
    <Terminal size={22} color="var(--color-steel-blue)" />,
    <Lightbulb size={22} color="var(--color-warm-amber)" />,
    <Users2 size={22} color="var(--color-muted-crimson)" />,
    <Hammer size={22} color="var(--color-warm-off-white)" />
  ];

  return (
    <section id="highlights" className="section highlights-section">
      <div className="section-transition-top" />
      <div className="container">
        <div className="section-header center">
          <span className="chapter-badge">
            <span style={{ color: 'var(--color-warm-amber)', fontWeight: 700 }}>CHAPTER 03</span>
            <span>SCALE & METRICS</span>
          </span>
          <h2 className="heading-section">EVENT HIGHLIGHTS</h2>
          <p className="section-lead">
            Structured for deep immersion and maximum output across every tier of computing.
          </p>
        </div>

        {/* 4 Core Statistics */}
        <div className="stats-grid">
          {eventHighlights.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div className="corner-accent corner-tl" />
              <div className="corner-accent corner-br" />
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
              <p className="stat-desc">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* 4 Additional Features / Values */}
        <div className="features-grid">
          {additionalHighlights.map((feat, idx) => (
            <div key={idx} className="feature-block">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                {highlightIcons[idx % highlightIcons.length]}
                <h3 className="feature-title">{feat.title}</h3>
              </div>
              <p className="feature-desc">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
