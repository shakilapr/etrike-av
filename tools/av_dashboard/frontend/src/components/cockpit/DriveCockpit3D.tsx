import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useCanStore } from '../../store/canStore';
import { TuktukVehicle } from './TuktukVehicle';
import { RoadEnvironment } from './RoadEnvironment';
import { SurroundingTraffic } from './SurroundingTraffic';
import { CockpitHud } from './CockpitHud';
import { LidarRangeRings } from './LidarRangeRings';
import { LidarPointCloud } from './LidarPointCloud';
import { useLidarStream } from './useLidarStream';

export const DriveCockpit3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraMode = useCanStore((s) => s.cameraMode);
  const [lidarCloudInstance, setLidarCloudInstance] = useState<LidarPointCloud | null>(null);
  const lidarStream = useLidarStream(lidarCloudInstance);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Fog (Deep midnight navy horizon fade matching real LiDAR aesthetic)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020412);
    scene.fog = new THREE.FogExp2(0x020412, 0.015);

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
        precision: 'mediump',
        stencil: false,
        depth: true,
        failIfMajorPerformanceCaveat: false,
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

    // 6. Road Environment, Range Rings & Real Hesai XT32 Point Cloud
    const road = new RoadEnvironment();
    scene.add(road.group);

    const rangeRings = new LidarRangeRings();
    scene.add(rangeRings.group);

    const lidarCloud = new LidarPointCloud();
    scene.add(lidarCloud.group);
    setLidarCloudInstance(lidarCloud);

    const tuktuk = new TuktukVehicle();
    scene.add(tuktuk.group);

    const traffic = new SurroundingTraffic();
    scene.add(traffic.group);

    // 7. Animation & Game Motion Loop
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const rawDt = (currentTime - lastTime) / 1000;
      const dt = typeof rawDt === 'number' && !isNaN(rawDt) && rawDt > 0 ? Math.min(rawDt, 0.1) : 0.016;
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
        dt,
        state.humanPoses || state.rosStatus.human_poses,
        state.demoPedestrian,
        state.mhrHuman,
        state.showSkeletons
      );

      // Point cloud visibility toggle
      lidarCloud.group.visible = state.showPointCloud;

      // Camera Management based on cameraMode
      const activeCameraMode = state.cameraMode;
      const allowTukTuk = state.showTukTuk;

      if (activeCameraMode === 'orbit') {
        tuktuk.group.visible = allowTukTuk;
        orbitControls.enabled = true;
        orbitControls.target.set(0, 0.75, 0.2);
        orbitControls.update();
      } else {
        orbitControls.enabled = false;

        if (activeCameraMode === 'cabin') {
          // Inside cabin: hide ego vehicle exterior mesh to give clean driver windshield perspective
          tuktuk.group.visible = false;
          camera.position.set(0, 1.30, -0.40);
          camera.lookAt(0, 1.05, -25);
        } else {
          tuktuk.group.visible = allowTukTuk;
          // Chase Cam: smoothly follow behind vehicle with stable framing
          const targetCamX = 0;
          const targetCamY = 3.2;
          const targetCamZ = 5.8;
          const targetLookY = 0.85;
          const targetLookZ = -5.0;

          if (isNaN(camera.position.x)) camera.position.x = 0;
          if (isNaN(camera.position.y)) camera.position.y = targetCamY;
          if (isNaN(camera.position.z)) camera.position.z = targetCamZ;

          const factor = Math.min(dt * 5, 1.0);
          camera.position.x += (targetCamX - camera.position.x) * factor;
          camera.position.y += (targetCamY - camera.position.y) * factor;
          camera.position.z += (targetCamZ - camera.position.z) * factor;

          camera.lookAt(0, targetLookY, targetLookZ);
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
      lidarCloud.dispose();
      road.dispose();
      rangeRings.dispose();
      tuktuk.dispose();
      traffic.dispose();
      setLidarCloudInstance(null);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const [filterMode, setFilterMode] = useState<'filtered' | 'raw' | 'inspection'>('filtered');
  const [opacity, setOpacity] = useState<number>(0.60);
  const [density, setDensity] = useState<'med' | 'low' | 'high'>('med');
  const [colorMode, setColorMode] = useState<'cyber' | 'prox' | 'intensity'>('cyber');
  const [groundMode, setGroundMode] = useState<'dim' | 'off' | 'full'>('dim');
  const [trailFrames, setTrailFrames] = useState<number>(3);

  const cycleFilterMode = async () => {
    const nextMode = filterMode === 'filtered' ? 'raw' : filterMode === 'raw' ? 'inspection' : 'filtered';
    setFilterMode(nextMode);
    try {
      await fetch(`/api/v1/lidar/mode?mode=${nextMode}`, { method: 'POST' });
    } catch {
      // Backend may be offline during development
    }
  };

  const cycleOpacity = () => {
    const next = opacity === 0.60 ? 0.35 : opacity === 0.35 ? 0.85 : 0.60;
    setOpacity(next);
    if (lidarCloudInstance) {
      lidarCloudInstance.setOpacity(next);
    }
  };

  const cycleDensity = async () => {
    const next = density === 'med' ? 'low' : density === 'low' ? 'high' : 'med';
    setDensity(next);
    const stride = next === 'low' ? 3 : next === 'med' ? 2 : 1;
    const target = next === 'low' ? 3500 : next === 'med' ? 6000 : 15000;
    try {
      await fetch(`/api/v1/lidar/density?stride=${stride}&target_points=${target}`, { method: 'POST' });
    } catch {
      // Backend may be offline during development
    }
  };

  const cycleColorMode = () => {
    const next = colorMode === 'cyber' ? 'prox' : colorMode === 'prox' ? 'intensity' : 'cyber';
    setColorMode(next);
    if (lidarCloudInstance) {
      lidarCloudInstance.setColorMode(next);
    }
  };

  const cycleGroundMode = () => {
    const next = groundMode === 'dim' ? 'off' : groundMode === 'off' ? 'full' : 'dim';
    setGroundMode(next);
    if (lidarCloudInstance) {
      lidarCloudInstance.setGroundMode(next);
    }
  };

  const cycleTrail = () => {
    const next = trailFrames === 3 ? 1 : 3;
    setTrailFrames(next);
    if (lidarCloudInstance) {
      lidarCloudInstance.setTrailFrames(next);
    }
  };

  return (
    <div className="relative w-full h-full bg-[#020412] overflow-hidden select-none">
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Real Hesai XT32 LiDAR Status Badge & Mode Switcher */}
      <div className="absolute top-[4.75rem] right-4 z-20 flex items-center gap-1.5 bg-[#050b1a]/95 border border-[#1e293b] backdrop-blur-md px-3 py-1.5 rounded-md font-mono text-xs shadow-2xl pointer-events-auto">
        <span
          className={`w-2 h-2 rounded-full ${
            lidarStream.connected ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-neutral-500'
          }`}
        />
        <span className="font-semibold text-neutral-200">XT32</span>
        <span className="text-cyan-400 font-medium">
          {lidarStream.pointCount > 0 ? `${lidarStream.pointCount.toLocaleString()} pts` : 'STANDBY'}
        </span>
        {lidarStream.hz > 0 && (
          <span className="text-emerald-400 text-[11px]">@{lidarStream.hz}Hz</span>
        )}
        <span className="text-neutral-600">|</span>

        {/* Color Mode Toggle */}
        <button
          onClick={cycleColorMode}
          title="Color Mode: Click to cycle: CYBER (Elevation) -> PROX (Collision Radar) -> REFL (Laser Reflectivity)"
          className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider transition-all border ${
            colorMode === 'cyber'
              ? 'bg-indigo-950/70 text-indigo-300 border-indigo-700/60 hover:bg-indigo-900/70'
              : colorMode === 'prox'
              ? 'bg-rose-950/80 text-amber-300 border-amber-500/70 hover:bg-rose-900/80 shadow-[0_0_8px_rgba(245,158,11,0.35)]'
              : 'bg-teal-950/70 text-teal-300 border-teal-700/60 hover:bg-teal-900/70'
          }`}
        >
          {colorMode === 'cyber' ? 'CYBER' : colorMode === 'prox' ? 'PROX' : 'REFL'}
        </button>

        {/* Ground Mode Toggle */}
        <button
          onClick={cycleGroundMode}
          title="Ground Mode: Click to cycle: GND:DIM (Subtle road) -> GND:OFF (Obstacles only) -> GND:FULL (All)"
          className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider transition-all border ${
            groundMode === 'dim'
              ? 'bg-sky-950/70 text-sky-300 border-sky-700/60 hover:bg-sky-900/70'
              : groundMode === 'off'
              ? 'bg-neutral-900/90 text-neutral-400 border-neutral-700/60 hover:bg-neutral-800/90'
              : 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900/70'
          }`}
        >
          GND:{groundMode}
        </button>

        {/* Temporal Decay Accumulation Toggle */}
        <button
          onClick={cycleTrail}
          title="Temporal Decay: Click to cycle: 3F (Multi-frame dense sweeps) -> 1F (Instant single sweep)"
          className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider transition-all border ${
            trailFrames === 3
              ? 'bg-violet-950/70 text-violet-300 border-violet-700/60 hover:bg-violet-900/70 shadow-[0_0_8px_rgba(167,139,250,0.3)]'
              : 'bg-slate-900/80 text-neutral-400 border-slate-700/60 hover:bg-slate-800/80'
          }`}
        >
          {trailFrames}F TRAIL
        </button>

        <span className="text-neutral-600">|</span>

        {/* Filter Mode Toggle */}
        <button
          onClick={cycleFilterMode}
          title="Filter Mode: Click to cycle: Filtered (Clean) -> Raw (All 360°) -> Inspection (Red Body Strikes)"
          className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider transition-all border ${
            filterMode === 'filtered'
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900/60'
              : filterMode === 'raw'
              ? 'bg-amber-950/60 text-amber-300 border-amber-700/60 hover:bg-amber-900/60'
              : 'bg-rose-950/60 text-rose-300 border-rose-700/60 hover:bg-rose-900/60 shadow-[0_0_8px_rgba(244,63,94,0.4)]'
          }`}
        >
          {filterMode}
        </button>

        {/* Density Toggle */}
        <button
          onClick={cycleDensity}
          title="Density: Click to cycle: MED (6k pts) -> LOW (3.5k pts) -> HIGH (15k pts)"
          className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider transition-all border bg-cyan-950/60 text-cyan-300 border-cyan-700/60 hover:bg-cyan-900/60"
        >
          {density} DENS
        </button>

        {/* Opacity Toggle */}
        <button
          onClick={cycleOpacity}
          title="Opacity: Click to cycle: 60% -> 35% -> 85%"
          className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider transition-all border bg-slate-900/80 text-neutral-300 border-slate-700/60 hover:bg-slate-800/80"
        >
          {Math.round(opacity * 100)}% α
        </button>
      </div>

      {/* Ergonomic Floating HUD Overlay */}
      <CockpitHud />
    </div>
  );
};
