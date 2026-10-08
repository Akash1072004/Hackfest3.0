import React from 'react';
import { Mail, Building2, Handshake, Shield, Sparkles } from 'lucide-react';
import { sponsorsData, eventMeta } from '../data/eventData';
import HudPanel from './ui/HudPanel';
import HoloBadge from './ui/HoloBadge';

export default function SponsorsSection() {
  return (
    <section id="sponsors" className="section sponsors-section">
      <div className="section-transition-top" />
      <div className="container">
        <div className="section-header center">
          <HoloBadge variant="cyan" icon={Handshake}>
            ALLIANCES & BACKING // CHAPTER 11
          </HoloBadge>
          <h2 className="heading-section stark-section-title">STRATEGIC ALLIANCES & PARTNERS</h2>
          <p className="section-lead">
            Collaborating with academia, open-source communities, and enterprise leaders to power the next generation of engineers.
          </p>
        </div>

        {/* Group 1: Organized By */}
        <div className="sponsors-group" style={{ marginBottom: '2.5rem' }}>
          <h3 className="sponsors-group-title" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.08em', color: 'var(--color-stark-gold)', marginBottom: '1.2rem' }}>
            ORGANIZING BODIES & INSTITUTION
          </h3>
          <div className="sponsors-cards-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
            {sponsorsData.organizedBy.map((org, i) => (
              <HudPanel key={i} variant="gold" scan={false} tilt={true}>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Building2 size={24} color="var(--color-stark-gold)" style={{ marginBottom: '0.6rem' }} />
                  <div className="sponsor-card-name" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: '#F5F7FA', fontWeight: 600 }}>
                    {org.name}
                  </div>
                  <div className="sponsor-card-tag" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#94A3B8', marginTop: '0.3rem' }}>
                    {org.role}
                  </div>
                </div>
              </HudPanel>
            ))}
          </div>
        </div>

        {/* Group 2: Partners */}
        <div className="sponsors-group" style={{ marginBottom: '2.5rem' }}>
          <h3 className="sponsors-group-title" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.08em', color: 'var(--color-arc-blue)', marginBottom: '1.2rem' }}>
            OUR PARTNERS & ECOSYSTEM
          </h3>
          <div className="sponsors-cards-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
            {sponsorsData.partners.map((partner, i) => (
              <HudPanel key={i} variant="cyan" scan={false} tilt={true}>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Handshake size={24} color="var(--color-arc-blue)" style={{ marginBottom: '0.6rem' }} />
                  <div className="sponsor-card-name" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: '#F5F7FA', fontWeight: 600 }}>
                    {partner.name}
                  </div>
                  <div className="sponsor-card-tag" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#94A3B8', marginTop: '0.3rem' }}>
                    {partner.type}
                  </div>
                </div>
              </HudPanel>
            ))}
          </div>
        </div>

        {/* Group 3: Supported By */}
        <div className="sponsors-group" style={{ marginBottom: '3rem' }}>
          <h3 className="sponsors-group-title" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.08em', color: '#94A3B8', marginBottom: '1.2rem' }}>
            SUPPORTED BY
          </h3>
          <div className="sponsors-cards-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem' }}>
            {sponsorsData.supportedBy.map((sup, i) => (
              <HudPanel key={i} variant="steel" scan={false} tilt={false}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="sponsor-card-name" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: '#F5F7FA', fontWeight: 600 }}>
                    {sup.name}
                  </div>
                  <div className="sponsor-card-tag" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#64748B', marginTop: '0.2rem' }}>
                    {sup.type}
                  </div>
                </div>
              </HudPanel>
            ))}
          </div>
        </div>

        {/* Become a Sponsor Banner */}
        <HudPanel variant="cyan" tag="ALLIANCE ENLISTMENT" scan={true} className="sponsor-cta-banner">
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <h3 className="heading-display" style={{ fontSize: '1.6rem', color: '#F5F7FA', marginBottom: '0.6rem' }}>
              JOIN THE ALLIANCE // BECOME A SPONSOR
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.94rem', maxWidth: '620px', margin: '0 auto 1.6rem auto', lineHeight: '1.6' }}>
              Connect with hundreds of elite student developers, showcase your developer platform, and fuel grassroots technological breakthroughs at REC Banda.
            </p>
            <a
              href={`mailto:${eventMeta.contactEmail}?subject=HackFest%203.0%20Sponsorship%20Inquiry`}
              className="btn btn-reactor"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
            >
              <Mail size={16} />
              REQUEST SPONSORSHIP PROSPECTUS
            </a>
          </div>
        </HudPanel>
      </div>
    </section>
  );
}
