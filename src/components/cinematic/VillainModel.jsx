import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { getGlowParticleTexture } from './particleTexture';

/**
 * VillainModelController (Doctor Doom):
 * Loads and displays the authentic Doctor Doom 3D model (doom.glb).
 * 
 * Clean, character-focused design:
 * - Real GLB loaded from /models/doom/doom.glb
 * - Authentic dark armor, silver faceplate, and forest-green cowl
 * - Dramatic emerald-green rim lighting and subtle green specular reflections
 * - Subtle, thin green portal ring BEHIND Doom (never covering the character)
 * - Restrained green stardust particles around gauntlet
 * - Fully framed in camera (head to boots completely visible)
 */
export class VillainModelController {
  constructor(isMobile = false) {
    this.root = new THREE.Group();
    this.root.name = 'DoctorDoom_Root';
    this.isMobile = isMobile;

    this.model = null;
    this.isLoaded = false;
    this.loadError = null;

    // Character pivot
    this.characterPivot = new THREE.Group();
    this.characterPivot.name = 'Doom_Pivot';
    this.root.add(this.characterPivot);

    // Subtle green background portal ring (behind Doom)
    this.portalRing = null;

    // Subtle green stardust particles
    this.stardust = null;
    this.stardustGeo = null;
    this.stardustData = [];

    // Lighting
    this.rimLight = null;
    this.fillLight = null;
    this.keyLight = null;

    this.materials = {
      portalRing: null,
      stardust: null,
    };

    this.initEffects();
  }

