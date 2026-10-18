import path from 'path';
import { fileURLToPath } from 'url';
import { THREE } from '../common/three_loader.js';
import { exportGlb } from '../common/exporter_utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, 'traffic_cone.glb');

console.log(`[Cone] Building 3D Traffic Cone model -> ${outputPath}`);

const root = new THREE.Group();
root.name = 'Traffic_Cone';

// Materials
const orangeMat = new THREE.MeshStandardMaterial({ name: 'Cone_Orange', color: 0xf97316, roughness: 0.40, metalness: 0.05 });
const whiteMat = new THREE.MeshStandardMaterial({ name: 'Cone_Reflective_White', color: 0xffffff, roughness: 0.20, metalness: 0.10 });
const baseMat = new THREE.MeshStandardMaterial({ name: 'Cone_Base_Black', color: 0x18181b, roughness: 0.80, metalness: 0.10 });

// 1. Base square rubber plate
const base = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 0.38), baseMat);
base.position.set(0, 0.02, 0);
base.name = 'Cone_Base';
root.add(base);

// 2. Tapered highway orange cone body
const body = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.18, 0.65, 20), orangeMat);
body.position.set(0, 0.35, 0);
body.name = 'Cone_Body';
root.add(body);

// 3. White reflective collar band
const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.13, 0.16, 20), whiteMat);
collar.position.set(0, 0.36, 0);
collar.name = 'Cone_Collar';
root.add(collar);

exportGlb(root, outputPath, 'Traffic Cone', 'traffic_cone.glb');
