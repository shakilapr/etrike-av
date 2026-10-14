import * as THREE from 'three';
import type { MhrHumanPayload } from '../../types/can';

/**
 * Renders Meta Momentum Human Rig (MHR) meshes streamed by the dashboard backend.
 *
 * The backend evaluates the official MHR TorchScript model and streams posed
 * vertex buffers (metres, Y-up) over the WebSocket. This class keeps one
 * persistent mesh per actor id and only updates its position buffer, mirroring
 * MHR's own web-viewer pattern (never rebuild the scene per frame).
 *
 * It is fail-soft: if the topology has not loaded yet or the payload reports
 * `available: false`, it simply hides its group so the procedural pedestrian
 * mesh remains authoritative.
 */

/** Vite dev server runs on :5173 with the backend on :8000. */
const API_BASE = window.location.port === '5173' ? 'http://127.0.0.1:8000' : '';
const TOPOLOGY_URL = `${API_BASE}/api/v1/mhr/topology`;

/** MHR's native mesh faces +Z; the cockpit actor forward is -Z. */
const MHR_FORWARD_OFFSET = Math.PI;

export interface MhrPlacement {
  position: THREE.Vector3;
  yaw: number;
  visible: boolean;
}

interface ActorMesh {
  group: THREE.Group;
  geometry: THREE.BufferGeometry;
  positionAttr: THREE.BufferAttribute;
}

export class MhrHuman {
  public group = new THREE.Group();

  private topology: Uint32Array | null = null;
  private topologyRequested = false;
  private available = false;
  private lastRevision = -1;
  private actorMeshes = new Map<string, ActorMesh>();
  private material: THREE.MeshStandardMaterial;

  constructor() {
    this.group.name = 'mhr_humans';
    this.material = new THREE.MeshStandardMaterial({
      color: 0x8b93a7,
      roughness: 0.64,
      metalness: 0.05,
      side: THREE.DoubleSide,
      flatShading: false,
    });
  }

  public get isAvailable(): boolean {
    return this.available;
  }

  private ensureTopology(): void {
    if (this.topologyRequested) return;
    this.topologyRequested = true;
    fetch(TOPOLOGY_URL)
      .then(async (res) => {
        if (!res.ok) throw new Error(`topology HTTP ${res.status}`);
        const buf = await res.arrayBuffer();
        this.topology = new Uint32Array(buf);
      })
      .catch((err) => {
        console.warn('[MhrHuman] topology unavailable, using procedural pedestrians:', err);
      });
  }

  /**
   * Reconcile streamed MHR actors with the scene.
   * @param placement resolves an actor id to its cockpit transform, or null to hide.
   * @returns the set of actor ids currently rendered by MHR.
   */
  public update(
    payload: MhrHumanPayload | null | undefined,
    placement: (id: string) => MhrPlacement | null
  ): Set<string> {
    this.available = Boolean(payload?.available);
    if (!this.available || !payload?.actors || payload.actors.length === 0) {
      this.hideAll();
      return new Set();
    }

    this.ensureTopology();
    if (!this.topology) {
      this.hideAll();
      return new Set();
    }

    // Only re-upload vertex buffers + recompute normals when the backend has
    // produced a new evaluation; placement still tracks the actor every frame.
    const revision = typeof payload.revision === 'number' ? payload.revision : -1;
    const geometryDirty = revision !== this.lastRevision;
    if (geometryDirty) this.lastRevision = revision;

    const seen = new Set<string>();
    for (const actor of payload.actors) {
      const place = placement(actor.id);
      if (!place || !place.visible) continue;
      const entry = this.upsertActor(actor.id, actor.vertices, geometryDirty);
      if (!entry) continue;
      seen.add(actor.id);
      entry.group.position.copy(place.position);
      entry.group.rotation.y = place.yaw;
      entry.group.visible = true;
    }

    for (const [id, entry] of this.actorMeshes) {
      if (!seen.has(id)) entry.group.visible = false;
    }
    return seen;
  }

  private hideAll(): void {
    for (const entry of this.actorMeshes.values()) {
      entry.group.visible = false;
    }
  }

  private upsertActor(id: string, verticesB64: string, geometryDirty: boolean): ActorMesh | null {
    let entry = this.actorMeshes.get(id);
    if (entry && !geometryDirty) return entry;

    const values = decodeBase64Float32(verticesB64);
    if (!values || values.length < 3 || values.length % 3 !== 0) return null;
    const vertexCount = values.length / 3;

    // (Re)create when the vertex count changed (LOD/identity change).
    if (entry && entry.positionAttr.count !== vertexCount) {
      this.disposeActor(id);
      entry = undefined;
    }

    if (!entry) {
      const created = this.createActor(values, vertexCount);
      if (!created) return null;
      entry = created;
      this.actorMeshes.set(id, entry);
      this.group.add(entry.group);
    }

    // Copy streamed positions into the persistent buffer, then re-normalise normals.
    const dst = entry.positionAttr.array as Float32Array;
    dst.set(values);
    entry.positionAttr.needsUpdate = true;
    entry.geometry.computeVertexNormals();
    entry.geometry.computeBoundingSphere();
    return entry;
  }

  private createActor(values: Float32Array, vertexCount: number): ActorMesh | null {
    if (!this.topology) return null;

    const positionAttr = new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3);
    positionAttr.setUsage(THREE.DynamicDrawUsage);
    (positionAttr.array as Float32Array).set(values);
    positionAttr.needsUpdate = true;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', positionAttr);
    geometry.setIndex(new THREE.BufferAttribute(this.topology, 1));
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    geometry.attributes.position.needsUpdate = true;

    const mesh = new THREE.Mesh(geometry, this.material);
    mesh.frustumCulled = false;
    mesh.castShadow = true;
    mesh.receiveShadow = false;

    const inner = new THREE.Group();
    inner.rotation.y = MHR_FORWARD_OFFSET;
    inner.add(mesh);

    const group = new THREE.Group();
    group.add(inner);
    group.visible = false;

    return {
      group,
      geometry,
      positionAttr,
    };
  }

  private disposeActor(id: string): void {
    const entry = this.actorMeshes.get(id);
    if (!entry) return;
    this.group.remove(entry.group);
    entry.geometry.dispose();
    this.actorMeshes.delete(id);
  }

  public dispose(): void {
    for (const id of Array.from(this.actorMeshes.keys())) {
      this.disposeActor(id);
    }
    this.material.dispose();
  }
}

/** Decode a Base64 string containing little-endian float32 values. */
function decodeBase64Float32(b64: string): Float32Array | null {
  if (!b64) return null;
  try {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    // Copy into an aligned buffer before viewing as float32.
    const aligned = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
    return new Float32Array(aligned);
  } catch (err) {
    console.warn('[MhrHuman] failed to decode vertex buffer:', err);
    return null;
  }
}
