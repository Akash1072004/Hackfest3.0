import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Zap, Target, Eye, Globe } from 'lucide-react';
import SuperheroPanel from './ui/SuperheroPanel';
import HoloBadge from './ui/HoloBadge';

export default function AboutSection() {
  const briefingPillars = [
    {
      code: 'DIRECTIVE 01',
      title: 'MISSION',
      desc: 'To cultivate defensive engineering and algorithmic mastery under simulated global crisis conditions.',
      icon: Target,
      variant: 'blue',
    },
    {
      code: 'DIRECTIVE 02',
      title: 'VISION',
      desc: 'Forging the next generation of technological heroes capable of constructing resilient decentralized infrastructure.',
      icon: Eye,
      variant: 'red',
    },
    {
      code: 'DIRECTIVE 03',
      title: 'OBJECTIVE',
      desc: '48 continuous hours of collaborative architecture, high-velocity coding, and jury defense in the Multipurpose Hall.',
      icon: Zap,
      variant: 'gold',
    },
    {
      code: 'DIRECTIVE 04',
      title: 'WHO CAN JOIN',
      desc: 'Open to undergraduate and postgraduate operatives pan-India across engineering, science, and design disciplines.',
      icon: Globe,
      variant: 'green',
    },
  ];

  return (
    <section id="about" className="section about-section marvel-briefing-section">
      <div className="section-transition-top" />
      <div className="container">
        {/* Header Telemetry */}
        <div className="section-header">
          <HoloBadge variant="gold">
            COMMAND INTEL // CHAPTER 02
          </HoloBadge>
          <h2 className="heading-section marvel-section-title">
            MISSION BRIEFING: ASSEMBLE
          </h2>
          <p className="section-lead">
            Orchestrated by the <strong>Student Developer Club (SDC)</strong> at <strong>Rajkiya Engineering College Banda</strong>, HackFest 3.0 serves as an elite operational proving ground where technological theory converts into working frontline defense.
          </p>
        </div>

        {/* 4-Card Directive Grid */}
        <div className="briefing-hud-grid">
          {briefingPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <SuperheroPanel
                key={pillar.title}
                variant={pillar.variant}
                tag={pillar.code}
                issueNumber={pillar.title}
                className="briefing-hud-card"
              >
                <div className="briefing-card-content">
                  <div className="briefing-icon-wrap" style={{ width: 44, height: 44, borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.8rem' }}>
                    <Icon size={24} />
                  </div>
                  <h3 className="heading-display" style={{ fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '0.4rem' }}>
                    {pillar.title}
                  </h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: '1.6' }}>
                    {pillar.desc}
                  </p>
                </div>
              </SuperheroPanel>
            );
          })}
        </div>

        {/* Tactical Base Overview Card */}
        <div className="briefing-base-overview" style={{ marginTop: '2.5rem' }}>
          <SuperheroPanel variant="blue" tag="SECTOR HQ // REC BANDA" issueNumber="OPERATIONS">
            <div className="briefing-base-layout">
              <div className="briefing-base-img-col">
                <img
                  src="/images/about-sdc.jpg"
                  alt="Student developers collaborating at REC Banda"
                  className="briefing-base-img"
                  loading="lazy"
                />
              </div>
              <div className="briefing-base-info-col">
                <span className="chapter-badge" style={{ margin: '0 0 0.6rem 0' }}>
                  OPERATIONAL DISPATCH
                </span>
                <h3 className="heading-display" style={{ fontSize: '1.7rem', color: '#FFFFFF', marginBottom: '0.8rem' }}>
                  REC BANDA ADVANCED ENGINEERING WING
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '0.94rem', lineHeight: '1.65', marginBottom: '1.4rem' }}>
                  Founded at REC Banda, the Student Developer Club drives open-source innovation, system architecture research, and collegiate competitive development. HackFest 3.0 represents our most ambitious convergence of talent, industry mentors, and high-impact jury panels.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link to="/about" className="btn btn-secondary">
                    ACCESS FULL SDC ARCHIVES
                    <ArrowUpRight size={16} />
                  </Link>
                  <Link to="/register" className="btn btn-avenger">
                    ENLIST OPERATIVE
                  </Link>
                </div>
              </div>
            </div>
          </SuperheroPanel>
        </div>
      </div>
    </section>
  );
}
