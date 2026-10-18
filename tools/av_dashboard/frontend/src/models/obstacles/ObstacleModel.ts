import * as THREE from 'three';
import { TrafficMaterials } from '../../components/cockpit/traffic/materials';
import { createObstacleMesh, createClusterMesh } from '../../components/cockpit/traffic/ProceduralObstacles';

export { createObstacleMesh, createClusterMesh };

export function buildObstacleModel(mats: TrafficMaterials): THREE.Group {
  return createObstacleMesh(mats);
}

export function buildClusterModel(): THREE.Group {
  return createClusterMesh();
}
