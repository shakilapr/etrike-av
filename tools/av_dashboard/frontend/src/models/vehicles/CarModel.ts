import * as THREE from 'three';
import { TrafficMaterials, TrafficGeometries } from '../../components/cockpit/traffic/materials';
import { createCarMesh } from '../../components/cockpit/traffic/ProceduralVehicles';

export { createCarMesh };

export function buildCarModel(mats: TrafficMaterials, geos: TrafficGeometries): THREE.Group {
  return createCarMesh(mats, geos);
}
