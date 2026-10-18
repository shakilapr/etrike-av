import * as THREE from 'three';
import { TrafficMaterials, TrafficGeometries } from '../../components/cockpit/traffic/materials';
import { createConeMesh } from '../../components/cockpit/traffic/ProceduralObstacles';

export { createConeMesh };

export function buildConeModel(mats: TrafficMaterials, geos: TrafficGeometries): THREE.Group {
  return createConeMesh(mats, geos);
}
