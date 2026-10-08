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
  let phaseDetail = 'SENSORS ACTIVE • DORMANT ARMOR';
  if (progress >= 0.18 && progress < 0.42) {
    phaseName = 'ARC CORE IGNITION';
    phaseDetail = 'VIBRANIUM CONDENSER ACTIVE • 100% OUTPUT';
  } else if (progress >= 0.42 && progress < 0.58) {
    phaseName = 'REPULSOR THRUST ENGAGED';
    phaseDetail = 'TRAJECTORY VECTOR LOCKED • SUPERSONIC LIFT';
  } else if (progress >= 0.58 && progress < 0.72) {
    phaseName = 'HYPERSPACE WARP SPEED';
    phaseDetail = 'QUANTUM CORRIDOR OPEN • VELOCITY MAX';
  } else if (progress >= 0.72 && progress < 0.84) {
    phaseName = 'SINGULARITY DETECTED';
    phaseDetail = 'GARGANTUA CLASS BLACK HOLE • ACCRETION LOCK';
  } else if (progress >= 0.84 && progress < 0.93) {
    phaseName = 'DEEP MULTIVERSE GALAXY';
    phaseDetail = 'SPIRAL NEBULA SECTOR REC-B30 • PORTAL OPENING';
  } else if (progress >= 0.93) {
    phaseName = 'CONVERGENCE COMPLETE';
    phaseDetail = 'WELCOME TO HACKFEST 3.0 UNIVERSE';
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
            <span className={progress >= 0.18 ? 'active-stage' : ''}>[01] IGNITION</span>
            <span className="stage-sep">→</span>
            <span className={progress >= 0.42 ? 'active-stage' : ''}>[02] LAUNCH</span>
            <span className="stage-sep">→</span>
            <span className={progress >= 0.58 ? 'active-stage-amber' : ''}>[03] WARP</span>
            <span className="stage-sep">→</span>
            <span className={progress >= 0.72 ? 'active-stage-red' : ''}>[04] BLACK HOLE</span>
            <span className="stage-sep">→</span>
            <span className={progress >= 0.84 ? 'active-stage' : ''}>[05] GALAXY</span>
            <span className="stage-sep">→</span>
            <span className={progress >= 0.93 ? 'active-stage-white' : ''}>[06] HACKFEST 3.0</span>
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
