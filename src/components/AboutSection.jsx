import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Cpu, Layers, Users, Zap } from 'lucide-react';
import { eventMeta } from '../data/eventData';

export default function AboutSection() {
  return (
    <section id="about" className="section about-section">
      <div className="section-transition-top" />
      <div className="container">
        <div className="about-split">
          {/* Text Column */}
          <div className="about-copy">
            <span className="chapter-badge">
              <span style={{ color: 'var(--color-warm-amber)', fontWeight: 700 }}>CHAPTER 02</span>
              <span>ORIGIN & PURPOSE</span>
            </span>

            <h2 className="heading-section">
              ABOUT HACKFEST 3.0
            </h2>

            <p className="about-p">
              <strong>HackFest 3.0</strong> is the flagship technology-focused event orchestrated by the{' '}
              <strong>Student Developer Club (SDC)</strong> at <strong>Rajkiya Engineering College Banda</strong>.
              Born from a conviction that disruptive times demand relentless innovation, the festival serves as a high-octane proving ground where theory gives way to practical execution.
            </p>

            <p className="about-p">
              Across two intensive days, participants from across India converge in the Multipurpose Hall to tackle systemic crisis challenges. By uniting algorithmic speed, visionary product pitching, and multi-hour collaborative software engineering, HackFest 3.0 cultivates technical resilience, mentorship, and breakthrough problem-solving.
            </p>

            {/* Key Pillars */}
            <div className="about-key-points">
              <div className="about-point">
                <Cpu size={20} className="about-point-icon" />
                <span className="about-point-text">Practical System Development</span>
              </div>
              <div className="about-point">
                <Users size={20} className="about-point-icon" />
                <span className="about-point-text">Student Collaboration & Mentorship</span>
              </div>
              <div className="about-point">
                <Zap size={20} className="about-point-icon" />
                <span className="about-point-text">High-Intensity Problem Solving</span>
              </div>
              <div className="about-point">
                <Layers size={20} className="about-point-icon" />
                <span className="about-point-text">Competitive Peer Learning</span>
              </div>
            </div>

            <div>
              <Link to="/about" className="btn btn-secondary" style={{ padding: '0.75rem 1.6rem', fontSize: '0.85rem' }}>
                LEARN MORE ABOUT SDC
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          {/* Visual Column */}
          <div className="about-visual-wrap">
            <div className="about-image-card">
              <img
                src="/images/about-sdc.jpg"
                alt="Student developers collaborating at REC Banda"
                className="about-image"
                loading="lazy"
              />
              <div className="about-image-badge">
                <div>
                  <div className="about-badge-title">REC BANDA ENGINEERING CORE</div>
                  <div className="about-badge-sub">STUDENT DEVELOPER CLUB • INITIATIVE</div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-warm-off-white)' }}>
                  EST. 2023
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
