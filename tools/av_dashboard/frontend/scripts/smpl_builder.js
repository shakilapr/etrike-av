import * as THREE from 'three';

export function createSmplMaterials() {
  const smplSkinMat = new THREE.MeshStandardMaterial({
    name: 'SMPL_Skin_DigitalTwin',
    color: 0x334155, // Slate-700 digital twin humanoid silhouette
    roughness: 0.65,
    metalness: 0.10,
    transparent: true,
    opacity: 0.82,
  });

  const smplAccentMat = new THREE.MeshStandardMaterial({
    name: 'SMPL_Accent_SlateDark',
    color: 0x1e293b, // Slate-800 darker accent tone
    roughness: 0.75,
    metalness: 0.10,
    transparent: true,
    opacity: 0.88,
  });

  const visorMat = new THREE.MeshStandardMaterial({
    name: 'SMPL_Visor_CyanGlow',
    color: 0x38bdf8,
    roughness: 0.15,
    metalness: 0.85,
    emissive: 0x0284c7,
    emissiveIntensity: 1.5,
  });

  const jointMats = {
    cyan: new THREE.MeshBasicMaterial({ name: 'RTMPose_Cyan', color: 0x06b6d4 }),
    sky: new THREE.MeshBasicMaterial({ name: 'RTMPose_Sky', color: 0x38bdf8 }),
    violet: new THREE.MeshBasicMaterial({ name: 'RTMPose_Violet', color: 0xc084fc }),
    emerald: new THREE.MeshBasicMaterial({ name: 'RTMPose_Emerald', color: 0x10b981 }),
    amber: new THREE.MeshBasicMaterial({ name: 'RTMPose_Amber', color: 0xf59e0b }),
    orange: new THREE.MeshBasicMaterial({ name: 'RTMPose_Orange', color: 0xf97316 }),
  };

  return { smplSkinMat, smplAccentMat, visorMat, jointMats };
}

export function buildLimb(name, geo, mat, pos = [0, 0, 0]) {
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = name;
  mesh.position.set(...pos);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}
