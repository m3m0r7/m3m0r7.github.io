import * as THREE from 'three';
import { createModelKit } from './models.js';

export function buildCableWorkbench(scene) {
  const { group, box, cylinder, sphere, tube, surface } = createModelKit();
  const desk = group(scene);
  const steel = surface('metal', '#303c45'), silver = surface('metal', '#b7c6c9');
  const wood = surface('wood', '#9c7955');
  box(desk, [34.8, .56, 23.2], [0, -.35, 0], wood, .15);
  box(desk, [34.4, .08, .12], [0, -.22, 11.58], '#c39b6d', .03);
  for (const x of [-14.7, 14.7]) {
    for (const z of [-8.5, 8.5]) box(desk, [.52, 3.7, .52], [x, -2.45, z], steel, .06);
    box(desk, [.42, .38, 17.6], [x, -3.8, 0], steel, .04);
  }
  box(desk, [34, .4, .4], [0, -2.9, -8.5], steel, .04);
  box(scene, [100, .1, 100], [0, -4.36, 0], '#172026');

  // マットは物理床と同じ高さ。升目と目盛りで細い線の移動量を読み取れる。
  const matCanvas = document.createElement('canvas'); matCanvas.width = 1536; matCanvas.height = 960;
  const ctx = matCanvas.getContext('2d');
  ctx.fillStyle = '#233c3e'; ctx.fillRect(0, 0, 1536, 960);
  for (let x = 24; x < 1536; x += 24) {
    ctx.strokeStyle = x % 120 ? '#355051' : '#496364'; ctx.lineWidth = x % 120 ? .7 : 1.1;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 960); ctx.stroke();
  }
  for (let y = 24; y < 960; y += 24) {
    ctx.strokeStyle = y % 120 ? '#355051' : '#496364'; ctx.lineWidth = y % 120 ? .7 : 1.1;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1536, y); ctx.stroke();
  }
  ctx.strokeStyle = '#aac0b26e'; ctx.lineWidth = 2; ctx.strokeRect(15, 15, 1506, 930);
  ctx.font = '16px "Noto Sans JP", sans-serif'; ctx.fillStyle = '#a8bcaf';
  for (let i = 1; i <= 12; i++) ctx.fillText(String(i * 5), i * 120 + 5, 38);
  ctx.font = '500 21px "Noto Sans JP", sans-serif'; ctx.fillText('精密作業用マット', 50, 907);
  const matTexture = new THREE.CanvasTexture(matCanvas); matTexture.colorSpace = THREE.SRGBColorSpace; matTexture.anisotropy = 8;
  box(desk, [31.3, .055, 20], [0, -.035, 0], '#182e31', .08);
  const mat = new THREE.Mesh(new THREE.PlaneGeometry(31.2, 19.9), new THREE.MeshStandardMaterial({ map: matTexture, roughness: .94 }));
  mat.rotation.x = -Math.PI / 2; mat.position.y = -.006; mat.receiveShadow = true; desk.add(mat);

  // 工具と梱包材はケーブルの可動範囲の外に置く。
  const tools = group(desk, null, [16.3, .05, 3.6]);
  box(tools, [1.35, .1, 6.5], [0, 0, 0], surface('linen', '#4f5758'), .1);
  for (const [x, z, angle] of [[-.29, -1.5, .05], [.31, .85, -.12]]) {
    const driver = group(tools, null, [x, .18, z]); driver.rotation.y = angle;
    const handle = cylinder(driver, .15, .17, 1.05, [0, 0, 0], '#c69457', 16); handle.rotation.x = Math.PI / 2;
    const shaft = cylinder(driver, .045, .045, 1.1, [0, 0, -.96], silver, 12); shaft.rotation.x = Math.PI / 2;
    box(driver, [.08, .028, .22], [0, 0, -1.58], silver, .005);
    for (const offset of [-.22, 0, .22]) box(driver, [.29, .23, .035], [0, 0, offset], '#49382c', .01);
  }
  const pliers = group(desk, null, [-16.35, .25, 3]); pliers.rotation.y = .15;
  for (const side of [-1, 1]) {
    tube(pliers, [[side * .09, 0, -.3], [side * .29, 0, .15], [side * .38, 0, 1.5]], '#242d38', .14);
    tube(pliers, [[side * .08, 0, 0], [side * .21, 0, -.65], [side * .04, 0, -1.2]], silver, .085);
  }
  cylinder(pliers, .15, .15, .19, [0, .02, -.15], silver, 16);
  const tape = new THREE.Mesh(new THREE.TorusGeometry(.47, .17, 12, 40), new THREE.MeshStandardMaterial({ color: '#9d7d54', roughness: .9 }));
  tape.rotation.x = Math.PI / 2; tape.position.set(16.25, .21, -2.2); desk.add(tape);
  for (let i = 0; i < 3; i++) box(desk, [.16, .045, 1.9], [16.1 + i * .18, .06 + i * .04, -4], '#252b30', .025).rotation.y = .15 * i;

  const carton = group(desk, null, [10.8, 0, -10.75]);
  const paper = surface('plaster', '#aa8760');
  box(carton, [5, .08, 1.18], [0, .02, 0], paper);
  for (const z of [-.61, .61]) box(carton, [5, 1.15, .045], [0, .6, z], paper);
  for (const x of [-2.5, 2.5]) box(carton, [.045, 1.15, 1.25], [x, .6, 0], paper);
  const lid = box(carton, [5, .025, .85], [0, 1.45, -.92], paper); lid.rotation.x = -.7;
  for (let i = 0; i < 4; i++) sphere(carton, [.5, .21, .36], [-1.7 + i * 1.1, .25, 0], '#d0bda0');

  const lamp = group(desk, null, [-16, 0, -7.4]);
  cylinder(lamp, .7, .9, .25, [0, .09, 0], steel);
  for (const side of [-.13, .13]) tube(lamp, [[side, .25, 0], [side - .1, 4.7, -.25], [side + 3.3, 6.15, 1.1]], steel, .095);
  for (const [x, y, z] of [[0, .8, 0], [-.1, 4.7, -.25], [3.3, 6.15, 1.1]]) sphere(lamp, [.2, .2, .2], [x, y, z], silver);
  cylinder(lamp, .4, 1.05, .7, [3.3, 5.78, 1.1], '#334751');
  const diffuser = cylinder(lamp, .94, .94, .025, [3.3, 5.415, 1.1], '#fff0cc');
  diffuser.material = new THREE.MeshBasicMaterial({ color: '#fff0cc' });
  tube(desk, [[-16, .03, -7.4], [-16.3, .03, -9], [-16, .03, -11], [-13, -.4, -11.8]], '#172329', .055);
  const glow = new THREE.PointLight('#ffd8a1', 52, 19, 2); glow.position.set(-12.7, 5.2, -6.3); scene.add(glow);
  return desk;
}

