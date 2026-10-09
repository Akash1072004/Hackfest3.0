import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowUpRight, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [pastIntro, setPastIntro] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
      const introEl = document.getElementById('cinematic-intro');
      if (introEl && location.pathname === '/') {
        const totalScrollable = introEl.offsetHeight - window.innerHeight;
        setPastIntro(window.scrollY >= introEl.offsetTop + totalScrollable);
      } else {
        setPastIntro(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

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
    { label: 'COMMAND', id: 'hero', path: '/' },
    { label: 'BRIEFING', id: 'about', path: '/about' },
    { label: 'ARENAS', id: 'competitions', path: '/competitions' },
    { label: 'MISSIONS', id: 'problems', path: '/missions' },
    { label: 'TIMELINE', id: 'schedule', path: '/schedule' },
    { label: 'VAULT', id: 'prizes', path: '/prizes' },
    { label: 'RANKINGS', id: 'leaderboard', path: '/leaderboard' },
    { label: 'DIRECTIVES', id: 'faq', path: '/faq' },
  ];

  return (
    <>
      <nav
        className={`navbar stark-navbar ${
          location.pathname === '/' && !pastIntro
            ? 'navbar-in-intro'
            : scrolled
            ? 'scrolled stark-navbar-scrolled'
            : ''
        }`}
      >
        <div className="navbar-inner">
          {/* Stark Tech Brand Crest */}
          <Link to="/" className="nav-brand" onClick={() => handleNavClick('hero')}>
            <div className="stark-reactor-crest" aria-hidden="true">
              <svg viewBox="0 0 44 44" width="38" height="38">
                {/* Outer Hexagon Shield */}
                <polygon
                  points="22,2 40,12 40,32 22,42 4,32 4,12"
                  fill="#0D111A"
                  stroke="#00BFFF"
                  strokeWidth="1.6"
                  strokeDasharray="4 2"
                />
                {/* Inner Energy Triangle */}
                <polygon
                  points="22,10 33,29 11,29"
                  fill="rgba(230, 36, 41, 0.25)"
                  stroke="#E62429"
                  strokeWidth="1.8"
                />
                {/* Arc Reactor Core Center */}
                <circle cx="22" cy="22" r="4.5" fill="#00BFFF" />
                <circle cx="22" cy="22" r="7.5" fill="none" stroke="#F5B642" strokeWidth="1" />
              </svg>
            </div>
            <div className="brand-text-wrap">
              <span className="brand-title stark-brand-title">
                HACKFEST <span style={{ color: 'var(--color-arc-blue)' }}>3.0</span>
              </span>
              <span className="brand-sub stark-brand-sub">
                STARK COMMAND // REC BANDA
              </span>
            </div>
          </Link>

          {/* Central Holographic Navigation Links */}
          <ul className="nav-links stark-nav-links">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.label} className={`nav-item ${isActive ? 'active' : ''}`}>
                  {item.path.startsWith('/#') || item.path === '/' ? (
                    <button
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className="stark-nav-btn"
                    >
                      <span className="stark-nav-label">{item.label}</span>
                      <span className="stark-nav-indicator" />
                    </button>
                  ) : (
                    <Link to={item.path} className="stark-nav-link">
                      <span className="stark-nav-label">{item.label}</span>
                      <span className="stark-nav-indicator" />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Action Hub */}
          <div className="nav-actions">
            {/* Live System Status Indicator */}
            <div className="stark-sys-status hidden-mobile" title="Command Network Active">
              <span className="sys-status-dot" />
              <span className="sys-status-text">SYS: ONLINE</span>
            </div>

            {user ? (
              <Link
                to="/dashboard"
                className="btn btn-primary stark-cta-btn nav-dashboard-btn"
              >
                <LayoutDashboard size={15} />
                COMMAND CENTER
              </Link>
            ) : (
              <div className="nav-auth-actions">
                <Link
                  to="/login"
                  className="stark-login-link"
                >
                  OPERATIVE LOGIN
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary stark-cta-btn"
                >
                  ASSEMBLE
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            )}

            <button
              className="mobile-toggle stark-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={26} color="var(--color-arc-blue)" /> : <Menu size={26} color="var(--color-tech-white)" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Holographic Mobile Command Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer stark-mobile-drawer">
          <div className="drawer-header-telemetry">
            <span className="hud-tag-dot" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-arc-blue)' }}>
              TACTICAL HUD // PORTABLE DISPLAY
            </span>
          </div>

          <button
            className="modal-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={26} />
          </button>

          <ul className="mobile-nav-links stark-mobile-links">
            {navItems.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    letterSpacing: '0.08em',
                    color: 'var(--color-tech-white)',
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
            <li style={{ marginTop: '2rem', width: '100%', maxWidth: '280px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {user ? (
                <Link
                  to="/dashboard"
                  className="btn btn-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ACCESS COMMAND CENTER
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn btn-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    JOIN THE MISSION
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-secondary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    OPERATIVE LOGIN
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
