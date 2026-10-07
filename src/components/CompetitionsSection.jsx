import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock, Award, Users, Terminal, Lightbulb, Code2 } from 'lucide-react';
import { competitions } from '../data/eventData';

export default function CompetitionsSection() {
  return (
    <section id="competitions" className="section competitions-section">
      <div className="section-transition-top" />
      <div className="container">
        <div className="section-header">
          <span className="chapter-badge">
            <span style={{ color: 'var(--color-warm-amber)', fontWeight: 700 }}>CHAPTER 04</span>
            <span>THREE DISTINCT DOMAINS</span>
          </span>
          <h2 className="heading-section">THE THREE ARENAS</h2>
          <p className="section-lead">
            Three distinct competitive spheres engineered to challenge computational velocity, strategic innovation, and deep engineering endurance.
          </p>
        </div>

        <div className="competitions-grid">
          {competitions.map((comp) => {
            const isMain = comp.isDominant;

            return (
              <div
                key={comp.id}
                className={`competition-panel ${isMain ? 'dominant' : ''}`}
                style={{
                  borderColor: isMain ? 'var(--border-accent-crimson)' : 'var(--border-subtle)'
                }}
              >
                <div className="corner-accent corner-tl" />
                <div className="corner-accent corner-tr" />

                {/* Imagery Banner */}
                <div className="competition-image-wrap">
                  <img
                    src={comp.bgImage}
                    alt={`${comp.title} Arena`}
                    className="competition-panel-img"
                    loading="lazy"
                  />
                  <div className="competition-img-overlay" />
                  <div className="competition-badge-float">
                    {comp.badge}
                  </div>
                </div>

                {/* Body Content */}
                <div className="competition-body">
                  <h3 className="heading-display competition-panel-title">
                    {comp.title}
                  </h3>
                  <div className="competition-tagline">{comp.tagline}</div>
                  <p className="competition-desc">{comp.shortDescription}</p>

                  <div className="competition-meta-list">
                    <div className="competition-meta-item">
                      <Clock size={16} />
                      <span>{comp.duration}</span>
                    </div>
                    <div className="competition-meta-item">
                      <Users size={16} />
                      <span>{comp.format}</span>
                    </div>
                    <div className="competition-meta-item">
                      <Award size={16} />
                      <span>{comp.evaluation}</span>
                    </div>
                  </div>

                  <div className="competition-btn-wrap">
                    <Link
                      to={`/${comp.id}`}
                      className={`btn ${isMain ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ width: '100%' }}
                    >
                      {comp.cta}
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
