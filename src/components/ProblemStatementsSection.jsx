import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight, Layers, FileCode } from 'lucide-react';
import { problemCategories as defaultCategories } from '../data/eventData';
import { eventService } from '../services/eventService';
import ProblemDetailModal from './ProblemDetailModal';

export default function ProblemStatementsSection() {
  const [categories, setCategories] = useState(defaultCategories);
  const [activeProblem, setActiveProblem] = useState(null);

  useEffect(() => {
    let isMounted = true;
    eventService.getProblemCategories().then((res) => {
      if (isMounted && res?.length > 0) {
        setCategories(res);
      }
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <section id="problems" className="section problems-section">
      <div className="section-transition-top" />
      <div className="container">
        <div className="section-header">
          <span className="chapter-badge">
            <span style={{ color: 'var(--color-warm-amber)', fontWeight: 700 }}>CHAPTER 05</span>
            <span>CRISIS SPECIFICATIONS</span>
          </span>
          <h2 className="heading-section">PROBLEM STATEMENTS</h2>
          <p className="section-lead">
            Exactly six core problem-statement categories for the flagship Hackathon.
            Teams select one category on Day 2 to engineer their solution.
          </p>
        </div>

        <div className="problems-grid">
          {categories.map((prob) => (
            <div
              key={prob.id}
              className="problem-card"
              onClick={() => setActiveProblem(prob)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveProblem(prob);
                }
              }}
            >
              <div className="corner-accent corner-tl" />
              <div className="corner-accent corner-br" />

              <div className="problem-card-num">{prob.number}</div>
              <h3 className="problem-card-title">{prob.title}</h3>
              <div className="problem-card-theme">{prob.theme}</div>
              <p className="problem-card-brief">{prob.challenge}</p>

              <div className="problem-card-action">
                <span>VIEW SPECIFICATION</span>
                <ChevronRight size={16} color="var(--color-warm-amber)" />
              </div>
            </div>
          ))}
        </div>

        {/* Modal Inspector */}
        {activeProblem && (
          <ProblemDetailModal
            problem={activeProblem}
            onClose={() => setActiveProblem(null)}
          />
        )}
      </div>
    </section>
  );
}
