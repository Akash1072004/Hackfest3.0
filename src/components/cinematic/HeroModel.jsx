import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { getGlowParticleTexture } from './particleTexture';

/**
 * HeroModelController (Iron Man):
 * Loads and renders the authentic Iron Man Mark VII 3D model (ironman.glb).
 * 
 * Features:
 * - Real GLB loaded from /models/ironman/ironman.glb
 * - Authentic Mark VII armor with red & gold metallic specular highlights
 * - Glowing white-cyan Arc Reactor core and visor eye illumination
 * - Powerful frontal studio key light to make red & gold armor brightly visible
 * - Subtle foot thrusters with gentle blue flame particles
 * - Correct scale (3.32m height) and upright orientation
 * - Fully visible in Scene 5 and Scene 7 (Superhero Assembly)
 */
export class HeroModelController {
  constructor(isMobile = false) {
    this.root = new THREE.Group();
    this.root.name = 'IronMan_Root';
    this.isMobile = isMobile;

    this.model = null;
    this.isLoaded = false;
    this.loadError = null;

    // Character pivot
    this.characterPivot = new THREE.Group();
    this.characterPivot.name = 'IronMan_Pivot';
    this.root.add(this.characterPivot);

    // Dynamic lights & emitters
    this.arcReactorLight = null;
    this.armorKeyLight = null;
    this.frontFillLight = null;
    this.thrusterParticles = null;
    this.thrusterGeo = null;
    this.thrusterData = [];

    this.materials = {
      thrusterGlow: null,
    };

    this.initEffects();
  }

