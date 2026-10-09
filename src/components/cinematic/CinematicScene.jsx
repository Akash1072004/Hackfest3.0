import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import StarFieldController from './StarField';
import CosmicPlanetController from './CosmicPlanet';
import HeroModelController from './HeroModel';
import VillainModelController from './VillainModel';
import LightningWarriorController from './LightningWarrior';
import SpiderManModelController from './SpiderManModel';
import { createCinematicCamera } from './CinematicCamera';

/**
 * CinematicScene:
 * Master Three.js WebGL canvas hosting the clean, character-focused superhero cinematic.
 * 
 * Design:
 * - Deep black cosmic space with crisp stars at multiple depths
 * - Distant planetary flyby (the_universe.glb)
 * - ALL FOUR REAL 3D CHARACTER MODELS: Doctor Doom, Thor, Iron Man, Spider-Man
 * - NO giant green planets, NO random black rocks, NO oversized rings, NO clutter
 * - Controlled character-specific lighting (emerald for Doom, blue-white for Thor, cyan-gold for Iron Man, cobalt-red for Spider-Man)
 * - Slow, buttery-smooth, reversible scroll progression
 */
export default function CinematicScene({ progress = 0, onAssetLoaded = () => {} }) {
  const containerRef = useRef(null);
  const progressRef = useRef(progress);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        onAssetLoaded(100);
        return;
      }
    } catch {
      setHasWebGL(false);
      onAssetLoaded(100);
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = width < 768;

    // 1. Scene with deep black space background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010206);
    scene.fog = new THREE.FogExp2(0x010206, 0.008);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 300);
    const cameraController = createCinematicCamera(camera, width / height);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: !isMobile,
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.2 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.maxWidth = '100%';
    container.appendChild(renderer.domElement);

    // 4. Clean Cinematic Studio Lighting for Character Models
    const ambientLight = new THREE.AmbientLight(0x0a1220, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(4, 6, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x182840, 1.2);
    fillLight.position.set(-5, -2, 4);
    scene.add(fillLight);

    const backRim = new THREE.DirectionalLight(0x406080, 1.5);
    backRim.position.set(0, 5, -5);
    scene.add(backRim);

    // 5. Initialize Clean Controllers (Stars, Cosmic Planet & Real Characters)
    const starField = new StarFieldController(isMobile);
    scene.add(starField.root);

    const cosmicPlanet = new CosmicPlanetController(isMobile);
    scene.add(cosmicPlanet.root);

    const villain = new VillainModelController(isMobile);
    scene.add(villain.root);

    const lightningWarrior = new LightningWarriorController(isMobile);
    scene.add(lightningWarrior.root);

    const hero = new HeroModelController(isMobile);
    scene.add(hero.root);

    const spiderMan = new SpiderManModelController(isMobile);
    scene.add(spiderMan.root);

    // Load Cosmic Planet (the_universe.glb) & All Four Real Character Models
    cosmicPlanet.load();

    let heroDone = false;
    let villainDone = false;
    let thorDone = false;
    let spiderDone = false;

    const checkAllLoaded = () => {
      if (heroDone && villainDone && thorDone && spiderDone) {
        onAssetLoaded(100);
      }
    };

    // 1. Doctor Doom
    villain
      .load((pct) => onAssetLoaded(pct * 0.25))
      .then(() => {
        villainDone = true;
        checkAllLoaded();
      })
      .catch((err) => {
        console.warn('Doctor Doom load fallback:', err);
        villainDone = true;
        checkAllLoaded();
      });

    // 2. Thor
    lightningWarrior
      .load((pct) => onAssetLoaded(25 + pct * 0.25))
      .then(() => {
        thorDone = true;
        checkAllLoaded();
      })
      .catch((err) => {
        console.warn('Thor load fallback:', err);
        thorDone = true;
        checkAllLoaded();
      });

    // 3. Iron Man
    hero
      .load((pct) => onAssetLoaded(50 + pct * 0.25))
      .then(() => {
        heroDone = true;
        checkAllLoaded();
      })
      .catch((err) => {
        console.warn('Iron Man load fallback:', err);
        heroDone = true;
        checkAllLoaded();
      });

    // 4. Spider-Man
    spiderMan
      .load((pct) => onAssetLoaded(75 + pct * 0.25))
      .then(() => {
        spiderDone = true;
        checkAllLoaded();
      })
      .catch((err) => {
        console.warn('Spider-Man load fallback:', err);
        spiderDone = true;
        checkAllLoaded();
      });

    // 6. Animation Render Loop with Smooth Progress Damping (Lerp)
    let animationFrameId;
    const clock = new THREE.Clock();
    let smoothedProgress = progressRef.current;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const targetProg = progressRef.current;

      // Smooth progress interpolation: responsive and silky smooth
      smoothedProgress += (targetProg - smoothedProgress) * 0.12;

      // Update controllers
      starField.update(smoothedProgress, elapsedTime);
      cosmicPlanet.update(smoothedProgress, elapsedTime);
      villain.update(smoothedProgress, elapsedTime);
      lightningWarrior.update(smoothedProgress, elapsedTime);
      hero.update(smoothedProgress, elapsedTime);
      spiderMan.update(smoothedProgress, elapsedTime);

      // Update Camera
      cameraController.update(smoothedProgress);

      renderer.render(scene, camera);
    };

    animate();

    // 7. Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      cameraController.resize(newW, newH);
      renderer.setSize(newW, newH);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, newW < 768 ? 1.2 : 2));
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);

    // Debug object for runtime verification
    if (typeof window !== 'undefined') {
      window.__CINEMATIC_DEBUG__ = {
        scene,
        camera,
        renderer,
        starField,
        cosmicPlanet,
        villain,
        lightningWarrior,
        hero,
        spiderMan,
      };
    }

    // 8. Cleanup & Resource Disposal
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);

      if (typeof window !== 'undefined') {
        delete window.__CINEMATIC_DEBUG__;
      }

      cameraController.dispose();
      starField.dispose();
      cosmicPlanet.dispose();
      villain.dispose();
      lightningWarrior.dispose();
      hero.dispose();
      spiderMan.dispose();

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onAssetLoaded]);

  if (!hasWebGL) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-slate-950 p-6 text-center text-white">
        <div className="max-w-md rounded-2xl border border-red-500/30 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="text-2xl font-black tracking-wider text-red-400 uppercase">
            HACKFEST 3.0
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            WebGL acceleration not detected. Entering HackFest direct mode.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 h-full w-full overflow-hidden"
      style={{ touchAction: 'pan-y' }}
    />
  );
}
