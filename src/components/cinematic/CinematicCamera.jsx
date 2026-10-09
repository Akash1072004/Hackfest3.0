import * as THREE from 'three';

/**
 * CinematicCamera controller:
 * Master timeline camera choreography across the 5 character-focused scenes:
 * 
 * Phase 1 (0.00 - 0.18): Deep Cosmic Space (gentle glide through stars)
 * Phase 2 (0.18 - 0.42): Doctor Doom Reveal (perfect full-body framing + cinematic orbit)
 * Phase 3 (0.42 - 0.66): Thor's Thunder Arrival (left sector framing, winged helmet to boots)
 * Phase 4 (0.66 - 0.85): Iron Man's Arrival (center hover framing, full Mark VII armor)
 * Phase 5 (0.85 - 1.00): Superhero Assembly (grand wide poster pullback framing all 3 champions)
 */
export function createCinematicCamera(camera, initialAspect = 16 / 9) {
  camera.fov = 50;
  camera.near = 0.1;
  camera.far = 300;
  camera.aspect = initialAspect;
  camera.position.set(0, 0, 16.0);
  camera.updateProjectionMatrix();

  const currentPos = camera.position.clone();
  const currentLookAt = new THREE.Vector3(0, 0, 0);
  const targetPos = new THREE.Vector3();
  const targetLookAt = new THREE.Vector3();

  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  const onMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    targetMouseX = x * 0.18;
    targetMouseY = y * 0.12;
  };

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  return {
    camera,

    update(progress) {
      // Subtle mouse parallax
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // -------------------------------------------------------------
      // SCENE 1: COSMIC ARRIVAL (0.00 - 0.12)
      // -------------------------------------------------------------
      if (progress < 0.12) {
        const t = progress / 0.12; // 0 to 1
        const smoothT = Math.pow(t, 1.2);

        targetPos.set(0.0, THREE.MathUtils.lerp(0.0, 0.4, smoothT), THREE.MathUtils.lerp(16.0, 10.5, smoothT));
        targetLookAt.set(0, 0.4, 0);
        camera.fov = 50;
      }
      // -------------------------------------------------------------
      // SCENE 2: PLANETARY FLYBY (0.12 - 0.26)
      // -------------------------------------------------------------
      else if (progress < 0.26) {
        const t = (progress - 0.12) / 0.14; // 0 to 1
        const smoothT = t * t * (3 - 2 * t);

        // Gentle camera drift past the rotating cosmic planet in the right-hand depth
        targetPos.set(
          THREE.MathUtils.lerp(0.0, 0.8, smoothT),
          THREE.MathUtils.lerp(0.4, 0.8, smoothT),
          THREE.MathUtils.lerp(10.5, 8.5, smoothT)
        );
        targetLookAt.set(
          THREE.MathUtils.lerp(0.0, 1.5, smoothT),
          THREE.MathUtils.lerp(0.4, 0.8, smoothT),
          THREE.MathUtils.lerp(0.0, -8.0, smoothT)
        );
        camera.fov = 50;
      }
      // -------------------------------------------------------------
      // SCENE 3: DOCTOR DOOM REVEAL (0.28 - 0.46)
      // -------------------------------------------------------------
      else if (progress < 0.46) {
        const t = (progress - 0.28) / 0.18; // 0 to 1 across 18% of timeline
        const smoothT = t * t * (3 - 2 * t);

        // Smooth camera transition to Doom + subtle cinematic orbit
        const orbitX = Math.sin(smoothT * Math.PI) * 0.25;
        targetPos.set(
          orbitX,
          THREE.MathUtils.lerp(0.8, 1.6, smoothT),
          THREE.MathUtils.lerp(8.5, 6.2, smoothT)
        );
        targetLookAt.set(0, 1.6, -0.5);
        camera.fov = 50;
      }
      // -------------------------------------------------------------
      // SCENE 4: BIFROST CELESTIAL SURGE (0.46 - 0.58)
      // -------------------------------------------------------------
      else if (progress < 0.58) {
        const t = (progress - 0.46) / 0.12; // 0 to 1 across 12% of timeline
        const smoothT = t * t * (3 - 2 * t);

        // Smoothly pans through the celestial lightning rift
        targetPos.set(
          THREE.MathUtils.lerp(0.0, 0.4, smoothT),
          1.6,
          THREE.MathUtils.lerp(6.2, 6.0, smoothT)
        );
        targetLookAt.set(0.0, 1.6, -1.0);
        camera.fov = 50;
      }
      // -------------------------------------------------------------
      // SCENE 5: IRON MAN'S ARRIVAL (0.58 - 0.74)
      // -------------------------------------------------------------
      else if (progress < 0.74) {
        const t = (progress - 0.58) / 0.16; // 0 to 1 across 16% of timeline
        const smoothT = t * t * (3 - 2 * t);

        // Frames Iron Man hovering in center (X = 0, Y = 0.0, Z = 0)
        targetPos.set(
          THREE.MathUtils.lerp(0.4, 0.0, smoothT),
          THREE.MathUtils.lerp(1.6, 1.65, smoothT),
          THREE.MathUtils.lerp(6.0, 5.8, smoothT)
        );
        targetLookAt.set(
          0.0,
          1.65,
          0.0
        );
        camera.fov = 50;
      }
      // -------------------------------------------------------------
      // SCENE 6: SPIDER-MAN REVEAL (0.74 - 0.88)
      // -------------------------------------------------------------
      else if (progress < 0.88) {
        const t = (progress - 0.74) / 0.14; // 0 to 1 across 14% of timeline
        const smoothT = t * t * (3 - 2 * t);

        // Frames Spider-Man swinging into view (X = -0.8, Y = 0, Z = -0.5)
        targetPos.set(
          THREE.MathUtils.lerp(0.0, -0.8, smoothT),
          1.6,
          THREE.MathUtils.lerp(5.8, 5.8, smoothT)
        );
        targetLookAt.set(
          -0.8,
          1.6,
          -0.5
        );
        camera.fov = 50;
      }
      // -------------------------------------------------------------
      // SCENE 7: MULTIVERSE ASSEMBLY (0.88 - 1.00)
      // -------------------------------------------------------------
      else {
        const t = (progress - 0.88) / 0.12; // 0 to 1
        const smoothT = Math.pow(t, 1.1);

        // Grand poster pull-back framing all champions side-by-side:
        // Spider-Man (left flank: -2.4), Iron Man (center: 0.0), Doctor Doom (right flank: +2.4)
        targetPos.set(
          0.0,
          THREE.MathUtils.lerp(1.6, 1.8, smoothT),
          THREE.MathUtils.lerp(5.8, 9.2, smoothT)
        );
        targetLookAt.set(0.0, 1.6, -0.3);
        camera.fov = THREE.MathUtils.lerp(50, 48, smoothT);
      }

      camera.updateProjectionMatrix();

      // Fluid interpolation (prevents any jerky snapping)
      currentPos.lerp(targetPos, 0.08);
      currentLookAt.lerp(targetLookAt, 0.08);

      camera.position.copy(currentPos);
      camera.position.x += mouseX;
      camera.position.y += mouseY;
      camera.lookAt(currentLookAt);
    },

    resize(width, height) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    },

    dispose() {
      window.removeEventListener('mousemove', onMouseMove);
    },
  };
}

export default createCinematicCamera;
