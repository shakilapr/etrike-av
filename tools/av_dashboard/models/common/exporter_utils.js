import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GLTFExporter } from './three_loader.js';

// Polyfill browser FileReader for Node.js if undefined
if (typeof FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        if (this.onloadend) this.onloadend();
      }).catch((err) => {
        if (this.onerror) this.onerror(err);
      });
    }
  };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const PUBLIC_MODELS_DIR = path.resolve(__dirname, '../../frontend/public/models');

export function exportGlb(rootObject, outputPath, modelName, publicFilename) {
  const exporter = new GLTFExporter();
  exporter.parse(
    rootObject,
    (gltfData) => {
      const buffer = Buffer.from(gltfData);
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, buffer);
      console.log(`[3D Model] Generated ${modelName} -> ${outputPath} (${buffer.length} bytes)`);

      if (publicFilename) {
        fs.mkdirSync(PUBLIC_MODELS_DIR, { recursive: true });
        const pubPath = path.resolve(PUBLIC_MODELS_DIR, publicFilename);
        fs.writeFileSync(pubPath, buffer);
        console.log(`[3D Model] Synced ${modelName} -> ${pubPath}`);
      }
    },
    (err) => {
      console.error(`[3D Model] Error generating ${modelName}:`, err);
      process.exit(1);
    },
    { binary: true }
  );
}
