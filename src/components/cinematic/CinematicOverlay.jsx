import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, FastForward, Shield, Radio, Sparkles, ChevronDown } from 'lucide-react';

/**
 * CinematicOverlay:
 * Stark-tech holographic HUD layer that sits on top of the 3D Canvas.
 * Displays real-time telemetry: armor ignition -> warp jump -> Black Hole -> Spiral Galaxy -> HackFest reveal.
 */
export default function CinematicOverlay({ progress = 0, onSkip = () => {}, isMobile = false }) {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [synthAudio, setSynthAudio] = useState(null);

  // Determine current cinematic phase
  let phaseName = 'MARK VIII // STANDBY';
  let phaseDetail = 'SENSORS ACTIVE • DORMANT ARMOR ONLINE';
  if (progress >= 0.12 && progress < 0.24) {
    phaseName = 'INTERSTELLAR EXPEDITION';
    phaseDetail = 'WARP CORRIDOR ACTIVE • SINGULARITY & SPIRAL GALAXY';
  } else if (progress >= 0.24 && progress < 0.45) {
    phaseName = 'MULTIVERSE INCURSION EVENT';
    phaseDetail = 'PLANET ENTRY // REALITY CRACKS & COLLAPSING HORIZON';
  } else if (progress >= 0.45 && progress < 0.58) {
    phaseName = 'FLIGHT PURSUIT VECTOR';
    phaseDetail = 'REPULSOR BOOST ENGAGED • SUPERSONIC VELOCITY';
  } else if (progress >= 0.58 && progress < 0.68) {
    phaseName = 'MYSTIC ANOMALY DETECTED';
    phaseDetail = 'DARK TECH SORCERER // EMERALD ENERGY SURGE';
  } else if (progress >= 0.68 && progress < 0.77) {
    phaseName = 'COSMIC CONFRONTATION';
    phaseDetail = 'FACE-OFF ACTIVE • OPPOSING BEAMS CLASHING';
  } else if (progress >= 0.77 && progress < 0.86) {
    phaseName = 'THUNDER CONVERGENCE';
    phaseDetail = 'LIGHTNING STRIKE CONFIRMED • WARRIOR ONLINE';
  } else if (progress >= 0.86 && progress < 0.94) {
    phaseName = 'SUPERHERO TEAM ASSEMBLE';
    phaseDetail = 'MULTIVERSE TRINITY ASSEMBLED • COSMIC DEFENSE';
  } else if (progress >= 0.94) {
    phaseName = 'PORTAL CONVERGENCE COMPLETE';
    phaseDetail = 'WELCOME TO HACKFEST 3.0 // STUDENT DEVELOPER CLUB';
  }

  // Web Audio Synth for ambient futuristic reactor hum & cosmic pulse
  const toggleAudio = () => {
    if (audioEnabled) {
      if (synthAudio) {
        synthAudio.stop();
        setSynthAudio(null);
      }
      setAudioEnabled(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(65, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(280, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        setSynthAudio({
          ctx,
          osc,
          filter,
          gain,
          stop: () => {
            try {
              gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
              setTimeout(() => {
                osc.stop();
                ctx.close();
              }, 350);
            } catch {
              // ignore
            }
          },
        });
        setAudioEnabled(true);
      } catch (err) {
        console.warn('Audio activation failed:', err);
      }
    }
  };

  // Modulate synth audio pitch with scroll progress
  useEffect(() => {
    if (synthAudio && synthAudio.osc) {
      const freq = 65 + progress * 140;
      synthAudio.osc.frequency.setTargetAtTime(freq, synthAudio.ctx.currentTime, 0.1);
      if (synthAudio.filter) {
        synthAudio.filter.frequency.setTargetAtTime(280 + progress * 600, synthAudio.ctx.currentTime, 0.1);
      }
    }
  }, [progress, synthAudio]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (synthAudio) {
        synthAudio.stop();
      }
    };
  }, [synthAudio]);

  // Title reveal threshold & opacity calculation (fades in at 0.88, fully visible by 0.96+)
  const revealOpacity = Math.min(1, Math.max(0, (progress - 0.88) / 0.09));
  const showReveal = progress >= 0.88;

  return (
    <div className="cinematic-overlay-hud">
      {/* TOP HUD BAR */}
      <div className="cinematic-hud-top">
        {/* Left Telemetry */}
        <div className="cinematic-hud-badge">
          <div className="hud-beacon-pulse">
            <span className="beacon-ping"></span>
            <span className="beacon-dot"></span>
          </div>
          <div className="hud-badge-info">
            <span className="hud-badge-phase">{phaseName}</span>
            <span className="hud-badge-detail">{phaseDetail}</span>
          </div>
        </div>

        {/* Center Target Reticle (Desktop only) */}
        {!isMobile && (
          <div className="cinematic-hud-center-pill">
            <Shield size={14} className="hud-icon-red pulse" />
            <span>STARK ARCHIVE // PROTOCOL 3.0</span>
          </div>
        )}

        {/* Right Action Controls */}
        <div className="cinematic-hud-actions">
          {/* Audio toggle */}
          <button
            onClick={toggleAudio}
            type="button"
            title={audioEnabled ? 'Mute Core Hum' : 'Enable Core Hum'}
            className="hud-action-btn hud-sound-btn"
          >
            {audioEnabled ? <Volume2 size={16} className="text-cyan pulse" /> : <VolumeX size={16} />}
          </button>

          {/* Skip Intro */}
          <button
            onClick={onSkip}
            type="button"
            className="hud-action-btn hud-skip-btn"
          >
            <span>SKIP INTRO</span>
            <FastForward size={14} />
          </button>
        </div>
      </div>

      {/* CENTER MOVIE TITLE REVEAL (Progress >= 0.88) */}
      <div
        className={`cinematic-title-reveal ${showReveal ? 'reveal-active' : ''}`}
        style={{
          opacity: revealOpacity,
          transform: `scale(${0.92 + revealOpacity * 0.08})`,
        }}
      >
        <div className="cinematic-title-pill">
          <Sparkles size={14} className="spin-slow" />
          <span>STUDENT DEVELOPER CLUB • REC BANDA</span>
        </div>

        <div className="cinematic-title-hero">
          <h1 className="cinematic-title-text">
            <span className="title-hackfest">HACKFEST</span>{' '}
            <span className="title-number">3.0</span>
          </h1>
          <div className="cinematic-title-glow-line"></div>
        </div>

        <h2 className="cinematic-subtitle-tag">
          THE NEXT GENERATION HEROES
        </h2>

        <p className="cinematic-inst-tag">
          RAJKIYA ENGINEERING COLLEGE BANDA
        </p>

        <div className="cinematic-enter-indicator" onClick={onSkip} role="button" tabIndex={0}>
          <span>ENTER THE BATTLEFIELD</span>
          <ChevronDown size={18} className="bounce-arrow" />
        </div>
      </div>

      {/* BOTTOM HUD / SCROLL TIMELINE BAR */}
      <div className="cinematic-hud-bottom">
        {progress < 0.15 && (
          <div className="cinematic-scroll-hint">
            <Radio size={14} className="pulse" />
            <span>SCROLL DOWN TO INITIATE SUPERHERO LAUNCH SEQUENCE</span>
          </div>
        )}

        <div className="cinematic-timeline-legend">
          <div className="timeline-legend-item">
            <span className="text-cyan">TIMELINE:</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="timeline-stages-desktop">
            <span className={progress >= 0.12 ? 'active-stage' : ''}>[01] COSMOS</span>
            <span className="stage-sep">→</span>
            <span className={progress >= 0.24 ? 'active-stage-violet' : ''}>[02] INCURSION</span>
            <span className="stage-sep">→</span>
            <span className={progress >= 0.45 ? 'active-stage' : ''}>[03] FLIGHT</span>
            <span className="stage-sep">→</span>
            <span className={progress >= 0.58 ? 'active-stage-emerald' : ''}>[04] VILLAIN</span>
            <span className="stage-sep">→</span>
            <span className={progress >= 0.68 ? 'active-stage-amber' : ''}>[05] FACE-OFF</span>
            <span className="stage-sep">→</span>
            <span className={progress >= 0.77 ? 'active-stage' : ''}>[06] THUNDER</span>
            <span className="stage-sep">→</span>
            <span className={progress >= 0.86 ? 'active-stage-red' : ''}>[07] ASSEMBLE</span>
            <span className="stage-sep">→</span>
            <span className={progress >= 0.94 ? 'active-stage-white' : ''}>[08] HACKFEST 3.0</span>
          </div>
          <div className="timeline-fps">
            <span>60 FPS</span>
          </div>
        </div>

        <div className="cinematic-progress-track">
          <div
            className="cinematic-progress-bar"
            style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
