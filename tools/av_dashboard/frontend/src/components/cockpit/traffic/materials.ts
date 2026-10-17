import * as THREE from 'three';

export interface TrafficMaterials {
  pedMat: THREE.MeshStandardMaterial;
  pedAccentMat: THREE.MeshStandardMaterial;
  pedVisorMat: THREE.MeshStandardMaterial;
  pedShadowMat: THREE.MeshBasicMaterial;
  pedHazardMat: THREE.MeshBasicMaterial;
  pedFusedMat: THREE.MeshStandardMaterial;
  pedLidarMat: THREE.MeshStandardMaterial;
  pedCameraMat: THREE.MeshStandardMaterial;
  carPaintMat: THREE.MeshStandardMaterial;
  carGlassMat: THREE.MeshStandardMaterial;
  truckPaintMat: THREE.MeshStandardMaterial;
  coneOrangeMat: THREE.MeshStandardMaterial;
  coneWhiteMat: THREE.MeshStandardMaterial;
  coneBaseMat: THREE.MeshStandardMaterial;
  obstacleMat: THREE.MeshStandardMaterial;
  obstacleRingMat: THREE.MeshBasicMaterial;
  headlightMat: THREE.MeshBasicMaterial;
  taillightMat: THREE.MeshBasicMaterial;
  wheelTireMat: THREE.MeshStandardMaterial;
  wheelRimMat: THREE.MeshStandardMaterial;
  shadowMat: THREE.MeshBasicMaterial;
  jointCyanMat: THREE.MeshBasicMaterial;
  jointSkyMat: THREE.MeshBasicMaterial;
  jointVioletMat: THREE.MeshBasicMaterial;
  jointEmeraldMat: THREE.MeshBasicMaterial;
  jointAmberMat: THREE.MeshBasicMaterial;
  jointOrangeMat: THREE.MeshBasicMaterial;
  boneCyanMat: THREE.MeshBasicMaterial;
  boneSkyMat: THREE.MeshBasicMaterial;
  boneVioletMat: THREE.MeshBasicMaterial;
  boneEmeraldMat: THREE.MeshBasicMaterial;
  boneAmberMat: THREE.MeshBasicMaterial;
  boneOrangeMat: THREE.MeshBasicMaterial;
}

export interface TrafficGeometries {
  boneCylinderGeo: THREE.CylinderGeometry;
  shadowCircleGeo: THREE.CircleGeometry;
  wheelTireGeo: THREE.CylinderGeometry;
  wheelRimGeo: THREE.CylinderGeometry;
  pedHeadGeo: THREE.SphereGeometry;
  pedVisorGeo: THREE.BoxGeometry;
  pedNeckGeo: THREE.CylinderGeometry;
  pedChestGeo: THREE.CapsuleGeometry;
  pedAbdomenGeo: THREE.CapsuleGeometry;
  pedPelvisGeo: THREE.CapsuleGeometry;
  pedUpperArmGeo: THREE.CapsuleGeometry;
  pedForeArmGeo: THREE.CapsuleGeometry;
  pedHandGeo: THREE.BoxGeometry;
  pedThighGeo: THREE.CapsuleGeometry;
  pedShinGeo: THREE.CapsuleGeometry;
  pedFootGeo: THREE.BoxGeometry;
  coneBaseGeo: THREE.BoxGeometry;
  coneBodyGeo: THREE.CylinderGeometry;
  coneReflectGeo: THREE.CylinderGeometry;
}

