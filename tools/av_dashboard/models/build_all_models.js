import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelScripts = [
  'etrike/build_etrike.js',
  'pedestrian/build_smpl.js',
  'car/build_car.js',
  'truck/build_truck.js',
  'cyclist/build_cyclist.js',
  'cone/build_cone.js',
  'obstacle/build_obstacle.js',
];

console.log('=== Building All AV Dashboard 3D Models ===\n');

for (const relPath of modelScripts) {
  const fullPath = path.resolve(__dirname, relPath);
  console.log(`--> Running ${relPath}...`);
  const res = spawnSync('node', [fullPath], { stdio: 'inherit' });
  if (res.status !== 0) {
    console.error(`Error running ${relPath}, exit code ${res.status}`);
    process.exit(res.status);
  }
}

console.log('\n=== All 3D Models Generated and Synced to public/models Successfully ===');
