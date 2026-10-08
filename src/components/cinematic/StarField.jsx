import * as THREE from 'three';
import { getGlowParticleTexture } from './particleTexture';

/**
 * StarFieldController:
 * 3-Layer Depth Parallax Starfield & Cosmic Dust with smooth glow particles.
 */
export class StarFieldController {
  constructor(isMobile = false) {
    this.root = new THREE.Group();
    this.root.name = 'Deep_Multiverse_StarField';
    this.isMobile = isMobile;

    this.layer1 = null;
    this.layer2 = null;
    this.layer3 = null;

    this.layer3Velocities = [];

    this.init();
  }

  init() {
    const glowTex = getGlowParticleTexture();

    // -------------------------------------------------------------
    // LAYER 1: Distant Background Stars
    // -------------------------------------------------------------
    const count1 = this.isMobile ? 1200 : 3200;
    const geo1 = new THREE.BufferGeometry();
    const pos1 = new Float32Array(count1 * 3);
    const col1 = new Float32Array(count1 * 3);

    const cWhite = new THREE.Color(0xffffff);
    const cPaleBlue = new THREE.Color(0x99ccff);
    const cGold = new THREE.Color(0xffe099);

    for (let i = 0; i < count1; i++) {
      const radius = 25 + Math.random() * 85;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos1[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos1[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos1[i * 3 + 2] = -15 - Math.random() * 95;

      const pick = Math.random();
      const col = pick < 0.6 ? cWhite : pick < 0.85 ? cPaleBlue : cGold;
      col1[i * 3] = col.r;
      col1[i * 3 + 1] = col.g;
      col1[i * 3 + 2] = col.b;
    }

    geo1.setAttribute('position', new THREE.BufferAttribute(pos1, 3));
    geo1.setAttribute('color', new THREE.BufferAttribute(col1, 3));

    const mat1 = new THREE.PointsMaterial({
      size: this.isMobile ? 0.14 : 0.16,
      map: glowTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.layer1 = new THREE.Points(geo1, mat1);
    this.root.add(this.layer1);

    // -------------------------------------------------------------
    // LAYER 2: Medium Interstellar Stars & Twinkling Dust
    // -------------------------------------------------------------
    const count2 = this.isMobile ? 700 : 1800;
    const geo2 = new THREE.BufferGeometry();
    const pos2 = new Float32Array(count2 * 3);
    const col2 = new Float32Array(count2 * 3);

    const cCyan = new THREE.Color(0x00f3ff);
    const cAmber = new THREE.Color(0xf5b642);
    const cCrimson = new THREE.Color(0xe62429);
    const cViolet = new THREE.Color(0xa855f7);

    for (let i = 0; i < count2; i++) {
      const radius = 10 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const z = 15 - Math.random() * 90;

      pos2[i * 3] = Math.cos(theta) * radius;
      pos2[i * 3 + 1] = Math.sin(theta) * radius;
      pos2[i * 3 + 2] = z;

      const pick = Math.random();
      const col = pick < 0.4 ? cCyan : pick < 0.7 ? cAmber : pick < 0.88 ? cViolet : cCrimson;
      col2[i * 3] = col.r;
      col2[i * 3 + 1] = col.g;
      col2[i * 3 + 2] = col.b;
    }

    geo2.setAttribute('position', new THREE.BufferAttribute(pos2, 3));
    geo2.setAttribute('color', new THREE.BufferAttribute(col2, 3));

    const mat2 = new THREE.PointsMaterial({
      size: this.isMobile ? 0.22 : 0.24,
      map: glowTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.layer2 = new THREE.Points(geo2, mat2);
    this.root.add(this.layer2);

    // -------------------------------------------------------------
    // LAYER 3: Nearby Cosmic Dust & Star Embers (High Parallax)
    // -------------------------------------------------------------
    const count3 = this.isMobile ? 220 : 500;
    const geo3 = new THREE.BufferGeometry();
    const pos3 = new Float32Array(count3 * 3);
    const col3 = new Float32Array(count3 * 3);

    for (let i = 0; i < count3; i++) {
      const radius = 2.0 + Math.random() * 9.5;
      const theta = Math.random() * Math.PI * 2;
      const z = 12 - Math.random() * 65;

      pos3[i * 3] = Math.cos(theta) * radius;
      pos3[i * 3 + 1] = Math.sin(theta) * radius;
      pos3[i * 3 + 2] = z;

      const isGold = Math.random() > 0.6;
      col3[i * 3] = isGold ? 1.0 : 0.2;
      col3[i * 3 + 1] = isGold ? 0.8 : 0.95;
      col3[i * 3 + 2] = isGold ? 0.3 : 1.0;

      this.layer3Velocities.push({
        origRadius: radius,
        origTheta: theta,
        zSpeed: 0.6 + Math.random() * 1.6,
      });
    }

    geo3.setAttribute('position', new THREE.BufferAttribute(pos3, 3));
    geo3.setAttribute('color', new THREE.BufferAttribute(col3, 3));

    const mat3 = new THREE.PointsMaterial({
      size: this.isMobile ? 0.24 : 0.26,
      map: glowTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.layer3 = new THREE.Points(geo3, mat3);
    this.root.add(this.layer3);
  }

  update(progress, time) {
    if (this.layer1) {
      this.layer1.rotation.z = time * 0.008;
    }

    if (this.layer2) {
      this.layer2.rotation.z = time * 0.015;

      const pos = this.layer2.geometry.attributes.position.array;
      const driftSpeed = progress > 0.5 ? (progress - 0.5) * 8.0 : 0.3;

      for (let i = 0; i < pos.length / 3; i++) {
        pos[i * 3 + 2] += driftSpeed * 0.15;
        if (pos[i * 3 + 2] > 20) {
          pos[i * 3 + 2] = -75;
        }
      }
      this.layer2.geometry.attributes.position.needsUpdate = true;
    }

    if (this.layer3) {
      const pos = this.layer3.geometry.attributes.position.array;
      let speedMultiplier = 1.0;
      if (progress >= 0.55 && progress <= 0.75) {
        speedMultiplier = 14.0 * (1 + (progress - 0.55) / 0.2);
      } else if (progress > 0.75) {
        speedMultiplier = 2.5;
      } else {
        speedMultiplier = 0.8;
      }

      for (let i = 0; i < this.layer3Velocities.length; i++) {
        const vel = this.layer3Velocities[i];
        pos[i * 3 + 2] += vel.zSpeed * speedMultiplier * 0.08;

        if (pos[i * 3 + 2] > 15) {
          pos[i * 3 + 2] = -55;
          const angle = vel.origTheta + time * 0.1;
          pos[i * 3] = Math.cos(angle) * vel.origRadius;
          pos[i * 3 + 1] = Math.sin(angle) * vel.origRadius;
        }
      }
      this.layer3.geometry.attributes.position.needsUpdate = true;
    }
  }

  dispose() {
    if (this.layer1) {
      this.layer1.geometry.dispose();
      this.layer1.material.dispose();
    }
    if (this.layer2) {
      this.layer2.geometry.dispose();
      this.layer2.material.dispose();
    }
    if (this.layer3) {
      this.layer3.geometry.dispose();
      this.layer3.material.dispose();
    }
  }
}

export default StarFieldController;
