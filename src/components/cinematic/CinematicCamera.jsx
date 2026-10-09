import * as THREE from 'three';

/**
 * CinematicCamera controller:
 * Master timeline camera choreography across all cinematic superhero phases:
 * 0.00 - 0.12: Establishing hero awakening shot in deep darkness
 * 0.12 - 0.24: Interstellar universe travel, warp jump, Black Hole & Galaxy
 * 0.24 - 0.45: Planet approach & Multiverse Incursion (Atmosphere entry, surface spires, reality cracks, incursion overlap, gravitational collapse, blackout)
 * 0.45 - 0.58: Iron-Man-inspired flight tracking (hero accelerates, passes camera, camera turns & follows)
 * 0.58 - 0.68: Doom-inspired villain entrance (menacing low-angle, emerald energy blast shockwave)
 * 0.68 - 0.77: Cosmic confrontation (dynamic face-off angle framing Hero left vs Villain right)
 * 0.77 - 0.86: Thor-inspired lightning entry (lightning strike shake, crane up to reveal warrior)
 * 0.86 - 0.94: Superhero team assembly (wide cinematic poster triad with rotating galaxy backdrop)
 * 0.94 - 1.00: Cosmic portal breach accelerating into HackFest 3.0 reveal
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

      const heroPos = heroGroup ? heroGroup.position : new THREE.Vector3(0, 0, 0);

      if (progress < 0.12) {
        // -----------------------------------------------------------
        // 1. HERO AWAKENING (0.00 - 0.12)
        // -----------------------------------------------------------
        const t = progress / 0.12;
        targetPos.set(
          THREE.MathUtils.lerp(0, 0.35, t),
          THREE.MathUtils.lerp(0.4, 0.45, t),
          THREE.MathUtils.lerp(8.5, 6.8, t)
        );
        targetLookAt.set(0, 0.35, 0);
        camera.fov = 50;
      } else if (progress < 0.24) {
        // -----------------------------------------------------------
        // 2. UNIVERSE TRAVEL & SINGULARITY (0.12 - 0.24)
        // -----------------------------------------------------------
        const t = (progress - 0.12) / (0.24 - 0.12);
        const smoothT = t * t * (3 - 2 * t);
        targetPos.set(
          THREE.MathUtils.lerp(0.35, 1.8, smoothT),
          THREE.MathUtils.lerp(0.45, 0.7, smoothT),
          THREE.MathUtils.lerp(6.8, -26.0, smoothT)
        );
        // LookAt sweeps past Black Hole (7.5, 1.2, -28) and Galaxy (-13.5, 3.8, -38)
        targetLookAt.set(
          THREE.MathUtils.lerp(0.0, 5.0, smoothT),
          THREE.MathUtils.lerp(0.35, 1.1, smoothT),
          THREE.MathUtils.lerp(0.0, -28.0, smoothT)
        );
        camera.fov = THREE.MathUtils.lerp(50, 62, smoothT);
      } else if (progress < 0.45) {
        // -----------------------------------------------------------
        // 3. PLANET APPROACH & MULTIVERSE INCURSION (0.24 - 0.45)
        // -----------------------------------------------------------
        const incursionP = (progress - 0.24) / (0.45 - 0.24);

        if (incursionP < 0.22) {
          // Planet approach: camera glides slowly toward planet
          const subT = incursionP / 0.22;
          const smoothSub = subT * subT * (3 - 2 * subT);
          targetPos.set(
            THREE.MathUtils.lerp(1.8, 0.0, smoothSub),
            THREE.MathUtils.lerp(0.7, 0.0, smoothSub),
            THREE.MathUtils.lerp(-26.0, -12.0, smoothSub)
          );
          targetLookAt.set(0, 0, -42.0);
          camera.fov = THREE.MathUtils.lerp(62, 52, smoothSub);
        } else if (incursionP < 0.45) {
          // Atmosphere entry: camera accelerates into the atmosphere
          const subT = (incursionP - 0.22) / 0.23;
          const smoothSub = Math.pow(subT, 1.3);
          targetPos.set(
            0,
            THREE.MathUtils.lerp(0.0, -2.5, smoothSub),
            THREE.MathUtils.lerp(-12.0, -6.0, smoothSub)
          );
          targetLookAt.set(0, -1.0, -22.0);
          camera.fov = THREE.MathUtils.lerp(52, 60, smoothSub);
        } else if (incursionP < 0.70) {
          // Planet surface spires & reality cracks
          const subT = (incursionP - 0.45) / 0.25;
          targetPos.set(
            THREE.MathUtils.lerp(0.0, 0.4, subT),
            THREE.MathUtils.lerp(-2.5, -1.8, subT),
            THREE.MathUtils.lerp(-6.0, -8.0, subT)
          );
          targetLookAt.set(0, 1.5, -20.0);
          // Subtle dimensional jitter
          targetPos.x += Math.sin(subT * 20) * 0.04;
          camera.fov = 54;
        } else if (incursionP < 0.90) {
          // Incursion collision & gravitational collapse: camera drawn inward
          const subT = (incursionP - 0.70) / 0.20;
          const smoothSub = Math.pow(subT, 1.4);
          targetPos.set(
            THREE.MathUtils.lerp(0.4, 0.0, smoothSub),
            THREE.MathUtils.lerp(-1.8, 0.0, smoothSub),
            THREE.MathUtils.lerp(-8.0, -13.5, smoothSub)
          );
          targetLookAt.set(0, 0, -16.0);
          // High gravitational instability
          targetPos.x += (Math.random() - 0.5) * 0.06;
          targetPos.y += (Math.random() - 0.5) * 0.06;
          camera.fov = THREE.MathUtils.lerp(54, 46, smoothSub);
        } else {
          // Blackout moment: camera stops at singularity threshold
          targetPos.set(0, 0, -14.0);
          targetLookAt.set(0, 0, -16.0);
          camera.fov = 48;
        }
      } else if (progress < 0.58) {
        // -----------------------------------------------------------
        // 4. IRON-MAN-INSPIRED FLIGHT SEQUENCE (0.45 - 0.58)
        // -----------------------------------------------------------
        const t = (progress - 0.45) / (0.58 - 0.45);

        if (t < 0.45) {
          // Camera placed in front of approaching hero
          const subT = t / 0.45;
          targetPos.set(
            THREE.MathUtils.lerp(0.0, 0.5, subT),
            THREE.MathUtils.lerp(0.0, 0.3, subT),
            THREE.MathUtils.lerp(-14.0, 5.0, subT)
          );
          targetLookAt.set(heroPos.x, heroPos.y + 0.4, heroPos.z);
          camera.fov = 54;
        } else if (t < 0.75) {
          // Hero swoops past camera! Camera spins to follow
          const subT = (t - 0.45) / 0.30;
          targetPos.set(
            THREE.MathUtils.lerp(0.5, -0.6, subT),
            THREE.MathUtils.lerp(0.3, 0.8, subT),
            THREE.MathUtils.lerp(5.0, 7.5, subT)
          );
          // Look forward into deep distance tracking retreating hero
          targetLookAt.set(heroPos.x, heroPos.y, heroPos.z);
          camera.fov = THREE.MathUtils.lerp(54, 65, subT);
        } else {
          // Camera glides behind flying hero as hero streaks ahead
          const subT = (t - 0.75) / 0.25;
          targetPos.set(
            THREE.MathUtils.lerp(-0.6, 0.0, subT),
            THREE.MathUtils.lerp(0.8, 0.2, subT),
            THREE.MathUtils.lerp(7.5, -4.0, subT)
          );
          targetLookAt.set(0, 0.2, -18.0);
          camera.fov = THREE.MathUtils.lerp(65, 52, subT);
        }
      } else if (progress < 0.68) {
        // -----------------------------------------------------------
        // 5. DOOM-INSPIRED VILLAIN ENTRANCE & ENERGY BLAST (0.58 - 0.68)
        // -----------------------------------------------------------
        const t = (progress - 0.58) / (0.68 - 0.58);
        const smoothT = t * t * (3 - 2 * t);

        // Low-angle menacing shot looking up at stepping villain
        targetPos.set(
          THREE.MathUtils.lerp(0.0, 0.2, smoothT),
          THREE.MathUtils.lerp(0.2, -0.3, smoothT),
          THREE.MathUtils.lerp(-4.0, -5.5, smoothT)
        );
        targetLookAt.set(0, 1.4, -11.0);
        camera.fov = 52;

        // Subtle camera shake when energy blast fires (t > 0.65)
        if (t > 0.65) {
          targetPos.x += (Math.random() - 0.5) * 0.08;
          targetPos.y += (Math.random() - 0.5) * 0.08;
        }
      } else if (progress < 0.77) {
        // -----------------------------------------------------------
        // 6. COSMIC CONFRONTATION (HERO VS VILLAIN) (0.68 - 0.77)
        // -----------------------------------------------------------
        const t = (progress - 0.68) / (0.77 - 0.68);
        const smoothT = t * t * (3 - 2 * t);

        // Sweeping arc camera showing both titans: Hero Left vs Villain Right
        targetPos.set(
          THREE.MathUtils.lerp(-1.4, 1.4, smoothT),
          THREE.MathUtils.lerp(0.4, 0.5, smoothT),
          THREE.MathUtils.lerp(-7.2, -7.0, smoothT)
        );
        // Look directly at the central clash vortex at (0, 1.8, -13)
        targetLookAt.set(0, 1.8, -13.0);
        camera.fov = 56;
      } else if (progress < 0.86) {
        // -----------------------------------------------------------
        // 7. THOR-INSPIRED LIGHTNING ENTRY (0.77 - 0.86)
        // -----------------------------------------------------------
        const t = (progress - 0.77) / (0.86 - 0.77);

        if (t < 0.35) {
          // Lightning strike impact & shake
          targetPos.set(0, -0.2, -6.5);
          targetLookAt.set(0, 1.2, -11.0);
          // High voltage impact shake
          targetPos.x += (Math.random() - 0.5) * 0.15;
          targetPos.y += (Math.random() - 0.5) * 0.15;
          camera.fov = 54;
        } else {
          // Crane up smoothly as Warrior raises thunder hammer
          const subT = (t - 0.35) / 0.65;
          const smoothSub = subT * subT * (3 - 2 * subT);
          targetPos.set(
            0,
            THREE.MathUtils.lerp(-0.2, 0.7, smoothSub),
            THREE.MathUtils.lerp(-6.5, -6.0, smoothSub)
          );
          targetLookAt.set(0, THREE.MathUtils.lerp(1.2, 2.2, smoothSub), -11.0);
          camera.fov = 50;
        }
      } else if (progress < 0.94) {
        // -----------------------------------------------------------
        // 8. SUPERHERO TEAM ASSEMBLY POSTER SHOT (0.86 - 0.94)
        // -----------------------------------------------------------
        const t = (progress - 0.86) / (0.94 - 0.86);
        const smoothT = t * t * (3 - 2 * t);

        // Pull back into grand wide cinematic poster angle
        targetPos.set(
          0,
          THREE.MathUtils.lerp(0.7, 1.2, smoothT),
          THREE.MathUtils.lerp(-6.0, -8.6, smoothT)
        );
        targetLookAt.set(0, 1.1, -15.0);
        camera.fov = 50;
      } else {
        // -----------------------------------------------------------
        // 9. COSMIC PORTAL BREACH & HACKFEST REVEAL (0.94 - 1.00)
        // -----------------------------------------------------------
        const t = (progress - 0.94) / (1.0 - 0.94);
        const smoothT = Math.pow(t, 1.4);

        // Accelerated dive through portal core
        targetPos.set(
          0,
          THREE.MathUtils.lerp(1.2, 0.0, smoothT),
          THREE.MathUtils.lerp(-8.6, -52.0, smoothT)
        );
        targetLookAt.set(0, 0, -68.0);
        camera.fov = THREE.MathUtils.lerp(50, 75, smoothT);
      }

      // Parallax mouse responsiveness
      const parallaxFactor = progress > 0.6 ? 0.22 : 0.45;
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
