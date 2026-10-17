export const lidarVertexShader = `
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

    vHorizDist = length(vec2(position.x, position.z));
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDist = -mvPosition.z;

    float isGround = step(position.y, 0.20);
    float sizeMultiplier = mix(1.25, 0.70, isGround);
    float baseSize = pointSize * sizeMultiplier;

    gl_PointSize = clamp(baseSize * (28.0 / max(-mvPosition.z, 0.45)), 1.2, 5.2);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const lidarFragmentShader = `
  uniform float opacity;
  uniform float colorMode;
  uniform float groundMode;

  varying float vElevation;
  varying float vIntensity;
  varying float vDist;
  varying float vHorizDist;
  varying float vAge;

  vec3 getCyberElevationColor(float y, float intensity) {
    if (intensity < 0.0) return vec3(0.98, 0.12, 0.25);
    if (y <= 0.20) {
      vec3 groundBase = mix(vec3(0.04, 0.20, 0.75), vec3(0.06, 0.58, 0.90), clamp((y + 0.5) / 0.70, 0.0, 1.0));
      if (intensity > 0.35) {
        float boost = clamp((intensity - 0.35) / 0.65, 0.0, 1.0);
        groundBase = mix(groundBase, vec3(0.85, 0.98, 1.0), boost);
      }
      return groundBase;
    }
    if (y <= 0.85) {
      float t = (y - 0.20) / 0.65;
      vec3 curbColor = mix(vec3(0.05, 0.75, 0.98), vec3(0.08, 0.90, 0.35), t);
      if (intensity > 0.4) {
        curbColor = mix(curbColor, vec3(0.5, 1.0, 0.7), (intensity - 0.4) * 0.8);
      }
      return curbColor;
    }
    if (y <= 2.2) {
      float t = (y - 0.85) / 1.35;
      return mix(vec3(0.08, 0.90, 0.35), vec3(0.98, 0.88, 0.06), t);
    }
    float t = clamp((y - 2.2) / 2.0, 0.0, 1.0);
    return mix(vec3(0.98, 0.88, 0.06), vec3(0.98, 0.40, 0.05), t);
  }

  vec3 getProximityColor(float dist, float y, float intensity) {
    if (intensity < 0.0) return vec3(0.98, 0.12, 0.25);
    if (y <= 0.20) return vec3(0.06, 0.22, 0.65);
    if (dist < 1.6) return vec3(1.0, 0.10, 0.22);
    if (dist < 3.2) {
      float t = (dist - 1.6) / 1.6;
      return mix(vec3(1.0, 0.10, 0.22), vec3(0.98, 0.55, 0.04), t);
    }
    if (dist < 6.0) {
      float t = (dist - 3.2) / 2.8;
      return mix(vec3(0.98, 0.55, 0.04), vec3(0.06, 0.80, 0.98), t);
    }
    float t = clamp((dist - 6.0) / 12.0, 0.0, 1.0);
    return mix(vec3(0.06, 0.80, 0.98), vec3(0.05, 0.28, 0.65), t);
  }

  vec3 getIntensityColor(float intensity) {
    if (intensity < 0.0) return vec3(0.98, 0.12, 0.25);
    float i = clamp(intensity, 0.0, 1.0);
    if (i < 0.25) {
      return mix(vec3(0.05, 0.08, 0.35), vec3(0.02, 0.55, 0.85), i / 0.25);
    } else if (i < 0.65) {
      return mix(vec3(0.02, 0.55, 0.85), vec3(0.98, 0.85, 0.12), (i - 0.25) / 0.40);
    }
    return mix(vec3(0.98, 0.85, 0.12), vec3(1.0, 1.0, 1.0), (i - 0.65) / 0.35);
  }

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float rSq = dot(coord, coord);
    if (rSq > 0.25) discard;

    float isGround = step(vElevation, 0.20);
    if (groundMode > 0.5 && groundMode < 1.5 && isGround > 0.5) discard;

    vec3 baseColor;
    if (colorMode < 0.5) {
      baseColor = getCyberElevationColor(vElevation, vIntensity);
    } else if (colorMode < 1.5) {
      baseColor = getProximityColor(vHorizDist, vElevation, vIntensity);
    } else {
      baseColor = getIntensityColor(vIntensity);
    }

    float finalAlpha = opacity;
    if (isGround > 0.5 && groundMode < 0.5) {
      finalAlpha *= 0.32;
    }
    finalAlpha *= (1.0 - smoothstep(0.18, 0.25, rSq));
    gl_FragColor = vec4(baseColor, finalAlpha);
  }
`;
