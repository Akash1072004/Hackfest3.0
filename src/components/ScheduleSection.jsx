import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, ChevronDown } from 'lucide-react';
import { scheduleData as defaultScheduleData } from '../data/eventData';
import { eventService } from '../services/eventService';

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

  return (
    <section id="schedule" className="section schedule-section">
      <div className="section-transition-top" />
      <div className="container">
        <div className="section-header center">
          <span className="chapter-badge">
            <span style={{ color: 'var(--color-warm-amber)', fontWeight: 700 }}>CHAPTER 06</span>
            <span>CHRONOLOGY OF EVENTS</span>
          </span>
          <h2 className="heading-section">EVENT SCHEDULE</h2>
          <p className="section-lead">
            The chronological flight plan across both days of HackFest 3.0.
            Times are currently configurable data marked as [TO BE DECIDED] until final verification.
          </p>
        </div>

        {/* Day Switcher */}
        <div className="schedule-tabs">
          <button
            className={`schedule-tab-btn ${activeDay === 'day1' ? 'active' : ''}`}
            onClick={() => setActiveDay('day1')}
          >
            DAY 01 • INAUGURATION & SPRINTS
          </button>
          <button
            className={`schedule-tab-btn ${activeDay === 'day2' ? 'active' : ''}`}
            onClick={() => setActiveDay('day2')}
          >
            DAY 02 • THE FLAGSHIP HACKATHON
          </button>
        </div>

        {/* Day Header Info */}
        <div style={{ maxWidth: '860px', margin: '0 auto 2rem auto', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', color: 'var(--color-warm-amber)', letterSpacing: '0.12em', marginBottom: '0.35rem' }}>
            {currentSchedule.theme}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            <MapPin size={14} color="var(--color-steel-blue)" />
            <span>VENUE: {currentSchedule.venue}</span>
          </div>
        </div>

        {/* Timeline Stream */}
        <div className="timeline-stream">
          {currentSchedule.items.map((item, idx) => (
            <div
              key={idx}
              className={`timeline-card ${item.highlight ? 'highlight' : ''}`}
            >
              <div className="timeline-step">
                {item.order}
              </div>

              <div className="timeline-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <h3 className="timeline-title">{item.title}</h3>
                  {item.badge && (
                    <span className="chapter-badge" style={{ margin: 0, padding: '0.15rem 0.5rem', fontSize: '0.7rem' }}>
                      {item.badge}
                    </span>
                  )}
                </div>

                <p className="timeline-desc">{item.description}</p>

                {/* Dignitaries if Opening Ceremony / Motivational Address */}
                {item.dignitaries && (
                  <div className="timeline-dignitaries">
                    {item.dignitaries.map((dig, dIdx) => (
                      <span key={dIdx} className="dignitary-badge">
                        <User size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        {dig.name} ({dig.role})
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="timeline-time-badge">
                <Clock size={13} style={{ display: 'inline', marginRight: '5px' }} />
                <span>{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
