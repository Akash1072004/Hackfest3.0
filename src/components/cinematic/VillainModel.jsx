import * as THREE from 'three';
import { getGlowParticleTexture } from './particleTexture';

/**
 * VillainModelController:
 * Original Doom-inspired dark technological sorcerer.
 * Features:
 * 1. Dark gunmetal / titanium plate armor with emerald green runes
 * 2. Sculpted technological mantle and horned cowl
 * 3. Glowing emerald slit visor / eyes
 * 4. Mystic green energy gauntlet with orbiting plasma runes
 * 5. Expansive emerald energy wave blast effect
 * 6. Floating dark cosmic debris
 */
export class VillainModelController {
  constructor(isMobile = false) {
    this.root = new THREE.Group();
    this.root.name = 'Villain_Doom_Sorcerer_Root';
    this.isMobile = isMobile;

    this.materials = {
      darkPlate: null,
      goldTrim: null,
      emeraldGlow: null,
      energyWave: null,
    };

    this.energySphere = null;
    this.energyRings = [];
    this.energyWaveMesh = null;
    this.handRays = null;
    this.floatingDebris = [];
    this.greenLight = null;

    this.init();
  }

  init() {
    const glowTex = getGlowParticleTexture();

    // 1. Materials
    this.materials.darkPlate = new THREE.MeshStandardMaterial({
      color: 0x161b22, // Dark gunmetal titanium
      metalness: 0.88,
      roughness: 0.28,
    });

    this.materials.goldTrim = new THREE.MeshStandardMaterial({
      color: 0x8c733e, // Antique dark bronze/gold trim
      metalness: 0.9,
      roughness: 0.35,
    });

    this.materials.emeraldGlow = new THREE.MeshBasicMaterial({
      color: 0x00ff88, // Mystic emerald sorcery glow
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });

    this.materials.energyWave = new THREE.MeshBasicMaterial({
      color: 0x00ff77,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });

    // 2. Sculpted Villain Character Group
    const body = new THREE.Group();

    // Torso / Cuirass (segmented titanium plates)
    const chestGeo = new THREE.CylinderGeometry(0.55, 0.42, 1.1, 7);
    const chest = new THREE.Mesh(chestGeo, this.materials.darkPlate);
    chest.position.y = 1.65;
    body.add(chest);

    // Dark Sorcerer Mantle / Pauldrons (Flared angular shoulder guards)
    const pauldronGeo = new THREE.ConeGeometry(0.35, 0.5, 5);
    const pauldronL = new THREE.Mesh(pauldronGeo, this.materials.goldTrim);
    pauldronL.position.set(-0.68, 2.05, 0);
    pauldronL.rotation.z = Math.PI / 4;
    body.add(pauldronL);

    const pauldronR = new THREE.Mesh(pauldronGeo, this.materials.goldTrim);
    pauldronR.position.set(0.68, 2.05, 0);
    pauldronR.rotation.z = -Math.PI / 4;
    body.add(pauldronR);

    // Menacing Technological Cowl / Helmet
    const headGeo = new THREE.BoxGeometry(0.48, 0.55, 0.5);
    const head = new THREE.Mesh(headGeo, this.materials.darkPlate);
    head.position.y = 2.45;
    body.add(head);

    // Glowing Emerald Visor / Eyes
    const eyeGeo = new THREE.BoxGeometry(0.32, 0.08, 0.1);
    const eyes = new THREE.Mesh(eyeGeo, this.materials.emeraldGlow);
    eyes.position.set(0, 2.48, 0.26);
    body.add(eyes);

    // Hood / Brow Crest
    const cowlGeo = new THREE.ConeGeometry(0.42, 0.4, 4);
    const cowl = new THREE.Mesh(cowlGeo, this.materials.darkPlate);
    cowl.position.set(0, 2.75, -0.05);
    cowl.rotation.x = -0.2;
    body.add(cowl);

    // Right Arm (Raised Gauntlet charging energy)
    this.armR = new THREE.Group();
    this.armR.position.set(0.62, 1.95, 0);

    const bicepR = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.14, 0.6, 6), this.materials.darkPlate);
    bicepR.position.set(0.25, 0.15, 0.2);
    bicepR.rotation.set(-0.6, 0, -0.8);
    this.armR.add(bicepR);

    const forearmR = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.15, 0.65, 6), this.materials.goldTrim);
    forearmR.position.set(0.55, 0.55, 0.55);
    forearmR.rotation.set(-1.1, 0, -0.4);
    this.armR.add(forearmR);

    // Gauntlet Hand
    const handMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.25), this.materials.darkPlate);
    handMesh.position.set(0.72, 0.85, 0.85);
    this.armR.add(handMesh);
    body.add(this.armR);

    // Left Arm (Relaxed at side)
    const armL = new THREE.Group();
    armL.position.set(-0.62, 1.95, 0);
    const armLMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.14, 1.1, 6), this.materials.darkPlate);
    armLMesh.position.set(-0.1, -0.45, 0.05);
    armLMesh.rotation.z = 0.12;
    armL.add(armLMesh);
    body.add(armL);

    // Armored Legs
    const legGeo = new THREE.CylinderGeometry(0.2, 0.16, 1.25, 6);
    const legL = new THREE.Mesh(legGeo, this.materials.darkPlate);
    legL.position.set(-0.25, 0.65, 0);
    body.add(legL);

    const legR = new THREE.Mesh(legGeo, this.materials.darkPlate);
    legR.position.set(0.25, 0.65, 0);
    body.add(legR);

    this.root.add(body);

    // 3. Mystic Green Energy Core / Gauntlet Plasma Orb
    const orbGeo = new THREE.SphereGeometry(0.28, 20, 20);
    this.energySphere = new THREE.Mesh(orbGeo, this.materials.emeraldGlow);
    this.energySphere.position.set(1.35, 2.8, 0.9);
    this.root.add(this.energySphere);

    // Orbiting Mystic Runic Rings around hand
    [0.45, 0.72].forEach((radius, idx) => {
      const ringGeo = new THREE.TorusGeometry(radius, 0.025, 12, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: idx === 0 ? 0x00ff88 : 0x33ffbb,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(this.energySphere.position);
      this.energyRings.push(ring);
      this.root.add(ring);
    });

    // 4. Emerald Energy Shockwave (expands toward camera on blast)
    const waveGeo = new THREE.RingGeometry(0.5, 1.8, 36);
    this.energyWaveMesh = new THREE.Mesh(waveGeo, this.materials.energyWave);
    this.energyWaveMesh.position.copy(this.energySphere.position);
    this.root.add(this.energyWaveMesh);

    // 5. Orbiting Technological Sorcery Debris
    const debrisCount = this.isMobile ? 12 : 28;
    for (let i = 0; i < debrisCount; i++) {
      const dGeo = new THREE.DodecahedronGeometry(0.08 + Math.random() * 0.12);
      const dMesh = new THREE.Mesh(dGeo, this.materials.darkPlate);
      const angle = Math.random() * Math.PI * 2;
      const dist = 1.2 + Math.random() * 2.2;
      dMesh.position.set(Math.cos(angle) * dist, 1.8 + (Math.random() - 0.5) * 1.5, Math.sin(angle) * dist);
      this.floatingDebris.push({
        mesh: dMesh,
        angle,
        speed: 0.8 + Math.random() * 1.2,
        dist,
        rotSpeed: (Math.random() - 0.5) * 2,
      });
      this.root.add(dMesh);
    }

    // 6. Dynamic Emerald Radiation Point Light
    this.greenLight = new THREE.PointLight(0x00ff88, 0, 25);
    this.greenLight.position.copy(this.energySphere.position);
    this.root.add(this.greenLight);

    this.root.visible = false;
  }

  update(progress, time) {
    // Villain active during:
    // Stage A: Entrance & Energy Action (48% - 60%)
    // Stage B: Cosmic Face-Off with Hero (60% - 70%)
    // Stage C: Final Team Assembly (82% - 95%)
    let isVisible = false;

    if (progress >= 0.46 && progress < 0.58) {
      // -----------------------------------------------------------
      // STAGE A: VILLAIN ENTRANCE & ENERGY BLAST (46% - 58%)
      // -----------------------------------------------------------
      isVisible = true;
      const p = (progress - 0.46) / 0.12; // 0 to 1

      // Villain steps forward out of dark space
      this.root.position.set(
        0,
        THREE.MathUtils.lerp(-0.5, 0.0, p),
        THREE.MathUtils.lerp(-18, -9.5, p)
      );
      this.root.rotation.set(0.05, Math.sin(p * Math.PI) * 0.15, 0);

      // Energy charging and shockwave expansion
      const charge = Math.min(1, Math.max(0, (p - 0.25) / 0.4));
      const sphereScale = 0.5 + charge * 1.8 + Math.sin(time * 8) * 0.15;
      this.energySphere.scale.set(sphereScale, sphereScale, sphereScale);
      this.greenLight.intensity = charge * 5.0;

      // Energy wave blast towards camera (p > 0.6)
      if (p > 0.6) {
        const blastP = (p - 0.6) / 0.4;
        this.energyWaveMesh.visible = true;
        this.energyWaveMesh.scale.setScalar(1 + blastP * 16);
        this.energyWaveMesh.position.z = 0.9 + blastP * 8;
        this.materials.energyWave.opacity = (1 - blastP) * 0.85;
      } else {
        this.energyWaveMesh.visible = false;
        this.materials.energyWave.opacity = 0;
      }
    } else if (progress >= 0.58 && progress < 0.70) {
      // -----------------------------------------------------------
      // STAGE B: HERO VS VILLAIN FACE-OFF (58% - 70%)
      // -----------------------------------------------------------
      isVisible = true;
      const p = (progress - 0.58) / 0.12;

      // Positioned on the right flank facing center
      this.root.position.set(3.4, 0.2, -13.5);
      this.root.rotation.set(0, -0.65, 0); // Faces toward center-left where hero is

      const sphereScale = 1.6 + Math.sin(time * 6) * 0.25;
      this.energySphere.scale.set(sphereScale, sphereScale, sphereScale);
      this.greenLight.intensity = 4.2;
      this.energyWaveMesh.visible = false;
    } else if (progress >= 0.82 && progress < 0.94) {
      // -----------------------------------------------------------
      // STAGE C: TEAM ASSEMBLY POSTER FORMATION (82% - 94%)
      // -----------------------------------------------------------
      isVisible = true;
      const p = (progress - 0.82) / 0.12;

      // Positioned in the team poster triad (center-right flank)
      this.root.position.set(
        THREE.MathUtils.lerp(3.4, 2.6, p),
        THREE.MathUtils.lerp(0.2, -0.3, p),
        THREE.MathUtils.lerp(-13.5, -16.0, p)
      );
      this.root.rotation.set(0, -0.35, 0);

      this.energySphere.scale.set(1.2, 1.2, 1.2);
      this.greenLight.intensity = 2.8;
      this.energyWaveMesh.visible = false;
    } else {
      isVisible = false;
    }

    this.root.visible = isVisible;

    if (!isVisible) return;

    // Rotate mystic energy rings
    this.energyRings.forEach((r, idx) => {
      r.rotation.x += (idx === 0 ? 0.04 : -0.03);
      r.rotation.y += 0.035;
    });

    // Orbit floating technological debris
    this.floatingDebris.forEach((d) => {
      d.angle += d.speed * 0.015;
      d.mesh.position.x = Math.cos(d.angle) * d.dist;
      d.mesh.position.z = Math.sin(d.angle) * d.dist;
      d.mesh.rotation.x += d.rotSpeed * 0.02;
      d.mesh.rotation.y += d.rotSpeed * 0.02;
    });
  }

  dispose() {
    Object.values(this.materials).forEach((m) => {
      if (m && m.dispose) m.dispose();
    });
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
  }
}

export default VillainModelController;
