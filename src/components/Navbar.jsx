import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowUpRight, User, LayoutDashboard } from 'lucide-react';
import { eventMeta } from '../data/eventData';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, isConfigured } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: 'HOME', id: 'hero', path: '/' },
    { label: 'ABOUT', id: 'about', path: '/about' },
    { label: 'COMPETITIONS', id: 'competitions', path: '/competitions' },
    { label: 'MISSIONS', id: 'problems', path: '/missions' },
    { label: 'SCHEDULE', id: 'schedule', path: '/schedule' },
    { label: 'PRIZES', id: 'prizes', path: '/prizes' },
    { label: 'LEADERBOARD', id: 'leaderboard', path: '/leaderboard' },
    { label: 'FAQ', id: 'faq', path: '/faq' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container-wide navbar-inner">
          <Link to="/" className="nav-brand" onClick={() => handleNavClick('hero')}>
            <div className="brand-crest">
              <svg viewBox="0 0 40 40" width="34" height="34">
                <polygon points="20,2 38,12 33,34 20,39 7,34 2,12" fill="#8F3035" stroke="#B98545" strokeWidth="1.8" />
                <path d="M14 14 L14 26 M14 20 L22 20 M22 14 L22 26" stroke="#ECE8DF" strokeWidth="2" strokeLinecap="square" />
                <circle cx="28" cy="24" r="2" fill="#B98545" />
              </svg>
            </div>
            <div className="brand-text-wrap">
              <span className="brand-title">{eventMeta.name}</span>
              <span className="brand-sub">REC BANDA</span>
            </div>
          </Link>

          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.label} className="nav-item">
                {item.path.startsWith('/#') || item.path === '/' ? (
                  <button
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link to={item.path} style={{ textDecoration: 'none' }}>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            {user ? (
              <Link
                to="/dashboard"
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.4rem', fontSize: '0.84rem' }}
              >
                <LayoutDashboard size={15} />
                DASHBOARD
              </Link>
            ) : (
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <Link
                  to="/login"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--color-warm-off-white)', textDecoration: 'none', padding: '0.5rem 0.8rem' }}
                >
                  SIGN IN
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  style={{ padding: '0.65rem 1.4rem', fontSize: '0.84rem' }}
                >
                  REGISTER
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            )}

            <button
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <button
            className="modal-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={28} />
          </button>
          <ul className="mobile-nav-links">
            {navItems.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {item.label}
                </button>
              </li>
            ))}
            <li style={{ marginTop: '1.5rem', width: '100%', maxWidth: '240px', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {user ? (
                <Link
                  to="/dashboard"
                  className="btn btn-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  GO TO DASHBOARD
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn btn-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    REGISTER NOW
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-secondary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    SIGN IN
                  </Link>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
