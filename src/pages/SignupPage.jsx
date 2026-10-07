import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ArrowUpRight, Lock, Mail, User, Phone, School, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { eventMeta } from '../data/eventData';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: 'Rajkiya Engineering College Banda',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { signUp, isConfigured } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        college: formData.college,
        phone: formData.phone,
        role: 'participant',
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'calc(var(--nav-height) + 2rem) 1.5rem 4rem' }}>
      <div className="container" style={{ maxWidth: '540px' }}>
        <Link
          to="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-warm-amber)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', marginBottom: '1.5rem' }}
        >
          <ArrowLeft size={16} />
          RETURN TO HOME
        </Link>

        <div style={{ background: 'rgba(37, 42, 49, 0.85)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-lg)', padding: 'clamp(2rem, 5vw, 2.8rem)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ marginBottom: '1.8rem' }}>
            <span className="chapter-badge">RECRUITMENT SECTOR</span>
            <h1 className="heading-display" style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>
              CREATE ACCOUNT
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Register builder credentials for {eventMeta.name}. Team formation and arena entry start here.
            </p>
          </div>

          {!isConfigured && (
            <div style={{ background: 'rgba(185, 133, 69, 0.12)', border: '1px solid var(--border-accent-amber)', borderRadius: 'var(--radius-sm)', padding: '0.9rem 1rem', marginBottom: '1.5rem', fontSize: '0.82rem', color: 'var(--color-warm-off-white)', lineHeight: '1.5' }}>
              <strong>Notice:</strong> Supabase environment variables are currently pending setup. Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to enable live auth.
            </div>
          )}

          {error && (
            <div style={{ background: 'rgba(143, 48, 53, 0.2)', border: '1px solid var(--border-accent-crimson)', borderRadius: 'var(--radius-sm)', padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ffb4b7', fontSize: '0.85rem', marginBottom: '1.4rem' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(185, 133, 69, 0.2)', border: '1px solid var(--color-warm-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem auto', color: 'var(--color-warm-amber)' }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 className="heading-display" style={{ fontSize: '1.4rem', marginBottom: '0.6rem' }}>ACCOUNT INITIALIZED</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.8rem', lineHeight: '1.6' }}>
                Your account is ready. If email verification was sent, please verify your address, then proceed to sign in.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate('/login')}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                PROCEED TO SIGN IN
                <ArrowUpRight size={18} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-soft-gray)', marginBottom: '0.35rem', letterSpacing: '0.05em' }}>
                  FULL NAME *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="var(--color-soft-gray)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Arjun Verma"
                    required
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.7rem', background: '#111827', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', color: 'var(--color-warm-off-white)', fontFamily: 'var(--font-body)', fontSize: '0.92rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-soft-gray)', marginBottom: '0.35rem', letterSpacing: '0.05em' }}>
                  EMAIL ADDRESS *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="var(--color-soft-gray)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="builder@institution.ac.in"
                    required
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.7rem', background: '#111827', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', color: 'var(--color-warm-off-white)', fontFamily: 'var(--font-body)', fontSize: '0.92rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-soft-gray)', marginBottom: '0.35rem', letterSpacing: '0.05em' }}>
                    PHONE NUMBER
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} color="var(--color-soft-gray)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.7rem', background: '#111827', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', color: 'var(--color-warm-off-white)', fontFamily: 'var(--font-body)', fontSize: '0.92rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-soft-gray)', marginBottom: '0.35rem', letterSpacing: '0.05em' }}>
                    COLLEGE / INSTITUTION
                  </label>
                  <div style={{ position: 'relative' }}>
                    <School size={18} color="var(--color-soft-gray)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      placeholder="REC Banda"
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.7rem', background: '#111827', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', color: 'var(--color-warm-off-white)', fontFamily: 'var(--font-body)', fontSize: '0.92rem' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-soft-gray)', marginBottom: '0.35rem', letterSpacing: '0.05em' }}>
                    PASSWORD *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} color="var(--color-soft-gray)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 6 characters"
                      required
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.7rem', background: '#111827', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', color: 'var(--color-warm-off-white)', fontFamily: 'var(--font-body)', fontSize: '0.92rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-soft-gray)', marginBottom: '0.35rem', letterSpacing: '0.05em' }}>
                    CONFIRM PASSWORD *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} color="var(--color-soft-gray)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      required
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.7rem', background: '#111827', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', color: 'var(--color-warm-off-white)', fontFamily: 'var(--font-body)', fontSize: '0.92rem' }}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', marginTop: '0.6rem', justifyContent: 'center' }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    REGISTERING CREDENTIALS...
                  </>
                ) : (
                  <>
                    CREATE BUILDER ACCOUNT
                    <ArrowUpRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          <div style={{ marginTop: '1.8rem', textAlign: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.2rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: 'var(--color-warm-amber)', fontWeight: 600 }}>
              Sign In Instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
