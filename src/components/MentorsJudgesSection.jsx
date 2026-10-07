import React, { useState } from 'react';
import { UserCheck, Shield, Award, CheckCircle, Scale } from 'lucide-react';
import { mentorsAndJudges, competitions } from '../data/eventData';

export default function MentorsJudgesSection() {
  const [activeTab, setActiveTab] = useState('judges');

  const hackathonComp = competitions.find((c) => c.id === 'hackathon');
  const ideathonComp = competitions.find((c) => c.id === 'ideathon');

  return (
    <section id="mentors-judges" className="section mentors-section">
      <div className="section-transition-top" />
      <div className="container">
        <div className="section-header center">
          <span className="chapter-badge">
            <span style={{ color: 'var(--color-warm-amber)', fontWeight: 700 }}>CHAPTER 08</span>
            <span>EXPERTISE & GOVERNANCE</span>
          </span>
          <h2 className="heading-section">MENTORS & JUDGES</h2>
          <p className="section-lead">
            Guided and evaluated by distinguished academic leadership, senior developers, and industry practitioners.
          </p>
        </div>

        {/* Tab switch between Judges and Mentors */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <button
            className={`workflow-tab-btn ${activeTab === 'judges' ? 'active' : ''}`}
            onClick={() => setActiveTab('judges')}
          >
            EVALUATION JURY & PATRONS
          </button>
          <button
            className={`workflow-tab-btn ${activeTab === 'mentors' ? 'active' : ''}`}
            onClick={() => setActiveTab('mentors')}
          >
            TECHNICAL MENTORS
          </button>
          <button
            className={`workflow-tab-btn ${activeTab === 'criteria' ? 'active' : ''}`}
            onClick={() => setActiveTab('criteria')}
          >
            OFFICIAL JUDGING CRITERIA
          </button>
        </div>

        {activeTab === 'judges' && (
          <div className="mentors-grid">
            {mentorsAndJudges.judges.map((judge) => (
              <div key={judge.id} className="mentor-card">
                <div className="mentor-avatar-wrap">
                  <Shield size={28} />
                </div>
                <h3 className="mentor-name">{judge.name}</h3>
                <div className="mentor-designation">{judge.designation}</div>
                <div className="mentor-org">{judge.organization}</div>
                <p className="mentor-bio">{judge.bio}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'mentors' && (
          <div className="mentors-grid">
            {mentorsAndJudges.mentors.map((mentor) => (
              <div key={mentor.id} className="mentor-card">
                <div className="mentor-avatar-wrap">
                  <UserCheck size={28} />
                </div>
                <h3 className="mentor-name">{mentor.name}</h3>
                <div className="mentor-designation">{mentor.designation}</div>
                <div className="mentor-org">EXPERTISE: {mentor.expertise}</div>
                <p className="mentor-bio">{mentor.bio}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'criteria' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Hackathon Criteria */}
            <div style={{ background: 'rgba(37, 42, 49, 0.7)', border: '1px solid var(--border-accent-crimson)', borderRadius: 'var(--radius-md)', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
                <Scale size={20} color="var(--color-muted-crimson)" />
                <h3 className="heading-display" style={{ fontSize: '1.25rem' }}>
                  HACKATHON CRITERIA
                </h3>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1.4rem' }}>
                Weightages: <strong style={{ color: 'var(--color-warm-amber)' }}>[TO BE DECIDED]</strong> by jury consensus.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {hackathonComp.judgingCriteria.map((c, i) => (
                  <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.8rem', background: 'rgba(28, 32, 38, 0.6)', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem' }}>
                    <span style={{ color: 'var(--color-warm-off-white)' }}>{c.criterion}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-warm-amber)' }}>{c.weight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ideathon Criteria */}
            <div style={{ background: 'rgba(37, 42, 49, 0.7)', border: '1px solid var(--border-accent-steel)', borderRadius: 'var(--radius-md)', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
                <Scale size={20} color="var(--color-steel-blue)" />
                <h3 className="heading-display" style={{ fontSize: '1.25rem' }}>
                  IDEATHON CRITERIA
                </h3>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1.4rem' }}>
                Weightages: <strong style={{ color: 'var(--color-warm-amber)' }}>[TO BE DECIDED]</strong> by jury consensus.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {ideathonComp.judgingCriteria.map((c, i) => (
                  <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.8rem', background: 'rgba(28, 32, 38, 0.6)', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem' }}>
                    <span style={{ color: 'var(--color-warm-off-white)' }}>{c.criterion}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-warm-amber)' }}>{c.weight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
