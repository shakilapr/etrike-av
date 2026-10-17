import * as THREE from 'three';
import { lidarVertexShader, lidarFragmentShader } from './lidar/LidarShader';

interface CachedFrame {
  positions: Float32Array;
  intensities: Float32Array;
  count: number;
}

export class LidarPointCloud {
  public group: THREE.Group;
  private pointsMesh: THREE.Points;
  private geometry: THREE.BufferGeometry;
  private material: THREE.ShaderMaterial;
  private maxPoints = 45000;
  private currentPointCount = 0;

  private posArray: Float32Array;
  private intensityArray: Float32Array;
  private ageArray: Float32Array;
  private posAttr: THREE.BufferAttribute;
  private intensityAttr: THREE.BufferAttribute;
  private ageAttr: THREE.BufferAttribute;

  private history: CachedFrame[] = [];
  private maxTrailFrames = 3;

  constructor() {
    this.group = new THREE.Group();

    this.geometry = new THREE.BufferGeometry();
    this.posArray = new Float32Array(this.maxPoints * 3);
    this.intensityArray = new Float32Array(this.maxPoints);
    this.ageArray = new Float32Array(this.maxPoints);

    this.posAttr = new THREE.BufferAttribute(this.posArray, 3);
    this.posAttr.setUsage(THREE.DynamicDrawUsage);
    this.geometry.setAttribute('position', this.posAttr);

    this.intensityAttr = new THREE.BufferAttribute(this.intensityArray, 1);
    this.intensityAttr.setUsage(THREE.DynamicDrawUsage);
    this.geometry.setAttribute('intensity', this.intensityAttr);

    this.ageAttr = new THREE.BufferAttribute(this.ageArray, 1);
    this.ageAttr.setUsage(THREE.DynamicDrawUsage);
    this.geometry.setAttribute('age', this.ageAttr);

    this.material = new THREE.ShaderMaterial({
      vertexShader: lidarVertexShader,
      fragmentShader: lidarFragmentShader,
      uniforms: {
        pointSize: { value: 2.2 },
        opacity: { value: 0.60 },
        colorMode: { value: 0.0 },
        groundMode: { value: 0.0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    this.pointsMesh = new THREE.Points(this.geometry, this.material);
    this.pointsMesh.frustumCulled = false;
    this.pointsMesh.renderOrder = 10;
    this.geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 2000.0);
    this.geometry.setDrawRange(0, 0);
    this.group.add(this.pointsMesh);
  }

  public updateFromBuffer(buffer: ArrayBuffer): number {
    const floatView = new Float32Array(buffer);
    const nPoints = Math.floor(floatView.length / 4);

    if (nPoints === 0) {
      this.history = [];
      this.geometry.setDrawRange(0, 0);
      this.currentPointCount = 0;
      return 0;
    }

    const framePos = new Float32Array(nPoints * 3);
    const frameInt = new Float32Array(nPoints);
    for (let i = 0; i < nPoints; i++) {
      const srcIdx = i * 4;
      const dstIdx = i * 3;
      framePos[dstIdx] = floatView[srcIdx];
      framePos[dstIdx + 1] = floatView[srcIdx + 1];
      framePos[dstIdx + 2] = floatView[srcIdx + 2];
      frameInt[i] = floatView[srcIdx + 3];
    }

    this.history.unshift({ positions: framePos, intensities: frameInt, count: nPoints });
    if (this.history.length > this.maxTrailFrames) {
      this.history.length = this.maxTrailFrames;
    }

    let writeOffset = 0;
    for (let f = 0; f < this.history.length; f++) {
      const frame = this.history[f];
      const available = Math.min(frame.count, Math.floor(this.maxPoints - writeOffset));
      if (available <= 0) break;

      this.posArray.set(frame.positions.subarray(0, available * 3), writeOffset * 3);
      this.intensityArray.set(frame.intensities.subarray(0, available), writeOffset);
      this.ageArray.fill(f, writeOffset, writeOffset + available);

      writeOffset += available;
    }

    this.posAttr.needsUpdate = true;
    this.intensityAttr.needsUpdate = true;
    this.ageAttr.needsUpdate = true;
    this.geometry.setDrawRange(0, writeOffset);
    if (!this.geometry.boundingSphere) {
      this.geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 2000.0);
    }
    this.currentPointCount = writeOffset;

    return writeOffset;
  }

  public getPointCount(): number {
    return this.currentPointCount;
  }

  public setVisible(visible: boolean): void {
    this.group.visible = visible;
  }

  public setPointSize(size: number): void {
    if (this.material.uniforms.pointSize) {
      this.material.uniforms.pointSize.value = size;
    }
  }

  public setOpacity(opacity: number): void {
    if (this.material.uniforms.opacity) {
      this.material.uniforms.opacity.value = Math.max(0.05, Math.min(1.0, opacity));
    }
  }

  public setColorMode(mode: 'cyber' | 'prox' | 'intensity'): void {
    if (this.material.uniforms.colorMode) {
      const val = mode === 'cyber' ? 0.0 : mode === 'prox' ? 1.0 : 2.0;
      this.material.uniforms.colorMode.value = val;
    }
  }

  public setGroundMode(mode: 'dim' | 'off' | 'full'): void {
    if (this.material.uniforms.groundMode) {
      const val = mode === 'dim' ? 0.0 : mode === 'off' ? 1.0 : 2.0;
      this.material.uniforms.groundMode.value = val;
    }
  }

  public setTrailFrames(frames: number): void {
    this.maxTrailFrames = Math.max(1, Math.min(5, frames));
    if (this.history.length > this.maxTrailFrames) {
      this.history.length = this.maxTrailFrames;
    }
  }

  public dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
    this.history = [];
  }
}
