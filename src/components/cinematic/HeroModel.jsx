import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { getGlowParticleTexture } from './particleTexture';

/**
 * HeroModel controller managing 3D superhero armored character loading,
 * procedural fallback, materials, and scroll-driven flight timeline.
 * Supports:
 * - 0% - 15%: Hero Awakening & Arc Reactor online
 * - 15% - 22%: Launch into space
 * - 32% - 46%: Iron-Man-Inspired Deep Space Cinematic Flight Sequence
 * - 58% - 70%: Hero Returns for Cosmic Confrontation with Villain
 * - 82% - 94%: Superhero Team Assembly poster formation
 */
export class HeroModelController {
  constructor(isMobile = false) {
    this.root = new THREE.Group();
    this.root.name = 'Hero_Character_Root';
    this.isMobile = isMobile;
    this.model = null;
    this.materials = {
      crimson: null,
      gold: null,
      core: null,
      eyes: null,
      thruster: null,
      repulsor: null,
    };
    this.thrusterParticles = null;
    this.thrusterGeo = null;
    this.handRepulsors = [];
    this.isLoaded = false;
  }

  async load(onProgress = () => {}) {
    return new Promise((resolve) => {
      const loader = new GLTFLoader();
      const modelUrl = '/models/hero/hero.glb';

      loader.load(
        modelUrl,
        (gltf) => {
          this.model = gltf.scene;
          this.setupModel();
          this.root.add(this.model);
          this.createThrusterFx();
          this.isLoaded = true;
          onProgress(100);
          resolve(this.root);
        },
        (xhr) => {
          if (xhr.total > 0) {
            onProgress(Math.round((xhr.loaded / xhr.total) * 100));
          }
        },
        (error) => {
          console.warn('HeroModel GLB load fallback to procedural armor:', error);
          this.buildProceduralArmor();
          this.createThrusterFx();
          this.isLoaded = true;
          onProgress(100);
          resolve(this.root);
        }
      );
    });
  }

