import { LOWER_Z_MAX, HOME_DOORS, HOME_OPEN_DOORS, HOME_WALLS, HOME_LOWER_FURNITURE, HOME_UPPER_FURNITURE } from './home-layout.mjs';
export const FLOOR_HEIGHT = 3.4;
export const SPAWN = { x: -1.5, z: -1.4, feet: FLOOR_HEIGHT, yaw: 0, pitch: -.08 };
const RADIUS = .2;
const upperFurniture = [
  ...HOME_UPPER_FURNITURE,
  [-3.9, -.8, -4.7, -3.18], [.45, 1.05, -4.54, -3.90],
  [-4.8, -4.03, -2.85, -.4], [-4.8, -3.4, .5, 3.0],
  [-2.6, -1.3, 1.1, 2.2], [-4.7, -4.1, 3.8, 4.5],
];
const lowerFurniture = [[-4.79,-3.87,-4.29,-3.67],[-4.79,-3.87,-2.87,-2.25], [-2.6, -1.15, -4.7, -3.8], ...HOME_LOWER_FURNITURE];
function overlaps(x, z, rect) {
  return x > rect[0] - RADIUS && x < rect[1] + RADIUS && z > rect[2] - RADIUS && z < rect[3] + RADIUS;
}
export function floorAt(x, z, previousFeet) {
  if (x > 3.04 && z >= -3.15 && z <= 3.15) return (3.15 - z) / 6.3 * FLOOR_HEIGHT;
  return previousFeet > FLOOR_HEIGHT / 2 ? FLOOR_HEIGHT : 0;
}
export function canStand(x, z, feet, unlocked, doors = {}) {
  if (!Number.isFinite(x + z + feet) || x < -4.76 || x > 4.76 || z < -4.76 || z > (feet < .4 ? LOWER_Z_MAX-.24 : 4.76)) return false;
  if (overlaps(x, z, [2.87, 3.04, -3.15, 3.15])) return false;
  if (feet > 2.9 && overlaps(x, z, [2.87, 5, 3.15, 3.32])) return false;
  if (feet < .4) {
    if(x< -1.65 && z>4.8)return false;
    if(Object.entries(HOME_DOORS).some(([id,rect])=>!doors[id]&&overlaps(x,z,rect)))return false;
    if(Object.entries(HOME_OPEN_DOORS).some(([id,rect])=>doors[id]&&overlaps(x,z,rect)))return false;
    if(HOME_WALLS.some(rect=>overlaps(x,z,rect)))return false;
    if (overlaps(x, z, [.87, 1.04, -5, -1])) return false;
    if (overlaps(x, z, [-5, -.66, -1.08, -.92]) || overlaps(x, z, [.72, 1.04, -1.08, -.92])) return false;
    if (!unlocked && overlaps(x, z, [-.66, .72, -1.08, -.92])) return false;
  }
  const furniture = feet > 2.9 ? upperFurniture : feet < .4 ? lowerFurniture : [];
  return !furniture.some(rect => overlaps(x, z, rect));
}
export function movePlayer(player, dx, dz, unlocked, doors = {}) {
  const next = { ...player };
  // 大きなフレーム差でも壁や施錠中の扉を飛び越えないように分割する。
  const steps = Math.max(1, Math.ceil(Math.hypot(dx, dz) / .07));
  for (let i = 0; i < steps; i++) {
    for (const [axis, amount] of [['x', dx / steps], ['z', dz / steps]]) {
      const x = next.x + (axis === 'x' ? amount : 0), z = next.z + (axis === 'z' ? amount : 0);
      const feet = floorAt(x, z, next.feet);
      if (Math.abs(feet - next.feet) < .15 && canStand(x, z, feet, unlocked, doors)) Object.assign(next, { x, z, feet });
    }
  }
  return next;
}
