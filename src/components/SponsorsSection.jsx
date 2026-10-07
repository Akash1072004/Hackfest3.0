import React from 'react';
import { Mail, Building2, Handshake } from 'lucide-react';
import { sponsorsData, eventMeta } from '../data/eventData';

export default function SponsorsSection() {
  return (
    <section id="sponsors" className="section sponsors-section">
      <div className="section-transition-top" />
      <div className="container">
        <div className="section-header center">
          <span className="chapter-badge">
            <span style={{ color: 'var(--color-warm-amber)', fontWeight: 700 }}>CHAPTER 11</span>
            <span>ALLIANCES & BACKING</span>
          </span>
          <h2 className="heading-section">PARTNERS & SPONSORS</h2>
          <p className="section-lead">
            Collaborating with academia, open-source communities, and enterprise leaders to power the next generation of engineers.
          </p>
        </div>

        {/* Group 1: Organized By */}
        <div className="sponsors-group">
          <h3 className="sponsors-group-title">ORGANIZING BODIES & INSTITUTION</h3>
          <div className="sponsors-cards-row">
            {sponsorsData.organizedBy.map((org, i) => (
              <div key={i} className="sponsor-surface-card">
                <Building2 size={24} color="var(--color-warm-amber)" style={{ marginBottom: '0.6rem' }} />
                <div className="sponsor-card-name">{org.name}</div>
                <div className="sponsor-card-tag">{org.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Group 2: Partners */}
        <div className="sponsors-group">
          <h3 className="sponsors-group-title">OUR PARTNERS & ECOSYSTEM</h3>
          <div className="sponsors-cards-row">
            {sponsorsData.partners.map((partner, i) => (
              <div key={i} className="sponsor-surface-card">
                <Handshake size={24} color="var(--color-steel-blue)" style={{ marginBottom: '0.6rem' }} />
                <div className="sponsor-card-name">{partner.name}</div>
                <div className="sponsor-card-tag">{partner.type}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Group 3: Supported By */}
        <div className="sponsors-group">
          <h3 className="sponsors-group-title">SUPPORTED BY</h3>
          <div className="sponsors-cards-row">
            {sponsorsData.supportedBy.map((sup, i) => (
              <div key={i} className="sponsor-surface-card" style={{ minWidth: '200px' }}>
                <div className="sponsor-card-name">{sup.name}</div>
                <div className="sponsor-card-tag">{sup.type}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Become a Sponsor Banner */}
        <div className="sponsor-cta-banner">
          <h3 className="heading-display" style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>
            BECOME A SPONSOR FOR HACKFEST 3.0
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '600px', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Connect with hundreds of elite student developers, brand your technology stack, and support grassroots innovation at REC Banda.
          </p>
          <a
            href={`mailto:${eventMeta.contactEmail}?subject=HackFest%203.0%20Sponsorship%20Inquiry`}
            className="btn btn-secondary"
          >
            <Mail size={16} />
            REQUEST SPONSORSHIP PROSPECTUS
          </a>
        </div>
      </div>
    </section>
  );
}