export function makeLanPlug(rope, endpoint) {
  const group = new THREE.Group(), meshes = [];
  const shell = new THREE.MeshPhysicalMaterial({ color: '#d1eee8', transparent: true, opacity: .8, roughness: .19, metalness: .08 });
  const boot = new THREE.MeshStandardMaterial({ color: '#69c2b0', roughness: .65 });
  const gold = new THREE.MeshStandardMaterial({ color: '#dbc083', roughness: .3, metalness: .8 });
  function part(size, position, material) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material); mesh.position.set(...position); mesh.castShadow = true;
    mesh.userData.rope = rope; mesh.userData.particleIndex = endpoint ? rope.particles.length - 1 : 0; group.add(mesh); meshes.push(mesh); return mesh;
  }
  part([.30, .40, .23], [0, .24, 0], shell); part([.25, .15, .2], [0, -.025, 0], boot);
  for (let i = 0; i < 8; i++) part([.02, .17, .02], [-.105 + i * .03, .30, .12], gold);
  part([.13, .29, .03], [0, .18, -.145], shell).rotation.x = -.2;
  for (let i = 0; i < 3; i++) part([.265, .025, .21], [0, -.04 - i * .04, 0], boot);
  return { group, meshes, dispose() { meshes.forEach(mesh => mesh.geometry.dispose()); shell.dispose(); boot.dispose(); gold.dispose(); } };
}
