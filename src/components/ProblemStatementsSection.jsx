import React, { useState, useEffect } from 'react';
import { ChevronRight, ShieldAlert, AlertTriangle, Skull, Flame } from 'lucide-react';
import { problemCategories as defaultCategories } from '../data/eventData';
import { eventService } from '../services/eventService';
import ProblemDetailModal from './ProblemDetailModal';
import DoomThreatNexus3D from './3d/DoomThreatNexus3D';
import SuperheroPanel from './ui/SuperheroPanel';
import HoloBadge from './ui/HoloBadge';

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

  const threatLevels = ['OMEGA LEVEL', 'CRITICAL LEVEL', 'GLOBAL CRISIS', 'EXTINCTION CLASS', 'OMEGA LEVEL', 'TACTICAL CRISIS'];
  const variants = ['green', 'red', 'gold', 'green', 'red', 'gold'];

  return (
    <section id="problems" className="section problems-section doom-battle-section">
      <div className="section-transition-top" />
      <div className="container">
        {/* Header Briefing */}
        <div className="section-header center">
          <HoloBadge variant="red" icon={ShieldAlert}>
            THE FINAL BATTLE // GLOBAL THREAT DATABASE
          </HoloBadge>
          <h2 className="heading-section marvel-section-title">
            THREAT DATABASE: CRISIS PROTOCOLS
          </h2>
          <p className="section-lead">
            A multiversal villainous threat has destabilized our digital and physical infrastructure.
            Examine the threat dossiers below, assemble your squad, and deploy counter-measures in the Flagship 48-Hour Battlefield.
          </p>
        </div>

        {/* Doctor Doom 3D Villain Presence Stage */}
        <div className="doom-villain-stage-card">
          <div className="doom-stage-header">
            <span className="doom-status-dot" />
            <span>THREAT OVERLORD DETECTED // THE CITADEL ARCHIVE</span>
          </div>

          <DoomThreatNexus3D />

          <div className="doom-stage-footer">
            <span className="doom-warning-text">
              <AlertTriangle size={15} color="#00ff77" />
              SELECT A MISSION SECTOR TO ENGAGE IN DEFENSE
            </span>
          </div>
        </div>

        {/* 6 Threat Cards Grid */}
        <div className="problems-grid doom-threats-grid" style={{ marginTop: '3rem' }}>
          {categories.map((prob, idx) => {
            const threatLevel = threatLevels[idx % threatLevels.length];
            const variant = variants[idx % variants.length];

            return (
              <SuperheroPanel
                key={prob.id}
                variant={variant}
                tag={`THREAT ${prob.number} // ${prob.theme.toUpperCase()}`}
                issueNumber={threatLevel}
                className="doom-threat-panel"
              >
                <div
                  className="doom-threat-inner"
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveProblem(prob)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveProblem(prob);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                    <span className="doom-threat-code">
                      SECTOR 0{prob.number}
                    </span>
                    <span className="doom-threat-badge">
                      <Skull size={13} style={{ marginRight: '4px' }} />
                      ALERT ACTIVE
                    </span>
                  </div>

                  <h3 className="doom-threat-title">
                    {prob.title}
                  </h3>

                  <p className="doom-threat-brief">
                    {prob.challenge}
                  </p>

                  <div className="doom-threat-action-bar">
                    <span>INSPECT THREAT DOSSIER</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </SuperheroPanel>
            );
          })}
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
