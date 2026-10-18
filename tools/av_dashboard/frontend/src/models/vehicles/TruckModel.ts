import * as THREE from 'three';
import { TrafficMaterials, TrafficGeometries } from '../../components/cockpit/traffic/materials';
import { createTruckMesh } from '../../components/cockpit/traffic/ProceduralVehicles';

export { createTruckMesh };

export function buildTruckModel(mats: TrafficMaterials, geos: TrafficGeometries): THREE.Group {
  return createTruckMesh(mats, geos);
}
