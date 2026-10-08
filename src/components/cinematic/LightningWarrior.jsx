import * as THREE from 'three';
import { getGlowParticleTexture } from './particleTexture';

/**
 * LightningWarriorController:
 * Original Thor-inspired Norse-futuristic thunder warrior.
 * Features:
 * 1. Heavy dark-steel & platinum plate armor with runic etchings
 * 2. Norse cybernetic winged helmet
 * 3. Flowing crimson cape silhouette
 * 4. Futuristic warhammer with glowing electric-blue core and runes
 * 5. Crackling electrical aura particles
 * 6. Dynamic thunder-strike impact & weapon raise animation
 */
export class LightningWarriorController {
  constructor(isMobile = false) {
    this.root = new THREE.Group();
    this.root.name = 'Lightning_Warrior_Root';
    this.isMobile = isMobile;

    this.materials = {
      steelPlate: null,
      silverTrim: null,
      capeMat: null,
      lightningGlow: null,
      hammerCore: null,
    };

    this.bodyGroup = null;
    this.hammerGroup = null;
    this.cape = null;
    this.electricAura = null;
    this.auraGeo = null;
    this.lightningLight = null;

    this.init();
  }

  init() {
    const glowTex = getGlowParticleTexture();

    // 1. PBR Materials
    this.materials.steelPlate = new THREE.MeshStandardMaterial({
      color: 0x1a2230, // Deep storm steel
      metalness: 0.92,
      roughness: 0.22,
    });

    this.materials.silverTrim = new THREE.MeshStandardMaterial({
      color: 0xa8b8cc, // Polished platinum / silver trim
      metalness: 0.95,
      roughness: 0.18,
    });

    this.materials.capeMat = new THREE.MeshStandardMaterial({
      color: 0x82141c, // Regal deep crimson storm cape
      metalness: 0.2,
      roughness: 0.75,
      side: THREE.DoubleSide,
    });

    this.materials.lightningGlow = new THREE.MeshBasicMaterial({
      color: 0x66ddff, // Electric lightning cyan
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });

    this.materials.hammerCore = new THREE.MeshBasicMaterial({
      color: 0xaae8ff, // Bright white-blue lightning core
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
    });

    // 2. Sculpted Character Group
    this.bodyGroup = new THREE.Group();

    // Heavy Torso / Cuirass
    const chestGeo = new THREE.CylinderGeometry(0.58, 0.45, 1.15, 8);
    const chest = new THREE.Mesh(chestGeo, this.materials.steelPlate);
    chest.position.y = 1.7;
    this.bodyGroup.add(chest);

    // Norse Circular Chest Runes (Discs across chest armor)
    [-0.22, 0.22].forEach((x) => {
      [1.85, 1.55].forEach((y) => {
        const disc = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.12, 0.06, 16),
          this.materials.silverTrim
        );
        disc.rotation.x = Math.PI / 2;
        disc.position.set(x, y, 0.35);
        this.bodyGroup.add(disc);
      });
    });

    // Heavy Pauldrons (Spiked Norse shoulder guards)
    [-1, 1].forEach((s) => {
      const pauldron = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.35, 0.5),
        this.materials.silverTrim
      );
      pauldron.position.set(s * 0.78, 2.15, 0.05);
      pauldron.rotation.z = s * -0.25;
      this.bodyGroup.add(pauldron);
    });

    // Cybernetic Winged Helmet
    const head = new THREE.Group();
    head.position.set(0, 2.55, 0);

    const skull = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.52, 0.48), this.materials.steelPlate);
    head.add(skull);

    // Visor / glowing eyes
    const eyeBand = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.08, 0.1), this.materials.lightningGlow);
    eyeBand.position.set(0, 0.02, 0.25);
    head.add(eyeBand);

    // Helmet Wings
    [-1, 1].forEach((s) => {
      const wing = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.65, 4), this.materials.silverTrim);
      wing.position.set(s * 0.32, 0.28, -0.05);
      wing.rotation.set(0.3, 0, s * -0.6);
      head.add(wing);
    });
    this.bodyGroup.add(head);

    // Flowing Crimson Cape (Curved mesh flowing behind warrior)
    const capeGeo = new THREE.PlaneGeometry(1.3, 2.2, 8, 8);
    // Curl cape slightly backwards
    const posAttr = capeGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const y = posAttr.getY(i);
      const x = posAttr.getX(i);
      posAttr.setZ(i, -0.2 - Math.pow((1.1 - y) * 0.4, 2) + Math.sin(x * 3) * 0.08);
    }
    capeGeo.computeVertexNormals();
    this.cape = new THREE.Mesh(capeGeo, this.materials.capeMat);
    this.cape.position.set(0, 1.35, -0.28);
    this.bodyGroup.add(this.cape);

    // Armored Legs
    [-1, 1].forEach((s) => {
      const thigh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.17, 0.9, 8),
        this.materials.steelPlate
      );
      thigh.position.set(s * 0.28, 0.9, 0);
      this.bodyGroup.add(thigh);

      const shin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.19, 0.16, 0.95, 8),
        this.materials.silverTrim
      );
      shin.position.set(s * 0.28, 0.05, 0.02);
      this.bodyGroup.add(shin);

      const boot = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.25, 0.5),
        this.materials.steelPlate
      );
      boot.position.set(s * 0.28, -0.45, 0.1);
      this.bodyGroup.add(boot);
    });

    // Left Arm (Fist clenched)
    const armL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.17, 0.14, 1.1, 8),
      this.materials.steelPlate
    );
    armL.position.set(-0.75, 1.55, 0.1);
    armL.rotation.z = 0.15;
    this.bodyGroup.add(armL);

    // Right Arm (Holding Thunder Hammer)
    this.armR = new THREE.Group();
    this.armR.position.set(0.75, 2.05, 0);

    const bicepR = new THREE.Mesh(
      new THREE.CylinderGeometry(0.17, 0.14, 0.65, 8),
      this.materials.steelPlate
    );
    bicepR.position.set(0.15, -0.25, 0.15);
    bicepR.rotation.set(-0.4, 0, -0.3);
    this.armR.add(bicepR);

    // 3. Futuristic Thunder Hammer (Warhammer)
    this.hammerGroup = new THREE.Group();
    this.hammerGroup.position.set(0.35, -0.35, 0.65);

    // Handle (Metallic shaft with leather wraps)
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 1.4, 12),
      this.materials.silverTrim
    );
    shaft.position.y = 0.4;
    this.hammerGroup.add(shaft);

    // Hammer Head (Blocky futuristic warhammer head)
    const headBlock = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.48, 0.48),
      this.materials.steelPlate
    );
    headBlock.position.y = 1.05;
    this.hammerGroup.add(headBlock);

    // Glowing Runic Inlay Core on Hammer Faces
    [-1, 1].forEach((s) => {
      const runeFace = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.38, 0.38),
        this.materials.hammerCore
      );
      runeFace.position.set(s * 0.33, 1.05, 0);
      this.hammerGroup.add(runeFace);
    });

    this.armR.add(this.hammerGroup);
    this.bodyGroup.add(this.armR);

    this.root.add(this.bodyGroup);

    // 4. Crackling Electrical Aura Particles
    const auraCount = this.isMobile ? 35 : 90;
    this.auraGeo = new THREE.BufferGeometry();
    const auraPos = new Float32Array(auraCount * 3);
    this.auraOffsets = [];

    for (let i = 0; i < auraCount; i++) {
      auraPos[i * 3] = (Math.random() - 0.5) * 2.2;
      auraPos[i * 3 + 1] = 0.5 + Math.random() * 2.8;
      auraPos[i * 3 + 2] = (Math.random() - 0.5) * 2.2;
      this.auraOffsets.push({
        baseX: auraPos[i * 3],
        baseY: auraPos[i * 3 + 1],
        baseZ: auraPos[i * 3 + 2],
        speed: 3 + Math.random() * 5,
      });
    }

    this.auraGeo.setAttribute('position', new THREE.BufferAttribute(auraPos, 3));

    const auraMat = new THREE.PointsMaterial({
      size: 0.16,
      map: glowTex,
      transparent: true,
      opacity: 0.85,
      color: 0x88eeff,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.electricAura = new THREE.Points(this.auraGeo, auraMat);
    this.root.add(this.electricAura);

    // 5. Electric Blue Thunder Light
    this.lightningLight = new THREE.PointLight(0x66ddff, 0, 30);
    this.lightningLight.position.set(0.8, 2.8, 0.8);
    this.root.add(this.lightningLight);

    this.root.visible = false;
  }

  update(progress, time) {
    // Active during:
    // Stage 1: Lightning Entry & Hammer Surge (70% - 82%)
    // Stage 2: Team Assembly Triad (82% - 94%)
    let isVisible = false;

    if (progress >= 0.70 && progress < 0.82) {
      isVisible = true;
      const p = (progress - 0.70) / 0.12; // 0 to 1

      // 70% - 74%: Descends swiftly out of lightning strike onto scene
      // 74% - 82%: Raises hammer to sky, lightning intensifies
      if (p < 0.35) {
        // Impact landing crouch
        const landP = p / 0.35;
        this.root.position.set(0, THREE.MathUtils.lerp(8, -0.4, Math.pow(landP, 1.8)), -11);
        this.root.rotation.set(0.35 * (1 - landP), 0, 0);
        this.armR.rotation.set(-0.3, 0, 0);
        this.materials.lightningGlow.opacity = 1.0;
        this.lightningLight.intensity = (1 - landP) * 12 + 3;
      } else {
        // Rises and raises glowing thunder hammer
        const raiseP = (p - 0.35) / 0.65;
        this.root.position.set(0, THREE.MathUtils.lerp(-0.4, 0.1, raiseP), -11);
        this.root.rotation.set(0, Math.sin(raiseP * Math.PI) * 0.12, 0);

        // Raise arm & hammer skyward
        this.armR.rotation.set(
          THREE.MathUtils.lerp(-0.3, -1.8, raiseP),
          THREE.MathUtils.lerp(0, 0.3, raiseP),
          THREE.MathUtils.lerp(0, -0.4, raiseP)
        );

        const pulse = 3 + Math.sin(time * 12) * 1.5;
        this.lightningLight.intensity = pulse + raiseP * 4;
        this.materials.hammerCore.opacity = 0.8 + Math.sin(time * 15) * 0.2;
      }
    } else if (progress >= 0.82 && progress < 0.94) {
      // Stage 2: Team Assembly Triad Position (Center-Ground Hero)
      isVisible = true;
      const p = (progress - 0.82) / 0.12;

      this.root.position.set(
        0,
        THREE.MathUtils.lerp(0.1, 0.4, p),
        THREE.MathUtils.lerp(-11, -14.2, p)
      );
      this.root.rotation.set(0, 0, 0);

      // Heroic ready stance with weapon angled
      this.armR.rotation.set(-0.8, 0.2, -0.3);
      this.lightningLight.intensity = 3.5 + Math.sin(time * 6) * 1.0;
    } else {
      isVisible = false;
    }

    this.root.visible = isVisible;
    if (!isVisible) return;

    // Flutter cape in cosmic solar wind
    if (this.cape) {
      const posAttr = this.cape.geometry.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const y = posAttr.getY(i);
        const flutter = Math.sin(time * 5 + y * 2) * 0.08 * (1.1 - y);
        posAttr.setZ(i, -0.2 - Math.pow((1.1 - y) * 0.4, 2) + flutter);
      }
      posAttr.needsUpdate = true;
    }

    // Animate crackling electrical aura particles
    if (this.auraGeo && this.auraOffsets) {
      const pos = this.auraGeo.attributes.position;
      const count = this.auraOffsets.length;
      for (let i = 0; i < count; i++) {
        const item = this.auraOffsets[i];
        // Jitter randomly like electrical sparks
        const jitterX = (Math.random() - 0.5) * 0.18;
        const jitterY = (Math.random() - 0.5) * 0.18;
        const jitterZ = (Math.random() - 0.5) * 0.18;
        pos.setX(i, item.baseX + Math.sin(time * item.speed) * 0.2 + jitterX);
        pos.setY(i, item.baseY + Math.cos(time * item.speed) * 0.2 + jitterY);
        pos.setZ(i, item.baseZ + jitterZ);
      }
      pos.needsUpdate = true;
    }
  }

  dispose() {
    Object.values(this.materials).forEach((m) => {
      if (m && m.dispose) m.dispose();
    });
    if (this.auraGeo) this.auraGeo.dispose();
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

export default LightningWarriorController;
