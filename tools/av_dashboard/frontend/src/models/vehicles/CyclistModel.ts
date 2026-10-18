import * as THREE from 'three';
import { TrafficMaterials, TrafficGeometries } from '../../components/cockpit/traffic/materials';
import { createCyclistMesh } from '../../components/cockpit/traffic/ProceduralVehicles';

export { createCyclistMesh };

export function buildCyclistModel(mats: TrafficMaterials, geos: TrafficGeometries): THREE.Group {
  return createCyclistMesh(mats, geos);
}
