import * as THREE from 'three';

export class LidarRangeRings {
  public group: THREE.Group;
  private rings: THREE.LineLoop[] = [];
  private ringRadii: number[] = [5, 10, 15, 20, 25, 30, 35, 40];

  constructor() {
    this.group = new THREE.Group();
    // Center concentric range rings directly at physical LiDAR roof mount location (matching vehicle TF2)
    this.group.position.set(0, 0, 0.425);
    this.createRings();
    this.createDistanceLabels();
    this.createRadialAxes();
  }

  private createRings(): void {
    const segments = 128;

    this.ringRadii.forEach((radius, idx) => {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        // Three.js ground plane is X-Z (X = lateral, Z = longitudinal)
        points.push(new THREE.Vector3(Math.cos(theta) * radius, 0.012, Math.sin(theta) * radius));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      // Radial opacity fade: rings close to vehicle are brighter cyan/blue, distant rings fade out
      const alpha = Math.max(0.18, 0.75 - (radius / 45.0) * 0.45);
      const isMajor = radius % 10 === 0;

      const material = new THREE.LineBasicMaterial({
        color: isMajor ? 0x38bdf8 : 0x1d4ed8, // Bright sky cyan for 10m/20m/30m, royal blue for intermediate
        transparent: true,
        opacity: alpha,
        linewidth: 1,
        depthWrite: false,
      });

      const ring = new THREE.LineLoop(geometry, material);
      this.rings.push(ring);
      this.group.add(ring);
    });
  }

  private createRadialAxes(): void {
    // Subtle crosshair / polar radial guide rays (forward, 45 deg, rear)
    const axisMaterial = new THREE.LineBasicMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    });

    const angles = [-Math.PI / 2, -Math.PI / 4, -3 * Math.PI / 4]; // Forward and front-diagonal rays
    angles.forEach((angle) => {
      const points = [
        new THREE.Vector3(Math.cos(angle) * 2.0, 0.01, Math.sin(angle) * 2.0),
        new THREE.Vector3(Math.cos(angle) * 40.0, 0.01, Math.sin(angle) * 40.0),
      ];
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geom, axisMaterial);
      this.group.add(line);
    });
  }

  private createDistanceLabels(): void {
    // Crisp metric distance markers along the forward axis (-Z direction in Three.js)
    [10, 20, 30, 40].forEach((dist) => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 48;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, 128, 48);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${dist}m`, 64, 24);

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
      });

      const sprite = new THREE.Sprite(spriteMat);
      // Place right along the forward corridor edge (-Z is forward in Three.js)
      sprite.position.set(0.8, 0.08, -dist);
      sprite.scale.set(1.4, 0.52, 1.0);
      this.group.add(sprite);
    });
  }

  public setVisible(visible: boolean): void {
    this.group.visible = visible;
  }

  public dispose(): void {
    this.group.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const mat = mesh.material;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else if (mat) (mat as THREE.Material).dispose();
      const sprite = child as THREE.Sprite;
      if (sprite.isSprite && sprite.material?.map) sprite.material.map.dispose();
    });
  }
}