  initEffects() {
    const glowTex = getGlowParticleTexture();

    // 1. Subtle, elegant thin portal ring BEHIND Doom (Z = -1.2)
    const ringGeo = new THREE.TorusGeometry(2.3, 0.025, 16, 64);
    this.materials.portalRing = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    this.portalRing = new THREE.Mesh(ringGeo, this.materials.portalRing);
    this.portalRing.position.set(0, 1.8, -1.2);
    this.characterPivot.add(this.portalRing);

    // 2. Restrained green stardust particles around gauntlet and body (small, subtle)
    const particleCount = this.isMobile ? 18 : 35;
    this.stardustGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    this.stardustData = [];

    for (let i = 0; i < particleCount; i++) {
      const radius = 0.4 + Math.random() * 1.5;
      const angle = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = 1.0 + Math.random() * 1.6;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      col[i * 3] = 0.1;
      col[i * 3 + 1] = 0.95;
      col[i * 3 + 2] = 0.45;

      this.stardustData.push({
        baseX: pos[i * 3],
        baseY: pos[i * 3 + 1],
        baseZ: pos[i * 3 + 2],
        speed: 1.0 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
      });
    }

    this.stardustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.stardustGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));

    this.materials.stardust = new THREE.PointsMaterial({
      size: 0.12,
      map: glowTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.stardust = new THREE.Points(this.stardustGeo, this.materials.stardust);
    this.characterPivot.add(this.stardust);

    // 3. Dynamic Emerald Lighting
    this.rimLight = new THREE.PointLight(0x00ff77, 0, 22);
    this.rimLight.position.set(0, 2.6, -1.8);
    this.characterPivot.add(this.rimLight);

    this.fillLight = new THREE.PointLight(0x22ee88, 0, 16);
    this.fillLight.position.set(-0.8, 2.0, 1.4);
    this.characterPivot.add(this.fillLight);

    this.keyLight = new THREE.PointLight(0x88ffcc, 0, 16);
    this.keyLight.position.set(0.8, 2.2, 1.5);
    this.characterPivot.add(this.keyLight);

    this.root.visible = false;
  }

  async load(onProgress = () => {}) {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      const primaryUrl = '/models/doom/doom.glb';
      const fallbackUrl = '/models/hero/doom/doom.glb';

      const attemptLoad = (url) => {
        loader.load(
          url,
          (gltf) => {
            this.model = gltf.scene;
            this.model.name = 'DoctorDoom_Model';

            this.setupModel();
            this.characterPivot.add(this.model);
            this.isLoaded = true;
            this.loadError = null;
            console.log(`Doctor Doom: Authentic 3D model loaded successfully from ${url}.`);

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
              console.warn(`Doctor Doom primary load failed (${primaryUrl}), trying fallback...`);
              attemptLoad(fallbackUrl);
            } else {
              console.error('CRITICAL: Failed to load Doctor Doom 3D model:', err);
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

    // Scale to ~1.65: raw height is 2.02m -> scaled height is ~3.33m
    const targetScale = 1.65;
    this.model.scale.set(targetScale, targetScale, targetScale);

    this.model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          const mat = child.material;
          mat.roughness = Math.min(mat.roughness ?? 0.38, 0.4);
          mat.metalness = Math.max(mat.metalness ?? 0.65, 0.7);
          mat.envMapIntensity = 1.5;
          mat.needsUpdate = true;
        }
      }
    });

    // Center X & Z, place feet at Y = 0
    this.model.position.set(0, 0, 0);
  }

  update(progress, elapsedTime) {
    let isVisible = false;

    // -------------------------------------------------------------
    // SCENE 3: DOCTOR DOOM'S REVEAL (0.28 - 0.46)
    // -------------------------------------------------------------
    if (progress >= 0.28 && progress < 0.46) {
      isVisible = true;
      const p = (progress - 0.28) / 0.18; // 0 to 1 across 18% of scroll duration

      // Doom emerges smoothly forward from deep space darkness: Z = -4.0 -> -0.5
      const emergeEase = Math.pow(p, 1.2);
      const posZ = THREE.MathUtils.lerp(-4.0, -0.5, emergeEase);
      this.root.position.set(0, 0, posZ);

      // Subtle breathing float and menacing slight rotation
      this.characterPivot.position.y = Math.sin(elapsedTime * 2.0) * 0.03;
      this.characterPivot.rotation.y = Math.sin(elapsedTime * 0.8) * 0.04;

      // Vivid lighting from the start:
      this.rimLight.intensity = 3.5 + p * 1.5;
      this.fillLight.intensity = 2.0 + p * 1.0;
      this.keyLight.intensity = 1.8 + p * 1.0;
      this.materials.portalRing.opacity = 0.5 + p * 0.3;
      this.materials.stardust.opacity = 0.4 + p * 0.4;
    }
    // -------------------------------------------------------------
    // SCENE 7: SUPERHERO ASSEMBLY (0.88 - 1.00)
    // -------------------------------------------------------------
    else if (progress >= 0.88) {
      isVisible = true;
      const p = (progress - 0.88) / 0.12;

      // Right flank champion: X = 2.4, Y = 0.0, Z = -0.4
      this.root.position.set(2.4, 0.0, -0.4);
      this.characterPivot.rotation.set(0, -0.25, 0);
      this.characterPivot.position.y = Math.sin(elapsedTime * 1.8) * 0.03;

      this.rimLight.intensity = 4.0;
      this.fillLight.intensity = 2.2;
      this.keyLight.intensity = 2.0;
      this.materials.portalRing.opacity = 0.6;
      this.materials.stardust.opacity = 0.5;
    } else {
      isVisible = false;
    }

    this.root.visible = isVisible;

    // Animate stardust
    if (isVisible && this.stardustGeo) {
      const posAttr = this.stardustGeo.attributes.position;
      for (let i = 0; i < this.stardustData.length; i++) {
        const d = this.stardustData[i];
        const t = elapsedTime * d.speed + d.phase;
        posAttr.setY(i, d.baseY + Math.sin(t) * 0.2);
      }
      posAttr.needsUpdate = true;
    }
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
    if (this.stardustGeo) this.stardustGeo.dispose();
    if (this.materials.portalRing) this.materials.portalRing.dispose();
    if (this.materials.stardust) this.materials.stardust.dispose();
  }
}

export default VillainModelController;
