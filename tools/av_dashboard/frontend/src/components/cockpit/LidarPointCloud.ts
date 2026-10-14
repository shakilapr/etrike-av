import * as THREE from 'three';

const lidarVertexShader = `
  attribute float intensity;
  varying float vElevation;
  varying float vIntensity;
  varying float vDist;

  uniform float pointSize;

  void main() {
    vElevation = position.y;
    vIntensity = intensity;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDist = -mvPosition.z;

  // Perspective point attenuation: finer dots with lower max size
    gl_PointSize = clamp(pointSize * (28.0 / max(-mvPosition.z, 0.5)), 1.0, 4.2);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const lidarFragmentShader = `
  uniform float opacity;
  varying float vElevation;
  varying float vIntensity;
  varying float vDist;

  vec3 getLidarColor(float y, float intensity) {
    // Inspection mode marker: self-reflection points marked with intensity < 0.0
    if (intensity < 0.0) {
      return vec3(0.98, 0.12, 0.25); // Vibrant neon crimson
    }

    // 1. Ground level (y <= 0.25m): deep electric blue to cyan
    if (y <= 0.25) {
      vec3 groundBase = mix(vec3(0.03, 0.25, 0.85), vec3(0.06, 0.65, 0.95), clamp((y + 0.5) / 0.75, 0.0, 1.0));
      // Road markings / paint reflections highlight into brilliant cyan-white
      if (intensity > 0.35) {
        float boost = clamp((intensity - 0.35) / 0.65, 0.0, 1.0);
        groundBase = mix(groundBase, vec3(0.85, 0.98, 1.0), boost);
      }
      return groundBase;
    }

    // 2. Curbs, wheel heights, low obstacles (0.25m < y <= 1.1m): cyan to emerald lime
    if (y <= 1.1) {
      float t = (y - 0.25) / 0.85;
      vec3 curbColor = mix(vec3(0.06, 0.70, 0.95), vec3(0.08, 0.88, 0.30), t);
      if (intensity > 0.4) {
        curbColor = mix(curbColor, vec3(0.5, 1.0, 0.7), (intensity - 0.4) * 0.8);
      }
      return curbColor;
    }

    // 3. Mid vegetation, vehicle bodies, pedestrians (1.1m < y <= 2.5m): emerald green to golden yellow
    if (y <= 2.5) {
      float t = (y - 1.1) / 1.4;
      return mix(vec3(0.08, 0.88, 0.30), vec3(0.96, 0.86, 0.06), t);
    }

    // 4. Canopy, roofs, tall structures (y > 2.5m): golden yellow to vivid warm orange/red
    float t = clamp((y - 2.5) / 2.0, 0.0, 1.0);
    return mix(vec3(0.96, 0.86, 0.06), vec3(0.98, 0.42, 0.05), t);
  }

  void main() {
    // Round circular point sprite (discard corners)
    vec2 coord = gl_PointCoord - vec2(0.5);
    float distSq = dot(coord, coord);
    if (distSq > 0.25) {
      discard;
    }

    // Soft Gaussian alpha edge
    float alpha = smoothstep(0.5, 0.32, sqrt(distSq));

    // Distance horizon fade into midnight blue void
    float fogFactor = smoothstep(65.0, 40.0, vDist);

    vec3 col = getLidarColor(vElevation, vIntensity);
    gl_FragColor = vec4(col, alpha * fogFactor * opacity);
  }
`;

export class LidarPointCloud {
  public group: THREE.Group;
  private pointsMesh: THREE.Points;
  private geometry: THREE.BufferGeometry;
  private material: THREE.ShaderMaterial;
  private maxPoints = 30000;
  private currentPointCount = 0;

  private posArray: Float32Array;
  private intensityArray: Float32Array;
  private posAttr: THREE.BufferAttribute;
  private intensityAttr: THREE.BufferAttribute;

  constructor() {
    this.group = new THREE.Group();

    this.geometry = new THREE.BufferGeometry();
    this.posArray = new Float32Array(this.maxPoints * 3);
    this.intensityArray = new Float32Array(this.maxPoints);

    this.posAttr = new THREE.BufferAttribute(this.posArray, 3);
    this.posAttr.setUsage(THREE.DynamicDrawUsage);
    this.geometry.setAttribute('position', this.posAttr);

    this.intensityAttr = new THREE.BufferAttribute(this.intensityArray, 1);
    this.intensityAttr.setUsage(THREE.DynamicDrawUsage);
    this.geometry.setAttribute('intensity', this.intensityAttr);

    this.material = new THREE.ShaderMaterial({
      vertexShader: lidarVertexShader,
      fragmentShader: lidarFragmentShader,
      uniforms: {
        pointSize: { value: 2.0 },
        opacity: { value: 0.42 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    this.pointsMesh = new THREE.Points(this.geometry, this.material);
    this.geometry.setDrawRange(0, 0);
    this.group.add(this.pointsMesh);
  }

  public updateFromBuffer(buffer: ArrayBuffer): number {
    const floatView = new Float32Array(buffer);
    const nPoints = Math.min(Math.floor(floatView.length / 4), this.maxPoints);

    if (nPoints === 0) {
      this.geometry.setDrawRange(0, 0);
      this.currentPointCount = 0;
      return 0;
    }

    for (let i = 0; i < nPoints; i++) {
      const srcIdx = i * 4;
      const dstIdx = i * 3;

      this.posArray[dstIdx] = floatView[srcIdx];
      this.posArray[dstIdx + 1] = floatView[srcIdx + 1];
      this.posArray[dstIdx + 2] = floatView[srcIdx + 2];
      this.intensityArray[i] = floatView[srcIdx + 3];
    }

    this.posAttr.needsUpdate = true;
    this.intensityAttr.needsUpdate = true;
    this.geometry.setDrawRange(0, nPoints);
    this.currentPointCount = nPoints;

    return nPoints;
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

  public dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}
