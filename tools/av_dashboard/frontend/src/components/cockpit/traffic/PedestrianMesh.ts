import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { TrafficMaterials, TrafficGeometries } from './materials';
import { ActorLimbs } from './types';

export function createPedestrianMesh(
  mats: TrafficMaterials,
  geos: TrafficGeometries,
  humanModelTemplate: THREE.Group | null,
  smplTemplate: THREE.Group | null
): {
  mesh: THREE.Group;
  limbs: ActorLimbs;
  smplMesh?: THREE.Object3D;
  smplBones?: Record<string, THREE.Bone>;
  proceduralMesh?: THREE.Object3D;
  humanObjMesh?: THREE.Object3D;
  pedBox?: THREE.Mesh;
  pedEdges?: THREE.LineSegments;
  pedRing?: THREE.Mesh;
} {
  const ped = new THREE.Group();

  // 1. Ground Contact Shadow
  const shadow = new THREE.Mesh(geos.shadowCircleGeo, mats.pedShadowMat);
  shadow.position.set(0, 0.02, 0);
  ped.add(shadow);

  // 2. Volumetric 3D Bounding Box & Wireframe Edges
  const boxGeo = new THREE.BoxGeometry(0.70, 1.80, 0.70);
  const boxMat = new THREE.MeshStandardMaterial({
    color: 0x00e5ff,
    roughness: 0.25,
    metalness: 0.75,
    transparent: true,
    opacity: 0.18,
    depthWrite: false,
  });
  const pedBox = new THREE.Mesh(boxGeo, boxMat);
  pedBox.position.y = 0.90;
  ped.add(pedBox);

  const edgesGeo = new THREE.EdgesGeometry(boxGeo);
  const edgesMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    linewidth: 2,
    transparent: true,
    opacity: 0.85,
  });
  const pedEdges = new THREE.LineSegments(edgesGeo, edgesMat);
  pedEdges.position.y = 0.90;
  ped.add(pedEdges);

  // 3. Ground Contact Ring
  const ringGeo = new THREE.RingGeometry(0.35, 0.52, 32);
  ringGeo.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x00e5ff,
    transparent: true,
    opacity: 0.65,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const pedRing = new THREE.Mesh(ringGeo, ringMat);
  pedRing.position.y = 0.02;
  ped.add(pedRing);

  // 4. Authentic 3D Human Body Mesh (RViz human_model.obj)
  let humanObjMesh: THREE.Object3D | undefined;
  if (humanModelTemplate) {
    humanObjMesh = humanModelTemplate.clone(true);
    ped.add(humanObjMesh);
  }

  // 5. Rigged Skinned SMPL Humanoid Mesh
  let smplMesh: THREE.Object3D | undefined;
  let smplBones: Record<string, THREE.Bone> | undefined;
  if (smplTemplate) {
    smplMesh = SkeletonUtils.clone(smplTemplate);
    smplMesh.name = 'SMPL_Rigged_Mesh';
    smplMesh.scale.setScalar(0.0096);
    smplMesh.rotation.y = Math.PI;

    const bones: Record<string, THREE.Bone> = {};
    smplMesh.traverse((child) => {
      if ((child as THREE.Bone).isBone) {
        bones[child.name] = child as THREE.Bone;
      }
      if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
        const m = child as THREE.SkinnedMesh;
        m.castShadow = true;
        m.receiveShadow = true;
        m.material = mats.pedMat;
      }
    });
    smplBones = bones;
    ped.add(smplMesh);
  }

  // 6. Anatomical Articulated Limb Hierarchy
  const bodyRoot = new THREE.Group();
  bodyRoot.position.set(0, 0, 0);
  ped.add(bodyRoot);

  const hips = new THREE.Group();
  hips.name = 'Hips';
  hips.position.set(0, 0.86, 0);
  bodyRoot.add(hips);

  const pelvis = new THREE.Mesh(geos.pedPelvisGeo, mats.pedMat);
  pelvis.position.set(0, 0, 0);
  hips.add(pelvis);

  const torsoGroup = new THREE.Group();
  torsoGroup.name = 'Spine';
  torsoGroup.position.set(0, 0.08, 0);
  hips.add(torsoGroup);

  const abdomen = new THREE.Mesh(geos.pedAbdomenGeo, mats.pedMat);
  abdomen.position.set(0, 0.08, 0);
  torsoGroup.add(abdomen);

  const chest = new THREE.Mesh(geos.pedChestGeo, mats.pedMat);
  chest.name = 'Chest';
  chest.position.set(0, 0.26, 0);
  torsoGroup.add(chest);

  const neck = new THREE.Mesh(geos.pedNeckGeo, mats.pedAccentMat);
  neck.name = 'Neck';
  neck.position.set(0, 0.42, 0);
  torsoGroup.add(neck);

  const head = new THREE.Mesh(geos.pedHeadGeo, mats.pedMat);
  head.name = 'Head';
  head.position.set(0, 0.54, 0);
  const visor = new THREE.Mesh(geos.pedVisorGeo, mats.pedVisorMat);
  visor.position.set(0, 0.01, -0.09);
  head.add(visor);
  torsoGroup.add(head);

  // Left Arm
  const armL = new THREE.Group();
  armL.name = 'LeftArm';
  armL.position.set(-0.19, 0.36, 0);
  const upperArmL = new THREE.Mesh(geos.pedUpperArmGeo, mats.pedMat);
  upperArmL.position.set(0, -0.12, 0);
  armL.add(upperArmL);

  const elbowL = new THREE.Group();
  elbowL.name = 'LeftForeArm';
  elbowL.position.set(0, -0.24, 0);
  const foreArmL = new THREE.Mesh(geos.pedForeArmGeo, mats.pedMat);
  foreArmL.position.set(0, -0.11, 0);
  elbowL.add(foreArmL);
  const handL = new THREE.Mesh(geos.pedHandGeo, mats.pedAccentMat);
  handL.position.set(0, -0.24, 0);
  elbowL.add(handL);
  armL.add(elbowL);
  torsoGroup.add(armL);

  // Right Arm
  const armR = new THREE.Group();
  armR.name = 'RightArm';
  armR.position.set(0.19, 0.36, 0);
  const upperArmR = new THREE.Mesh(geos.pedUpperArmGeo, mats.pedMat);
  upperArmR.position.set(0, -0.12, 0);
  armR.add(upperArmR);

  const elbowR = new THREE.Group();
  elbowR.name = 'RightForeArm';
  elbowR.position.set(0, -0.24, 0);
  const foreArmR = new THREE.Mesh(geos.pedForeArmGeo, mats.pedMat);
  foreArmR.position.set(0, -0.11, 0);
  elbowR.add(foreArmR);
  const handR = new THREE.Mesh(geos.pedHandGeo, mats.pedAccentMat);
  handR.position.set(0, -0.24, 0);
  elbowR.add(handR);
  armR.add(elbowR);
  torsoGroup.add(armR);

  // Left Leg
  const legL = new THREE.Group();
  legL.name = 'LeftUpLeg';
  legL.position.set(-0.095, -0.05, 0);
  const thighL = new THREE.Mesh(geos.pedThighGeo, mats.pedMat);
  thighL.position.set(0, -0.18, 0);
  legL.add(thighL);

  const kneeL = new THREE.Group();
  kneeL.name = 'LeftLeg';
  kneeL.position.set(0, -0.36, 0);
  const shinL = new THREE.Mesh(geos.pedShinGeo, mats.pedMat);
  shinL.position.set(0, -0.17, 0);
  kneeL.add(shinL);
  const footL = new THREE.Mesh(geos.pedFootGeo, mats.pedAccentMat);
  footL.position.set(0, -0.35, 0.04);
  kneeL.add(footL);
  legL.add(kneeL);
  hips.add(legL);

  // Right Leg
  const legR = new THREE.Group();
  legR.name = 'RightUpLeg';
  legR.position.set(0.095, -0.05, 0);
  const thighR = new THREE.Mesh(geos.pedThighGeo, mats.pedMat);
  thighR.position.set(0, -0.18, 0);
  legR.add(thighR);

  const kneeR = new THREE.Group();
  kneeR.name = 'RightLeg';
  kneeR.position.set(0, -0.36, 0);
  const shinR = new THREE.Mesh(geos.pedShinGeo, mats.pedMat);
  shinR.position.set(0, -0.17, 0);
  kneeR.add(shinR);
  const footR = new THREE.Mesh(geos.pedFootGeo, mats.pedAccentMat);
  footR.position.set(0, -0.35, 0.04);
  kneeR.add(footR);
  legR.add(kneeR);
  hips.add(legR);

  const result = {
    mesh: ped,
    limbs: {
      bodyRoot,
      hips,
      spine: torsoGroup,
      chest,
      neck,
      head,
      armL,
      elbowL,
      armR,
      elbowR,
      legL,
      kneeL,
      legR,
      kneeR,
    },
    smplMesh,
    smplBones,
    proceduralMesh: bodyRoot,
    humanObjMesh,
    pedBox,
    pedEdges,
    pedRing,
  };

  if (humanObjMesh) {
    if (smplMesh) smplMesh.visible = false;
    bodyRoot.visible = false;
  }

  return result;
}
