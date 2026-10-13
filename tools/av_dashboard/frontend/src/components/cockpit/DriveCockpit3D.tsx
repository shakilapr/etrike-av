import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useCanStore } from '../../store/canStore';
import { TuktukVehicle } from './TuktukVehicle';
import { RoadEnvironment } from './RoadEnvironment';
import { SurroundingTraffic } from './SurroundingTraffic';
import { CockpitHud } from './CockpitHud';

export const DriveCockpit3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraMode = useCanStore((s) => s.cameraMode);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Fog (Pure engineering black horizon fade)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.015);

    // 2. Camera
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 300);
    camera.position.set(0, 2.8, 6.2);

    // 3. Renderer with WebGL error safeguard
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        powerPreference: 'high-performance',
        precision: 'mediump',
        stencil: false,
        depth: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(1.0);
      renderer.shadowMap.enabled = false;
      container.appendChild(renderer.domElement);
    } catch (err) {
      console.error('[DriveCockpit3D] WebGL context initialization failed:', err);
      return;
    }

    // 4. Orbit Controls (Used in Orbit mode)
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;
    orbitControls.maxPolarAngle = Math.PI / 2 - 0.05; // Do not go below ground
    orbitControls.minDistance = 2.0;
    orbitControls.maxDistance = 25.0;
    orbitControls.target.set(0, 0.8, 0);
    orbitControls.enabled = false;

    // 5. Lighting: High-contrast automotive studio lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    // Key light from front-left illuminating vehicle nose and flank
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(-12, 18, -15);
    scene.add(keyLight);

    // Fill light from rear-right
    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.9);
    fillLight.position.set(12, 12, 15);
    scene.add(fillLight);

    // Cyan rim bounce light
    const rimLight = new THREE.HemisphereLight(0x06b6d4, 0x18181b, 0.6);
    scene.add(rimLight);

    // 6. Road Environment, Tuktuk Vehicle & Surrounding Traffic
    const road = new RoadEnvironment();
    scene.add(road.group);

    const tuktuk = new TuktukVehicle();
    scene.add(tuktuk.group);

    const traffic = new SurroundingTraffic();
    scene.add(traffic.group);

    // 7. Animation & Game Motion Loop
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const state = useCanStore.getState();
      const telemetry = state.telemetry;
      const isAuto = telemetry.mode === 'AUTONOMOUS' || telemetry.mode === 'AUTO';
      const yawRate121 = state.framesById[0x121]?.signals?.['yaw_rate_mrad_s']?.value;
      const yawRate300 = state.framesById[0x300]?.signals?.['yaw_rate_mrad_s']?.value;
      const yawRate = typeof yawRate121 === 'number'
        ? yawRate121
        : typeof yawRate300 === 'number'
        ? yawRate300
        : typeof state.rosStatus.ego_yaw_rate_mrad_s === 'number'
        ? state.rosStatus.ego_yaw_rate_mrad_s
        : 0;

      // Update Tuktuk vehicle dynamics
      tuktuk.update(
        telemetry.speed_act_kmh,
        telemetry.steer_act_deg,
        yawRate,
        telemetry.brake_act_kpa,
        dt
      );

      // Update Road & Trajectory
      road.update(
        telemetry.speed_act_kmh,
        telemetry.steer_act_deg,
        isAuto,
        state.plannedTrajectory,
        dt
      );

      // Update Surrounding Traffic, Pedestrians & Obstacles.
      // Hide objects entirely until ego pose is valid, otherwise every actor would
      // pile up at the origin while localization is still converging.
      const poseOk = state.rosStatus.pose_ok !== false;
      traffic.update(
        telemetry.speed_act_kmh,
        poseOk ? state.perceptionObjects : [],
        state.rosStatus.active,
        dt
      );

      // Camera Management based on cameraMode
      const activeCameraMode = state.cameraMode;
      if (activeCameraMode === 'orbit') {
        orbitControls.enabled = true;
        orbitControls.target.set(0, 0.75, 0.2);
        orbitControls.update();
      } else {
        orbitControls.enabled = false;

        if (activeCameraMode === 'cabin') {
          // Inside cabin looking forward over handlebars through windshield
          camera.position.set(0, 1.25, 0.0);
          camera.lookAt(0, 1.0, -25);
        } else {
          // Chase Cam: smoothly follow behind the vehicle
          const targetCamX = 0;
          const targetCamY = 2.5;
          const targetCamZ = 5.2;

          camera.position.x += (targetCamX - camera.position.x) * (dt * 6);
          camera.position.y += (targetCamY - camera.position.y) * (dt * 6);
          camera.position.z += (targetCamZ - camera.position.z) * (dt * 6);

          camera.lookAt(0, 0.75, -8);
        }
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      orbitControls.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden select-none">
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Ergonomic Floating HUD Overlay */}
      <CockpitHud />
    </div>
  );
};
