import path from 'path';
import { fileURLToPath } from 'url';
import { THREE } from '../common/three_loader.js';
import { exportGlb } from '../common/exporter_utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, 'obstacle.glb');

console.log(`[Obstacle] Building 3D Physical Obstacle model -> ${outputPath}`);

const root = new THREE.Group();
root.name = 'Physical_Obstacle';

// Materials
const obsMat = new THREE.MeshStandardMaterial({ name: 'Obstacle_Slate', color: 0x475569, roughness: 0.45, metalness: 0.25 });
const ringMat = new THREE.MeshBasicMaterial({ name: 'Obstacle_Crown_Ring', color: 0x94a3b8 });
const clusterMat = new THREE.MeshStandardMaterial({ name: 'Cluster_Cyan', color: 0x06b6d4, roughness: 0.25, metalness: 0.75, transparent: true, opacity: 0.35 });

// 1. Central cylindrical body
const geo = new THREE.CylinderGeometry(0.34, 0.36, 0.75, 18);
const body = new THREE.Mesh(geo, obsMat);
body.position.set(0, 0.375, 0);
body.name = 'Obstacle_Body';
root.add(body);

// 2. Crown ring
const crownGeo = new THREE.TorusGeometry(0.34, 0.02, 8, 24);
crownGeo.rotateX(Math.PI / 2);
const crown = new THREE.Mesh(crownGeo, ringMat);
crown.position.set(0, 0.75, 0);
crown.name = 'Obstacle_Crown';
root.add(crown);

// 3. Volumetric Bounding Box
const box = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), clusterMat);
box.position.set(0, 0.4, 0);
box.name = 'Cluster_BoundingBox';
root.add(box);

exportGlb(root, outputPath, 'Physical Obstacle', 'obstacle.glb');
