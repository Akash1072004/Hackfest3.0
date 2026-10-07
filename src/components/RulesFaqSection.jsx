import React, { useState } from 'react';
import { ChevronDown, FileText, HelpCircle, ShieldAlert } from 'lucide-react';
import { rulesData, faqsData } from '../data/eventData';

export default function RulesFaqSection() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (idx) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="section rules-faq-section">
      <div className="section-transition-top" />
      <div className="container">
        <div className="section-header">
          <span className="chapter-badge">
            <span style={{ color: 'var(--color-warm-amber)', fontWeight: 700 }}>CHAPTER 10</span>
            <span>GOVERNANCE & PROTOCOLS</span>
          </span>
          <h2 className="heading-section">RULES & FAQ</h2>
          <p className="section-lead">
            Essential guidelines, regulatory standards, and common inquiries for all participants.
          </p>
        </div>

        <div className="rules-faq-grid">
          {/* Left Column: Official Rules */}
          <div>
            <h3 className="rules-col-title">
              <FileText size={22} color="var(--color-warm-amber)" />
              EVENT RULES & CONDUCT
            </h3>

            <div>
              {rulesData.map((category, idx) => (
                <div key={idx} className="rules-category-block">
                  <h4 className="rules-category-title">{category.category}</h4>
                  <ul className="rules-list">
                    {category.rules.map((rule, rIdx) => (
                      <li key={rIdx}>{rule}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: FAQ Accordions */}
          <div>
            <h3 className="faq-col-title">
              <HelpCircle size={22} color="var(--color-steel-blue)" />
              FREQUENTLY ASKED QUESTIONS
            </h3>

            <div className="accordion-group">
              {faqsData.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                const paddedNum = String(idx + 1).padStart(2, '0');

                return (
                  <div
                    key={idx}
                    className={`accordion-item ${isOpen ? 'open' : ''}`}
                  >
                    <button
                      className="accordion-trigger"
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={isOpen}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="accordion-num">{paddedNum}</span>
                        <span>{item.q}</span>
                      </div>
                      <ChevronDown
                        size={18}
                        style={{
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.25s ease',
                          flexShrink: 0
                        }}
                      />
                    </button>

                    {isOpen && (
                      <div className="accordion-content">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
