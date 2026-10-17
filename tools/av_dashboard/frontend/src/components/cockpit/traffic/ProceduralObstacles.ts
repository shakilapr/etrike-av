import * as THREE from 'three';
import { TrafficMaterials, TrafficGeometries } from './materials';

export function createConeMesh(mats: TrafficMaterials, geos: TrafficGeometries): THREE.Group {
  const cone = new THREE.Group();

  // Base square rubber plate
  const base = new THREE.Mesh(geos.coneBaseGeo, mats.coneBaseMat);
  base.position.set(0, 0.02, 0);
  cone.add(base);

  // Tapered highway orange cone body
  const body = new THREE.Mesh(geos.coneBodyGeo, mats.coneOrangeMat);
  body.position.set(0, 0.35, 0);
  cone.add(body);

  // White reflective collar band
  const collar = new THREE.Mesh(geos.coneReflectGeo, mats.coneWhiteMat);
  collar.position.set(0, 0.36, 0);
  cone.add(collar);

  // Ground contact shadow
  const shadowGeo = new THREE.CircleGeometry(0.25, 16);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadow = new THREE.Mesh(shadowGeo, mats.shadowMat);
  shadow.position.set(0, 0.01, 0);
  cone.add(shadow);

  return cone;
}

export function createObstacleMesh(mats: TrafficMaterials): THREE.Group {
  const group = new THREE.Group();
  const geo = new THREE.CylinderGeometry(0.34, 0.36, 0.75, 18);
  const body = new THREE.Mesh(geo, mats.obstacleMat);
  body.position.set(0, 0.375, 0);
  body.name = 'obstacle_body';
  group.add(body);

  const ringGeo = new THREE.TorusGeometry(0.34, 0.02, 8, 24);
  ringGeo.rotateX(Math.PI / 2);
  const ring = new THREE.Mesh(ringGeo, mats.obstacleRingMat);
  ring.position.set(0, 0.75, 0);
  ring.name = 'obstacle_ring';
  group.add(ring);

  const shadowGeo = new THREE.CircleGeometry(0.4, 16);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadow = new THREE.Mesh(shadowGeo, mats.shadowMat);
  shadow.position.set(0, 0.01, 0);
  group.add(shadow);
  return group;
}

export function createClusterMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'LidarCluster';

  // 1. Semi-transparent bounding box with glowing cyan edges
  const boxGeo = new THREE.BoxGeometry(1, 1, 1);
  const boxMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    roughness: 0.25,
    metalness: 0.75,
    transparent: true,
    opacity: 0.35,
  });
  const box = new THREE.Mesh(boxGeo, boxMat);
  box.position.y = 0.5;
  group.add(box);

  // 2. Glowing wireframe bounding edges
  const edgesGeo = new THREE.EdgesGeometry(boxGeo);
  const edgesMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    linewidth: 2,
  });
  const edges = new THREE.LineSegments(edgesGeo, edgesMat);
  edges.position.y = 0.5;
  group.add(edges);

  // 3. Ground contact ring
  const ringGeo = new THREE.RingGeometry(0.35, 0.55, 32);
  ringGeo.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.55,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.y = 0.02;
  group.add(ring);

  return group;
}
