import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, CheckCircle2, ShieldAlert, Sparkles, Send } from 'lucide-react';
import { eventMeta, competitions } from '../data/eventData';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    institution: '',
    arena: 'hackathon',
    teamName: '',
    teamSize: '3',
    experience: 'intermediate',
    agreeRules: false
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreeRules) {
      alert('Please review and agree to the event guidelines.');
      return;
    }
    setSubmitted(true);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  return (
    <div style={{ paddingTop: 'calc(var(--nav-height) + 2rem)', paddingBottom: '6rem' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        <Link
          to="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-warm-amber)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', marginBottom: '1.5rem' }}
        >
          <ArrowLeft size={16} />
          RETURN TO HOME
        </Link>

        <span className="chapter-badge">REGISTRATION SECTOR</span>
        <h1 className="heading-display" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', marginBottom: '0.8rem' }}>
          JOIN HACKFEST 3.0
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2.5rem' }}>
          Secure your participation at <strong>Rajkiya Engineering College Banda</strong>.
          There are zero registration fees. All registered participants receive access passes, meals during event hours, and verified participation certificates.
        </p>

        {submitted ? (
          <div style={{ background: 'rgba(37, 42, 49, 0.85)', border: '1px solid var(--border-accent-amber)', borderRadius: 'var(--radius-lg)', padding: '3rem', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(185, 133, 69, 0.15)', border: '1px solid var(--color-warm-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', color: 'var(--color-warm-amber)' }}>
              <CheckCircle2 size={36} />
            </div>
            <h2 className="heading-display" style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>
              REGISTRATION RECEIVED
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', maxWidth: '540px', margin: '0 auto 1.5rem auto', lineHeight: '1.6' }}>
              Welcome to the ranks, <strong>{formData.fullName}</strong>. A confirmation beacon and instructions have been dispatched to <strong>{formData.email}</strong>.
            </p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--color-warm-amber)', marginBottom: '2rem' }}>
              ARENA: {formData.arena.toUpperCase()} • TEAM: {formData.teamName || 'INDIVIDUAL'}
            </div>
            <Link to="/" className="btn btn-primary">
              EXPLORE ARENA DETAILS
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: 'rgba(37, 42, 49, 0.75)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-lg)', padding: 'clamp(1.8rem, 3.5vw, 2.8rem)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Arena Selection */}
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--color-warm-amber)', letterSpacing: '0.1em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                SELECT COMPETITIVE ARENA *
              </label>
              <select
                name="arena"
                value={formData.arena}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.85rem 1rem', background: '#111827', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', color: 'var(--color-warm-off-white)', fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}
                required
              >
                <option value="hackathon">Main Hackathon (Day 2 • Team 2-4)</option>
                <option value="codeathon">Codeathon (Day 1 • 1.5h • Individual)</option>
                <option value="ideathon">Ideathon (Day 1 • Pitching • Team 1-3)</option>
              </select>
            </div>

            {/* Full Name & Email */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-soft-gray)', marginBottom: '0.4rem' }}>
                  FULL NAME (TEAM LEAD / PARTICIPANT) *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Akash Kumar"
                  required
                  style={{ width: '100%', padding: '0.8rem 1rem', background: '#111827', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', color: 'var(--color-warm-off-white)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-soft-gray)', marginBottom: '0.4rem' }}>
                  INSTITUTIONAL / CONTACT EMAIL *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@college.edu / name@gmail.com"
                  required
                  style={{ width: '100%', padding: '0.8rem 1rem', background: '#111827', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', color: 'var(--color-warm-off-white)' }}
                />
              </div>
            </div>

            {/* Phone & College */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-soft-gray)', marginBottom: '0.4rem' }}>
                  WHATSAPP / CONTACT PHONE *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  required
                  style={{ width: '100%', padding: '0.8rem 1rem', background: '#111827', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', color: 'var(--color-warm-off-white)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-soft-gray)', marginBottom: '0.4rem' }}>
                  COLLEGE / UNIVERSITY NAME *
                </label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  placeholder="e.g. Rajkiya Engineering College Banda"
                  required
                  style={{ width: '100%', padding: '0.8rem 1rem', background: '#111827', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', color: 'var(--color-warm-off-white)' }}
                />
              </div>
            </div>

            {/* Team details if not solo */}
            {formData.arena !== 'codeathon' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-soft-gray)', marginBottom: '0.4rem' }}>
                    TEAM NAME *
                  </label>
                  <input
                    type="text"
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleChange}
                    placeholder="e.g. Citadel Builders"
                    required
                    style={{ width: '100%', padding: '0.8rem 1rem', background: '#111827', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', color: 'var(--color-warm-off-white)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-soft-gray)', marginBottom: '0.4rem' }}>
                    TEAM SIZE
                  </label>
                  <select
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.8rem 1rem', background: '#111827', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', color: 'var(--color-warm-off-white)' }}
                  >
                    {formData.arena === 'hackathon' ? (
                      <>
                        <option value="2">2 Members</option>
                        <option value="3">3 Members</option>
                        <option value="4">4 Members</option>
                      </>
                    ) : (
                      <>
                        <option value="1">1 Member (Solo Pitch)</option>
                        <option value="2">2 Members</option>
                        <option value="3">3 Members</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            )}

            {/* Agreement */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', paddingTop: '0.5rem' }}>
              <input
                type="checkbox"
                id="agreeRules"
                name="agreeRules"
                checked={formData.agreeRules}
                onChange={handleChange}
                style={{ marginTop: '4px', cursor: 'pointer' }}
                required
              />
              <label htmlFor="agreeRules" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', cursor: 'pointer', lineHeight: '1.5' }}>
                I agree to the HackFest 3.0 code of conduct, commit to bringing original work created during the event, and will adhere to REC Banda campus regulations.
              </label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '1rem', marginTop: '1rem' }}>
              CONFIRM REGISTRATION
              <Send size={18} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
