import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Compass, ShieldAlert, Sparkles, Terminal } from 'lucide-react';
import { eventMeta } from '../data/eventData';

export default function HeroSection() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="hero-section">
      {/* Cinematic Background Environment */}
      <div className="hero-bg-container">
        <img
          src="/images/hero-apocalypse.jpg"
          alt="Cinematic technological landscape after disruption"
          className="hero-bg-image"
          loading="eager"
        />
        <div className="hero-overlay" />
      </div>

      <div className="container hero-content">
        {/* Issue / Chapter Metadata */}
        <div className="hero-meta-strip">
          <span className="chapter-badge">
            <span style={{ color: 'var(--color-warm-amber)', fontWeight: 700 }}>CHAPTER 01</span>
            <span>THE DISRUPTION & REBUILD</span>
          </span>
          <span className="hero-tag">REC BANDA</span>
          <span className="hero-inst">STUDENT DEVELOPER CLUB</span>
        </div>

        {/* Main Display Headline */}
        <h1 className="heading-display hero-title">
          <span>HACKFEST</span> <span className="hero-title-accent">3.0</span>
        </h1>

        {/* Tagline Statement */}
        <div className="hero-tagline">
          {eventMeta.tagline}
        </div>

        {/* Concise Atmospheric Description */}
        <p className="hero-desc">
          When legacy infrastructures shatter, engineering becomes humanity's first line of defense.
          Join over 500+ student developers at <strong>Rajkiya Engineering College Banda</strong> to construct resilient systems across Codeathon, Ideathon, and the Flagship Hackathon.
        </p>

        {/* Actions */}
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary" id="hero-register-btn">
            REGISTER NOW
            <ArrowUpRight size={18} />
          </Link>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => scrollTo('about')}
            id="hero-explore-btn"
          >
            <Compass size={18} color="var(--color-steel-blue)" />
            EXPLORE EVENT
          </button>
        </div>

        {/* Vital Quick Facts Strip */}
        <div className="hero-stats-bar">
          <div className="hero-stat-item">
            <span className="hero-stat-label">LOCATION</span>
            <span className="hero-stat-value">{eventMeta.venueShort}</span>
          </div>
          <div className="hero-stat-item">
            <span className="hero-stat-label">ARENAS</span>
            <span className="hero-stat-value">3 COMPETITIONS</span>
          </div>
          <div className="hero-stat-item">
            <span className="hero-stat-label">ELIGIBILITY</span>
            <span className="hero-stat-value">COLLEGES PAN-INDIA</span>
          </div>
        </div>
      </div>
    </section>
  );
}
