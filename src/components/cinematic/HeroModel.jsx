import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * HeroModel controller managing 3D superhero armored character loading,
 * procedural fallback, materials, and scroll-driven flight timeline.
 */
export class HeroModelController {
  constructor() {
    this.root = new THREE.Group();
    this.root.name = 'Hero_Character_Root';
    this.model = null;
    this.materials = {
      crimson: null,
      gold: null,
      core: null,
      eyes: null,
      thruster: null
    };
    this.thrusterParticles = null;
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
      name: 'Armor_Crimson'
    });
    this.materials.crimson = crimson;

    const gold = new THREE.MeshStandardMaterial({
      color: 0xd4a017,
      metalness: 0.92,
      roughness: 0.2,
      name: 'Armor_Gold'
    });
    this.materials.gold = gold;

    const steel = new THREE.MeshStandardMaterial({
      color: 0x141c2b,
      metalness: 0.85,
      roughness: 0.35,
      name: 'Armor_DarkSteel'
    });

    const core = new THREE.MeshStandardMaterial({
      color: 0x00bfff,
      emissive: 0x00bfff,
      emissiveIntensity: 2.5,
      roughness: 0.1,
      metalness: 0.1,
      name: 'Arc_Reactor_Core'
    });
    this.materials.core = core;

    const eyes = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 3.5,
      name: 'Visor_Eyes_Glow'
    });
    this.materials.eyes = eyes;

    const thruster = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00e5ff,
      emissiveIntensity: 3.0,
      name: 'Thruster_Glow'
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
    const count = 120;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.4;
      pos[i * 3 + 1] = -2.2 - Math.random() * 1.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;

      col[i * 3] = 0.0;
      col[i * 3 + 1] = 0.8 + Math.random() * 0.2;
      col[i * 3 + 2] = 1.0;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    this.thrusterParticles = new THREE.Points(geo, mat);
    this.thrusterParticles.visible = false;
    this.root.add(this.thrusterParticles);
  }

  update(progress, time) {
    if (!this.root) return;

    // 0% - 15%: Dormant / waking up
    // 15% - 40%: Core ignition, slight hover
    // 40% - 60%: Pre-launch posture, energy surge
    // 60% - 85%: Launching forward into space
    // 85% - 100%: Hyper-velocity through multiverse

    if (progress < 0.15) {
      // Idle breathing
      const wake = progress / 0.15;
      this.root.position.y = Math.sin(time * 1.5) * 0.05;
      this.root.position.z = 0;
      this.root.rotation.x = 0;
      this.root.rotation.y = Math.sin(time * 0.8) * 0.06;

      if (this.materials.core) this.materials.core.emissiveIntensity = 0.8 + wake * 1.5;
      if (this.materials.eyes) this.materials.eyes.emissiveIntensity = 0.5 + wake * 2.0;
      if (this.thrusterParticles) this.thrusterParticles.visible = false;
    } else if (progress < 0.45) {
      // Reactor fully awake, hero levitates
      const p = (progress - 0.15) / 0.3;
      this.root.position.y = 0.2 * p + Math.sin(time * 2.5) * 0.08;
      this.root.position.z = -0.5 * p;
      this.root.rotation.x = -0.12 * p;
      this.root.rotation.y = Math.sin(time * 1.2) * 0.15;

      const pulse = 2.5 + Math.sin(time * 6.0) * 0.8;
      if (this.materials.core) this.materials.core.emissiveIntensity = pulse;
      if (this.materials.eyes) this.materials.eyes.emissiveIntensity = 3.5;
      if (this.thrusterParticles) {
        this.thrusterParticles.visible = true;
        this.thrusterParticles.material.opacity = p * 0.6;
      }
    } else if (progress < 0.68) {
      this.root.visible = true;
      // Takeoff & flight posture
      const p = (progress - 0.45) / 0.23;
      this.root.rotation.x = -0.6 * p - 0.12;
      this.root.rotation.y = (Math.random() - 0.5) * 0.02;
      this.root.position.y = 0.2 + p * 1.5;
      this.root.position.z = -0.5 - p * 24.0;

      if (this.materials.core) this.materials.core.emissiveIntensity = 4.5;
      if (this.materials.eyes) this.materials.eyes.emissiveIntensity = 4.5;
      if (this.thrusterParticles) {
        this.thrusterParticles.visible = true;
        this.thrusterParticles.material.opacity = 1.0;
        this.thrusterParticles.scale.set(1 + p * 1.5, 1 + p * 2.5, 1 + p * 1.5);
      }
    } else if (progress < 0.75) {
      this.root.visible = true;
      // Hypersonic dash disappearing into deep cosmic distance
      const p = (progress - 0.68) / 0.07;
      this.root.rotation.x = -0.72;
      this.root.position.y = 1.7 + p * 4.0;
      this.root.position.z = -24.5 - p * 50.0;
      const fade = Math.max(0, 1.0 - p);
      this.root.scale.set(1.15 * fade, 1.15 * fade, 1.15 * fade);
      if (this.thrusterParticles) {
        this.thrusterParticles.material.opacity = fade;
      }
    } else {
      // Disappears completely during deep space universe travel
      this.root.visible = false;
    }
  }

  dispose() {
    if (this.thrusterParticles) {
      this.thrusterParticles.geometry.dispose();
      this.thrusterParticles.material.dispose();
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
