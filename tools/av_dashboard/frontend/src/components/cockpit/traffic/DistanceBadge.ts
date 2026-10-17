import * as THREE from 'three';

export function createDistanceBadge(): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 48;
  const ctx = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1.30, 0.195, 1);
  sprite.position.y = 1.90;
  sprite.userData = { canvas, ctx, texture, lastText: '', lastHazard: null };
  return sprite;
}

export function updateDistanceBadge(
  sprite: THREE.Sprite,
  text: string,
  isHazard: boolean,
  provenance?: string
): void {
  const data = sprite.userData;
  if (!data || !data.ctx) return;
  const cacheKey = `${text}_${isHazard}_${provenance || ''}`;
  if (data.lastCacheKey === cacheKey) return;
  data.lastCacheKey = cacheKey;

  const ctx = data.ctx as CanvasRenderingContext2D;
  ctx.clearRect(0, 0, 320, 48);

  let borderColor = '#38bdf8';
  let tagBgColor = '#0284c7';
  if (provenance === 'lidar') {
    borderColor = '#ff8c00';
    tagBgColor = '#ea580c';
  } else if (provenance === 'camera') {
    borderColor = '#ffe600';
    tagBgColor = '#ca8a04';
  } else if (provenance === 'fused') {
    borderColor = '#00e5ff';
    tagBgColor = '#0891b2';
  } else if (provenance === 'hazard' || isHazard) {
    borderColor = '#f87171';
    tagBgColor = '#ef4444';
  }

  ctx.fillStyle = isHazard ? 'rgba(220, 38, 38, 0.94)' : 'rgba(10, 18, 30, 0.90)';
  ctx.beginPath();
  const r = 16;
  ctx.moveTo(r, 4);
  ctx.lineTo(320 - r, 4);
  ctx.arcTo(320 - 4, 4, 320 - 4, 44, r);
  ctx.arcTo(320 - 4, 44, 4, 44, r);
  ctx.arcTo(4, 44, 4, 4, r);
  ctx.arcTo(4, 4, 320 - r, 4, r);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2.0;
  ctx.stroke();

  const match = text.match(/^\[(.*?)\]\s*(.*)$/);
  if (match) {
    const tag = match[1];
    const remainder = match[2];

    const tagWidth = tag.length * 10 + 16;
    ctx.fillStyle = tagBgColor;
    ctx.beginPath();
    const tr = 8;
    ctx.moveTo(10 + tr, 8);
    ctx.lineTo(10 + tagWidth - tr, 8);
    ctx.arcTo(10 + tagWidth, 8, 10 + tagWidth, 40, tr);
    ctx.arcTo(10 + tagWidth, 40, 10, 40, tr);
    ctx.arcTo(10, 40, 10, 8, tr);
    ctx.arcTo(10, 8, 10 + tagWidth, 8, tr);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tag, 10 + tagWidth / 2, 24);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(remainder, 10 + tagWidth + 10, 24);
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 160, 24);
  }

  (data.texture as THREE.CanvasTexture).needsUpdate = true;
}
