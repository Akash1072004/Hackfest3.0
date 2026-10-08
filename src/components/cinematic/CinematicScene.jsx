import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import StarFieldController from './StarField';
import UniverseTravelController from './UniverseTravel';
import HeroModelController from './HeroModel';
import EnergyCoreController from './EnergyCore';
import BlackHoleController from './BlackHole';
import GalaxyController from './Galaxy';
import DistantObjectsController from './DistantObjects';
import MultiversePortalController from './MultiversePortal';
import { createCinematicCamera } from './CinematicCamera';

/**
 * CinematicScene:
 * Master Three.js WebGL canvas hosting the 3D cinematic superhero universe.
 * Renders:
 * Phase 1: 3D Armored Superhero character, glowing reactor core, launch stance
 * Phase 2: Interstellar travel, 3-layer parallax starfield, warp speed streaks,
 *          Gargantua-class Black Hole with accretion disk & gravitational lensing,
 *          Majestic 4-arm rotating Spiral Galaxy & Cosmic Nebula,
 *          Deep space research artifacts, Multiverse Portal, and dynamic camera choreography.
 */
export default function CinematicScene({ progress = 0, onAssetLoaded = () => {} }) {
  const containerRef = useRef(null);
  const progressRef = useRef(progress);
  const [hasWebGL, setHasWebGL] = useState(true);

  // Keep progressRef updated for the animation loop
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

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020308);
    // Subtle cosmic depth fog
    scene.fog = new THREE.FogExp2(0x020308, 0.009);

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
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.maxWidth = '100%';
    container.appendChild(renderer.domElement);

    // 4. Cinematic Lighting
    // Ambient light: deep cosmic navy
    const ambientLight = new THREE.AmbientLight(0x081226, 1.4);
    scene.add(ambientLight);

    // Key Rim Light: Warm Gold/Red Marvel tone from top-right
    const keyLight = new THREE.DirectionalLight(0xff4422, 2.8);
    keyLight.position.set(6, 8, 4);
    scene.add(keyLight);

    // Fill Light: High-tech Cyan Stark Tone from bottom-left
    const fillLight = new THREE.DirectionalLight(0x00d9ff, 2.0);
    fillLight.position.set(-6, -2, 3);
    scene.add(fillLight);

    // Top Rim Backlight: sharp silhouette highlight
    const backRim = new THREE.DirectionalLight(0xffffff, 2.2);
    backRim.position.set(0, 7, -6);
    scene.add(backRim);

    // 5. Initialize 3D Controllers
    // 3-Layer Parallax Starfield & Cosmic Dust
    const starField = new StarFieldController(isMobile);
    scene.add(starField.root);

    // Warp speed light streaks
    const universeTravel = new UniverseTravelController(isMobile);
    scene.add(universeTravel.root);

    // Gargantua-class Black Hole
    const blackHole = new BlackHoleController(isMobile);
    scene.add(blackHole.root);

    // 4-arm rotating Spiral Galaxy & Cosmic Nebula
    const galaxy = new GalaxyController(isMobile);
    scene.add(galaxy.root);

    // Distant deep-space research probe & ringed planetoid
    const distantObjects = new DistantObjectsController(isMobile);
    scene.add(distantObjects.root);

    // Multiverse cosmic portal
    const multiversePortal = new MultiversePortalController();
    scene.add(multiversePortal.root);

    // Energy core (holographic rings)
    const energyCore = new EnergyCoreController();
    scene.add(energyCore.root);

    // Superhero armored character
    const hero = new HeroModelController();
    scene.add(hero.root);

    hero
      .load((percent) => {
        onAssetLoaded(percent);
      })
      .then(() => {
        onAssetLoaded(100);
      })
      .catch((err) => {
        console.warn('Hero load fallback triggered:', err);
        onAssetLoaded(100);
      });

    // 6. Animation Render Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const currentProg = progressRef.current;

      // Update controllers
      starField.update(currentProg, elapsedTime);
      universeTravel.update(currentProg, elapsedTime);
      blackHole.update(currentProg, elapsedTime);
      galaxy.update(currentProg, elapsedTime);
      distantObjects.update(currentProg, elapsedTime);
      multiversePortal.update(currentProg, elapsedTime);
      energyCore.update(currentProg, elapsedTime);
      hero.update(currentProg, elapsedTime);

      // Anchor energy core to hero position while preparing
      if (currentProg < 0.65) {
        energyCore.root.position.copy(hero.root.position);
      }

      // Update Camera controller
      cameraController.update(currentProg, hero.root);

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

    // 8. Cleanup & Resource Disposal
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);

      cameraController.dispose();
      starField.dispose();
      universeTravel.dispose();
      blackHole.dispose();
      galaxy.dispose();
      distantObjects.dispose();
      multiversePortal.dispose();
      energyCore.dispose();
      hero.dispose();

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
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-950/80 border border-red-500/40 text-red-400">
            ★
          </div>
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