  setupModel() {
    if (!this.model) return;
    this.model.scale.set(1.15, 1.15, 1.15);
    this.model.position.set(0, -0.2, 0);

    this.model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          const mat = child.material;
          if (mat.name === 'Arc_Reactor_Core' || mat.name.includes('Core')) {
            this.materials.core = mat;
          } else if (mat.name === 'Visor_Eyes_Glow' || mat.name.includes('Eye')) {
            this.materials.eyes = mat;
          } else if (mat.name === 'Thruster_Glow' || mat.name.includes('Thruster')) {
            this.materials.thruster = mat;
          } else if (mat.name.includes('Crimson')) {
            this.materials.crimson = mat;
          } else if (mat.name.includes('Gold')) {
            this.materials.gold = mat;
          }
        }
      }
    });
  }

  buildProceduralArmor() {
    const group = new THREE.Group();
    group.name = 'Procedural_Hero_Armor';

    // Materials
    const crimson = new THREE.MeshStandardMaterial({
      color: 0x9e1217,
      metalness: 0.9,
      roughness: 0.25,
      name: 'Armor_Crimson',
    });
    this.materials.crimson = crimson;

    const gold = new THREE.MeshStandardMaterial({
      color: 0xd4a017,
      metalness: 0.92,
      roughness: 0.2,
      name: 'Armor_Gold',
    });
    this.materials.gold = gold;

    const steel = new THREE.MeshStandardMaterial({
      color: 0x141c2b,
      metalness: 0.85,
      roughness: 0.35,
      name: 'Armor_DarkSteel',
    });

    const core = new THREE.MeshStandardMaterial({
      color: 0x00bfff,
      emissive: 0x00bfff,
      emissiveIntensity: 2.5,
      roughness: 0.1,
      metalness: 0.1,
      name: 'Arc_Reactor_Core',
    });
    this.materials.core = core;

    const eyes = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 3.5,
      name: 'Visor_Eyes_Glow',
    });
    this.materials.eyes = eyes;

    const thruster = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00e5ff,
      emissiveIntensity: 3.0,
      name: 'Thruster_Glow',
    });
    this.materials.thruster = thruster;

    // 1. Torso
    const chest = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.2, 0.8), crimson);
    chest.position.set(0, 1.8, 0);
    group.add(chest);

    const sternum = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.9, 0.15), gold);
    sternum.position.set(0, 1.85, 0.42);
    group.add(sternum);

    // Arc Reactor
    const rCyl = new THREE.CylinderGeometry(0.22, 0.22, 0.1, 24);
    rCyl.rotateX(Math.PI / 2);
    const reactor = new THREE.Mesh(rCyl, core);
    reactor.position.set(0, 1.95, 0.48);
    group.add(reactor);

    // Abdominal
    for (let i = 0; i < 3; i++) {
      const ab = new THREE.Mesh(
        new THREE.BoxGeometry(1.0 - i * 0.08, 0.22, 0.65 - i * 0.04),
        i % 2 === 0 ? steel : crimson
      );
      ab.position.set(0, 1.1 - i * 0.24, 0);
      group.add(ab);
    }

    // 2. Head / Helmet
    const head = new THREE.Group();
    head.position.set(0, 2.7, 0);
    const skull = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.8, 0.76), crimson);
    head.add(skull);
    const face = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.68, 0.25), gold);
    face.position.set(0, -0.04, 0.35);
    head.add(face);

    const eyeGeo = new THREE.BoxGeometry(0.18, 0.04, 0.05);
    const e1 = new THREE.Mesh(eyeGeo, eyes);
    e1.position.set(-0.16, 0.04, 0.48);
    const e2 = new THREE.Mesh(eyeGeo, eyes);
    e2.position.set(0.16, 0.04, 0.48);
    head.add(e1);
    head.add(e2);
    group.add(head);

    // 3. Arms
    [-1, 1].forEach((s) => {
      const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 12), crimson);
      shoulder.position.set(s * 1.05, 2.15, 0);
      group.add(shoulder);

      const bicep = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.2, 0.7, 12), gold);
      bicep.position.set(s * 1.05, 1.6, 0);
      group.add(bicep);

      const gauntlet = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.8, 0.38), crimson);
      gauntlet.position.set(s * 1.1, 0.85, 0.05);
      group.add(gauntlet);

      // Hand Repulsor Node on Palm
      const repulsorDisc = new THREE.Mesh(new THREE.CircleGeometry(0.1, 16), thruster);
      repulsorDisc.position.set(s * 1.1, 0.45, 0.2);
      repulsorDisc.rotation.x = Math.PI / 4;
      this.handRepulsors.push(repulsorDisc);
      group.add(repulsorDisc);
    });

    // 4. Legs
    [-1, 1].forEach((s) => {
      const thigh = new THREE.Mesh(new THREE.BoxGeometry(0.44, 1.0, 0.48), gold);
      thigh.position.set(s * 0.42, -0.15, 0);
      group.add(thigh);

      const shin = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.1, 0.44), crimson);
      shin.position.set(s * 0.42, -1.35, 0);
      group.add(shin);

      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.35, 0.72), steel);
      boot.position.set(s * 0.42, -2.0, 0.1);
      group.add(boot);
    });

    this.model = group;
    this.model.scale.set(1.15, 1.15, 1.15);
    this.root.add(this.model);
  }

  createThrusterFx() {
    const count = this.isMobile ? 60 : 160;
    this.thrusterGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    this.thrusterVels = [];

    for (let i = 0; i < count; i++) {
      const isFoot = i < count * 0.7;
      if (isFoot) {
        // Under boots
        const legSide = Math.random() > 0.5 ? 0.42 : -0.42;
        pos[i * 3] = legSide + (Math.random() - 0.5) * 0.25;
        pos[i * 3 + 1] = -2.2 - Math.random() * 0.6;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
      } else {
        // Behind hands
        const handSide = Math.random() > 0.5 ? 1.1 : -1.1;
        pos[i * 3] = handSide + (Math.random() - 0.5) * 0.2;
        pos[i * 3 + 1] = 0.45 - Math.random() * 0.4;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
      }

      col[i * 3] = 0.1;
      col[i * 3 + 1] = 0.85 + Math.random() * 0.15;
      col[i * 3 + 2] = 1.0;

      this.thrusterVels.push({
        baseX: pos[i * 3],
        baseY: pos[i * 3 + 1],
        baseZ: pos[i * 3 + 2],
        vy: -2.0 - Math.random() * 4.0,
      });
    }

    this.thrusterGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.thrusterGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));

    const glowTex = getGlowParticleTexture();
    const mat = new THREE.PointsMaterial({
      size: 0.18,
      map: glowTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.thrusterParticles = new THREE.Points(this.thrusterGeo, mat);
    this.thrusterParticles.visible = false;
    this.root.add(this.thrusterParticles);
  }

  update(progress, time) {
    if (!this.root) return;

    let isVisible = false;

    if (progress < 0.12) {
      // -----------------------------------------------------------
      // 1. HERO AWAKENING (0% - 12%)
      // -----------------------------------------------------------
      isVisible = true;
      const wake = progress / 0.12;
      this.root.scale.set(1.15, 1.15, 1.15);
      this.root.position.set(0, Math.sin(time * 1.5) * 0.05, 0);
      this.root.rotation.set(0, Math.sin(time * 0.8) * 0.06, 0);

      if (this.materials.core) this.materials.core.emissiveIntensity = 0.8 + wake * 1.8;
      if (this.materials.eyes) this.materials.eyes.emissiveIntensity = 0.5 + wake * 2.2;
      if (this.thrusterParticles) this.thrusterParticles.visible = false;
    } else if (progress < 0.18) {
      // -----------------------------------------------------------
      // 2. INITIAL LAUNCH INTO DEEP SPACE (12% - 18%)
      // -----------------------------------------------------------
      isVisible = true;
      const p = (progress - 0.12) / 0.06;
      this.root.scale.set(1.15, 1.15, 1.15);
      this.root.rotation.set(-0.6 * p, 0, 0);
      this.root.position.set(0, 0.2 + p * 1.8, -p * 35.0);

      if (this.materials.core) this.materials.core.emissiveIntensity = 4.0;
      if (this.materials.eyes) this.materials.eyes.emissiveIntensity = 4.0;
      if (this.thrusterParticles) {
        this.thrusterParticles.visible = true;
        this.thrusterParticles.material.opacity = (1 - p * 0.5);
      }
    } else if (progress >= 0.18 && progress < 0.45) {
      // -----------------------------------------------------------
      // Universe travel & Incursion (Hero not in frame)
      // -----------------------------------------------------------
      isVisible = false;
    } else if (progress >= 0.45 && progress < 0.58) {
      // -----------------------------------------------------------
      // 3. IRON-MAN-INSPIRED CINEMATIC FLIGHT SCENE (45% - 58%)
      // -----------------------------------------------------------
      isVisible = true;
      const p = (progress - 0.45) / 0.13; // 0 to 1

      if (p < 0.2) {
        // 0% - 20%: Appears in deep space after incursion blackout, glowing reactor shines
        const emergeP = p / 0.2;
        this.root.scale.setScalar(0.7 + emergeP * 0.45);
        this.root.position.set(0.5, 0.4, -32.0 + emergeP * 8.0);
        this.root.rotation.set(-0.35, -0.2, 0.15);

        if (this.materials.core) this.materials.core.emissiveIntensity = 4.5 + Math.sin(time * 8) * 1.5;
        if (this.materials.eyes) this.materials.eyes.emissiveIntensity = 3.0;
        if (this.thrusterParticles) {
          this.thrusterParticles.visible = true;
          this.thrusterParticles.material.opacity = emergeP * 0.7;
        }
      } else if (p < 0.65) {
        // 20% - 65%: Thrusters fully activate, accelerates toward camera!
        const flyP = (p - 0.2) / 0.45;
        const smoothFly = Math.pow(flyP, 1.4);

        // Sweeps from deep space z = -24 directly towards and past camera to z = 4.5
        this.root.position.set(
          THREE.MathUtils.lerp(0.5, -0.6, smoothFly) + Math.sin(time * 3) * 0.1,
          THREE.MathUtils.lerp(0.4, 0.1, smoothFly),
          THREE.MathUtils.lerp(-24.0, 4.5, smoothFly)
        );
        // Flight bank rotation
        this.root.rotation.set(-0.6, -0.25 + smoothFly * 0.4, 0.35 - smoothFly * 0.2);
        this.root.scale.setScalar(1.15);

        if (this.materials.core) this.materials.core.emissiveIntensity = 5.0;
        if (this.materials.eyes) this.materials.eyes.emissiveIntensity = 5.0;
        if (this.thrusterParticles) {
          this.thrusterParticles.visible = true;
          this.thrusterParticles.material.opacity = 1.0;
          this.thrusterParticles.scale.set(1.2 + flyP * 0.8, 1.5 + flyP * 1.5, 1.2 + flyP * 0.8);
        }
      } else {
        // 65% - 100%: Passes camera, banks away into distant space, camera follows
        const exitP = (p - 0.65) / 0.35;
        const smoothExit = Math.pow(exitP, 1.2);

        this.root.position.set(
          THREE.MathUtils.lerp(-0.6, 2.2, smoothExit),
          THREE.MathUtils.lerp(0.1, 1.5, smoothExit),
          THREE.MathUtils.lerp(4.5, -35.0, smoothExit)
        );
        this.root.rotation.set(-0.7, 0.45, -0.3);
        const fade = Math.max(0, 1.0 - smoothExit * 0.7);
        this.root.scale.setScalar(1.15 * fade);

        if (this.thrusterParticles) {
          this.thrusterParticles.material.opacity = (1 - smoothExit);
        }
      }
    } else if (progress >= 0.68 && progress < 0.77) {
      // -----------------------------------------------------------
      // 5. HERO VS VILLAIN CONFRONTATION (68% - 77%)
      // -----------------------------------------------------------
      isVisible = true;
      const p = (progress - 0.68) / 0.09;

      // Positioned on the left flank facing center-right toward villain
      this.root.scale.setScalar(1.15);
      this.root.position.set(-3.4, 0.2, -13.5);
      this.root.rotation.set(0, 0.65, 0); // Faces toward center-right

      if (this.materials.core) this.materials.core.emissiveIntensity = 4.5 + Math.sin(time * 10) * 1.0;
      if (this.materials.eyes) this.materials.eyes.emissiveIntensity = 4.5;
      if (this.thrusterParticles) {
        this.thrusterParticles.visible = true;
        this.thrusterParticles.material.opacity = 0.75;
      }
    } else if (progress >= 0.86 && progress < 0.94) {
      // -----------------------------------------------------------
      // 7. SUPERHERO TEAM ASSEMBLY POSTER TRIAD (86% - 94%)
      // -----------------------------------------------------------
      isVisible = true;
      const p = (progress - 0.86) / 0.08;

      // Positioned on the left flank of the team composition
      this.root.scale.setScalar(1.15);
      this.root.position.set(
        THREE.MathUtils.lerp(-3.4, -2.6, p),
        THREE.MathUtils.lerp(0.2, 0.1, p),
        THREE.MathUtils.lerp(-13.5, -16.0, p)
      );
      this.root.rotation.set(0, 0.35, 0);

      if (this.materials.core) this.materials.core.emissiveIntensity = 3.5;
      if (this.materials.eyes) this.materials.eyes.emissiveIntensity = 3.5;
      if (this.thrusterParticles) {
        this.thrusterParticles.visible = true;
        this.thrusterParticles.material.opacity = 0.5;
      }
    } else {
      isVisible = false;
    }

    this.root.visible = isVisible;
    if (!isVisible) return;

    // Animate thruster particles downward / backward
    if (this.thrusterGeo && this.thrusterVels) {
      const pos = this.thrusterGeo.attributes.position;
      const count = this.thrusterVels.length;

      for (let i = 0; i < count; i++) {
        const vel = this.thrusterVels[i];
        let y = pos.getY(i) + vel.vy * 0.035;
        if (y < vel.baseY - 2.5) {
          y = vel.baseY;
          pos.setX(i, vel.baseX + (Math.random() - 0.5) * 0.1);
          pos.setZ(i, vel.baseZ + (Math.random() - 0.5) * 0.1);
        }
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }
  }

  dispose() {
    if (this.thrusterParticles) {
      if (this.thrusterGeo) this.thrusterGeo.dispose();
      if (this.thrusterParticles.material) this.thrusterParticles.material.dispose();
    }
    if (this.root) {
      this.root.traverse((child) => {
        if (child.isMesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
            else child.material.dispose();
          }
        }
      });
    }
  }
}

export default HeroModelController;
