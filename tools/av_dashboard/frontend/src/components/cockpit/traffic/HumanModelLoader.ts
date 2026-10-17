import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { TrafficMaterials, TrafficGeometries } from './materials';
import { Actor } from './types';
import { createPedestrianMesh } from './PedestrianMesh';
import { createRTMPoseSkeletonOverlay } from './SkeletonRig';

export function disposeHierarchy(obj: THREE.Object3D): void {
  obj.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => m.dispose());
      } else {
        mesh.material.dispose();
      }
    }
  });
}

export function applySemanticThemeToActor(
  actor: Actor,
  provenance: string,
  mats: TrafficMaterials
): void {
  let mat = mats.pedFusedMat;
  let colorHex = 0x00e5ff;
  let edgeHex = 0x38bdf8;
  if (provenance === 'lidar') {
    mat = mats.pedLidarMat;
    colorHex = 0xff8c00;
    edgeHex = 0xfba04b;
  } else if (provenance === 'camera') {
    mat = mats.pedCameraMat;
    colorHex = 0xffe600;
    edgeHex = 0xfef08a;
  }

  if (actor.humanObjMesh) {
    actor.humanObjMesh.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = mat;
      }
    });
  }
  if (actor.smplMesh) {
    actor.smplMesh.traverse((child) => {
      if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
        (child as THREE.SkinnedMesh).material = mat;
      }
    });
  }
  if (actor.proceduralMesh) {
    actor.proceduralMesh.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && child.name !== 'Head' && !child.name.includes('Visor')) {
        (child as THREE.Mesh).material = mat;
      }
    });
  }
  if (actor.pedBoxMesh) {
    (actor.pedBoxMesh.material as THREE.MeshStandardMaterial).color.setHex(colorHex);
  }
  if (actor.pedEdgesMesh) {
    (actor.pedEdgesMesh.material as THREE.LineBasicMaterial).color.setHex(edgeHex);
  }
  if (actor.pedRingMesh) {
    (actor.pedRingMesh.material as THREE.MeshBasicMaterial).color.setHex(colorHex);
  }
}

export function upgradeActorHumanMesh(
  actor: Actor,
  humanModelTemplate: THREE.Group | null,
  mats: TrafficMaterials
): void {
  if (!humanModelTemplate) return;
  const pedRoot = actor.meshes['PEDESTRIAN'] as THREE.Group | undefined;
  if (!pedRoot) return;

  if (!actor.humanObjMesh) {
    const cloned = humanModelTemplate.clone(true);
    actor.humanObjMesh = cloned;
    pedRoot.add(cloned);
    applySemanticThemeToActor(actor, actor.sensorProvenance || 'fused', mats);
  }

  if (actor.proceduralMesh) {
    actor.proceduralMesh.visible = false;
  }
}

export function upgradeActorToSmpl(
  actor: Actor,
  smplTemplate: THREE.Group | null,
  humanModelTemplate: THREE.Group | null,
  mats: TrafficMaterials,
  geos: TrafficGeometries
): void {
  if (!smplTemplate) return;
  const oldPedMesh = actor.meshes['PEDESTRIAN'];
  if (oldPedMesh) {
    actor.group.remove(oldPedMesh);
    disposeHierarchy(oldPedMesh);
  }
  const { mesh: newMesh, limbs, smplMesh, smplBones, proceduralMesh, humanObjMesh, pedBox, pedEdges, pedRing } =
    createPedestrianMesh(mats, geos, humanModelTemplate, smplTemplate);
  const { group: skelGroup, joints: skelJoints, bones: skelBones } = createRTMPoseSkeletonOverlay(mats, geos);
  newMesh.add(skelGroup);

  actor.meshes['PEDESTRIAN'] = newMesh;
  actor.limbs = limbs;
  actor.smplMesh = smplMesh;
  actor.smplBones = smplBones;
  actor.proceduralMesh = proceduralMesh;
  actor.humanObjMesh = humanObjMesh;
  actor.pedBoxMesh = pedBox;
  actor.pedEdgesMesh = pedEdges;
  actor.pedRingMesh = pedRing;
  actor.skeletonGroup = skelGroup;
  actor.skeletonJoints = skelJoints;
  actor.skeletonBones = skelBones;
  actor.group.add(newMesh);
  newMesh.visible = actor.currentLabel === 'PEDESTRIAN';
  applySemanticThemeToActor(actor, actor.sensorProvenance || 'fused', mats);
}

export function loadHumanModelTemplate(
  mats: TrafficMaterials,
  onLoaded: (template: THREE.Group) => void
): void {
  const loader = new OBJLoader();
  loader.load(
    '/models/human_model.obj',
    (group) => {
      const rotMat = new THREE.Matrix4().set(
        0, -1,  0, 0,
        0,  0,  1, 0,
       -1,  0,  0, 0,
        0,  0,  0, 1
      );
      group.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const m = child as THREE.Mesh;
          m.geometry.applyMatrix4(rotMat);
          m.geometry.computeVertexNormals();
          m.castShadow = true;
          m.receiveShadow = true;
          m.material = mats.pedFusedMat;
        }
      });
      group.name = 'HumanModel_OBJ';
      onLoaded(group);
    },
    undefined,
    (err) => {
      console.warn('[SurroundingTraffic] human_model.obj load error:', err);
    }
  );
}

export function loadSmplTemplate(onLoaded: (template: THREE.Group) => void): void {
  const loader = new GLTFLoader();
  loader.load(
    '/models/pedestrian_smpl.glb',
    (gltf) => {
      onLoaded(gltf.scene as unknown as THREE.Group);
    },
    undefined,
    (err) => {
      console.warn('[SurroundingTraffic] SMPL pedestrian mesh unavailable, using procedural avatar:', err);
    }
  );
}
