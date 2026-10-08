import React, { useState, useEffect } from 'react';
import { Clock, MapPin, User, Shield, Zap, ChevronRight, Award } from 'lucide-react';
import { scheduleData as defaultScheduleData } from '../data/eventData';
import { eventService } from '../services/eventService';
import HoloBadge from './ui/HoloBadge';

export default function ScheduleSection() {
  const [activeDay, setActiveDay] = useState('day1');
  const [schedule, setSchedule] = useState(defaultScheduleData);

  useEffect(() => {
    let isMounted = true;
    eventService.getSchedules().then((res) => {
      if (isMounted && res) setSchedule(res);
    });
    return () => { isMounted = false; };
  }, []);

  const currentSchedule = schedule[activeDay] || defaultScheduleData[activeDay];

  const day1Milestones = ['RECRUIT', 'ASSEMBLE', 'BUILD', 'BATTLE'];
  const day2Milestones = ['DEPLOY', 'EVALUATE', 'FINAL BATTLE', 'CHAMPIONS'];
  const currentMilestones = activeDay === 'day1' ? day1Milestones : day2Milestones;

  return (
    <section id="schedule" className="section schedule-section superhero-timeline-section">
      <div className="section-transition-top" />
      <div className="container">
        {/* Header */}
        <div className="section-header center">
          <HoloBadge variant="cyan" icon={Clock}>
            OPERATION TIMELINE // CHAPTER 06
          </HoloBadge>
          <h2 className="heading-section marvel-section-title">MISSION TIMELINE: 48-HOUR FLIGHT PLAN</h2>
          <p className="section-lead">
            The chronological flight plan across both high-stakes operational days of HackFest 3.0.
          </p>
        </div>

        {/* Superhero Operational Phase Pipeline Bar */}
        <div className="superhero-phase-bar">
          {currentMilestones.map((m, idx) => (
            <React.Fragment key={idx}>
              <div className="superhero-phase-step">
                <span className="phase-step-num">0{idx + 1}</span>
                <span className="phase-step-name">{m}</span>
              </div>
              {idx < currentMilestones.length - 1 && (
                <span className="phase-step-arrow">→</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Day Switcher Hub */}
        <div className="schedule-tabs stark-schedule-tabs" style={{ marginTop: '2rem' }}>
          <button
            className={`schedule-tab-btn stark-tab-btn ${activeDay === 'day1' ? 'active stark-tab-active' : ''}`}
            onClick={() => setActiveDay('day1')}
          >
            <span className="stark-tab-indicator" />
            DAY 01 • RECRUIT, ASSEMBLE & ARENA SPRINTS
          </button>
          <button
            className={`schedule-tab-btn stark-tab-btn ${activeDay === 'day2' ? 'active stark-tab-active' : ''}`}
            onClick={() => setActiveDay('day2')}
          >
            <span className="stark-tab-indicator" style={{ background: 'var(--color-energy-red)' }} />
            DAY 02 • THE FINAL BATTLE & CHAMPION SEALS
          </button>
        </div>

        {/* Day Header Info */}
        <div className="stark-schedule-meta-box">
          <div className="stark-schedule-theme-tag" style={{ color: 'var(--color-stark-gold)', fontWeight: 700 }}>
            OPERATION: {currentSchedule.theme.toUpperCase()}
          </div>
          <div className="stark-schedule-venue-tag">
            <MapPin size={14} color="var(--color-arc-blue)" />
            <span>PRIMARY COORDINATES: {currentSchedule.venue}</span>
          </div>
        </div>

        {/* Futuristic Timeline Stream */}
        <div className="timeline-stream stark-timeline-stream">
          <div className="stark-conduit-line" />

          {currentSchedule.items.map((item, idx) => (
            <div
              key={idx}
              className={`timeline-card stark-timeline-card ${item.highlight ? 'stark-timeline-highlight' : ''}`}
            >
              <div className="timeline-step stark-timeline-node">
                <span className="stark-node-inner">{item.order}</span>
              </div>

              <div className="timeline-info stark-timeline-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <h3 className="timeline-title stark-timeline-title">{item.title}</h3>
                  {item.badge && (
                    <HoloBadge variant={item.highlight ? 'gold' : 'cyan'}>
                      {item.badge}
                    </HoloBadge>
                  )}
                </div>

                <p className="timeline-desc stark-timeline-desc">{item.description}</p>

                {/* Dignitaries if Opening Ceremony / Motivational Address */}
                {item.dignitaries && (
                  <div className="timeline-dignitaries stark-dignitaries-row">
                    {item.dignitaries.map((dig, dIdx) => (
                      <span key={dIdx} className="dignitary-badge stark-dig-badge">
                        <User size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        {dig.name} ({dig.role})
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="timeline-time-badge stark-time-beacon">
                <Clock size={13} style={{ display: 'inline', marginRight: '6px' }} />
                <span>{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
