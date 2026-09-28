import * as THREE from 'three';
import { createSurfaces } from './surfaces.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export function createModelKit() {
  const materials = new Map();
  const surface = createSurfaces();
  const geometries = new Map();
  function material(color, glow = 0) {
    if (color?.isMaterial) return color;
    const key = `${color}:${glow}`;
    if (!materials.has(key)) materials.set(key, new THREE.MeshStandardMaterial({ color, roughness: .48, emissive: color, emissiveIntensity: glow }));
    return materials.get(key);
  }
  function mesh(parent, geometry, color, position, glow = 0) {
    const object = new THREE.Mesh(geometry, material(color, glow));
    object.position.set(...position); object.castShadow = true; object.receiveShadow = true; parent.add(object); return object;
  }
  function group(parent, id, position = [0, 0, 0]) {
    const object = new THREE.Group(); object.position.set(...position); if (id) object.userData.id = id; parent.add(object); return object;
  }
  function box(parent, size, position, color, radius = .02, glow = 0) {
    const key = `${size}:${radius}`;
    if (!geometries.has(key)) geometries.set(key, radius ? new RoundedBoxGeometry(...size, 4, Math.min(radius, Math.min(...size) / 3)) : new THREE.BoxGeometry(...size));
    return mesh(parent, geometries.get(key), color, position, glow);
  }
  function cylinder(parent, top, bottom, height, position, color, segments = 32) {
    return mesh(parent, new THREE.CylinderGeometry(top, bottom, height, segments), color, position);
  }
  function sphere(parent, size, position, color) {
    const object = mesh(parent, new THREE.SphereGeometry(1, 32, 20), color, position); object.scale.set(...size); return object;
  }
  function tube(parent, points, color, radius = .015) {
    return mesh(parent, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))), 48, radius, 10, false), color, [0, 0, 0]);
  }
  function label(parent, lines, size, position, options = {}) {
    const canvas = document.createElement('canvas'); canvas.width = options.resolution || 1024; canvas.height = Math.round(canvas.width * size[1] / size[0]);
    const labelHeight=1024*size[1]/size[0];
    const ctx = canvas.getContext('2d');ctx.scale(canvas.width/1024,canvas.height/labelHeight);
    ctx.fillStyle = options.background || '#ede7d8'; ctx.fillRect(0, 0, 1024, labelHeight);
    ctx.fillStyle = options.color || '#455347'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `${options.bold ? '600' : '400'} ${options.fontSize || Math.min(66, labelHeight / (lines.length * 1.8))}px ${options.font || '"Noto Sans JP", sans-serif'}`;
    lines.forEach((line, i) => ctx.fillText(line, 512, labelHeight / 2 + (i - (lines.length - 1) / 2) * labelHeight / (lines.length + 1), 940));
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 4;
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(...size), new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }));
    plane.position.set(...position); parent.add(plane); return { plane, texture, ctx, canvas };
  }
  return { surface, material, mesh, group, box, cylinder, sphere, tube, label };
}

export { makeCat } from './cats.js';
