import * as THREE from 'three';
import { getGlowParticleTexture } from './particleTexture';

/**
 * LightningWarriorController:
 * Atmospheric Lightning Rift & Cosmic Thunder Field.
 * 
 * THOR AUDIT & COMPLIANCE:
 * - /models/thor/thor.glb was inspected and confirmed to contain Jane Foster (female Thor / hero_janefoster01).
 * - Exhaustive search confirmed NO male Thor 3D model exists in this project or machine.
 * - In strict compliance with instructions: Female Thor is EXCLUDED.
 * - Thor's hammer (Mjolnir) is NOT used as a substitute for the character.
 * - This controller provides an atmospheric Bifrost celestial electric storm bridging
 *   between Doctor Doom (Scene 3) and Iron Man (Scene 5).
 * - No character model is loaded or rendered here.
 */
export class LightningWarriorController {
  constructor(isMobile = false) {
    this.root = new THREE.Group();
    this.root.name = 'Thor_Atmospheric_Root';
    this.isMobile = isMobile;

    this.model = null;
    this.isLoaded = false; // Accurately reflects no male Thor model asset exists
    this.loadError = null;

    // Effects pivot
    this.characterPivot = new THREE.Group();
    this.characterPivot.name = 'Thunder_Pivot';
    this.root.add(this.characterPivot);

    this.thunderLight = null;
    this.lightningArcs = null;
    this.electricEmbers = null;
    this.emberGeo = null;
    this.emberData = [];

    this.materials = {
      lightningLine: null,
      emberGlow: null,
    };

    this.initEffects();
  }

  initEffects() {
    const glowTex = getGlowParticleTexture();

    // 1. Cosmic lightning line segments across space
    const arcCount = this.isMobile ? 12 : 24;
    const arcGeo = new THREE.BufferGeometry();
    const arcPos = new Float32Array(arcCount * 6);
    for (let i = 0; i < arcCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 0.5 + Math.random() * 2.0;
      arcPos[i * 6] = Math.cos(angle) * r;
      arcPos[i * 6 + 1] = 1.6 + (Math.random() - 0.5) * 2.5;
      arcPos[i * 6 + 2] = Math.sin(angle) * r;

      const angle2 = angle + (Math.random() - 0.5) * 0.8;
      const r2 = r + (Math.random() - 0.5) * 1.2;
      arcPos[i * 6 + 3] = Math.cos(angle2) * r2;
      arcPos[i * 6 + 4] = arcPos[i * 6 + 1] + (Math.random() - 0.5) * 1.5;
      arcPos[i * 6 + 5] = Math.sin(angle2) * r2;
    }
    arcGeo.setAttribute('position', new THREE.BufferAttribute(arcPos, 3));

    this.materials.lightningLine = new THREE.LineBasicMaterial({
      color: 0x94ebff,
      transparent: true,
      opacity: 0.0,
      linewidth: 2,
      blending: THREE.AdditiveBlending,
    });
    this.lightningArcs = new THREE.LineSegments(arcGeo, this.materials.lightningLine);
    this.characterPivot.add(this.lightningArcs);

    // 2. Electric blue embers
    const count = this.isMobile ? 20 : 40;
    this.emberGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    this.emberData = [];

    for (let i = 0; i < count; i++) {
      const radius = 0.5 + Math.random() * 2.5;
      const angle = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = 0.5 + Math.random() * 3.0;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      col[i * 3] = 0.4;
      col[i * 3 + 1] = 0.85;
      col[i * 3 + 2] = 1.0;

      this.emberData.push({
        baseX: pos[i * 3],
        baseY: pos[i * 3 + 1],
        baseZ: pos[i * 3 + 2],
        speed: 1.5 + Math.random() * 2.5,
        phase: Math.random() * Math.PI * 2,
      });
    }

    this.emberGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.emberGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));

    this.materials.emberGlow = new THREE.PointsMaterial({
      size: 0.16,
      map: glowTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.electricEmbers = new THREE.Points(this.emberGeo, this.materials.emberGlow);
    this.characterPivot.add(this.electricEmbers);

    // 3. Thunder flash light
    this.thunderLight = new THREE.PointLight(0x60d5ff, 0, 30);
    this.thunderLight.position.set(0, 2.0, 0);
    this.characterPivot.add(this.thunderLight);

    this.root.visible = false;
  }

  async load(onProgress = () => {}) {
    // No male Thor 3D model exists in project assets.
    // Progress callback reports completion without stalling the loader.
    onProgress(100);
    return Promise.resolve(this.root);
  }

  update(progress, elapsedTime) {
    let isVisible = false;

    // -------------------------------------------------------------
    // SCENE 4: ATMOSPHERIC BIFROST LIGHTNING SURGE (0.46 - 0.58)
    // -------------------------------------------------------------
    if (progress >= 0.46 && progress < 0.58) {
      isVisible = true;
      const p = (progress - 0.46) / 0.12; // 0 to 1

      this.root.position.set(0, 0, -1.0);

      // Flickering thunder flash
      const flash = Math.sin(elapsedTime * 25.0) > 0.4 ? 4.5 : 0.8;
      this.thunderLight.intensity = flash * Math.sin(p * Math.PI);

      this.materials.lightningLine.opacity = (0.4 + Math.sin(elapsedTime * 20.0) * 0.4) * Math.sin(p * Math.PI);
      this.materials.emberGlow.opacity = 0.7 * Math.sin(p * Math.PI);

      // Jitter lightning arcs
      const arcPos = this.lightningArcs.geometry.attributes.position;
      for (let i = 0; i < arcPos.count; i++) {
        if (Math.random() < 0.1) {
          arcPos.setY(i, arcPos.getY(i) + (Math.random() - 0.5) * 0.05);
        }
      }
      arcPos.needsUpdate = true;
    } else {
      isVisible = false;
    }

    this.root.visible = isVisible;
  }

  dispose() {
    if (this.root) {
      this.root.traverse((c) => {
        if (c.geometry) c.geometry.dispose();
        if (c.material) {
          if (Array.isArray(c.material)) c.material.forEach((m) => m.dispose());
          else c.material.dispose();
        }
      });
    }
  }
}

export default LightningWarriorController;
