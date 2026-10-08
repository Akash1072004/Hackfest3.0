import * as THREE from 'three';

/**
 * CinematicCamera controller:
 * Master timeline camera choreography:
 * 0.00 - 0.18: Establishing shot in front of dormant armor in darkness
 * 0.18 - 0.42: Orbit dolly in close around glowing arc reactor core
 * 0.42 - 0.58: Low-angle heroic perspective preparing for launch
 * 0.58 - 0.72: Hypersonic launch tracking behind hero into deep space
 * 0.72 - 0.84: Slow-motion cosmic glide orbiting past massive Black Hole Gargantua
 * 0.84 - 0.93: Deep universe traversal toward rotating Spiral Galaxy & opening Multiverse Portal
 * 0.93 - 1.00: Passing through portal threshold into HackFest 3.0 reveal
 */
export function createCinematicCamera(camera, initialAspect = 16 / 9) {
  camera.fov = 50;
  camera.near = 0.1;
  camera.far = 300;
  camera.aspect = initialAspect;
  camera.position.set(0, 0.4, 8.5);
  camera.updateProjectionMatrix();

  const currentPos = camera.position.clone();
  const currentLookAt = new THREE.Vector3(0, 0.3, 0);
  const targetPos = new THREE.Vector3();
  const targetLookAt = new THREE.Vector3();

  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  const onMouseMove = (e) => {
    targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', onMouseMove, { passive: true });
  }

  return {
    update: (progress, heroGroup = null) => {
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const heroZ = heroGroup ? heroGroup.position.z : 0;

      if (progress < 0.18) {
        // Stage 1: Establishing cinematic shot (dormant, subtle star drift)
        const t = progress / 0.18;
        targetPos.set(
          THREE.MathUtils.lerp(0, 0.4, t),
          THREE.MathUtils.lerp(0.4, 0.45, t),
          THREE.MathUtils.lerp(8.5, 7.2, t)
        );
        targetLookAt.set(0, 0.35, 0);
        camera.fov = 50;
      } else if (progress < 0.42) {
        // Stage 2: Dolly in close orbit around arc reactor core
        const t = (progress - 0.18) / (0.42 - 0.18);
        const smoothT = t * t * (3 - 2 * t);
        targetPos.set(
          THREE.MathUtils.lerp(0.4, 1.3, smoothT),
          THREE.MathUtils.lerp(0.45, 0.65, smoothT),
          THREE.MathUtils.lerp(7.2, 3.6, smoothT)
        );
        targetLookAt.set(0, 0.4, 0);
        camera.fov = 48;
      } else if (progress < 0.58) {
        // Stage 3: Low-angle heroic orbit preparing for launch
        const t = (progress - 0.42) / (0.58 - 0.42);
        const smoothT = t * t * (3 - 2 * t);
        targetPos.set(
          THREE.MathUtils.lerp(1.3, -0.7, smoothT),
          THREE.MathUtils.lerp(0.65, -0.35, smoothT),
          THREE.MathUtils.lerp(3.6, 4.2, smoothT)
        );
        targetLookAt.set(0, 0.65, 0);
        camera.fov = 52;
      } else if (progress < 0.72) {
        // Stage 4: Launching forward & warp speed jump!
        const t = (progress - 0.58) / (0.72 - 0.58);
        const smoothT = Math.pow(t, 1.3);
        targetPos.set(
          THREE.MathUtils.lerp(-0.7, 0, smoothT),
          THREE.MathUtils.lerp(-0.35, 0.2, smoothT),
          heroZ + THREE.MathUtils.lerp(4.2, 5.5, smoothT)
        );
        targetLookAt.set(0, 0.1, heroZ - 4);
        camera.fov = THREE.MathUtils.lerp(52, 65, smoothT);
      } else if (progress < 0.84) {
        // Stage 5: SLOW-MOTION COSMIC GLIDE PAST GARGANTUA BLACK HOLE
        // Black hole is at (7.5, 1.2, -28.0)
        const t = (progress - 0.72) / (0.84 - 0.72);
        const smoothT = t * t * (3 - 2 * t);
        targetPos.set(
          THREE.MathUtils.lerp(-0.5, 1.8, smoothT),
          THREE.MathUtils.lerp(0.2, 0.7, smoothT),
          THREE.MathUtils.lerp(-16.0, -27.5, smoothT)
        );
        // LookAt sweeps right across the accretion disk and photon ring
        targetLookAt.set(
          THREE.MathUtils.lerp(3.0, 7.5, smoothT),
          THREE.MathUtils.lerp(0.6, 1.2, smoothT),
          THREE.MathUtils.lerp(-24.0, -28.0, smoothT)
        );
        camera.fov = THREE.MathUtils.lerp(65, 56, smoothT); // Focus narrows onto the Black Hole
      } else if (progress < 0.93) {
        // Stage 6: TRAVERSING TOWARD SPIRAL GALAXY & MULTIVERSE PORTAL
        // Galaxy is at (-13.5, 3.8, -38.0), Portal is at (0, 0, -48.0)
        const t = (progress - 0.84) / (0.93 - 0.84);
        const smoothT = t * t * (3 - 2 * t);
        targetPos.set(
          THREE.MathUtils.lerp(1.8, 0.0, smoothT),
          THREE.MathUtils.lerp(0.7, 0.1, smoothT),
          THREE.MathUtils.lerp(-27.5, -42.0, smoothT)
        );
        targetLookAt.set(
          THREE.MathUtils.lerp(2.0, 0.0, smoothT),
          0.0,
          -48.0
        );
        camera.fov = THREE.MathUtils.lerp(56, 66, smoothT);
      } else {
        // Stage 7: BREACHING MULTIVERSE PORTAL THRESHOLD
        const t = (progress - 0.93) / (1.0 - 0.93);
        const smoothT = Math.pow(t, 1.2);
        targetPos.set(
          0,
          0,
          THREE.MathUtils.lerp(-42.0, -52.0, smoothT)
        );
        targetLookAt.set(0, 0, -68);
        camera.fov = THREE.MathUtils.lerp(66, 75, smoothT);
      }

      // Parallax
      const parallaxFactor = progress > 0.6 ? 0.2 : 0.45;
      targetPos.x += mouseX * parallaxFactor;
      targetPos.y += mouseY * (parallaxFactor * 0.7);

      currentPos.lerp(targetPos, 0.08);
      currentLookAt.lerp(targetLookAt, 0.08);

      camera.position.copy(currentPos);
      camera.lookAt(currentLookAt);
      camera.updateProjectionMatrix();
    },
    resize: (width, height) => {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    },
    dispose: () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mousemove', onMouseMove);
      }
    },
  };
}

export default createCinematicCamera;
