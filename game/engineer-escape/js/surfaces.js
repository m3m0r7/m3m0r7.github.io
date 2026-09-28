import * as THREE from 'three';

// 素材ごとに凹凸と光沢を分ける。乱数を固定し、再読み込みでも木目を保つ。
export function createSurfaces() {
  const cache = new Map();
  let seed = 1927;
  const random = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; };
  function texture(kind) {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 512;
    const ctx = canvas.getContext('2d'), pixels = ctx.createImageData(512, 512);
    for (let y = 0; y < 512; y++) for (let x = 0; x < 512; x++) {
      const grain = Math.sin(x * .23 + Math.sin(y * .017) * 2.5 + Math.sin(y * .006) * 8);
      let value = kind === 'wood' ? 204 + grain * 7 + Math.sin(x * 1.7 + y * .01) * 3 + random() * 8 : kind === 'linen' ? 188 + (x % 4 < 2 ? -14 : 10) + (y % 4 < 2 ? -13 : 9) + random() * 8 : 205 + random() * 30;
      const i = (y * 512 + x) * 4;
      pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = value; pixels.data[i + 3] = 255;
    }
    ctx.putImageData(pixels, 0, 0);
    const map = new THREE.CanvasTexture(canvas); map.wrapS = map.wrapT = THREE.RepeatWrapping; map.anisotropy = 8;
    map.repeat.set(kind === 'wood' ? 2 : 5, kind === 'wood' ? 1 : 5); return map;
  }
  const maps = { wood: texture('wood'), linen: texture('linen'), plaster: texture('plaster') };
  return (kind, color) => {
    const key = `${kind}:${color}`;
    if (!cache.has(key)) {
      const map = maps[kind] || null;
      cache.set(key, new THREE.MeshStandardMaterial({ color, map, bumpMap: map, bumpScale: kind === 'wood' ? .0025 : kind === 'linen' ? .009 : .005, roughness: kind === 'metal' ? .28 : kind === 'wood' ? .47 : .92, metalness: kind === 'metal' ? .8 : 0 }));
    }
    return cache.get(key);
  };
}