export function createTrafficMaterials(): TrafficMaterials {
  return {
    pedMat: new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.55, metalness: 0.20 }),
    pedAccentMat: new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.70, metalness: 0.15 }),
    pedVisorMat: new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.15, metalness: 0.85, emissive: 0x0284c7, emissiveIntensity: 1.5 }),
    pedShadowMat: new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5, depthWrite: false }),
    pedHazardMat: new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.35, side: THREE.DoubleSide }),
    pedFusedMat: new THREE.MeshStandardMaterial({ color: 0x00e5ff, roughness: 0.35, metalness: 0.25, emissive: 0x003344, emissiveIntensity: 0.4 }),
    pedLidarMat: new THREE.MeshStandardMaterial({ color: 0xff8c00, roughness: 0.35, metalness: 0.25, emissive: 0x442200, emissiveIntensity: 0.4 }),
    pedCameraMat: new THREE.MeshStandardMaterial({ color: 0xffe600, roughness: 0.35, metalness: 0.25, emissive: 0x443b00, emissiveIntensity: 0.4 }),
    carPaintMat: new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.25, metalness: 0.55 }),
    carGlassMat: new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.1, metalness: 0.85, transparent: true, opacity: 0.92 }),
    truckPaintMat: new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.35, metalness: 0.45 }),
    coneOrangeMat: new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4, metalness: 0.05 }),
    coneWhiteMat: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.1 }),
    coneBaseMat: new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8, metalness: 0.1 }),
    obstacleMat: new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.45, metalness: 0.25 }),
    obstacleRingMat: new THREE.MeshBasicMaterial({ color: 0x94a3b8 }),
    headlightMat: new THREE.MeshBasicMaterial({ color: 0xffffff }),
    taillightMat: new THREE.MeshBasicMaterial({ color: 0xef4444 }),
    wheelTireMat: new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.85, metalness: 0.1 }),
    wheelRimMat: new THREE.MeshStandardMaterial({ color: 0xd4d4d8, roughness: 0.2, metalness: 0.85 }),
    shadowMat: new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.45, depthWrite: false }),
    jointCyanMat: new THREE.MeshBasicMaterial({ color: 0x06b6d4, depthTest: false, transparent: true, opacity: 0.95 }),
    jointSkyMat: new THREE.MeshBasicMaterial({ color: 0x38bdf8, depthTest: false, transparent: true, opacity: 0.95 }),
    jointVioletMat: new THREE.MeshBasicMaterial({ color: 0xc084fc, depthTest: false, transparent: true, opacity: 0.95 }),
    jointEmeraldMat: new THREE.MeshBasicMaterial({ color: 0x10b981, depthTest: false, transparent: true, opacity: 0.95 }),
    jointAmberMat: new THREE.MeshBasicMaterial({ color: 0xf59e0b, depthTest: false, transparent: true, opacity: 0.95 }),
    jointOrangeMat: new THREE.MeshBasicMaterial({ color: 0xf97316, depthTest: false, transparent: true, opacity: 0.95 }),
    boneCyanMat: new THREE.MeshBasicMaterial({ color: 0x06b6d4, depthTest: false, transparent: true, opacity: 0.90 }),
    boneSkyMat: new THREE.MeshBasicMaterial({ color: 0x22d3ee, depthTest: false, transparent: true, opacity: 0.90 }),
    boneVioletMat: new THREE.MeshBasicMaterial({ color: 0xa855f7, depthTest: false, transparent: true, opacity: 0.90 }),
    boneEmeraldMat: new THREE.MeshBasicMaterial({ color: 0x10b981, depthTest: false, transparent: true, opacity: 0.90 }),
    boneAmberMat: new THREE.MeshBasicMaterial({ color: 0xf59e0b, depthTest: false, transparent: true, opacity: 0.90 }),
    boneOrangeMat: new THREE.MeshBasicMaterial({ color: 0xf97316, depthTest: false, transparent: true, opacity: 0.90 }),
  };
}

export function createTrafficGeometries(): TrafficGeometries {
  const shadowCircleGeo = new THREE.CircleGeometry(0.35, 18);
  shadowCircleGeo.rotateX(-Math.PI / 2);

  const wheelTireGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.22, 16);
  wheelTireGeo.rotateZ(Math.PI / 2);
  const wheelRimGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.23, 16);
  wheelRimGeo.rotateZ(Math.PI / 2);

  const pedHeadGeo = new THREE.SphereGeometry(0.105, 24, 24);
  pedHeadGeo.scale(0.85, 1.16, 1.02);
  const pedChestGeo = new THREE.CapsuleGeometry(0.125, 0.22, 16, 20);
  pedChestGeo.scale(1.26, 1.0, 0.86);
  const pedAbdomenGeo = new THREE.CapsuleGeometry(0.105, 0.16, 16, 20);
  pedAbdomenGeo.scale(1.10, 1.0, 0.86);
  const pedPelvisGeo = new THREE.CapsuleGeometry(0.118, 0.14, 16, 20);
  pedPelvisGeo.scale(1.14, 1.0, 0.90);

  return {
    boneCylinderGeo: new THREE.CylinderGeometry(0.016, 0.016, 1.0, 8),
    shadowCircleGeo,
    wheelTireGeo,
    wheelRimGeo,
    pedHeadGeo,
    pedVisorGeo: new THREE.BoxGeometry(0.13, 0.035, 0.06),
    pedNeckGeo: new THREE.CylinderGeometry(0.048, 0.062, 0.09, 16),
    pedChestGeo,
    pedAbdomenGeo,
    pedPelvisGeo,
    pedUpperArmGeo: new THREE.CapsuleGeometry(0.040, 0.24, 12, 16),
    pedForeArmGeo: new THREE.CapsuleGeometry(0.032, 0.22, 12, 16),
    pedHandGeo: new THREE.BoxGeometry(0.026, 0.08, 0.065),
    pedThighGeo: new THREE.CapsuleGeometry(0.060, 0.36, 12, 18),
    pedShinGeo: new THREE.CapsuleGeometry(0.044, 0.34, 12, 18),
    pedFootGeo: new THREE.BoxGeometry(0.075, 0.05, 0.22),
    coneBaseGeo: new THREE.BoxGeometry(0.38, 0.04, 0.38),
    coneBodyGeo: new THREE.CylinderGeometry(0.035, 0.18, 0.65, 20),
    coneReflectGeo: new THREE.CylinderGeometry(0.08, 0.13, 0.16, 20),
  };
}
