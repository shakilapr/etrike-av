import * as THREE from 'three';
import { TrafficMaterials, TrafficGeometries } from '../../components/cockpit/traffic/materials';
import { ActorLimbs } from '../../components/cockpit/traffic/types';
import { createPedestrianMesh } from '../../components/cockpit/traffic/PedestrianMesh';

export { createPedestrianMesh } from '../../components/cockpit/traffic/PedestrianMesh';

export function buildPedestrianModel(
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
  return createPedestrianMesh(mats, geos, humanModelTemplate, smplTemplate);
}
