import React, { useState } from 'react';
import { ArrowRight, ChevronRight, Workflow } from 'lucide-react';
import { howItWorks } from '../data/eventData';

export default function HowItWorksSection() {
  const [activeWorkflow, setActiveWorkflow] = useState('hackathon');

  const current = howItWorks[activeWorkflow];

  return (
    <section id="how-it-works" className="section how-it-works-section">
      <div className="section-transition-top" />
      <div className="container">
        <div className="section-header center">
          <span className="chapter-badge">
            <span style={{ color: 'var(--color-warm-amber)', fontWeight: 700 }}>CHAPTER 07</span>
            <span>OPERATIONAL BLUEPRINT</span>
          </span>
          <h2 className="heading-section">HOW THE EVENT WORKS</h2>
          <p className="section-lead">
            Clear, step-by-step technical pipelines for each competition track.
          </p>
        </div>

        {/* Workflow Track Selector */}
        <div className="workflow-tabs">
          <button
            className={`workflow-tab-btn ${activeWorkflow === 'hackathon' ? 'active' : ''}`}
            onClick={() => setActiveWorkflow('hackathon')}
          >
            FLAGSHIP HACKATHON
          </button>
          <button
            className={`workflow-tab-btn ${activeWorkflow === 'codeathon' ? 'active' : ''}`}
            onClick={() => setActiveWorkflow('codeathon')}
          >
            CODEATHON (1.5H)
          </button>
          <button
            className={`workflow-tab-btn ${activeWorkflow === 'ideathon' ? 'active' : ''}`}
            onClick={() => setActiveWorkflow('ideathon')}
          >
            IDEATHON (PITCH)
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h3 className="heading-display" style={{ fontSize: '1.45rem', color: 'var(--color-warm-off-white)' }}>
            {current.title}
          </h3>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--color-warm-amber)', marginTop: '4px' }}>
            {current.subtitle}
          </p>
        </div>

        {/* Step Cards Grid */}
        <div className="workflow-steps-track">
          {current.steps.map((st, i) => (
            <div key={i} className="workflow-step-card">
              <div className="workflow-step-header">
                <span className="workflow-step-num">STEP {st.step}</span>
                {i < current.steps.length - 1 && (
                  <ArrowRight size={16} color="var(--color-soft-gray)" style={{ opacity: 0.5 }} />
                )}
              </div>
              <h4 className="workflow-step-title">{st.name}</h4>
              <p className="workflow-step-desc">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