  initEffects() {
    const glowTex = getGlowParticleTexture();

    // 1. Arc reactor chest point light (white-cyan)
    this.arcReactorLight = new THREE.PointLight(0x00e1ff, 0, 16);
    this.arcReactorLight.position.set(0, 2.0, 0.5);
    this.characterPivot.add(this.arcReactorLight);

    // 2. Armor chest illumination light (gold/red enhancement)
    this.armorKeyLight = new THREE.PointLight(0xffbb55, 0, 14);
    this.armorKeyLight.position.set(0, 2.2, 1.4);
    this.characterPivot.add(this.armorKeyLight);

    // 3. Bright frontal studio key light for red/gold armor plates
    this.frontFillLight = new THREE.PointLight(0xfff4e6, 0, 22);
    this.frontFillLight.position.set(0, 2.0, 3.0);
    this.characterPivot.add(this.frontFillLight);

    // 4. Foot Thruster Particle System
    const count = this.isMobile ? 18 : 36;
    this.thrusterGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    this.thrusterData = [];

    for (let i = 0; i < count; i++) {
      const isLeft = i % 2 === 0;
      const footX = isLeft ? -0.32 : 0.32;
      pos[i * 3] = footX + (Math.random() - 0.5) * 0.1;
      pos[i * 3 + 1] = -0.05 - Math.random() * 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.1;

      col[i * 3] = 0.2;
      col[i * 3 + 1] = 0.8;
      col[i * 3 + 2] = 1.0;

      this.thrusterData.push({
        footX,
        y: pos[i * 3 + 1],
        speed: 1.2 + Math.random() * 1.8,
      });
    }

    this.thrusterGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.thrusterGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));

    this.materials.thrusterGlow = new THREE.PointsMaterial({
      size: 0.15,
      map: glowTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.thrusterParticles = new THREE.Points(this.thrusterGeo, this.materials.thrusterGlow);
    this.characterPivot.add(this.thrusterParticles);

    this.root.visible = false;
  }

  async load(onProgress = () => {}) {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      const primaryUrl = '/models/ironman/ironman.glb';
      const fallbackUrl = '/models/hero/doom/iron_man.glb';

      const attemptLoad = (url) => {
        loader.load(
          url,
          (gltf) => {
            this.model = gltf.scene;
            this.model.name = 'IronMan_Model';

            this.setupModel();
            this.characterPivot.add(this.model);
            this.isLoaded = true;
            this.loadError = null;
            console.log(`Iron Man: Authentic Mark VII 3D model loaded successfully from ${url}.`);

            onProgress(100);
            resolve(this.root);
          },
          (xhr) => {
            if (xhr.total > 0) {
              onProgress(Math.round((xhr.loaded / xhr.total) * 100));
            }
          },
          (err) => {
            if (url === primaryUrl) {
              console.warn(`Iron Man primary load failed (${primaryUrl}), trying fallback...`);
              attemptLoad(fallbackUrl);
            } else {
              console.error('CRITICAL: Failed to load Iron Man 3D model:', err);
              this.loadError = err;
              this.isLoaded = false;
              reject(err);
            }
          }
        );
      };

      attemptLoad(primaryUrl);
    });
  }

  setupModel() {
    if (!this.model) return;

    // Scale to ~3.8m height (commanding armored avenger):
    const targetScale = 3.8 / 2305; // ~0.00165
    this.model.scale.set(targetScale, targetScale, targetScale);

    // Rotate -90deg around X so Z (height) points straight UP (+Y), and Y (depth) points toward camera (+Z)
    this.model.rotation.set(-Math.PI / 2, 0, 0);
    this.model.position.set(0, 0, 0);

    this.model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          const mat = child.material;
          mat.metalness = 0.55;
          mat.roughness = 0.35;
          mat.envMapIntensity = 1.6;
          mat.needsUpdate = true;
        }
      }
    });
  }

  update(progress, elapsedTime) {
    let isVisible = false;

    // -------------------------------------------------------------
    // SCENE 5: IRON MAN'S ARRIVAL (0.58 - 0.74)
    // -------------------------------------------------------------
    if (progress >= 0.58 && progress < 0.74) {
      isVisible = true;
      const p = (progress - 0.58) / 0.16; // 0 to 1 across 16% of scroll duration

      // Smooth supersonic deceleration into frame: Z = -3.5 -> -0.3, Y = 1.2 -> 0.4
      const decel = 1 - Math.pow(1 - p, 2.2);
      const posY = THREE.MathUtils.lerp(1.2, 0.4, decel);
      const posZ = THREE.MathUtils.lerp(-3.5, -0.3, decel);
      this.root.position.set(0, posY, posZ);

      // Hover posture
      const flightPitch = THREE.MathUtils.lerp(0.25, 0.0, decel);
      this.characterPivot.rotation.set(flightPitch, 0, 0);
      this.characterPivot.position.y = Math.sin(elapsedTime * 2.2) * 0.03;

      // Lights
      const reactorGlow = 2.8 + Math.sin(elapsedTime * 4.0) * 0.5;
      this.arcReactorLight.intensity = reactorGlow;
      this.armorKeyLight.intensity = 2.5;
      this.frontFillLight.intensity = 5.0;

      // Animate thruster particles
      this.materials.thrusterGlow.opacity = Math.max(0.4, 1.0 - decel * 0.4);
      const posAttr = this.thrusterGeo.attributes.position;
      for (let i = 0; i < this.thrusterData.length; i++) {
        const d = this.thrusterData[i];
        let y = posAttr.getY(i) - d.speed * 0.02;
        if (y < -0.8) {
          y = -0.05;
        }
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;
    }
    // -------------------------------------------------------------
    // SCENE 7: SUPERHERO ASSEMBLY (0.88 - 1.00)
    // -------------------------------------------------------------
    else if (progress >= 0.88) {
      isVisible = true;
      const p = (progress - 0.88) / 0.12;

      // Center vanguard, framed proudly between Spider-Man & Doom: X = 0.0, Y = 0.65, Z = 0.0
      this.root.position.set(0.0, 0.65, 0.0);
      this.characterPivot.rotation.set(0, 0, 0);
      this.characterPivot.position.y = Math.sin(elapsedTime * 1.8 + 1.0) * 0.03;

      this.arcReactorLight.intensity = 3.0;
      this.armorKeyLight.intensity = 2.8;
      this.frontFillLight.intensity = 5.5;
      this.materials.thrusterGlow.opacity = 0.6;

      const posAttr = this.thrusterGeo.attributes.position;
      for (let i = 0; i < this.thrusterData.length; i++) {
        const d = this.thrusterData[i];
        let y = posAttr.getY(i) - d.speed * 0.015;
        if (y < -0.6) {
          y = -0.05;
        }
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;
    } else {
      isVisible = false;
    }

    this.root.visible = isVisible;
  }

  dispose() {
    if (this.root) {
      this.root.traverse((c) => {
        if (c.isMesh) {
          if (c.geometry) c.geometry.dispose();
          if (c.material) {
            if (Array.isArray(c.material)) c.material.forEach((m) => m.dispose());
            else c.material.dispose();
          }
        }
      });
    }
    if (this.thrusterGeo) this.thrusterGeo.dispose();
    if (this.materials.thrusterGlow) this.materials.thrusterGlow.dispose();
  }
}

export default HeroModelController;
