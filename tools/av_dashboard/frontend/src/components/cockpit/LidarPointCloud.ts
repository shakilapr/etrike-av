import * as THREE from 'three';

const lidarVertexShader = `
  attribute float intensity;
  attribute float age;

  varying float vElevation;
  varying float vIntensity;
  varying float vDist;
  varying float vHorizDist;
  varying float vAge;

  uniform float pointSize;

  void main() {
    vElevation = position.y;
    vIntensity = intensity;
    vAge = age;

    // Horizontal radial distance from vehicle center (X=lateral, Z=longitudinal)
    vHorizDist = length(vec2(position.x, position.z));

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDist = -mvPosition.z;

    // Ground points are slightly finer (1.2 - 2.8px), obstacles are solid (2.4 - 5.0px)
    float isGround = step(position.y, 0.20);
    float sizeMultiplier = mix(1.25, 0.70, isGround);
    float baseSize = pointSize * sizeMultiplier;

    // Perspective point attenuation
    gl_PointSize = clamp(baseSize * (28.0 / max(-mvPosition.z, 0.45)), 1.2, 5.2);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const lidarFragmentShader = `
  uniform float opacity;
  uniform float colorMode;  // 0.0 = CYBER, 1.0 = PROXIMITY, 2.0 = INTENSITY
  uniform float groundMode; // 0.0 = DIM, 1.0 = OFF, 2.0 = FULL

  varying float vElevation;
  varying float vIntensity;
  varying float vDist;
  varying float vHorizDist;
  varying float vAge;

  vec3 getCyberElevationColor(float y, float intensity) {
    // Inspection mode marker: self-reflection points marked with intensity < 0.0
    if (intensity < 0.0) {
      return vec3(0.98, 0.12, 0.25); // Vibrant neon crimson
    }

    // 1. Ground level (y <= 0.20m): deep electric blue to cyan
    if (y <= 0.20) {
      vec3 groundBase = mix(vec3(0.04, 0.20, 0.75), vec3(0.06, 0.58, 0.90), clamp((y + 0.5) / 0.70, 0.0, 1.0));
      // Road markings / paint reflections highlight into brilliant cyan-white
      if (intensity > 0.35) {
        float boost = clamp((intensity - 0.35) / 0.65, 0.0, 1.0);
        groundBase = mix(groundBase, vec3(0.85, 0.98, 1.0), boost);
      }
      return groundBase;
    }

    // 2. Curbs, wheel heights, low obstacles (0.20m < y <= 0.85m): cyan to emerald
    if (y <= 0.85) {
      float t = (y - 0.20) / 0.65;
      vec3 curbColor = mix(vec3(0.05, 0.75, 0.98), vec3(0.08, 0.90, 0.35), t);
      if (intensity > 0.4) {
        curbColor = mix(curbColor, vec3(0.5, 1.0, 0.7), (intensity - 0.4) * 0.8);
      }
      return curbColor;
    }

    // 3. Mid vegetation, vehicle bodies, pedestrians (0.85m < y <= 2.2m): emerald lime to golden yellow
    if (y <= 2.2) {
      float t = (y - 0.85) / 1.35;
      return mix(vec3(0.08, 0.90, 0.35), vec3(0.98, 0.88, 0.06), t);
    }

    // 4. Canopy, roofs, tall structures (y > 2.2m): golden yellow to vivid warm orange/red
    float t = clamp((y - 2.2) / 2.0, 0.0, 1.0);
    return mix(vec3(0.98, 0.88, 0.06), vec3(0.98, 0.40, 0.05), t);
  }

  vec3 getProximityColor(float dist, float y, float intensity) {
    if (intensity < 0.0) return vec3(0.98, 0.12, 0.25);

    // Ground points remain subdued indigo so they don't produce false red warnings
    if (y <= 0.20) {
      return vec3(0.06, 0.22, 0.65);
    }

    // Critical Danger Zone (< 1.6m): Neon Crimson Red
    if (dist < 1.6) {
      return vec3(1.0, 0.10, 0.22);
    }
    // Warning Zone (1.6m - 3.2m): Neon Amber Orange
    if (dist < 3.2) {
      float t = (dist - 1.6) / 1.6;
      return mix(vec3(1.0, 0.10, 0.22), vec3(1.0, 0.65, 0.05), t);
    }
    // Caution Zone (3.2m - 5.5m): Lemon Lime
    if (dist < 5.5) {
      float t = (dist - 3.2) / 2.3;
      return mix(vec3(1.0, 0.65, 0.05), vec3(0.60, 0.95, 0.15), t);
    }
    // Clear Zone (> 5.5m): Electric Ice Cyan
    return vec3(0.05, 0.85, 0.98);
  }

  vec3 getIntensityColor(float intensity, float y) {
    if (intensity < 0.0) return vec3(0.98, 0.12, 0.25);

    if (intensity < 0.22) {
      return mix(vec3(0.18, 0.24, 0.32), vec3(0.28, 0.38, 0.50), intensity / 0.22);
    }
    if (intensity < 0.52) {
      float t = (intensity - 0.22) / 0.30;
      return mix(vec3(0.28, 0.38, 0.50), vec3(0.08, 0.80, 0.98), t);
    }
    // High retro-reflectivity (road markings, signs, safety vests, license plates)
    float t = clamp((intensity - 0.52) / 0.48, 0.0, 1.0);
    return mix(vec3(0.08, 0.80, 0.98), vec3(0.96, 0.99, 1.0), t);
  }

  void main() {
    // 1. Ground suppression check
    bool isGround = (vElevation <= 0.20);
    if (isGround && groundMode > 0.5 && groundMode < 1.5) {
      discard; // groundMode == 1.0: OFF (Hide ground entirely)
    }

    // 2. Circular point sprite (discard corners)
    vec2 coord = gl_PointCoord - vec2(0.5);
    float distSq = dot(coord, coord);
    if (distSq > 0.25) {
      discard;
    }

    // 3. Soft Gaussian alpha edge with solid center
    float alpha = smoothstep(0.5, 0.18, sqrt(distSq));

    // 4. Temporal decay: older sweeps in history fade gracefully
    alpha *= max(0.25, 1.0 - vAge * 0.32);

    // 5. Two-Tier Ground Dimming vs Obstacle Glow
    if (isGround && groundMode < 0.5) {
      // Subdue ground noise down to 18-20% opacity, while highlighting retroreflective paint
      float groundAlpha = (vIntensity > 0.40) ? 0.65 : 0.20;
      alpha *= groundAlpha;
    } else {
      // Obstacle points (people, cars, obstacles) are boosted for crisp visibility
      alpha *= 1.25;
    }

    // 6. Distance horizon fade into void
    float fogFactor = smoothstep(65.0, 42.0, vDist);

    // 7. Select Color Palette
    vec3 col;
    if (colorMode > 1.5) {
      col = getIntensityColor(vIntensity, vElevation);
    } else if (colorMode > 0.5) {
      col = getProximityColor(vHorizDist, vElevation, vIntensity);
    } else {
      col = getCyberElevationColor(vElevation, vIntensity);
    }

    gl_FragColor = vec4(col, clamp(alpha * fogFactor * opacity, 0.0, 1.0));
  }
`;

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
        colorMode: { value: 0.0 },  // 0.0 = CYBER, 1.0 = PROXIMITY, 2.0 = INTENSITY
        groundMode: { value: 0.0 }, // 0.0 = DIM, 1.0 = OFF, 2.0 = FULL
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
    const nPoints = Math.floor(floatView.length / 4);

    if (nPoints === 0) {
      this.history = [];
      this.geometry.setDrawRange(0, 0);
      this.currentPointCount = 0;
      return 0;
    }

    // Extract current frame
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

    // Add to rolling history
    this.history.unshift({ positions: framePos, intensities: frameInt, count: nPoints });
    if (this.history.length > this.maxTrailFrames) {
      this.history.length = this.maxTrailFrames;
    }

    // Write all active frames into attributes with age factor
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
