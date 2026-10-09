import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * CosmicPlanetController:
 * Loads and animates the authentic cosmic planet model (the_universe.glb).
 * 
 * Used for:
 * - Scene 2: Planetary Flyby (0.12 - 0.28) — Slow rotation with subtle atmospheric rings
 * - Scene 7: Multiverse Assembly (0.88 - 1.00) — Distant cosmic background backdrop
 * 
 * Clean design:
 * - Real GLB loaded from /models/the_universe.glb
 * - Scaled and positioned in the deep background (Z ≈ -16.0) to prevent obscuring characters
 * - Beautiful slow rotation and subtle rim lighting
 * - Reversible scroll support
 */
export class CosmicPlanetController {
  constructor(isMobile = false) {
    this.root = new THREE.Group();
    this.root.name = 'CosmicPlanet_Root';
    this.isMobile = isMobile;

    this.model = null;
    this.mixer = null;
    this.isLoaded = false;
    this.loadError = null;
    this.lastTime = 0;

    // Atmospheric rim light
    this.rimLight = new THREE.PointLight(0x4080ff, 0, 30);
    this.rimLight.position.set(4, 3, -10);
    this.root.add(this.rimLight);

    this.root.visible = false;
  }

  async load(onProgress = () => {}) {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      const modelUrl = '/models/the_universe.glb';

      loader.load(
        modelUrl,
        (gltf) => {
          this.model = gltf.scene;
          this.model.name = 'CosmicPlanet_Model';

          // Play real animation if available
          if (gltf.animations && gltf.animations.length > 0) {
            this.mixer = new THREE.AnimationMixer(this.model);
            const clip = gltf.animations[0];
            const action = this.mixer.clipAction(clip);
            action.play();
          }

          // Scale and position in deep space
          const scale = 0.024;
          this.model.scale.set(scale, scale, scale);

          // Subtle enhancement of material emissive/roughness
          this.model.traverse((child) => {
            if (child.isMesh && child.material) {
              const mat = child.material;
              mat.roughness = Math.min(mat.roughness ?? 0.5, 0.45);
              mat.envMapIntensity = 1.2;
              mat.needsUpdate = true;
            }
          });

          this.root.add(this.model);
          this.isLoaded = true;
          this.loadError = null;
          console.log('Cosmic Planet: Authentic 3D universe model loaded successfully.');

          onProgress(100);
          resolve(this.root);
        },
        (xhr) => {
          if (xhr.total > 0) {
            onProgress(Math.round((xhr.loaded / xhr.total) * 100));
          }
        },
        (err) => {
          console.warn('Cosmic Planet load fallback:', err);
          this.loadError = err;
          this.isLoaded = false;
          resolve(this.root); // Do not block other characters
        }
      );
    });
  }

  update(progress, elapsedTime) {
    const delta = this.lastTime > 0 ? Math.min(elapsedTime - this.lastTime, 0.1) : 0.016;
    this.lastTime = elapsedTime;

    if (this.mixer) {
      this.mixer.update(delta);
    } else if (this.model) {
      this.model.rotation.y += 0.003;
      this.model.rotation.z += 0.001;
    }

    let isVisible = false;

    // -------------------------------------------------------------
    // SCENE 2: PLANETARY FLYBY (0.12 - 0.28)
    // -------------------------------------------------------------
    if (progress >= 0.12 && progress < 0.28) {
      isVisible = true;
      const p = (progress - 0.12) / 0.16; // 0 to 1

      // Drifts gracefully in background: X: 3.2 -> 2.2, Y: 1.2 -> 0.8, Z: -15.0 -> -11.0
      const posX = THREE.MathUtils.lerp(3.2, 1.8, p);
      const posY = THREE.MathUtils.lerp(1.2, 0.6, p);
      const posZ = THREE.MathUtils.lerp(-16.0, -11.0, p);
      this.root.position.set(posX, posY, posZ);

      // Fade in rim light
      const intensity = Math.sin(p * Math.PI) * 3.5;
      this.rimLight.intensity = intensity;
    }
    // -------------------------------------------------------------
    // SCENE 7: MULTIVERSE ASSEMBLY (0.88 - 1.00)
    // -------------------------------------------------------------
    else if (progress >= 0.88) {
      isVisible = true;
      const p = (progress - 0.88) / 0.12;

      // Positioned centered far in the distant cosmic backdrop behind all heroes
      this.root.position.set(0.0, 2.5, -28.0);
      this.rimLight.intensity = 2.5 + p * 1.5;
    } else {
      isVisible = false;
    }

    this.root.visible = isVisible;
  }

  dispose() {
    if (this.mixer) {
      this.mixer.stopAllAction();
    }
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

export default CosmicPlanetController;
