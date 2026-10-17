import { PerceptionObject, HumanPoseItem, HumanPosesPayload } from '../../../types/can';

export function preparePerceptionObjects(
  perceptionList: PerceptionObject[] | undefined,
  humanPoses: HumanPosesPayload | null | undefined,
  demoPedestrian: boolean,
  animTime: number
): { effectiveList: PerceptionObject[]; effectivePoses: HumanPoseItem[] } {
  const rawPoses = humanPoses?.poses;
  const rawList: PerceptionObject[] = [...(perceptionList || [])];
  const dedupList: PerceptionObject[] = [];

  const pedProvPriority = (p?: string) => {
    const s = (p || '').toLowerCase();
    return s === 'fused' ? 3 : s === 'camera' ? 2 : 1;
  };

  for (const obj of rawList) {
    if (obj.label !== 'PEDESTRIAN') {
      dedupList.push(obj);
      continue;
    }
    let matchIdx = -1;
    for (let i = 0; i < dedupList.length; i++) {
      const acc = dedupList[i];
      if (acc.label !== 'PEDESTRIAN') continue;
      const sameId = obj.id && acc.id && String(obj.id) === String(acc.id);
      const dist = Math.hypot(obj.x - acc.x, obj.z - acc.z);
      const diffSensors = pedProvPriority(obj.sensor) !== pedProvPriority(acc.sensor);
      if (sameId || (diffSensors && dist < 1.1)) {
        matchIdx = i;
        break;
      }
    }
    if (matchIdx >= 0) {
      const existing = dedupList[matchIdx];
      if (pedProvPriority(obj.sensor) > pedProvPriority(existing.sensor)) {
        if (String(existing.id).startsWith('det_') && !String(obj.id).startsWith('det_')) {
          obj.id = existing.id;
        }
        dedupList[matchIdx] = obj;
      } else if (String(obj.id).startsWith('det_') && !String(existing.id).startsWith('det_')) {
        existing.id = obj.id;
      }
    } else {
      dedupList.push(obj);
    }
  }

  const effectiveList = dedupList;
  const rawPosesCount = rawPoses ? rawPoses.length : 0;
  const hasRealPed = effectiveList.some((o) => o.label === 'PEDESTRIAN') || rawPosesCount > 0;

  if (rawPoses && rawPoses.length > 0) {
    rawPoses.forEach((pose, pIdx) => {
      const targetX = -pose.y_base;
      const targetZ = 1.0 - pose.x_base;
      let matchedObj = effectiveList.find(
        (o) => o.label === 'PEDESTRIAN' && ((o.id && pose.id && String(o.id) === String(pose.id)) || Math.hypot(o.x - targetX, o.z - targetZ) < 2.5)
      );
      if (matchedObj) {
        if (pose.id && !String(matchedObj.id).startsWith('det_')) {
          matchedObj.id = pose.id;
        }
      } else {
        effectiveList.push({
          id: pose.id || `yolo-ped-${pIdx}`,
          label: 'PEDESTRIAN',
          x: targetX,
          y: 0.0,
          z: targetZ,
          dx: 0.8,
          dy: 0.8,
          dz: 1.75,
          yaw: typeof (pose as any).yaw === 'number' ? (pose as any).yaw : 0.0,
          speed_kmh: 0.0,
        });
      }
    });
  }

  let effectivePoses = rawPoses ? [...rawPoses] : [];
  if (demoPedestrian && !hasRealPed) {
    const lookPhase = animTime * 1.5;
    const wavePhase = animTime * 2.8;
    const isDemoSeated = Math.sin(animTime * 0.35) > 0.6;
    effectiveList.push({
      id: 'demo-smpl-pedestrian',
      label: 'PEDESTRIAN',
      x: 0.22 * Math.sin(lookPhase),
      y: 0.0,
      z: -2.8,
      dx: 0.8,
      dy: 0.8,
      dz: 1.75,
      yaw: 0.12 * Math.sin(lookPhase),
      speed_kmh: 0.0,
    });
    effectivePoses.push({
      id: 'demo-smpl-pedestrian',
      x_base: 3.8,
      y_base: 0.0,
      z_base: 0.9,
      posture: isDemoSeated ? 'SEATED' : 'STANDING',
      is_seated: isDemoSeated,
      confidence: 0.98,
      keypoints: {
        nose: { x: 320 + 15 * Math.sin(lookPhase), y: 120 },
        left_shoulder: { x: 285, y: 160 },
        right_shoulder: { x: 355, y: 160 },
        left_elbow: { x: 275 - 10 * Math.sin(wavePhase), y: 215 },
        left_wrist: { x: 265 - 20 * Math.sin(wavePhase), y: 155 - 15 * Math.cos(wavePhase) },
        right_elbow: { x: 365, y: 220 },
        right_wrist: { x: 370, y: 275 },
      },
    });
  }

  return { effectiveList, effectivePoses };
}
