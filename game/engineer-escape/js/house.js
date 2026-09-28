import { makeInvoice } from './invoice.js';
import { buildPetStation } from './pet-station.js';
import { buildServerStorage } from './server-storage.js';
import { buildClimate } from './climate.js';
import { buildSofaDetails } from './sofa-details.js';
import * as THREE from 'three';
import { createModelKit, makeCat } from './models.js';
import { hasLink, pcPowered, serverOpen } from './state.mjs';
import { createMonitorDisplay } from './monitor.js';
import { EXTRA_INSPECTIONS } from './exploration.mjs';
import { buildDomestic } from './domestic.js';
import { buildNetworkCable } from './network-cable.js';
import { buildDeskAccessories } from './desk-accessories.js';
import { buildEquipmentRacks, ROUTER_POSITION } from './equipment-racks.js';
import { makeInsuranceCard } from './insurance-card.js';
import { makeClosedBook, makeCatTower } from './bedroom.js';
import { buildHouseFixtures } from './house-fixtures.js';
import { buildLibrary } from './library.js';
import { makeWindow, makePendant, makePainting, addRoomDetails } from './architecture.js';
import { createCatWalker } from './navigation.mjs';

export const OBJECTS = {
  pc: 'PC', invoice: '請求書', book: '本棚', 'command-book':'コマンドリファレンス', 'lounge-book':'猫と暮らす本', drawer: '机の引き出し',
  key: '小さな鍵', tester: 'LAN テスター', birthday: '動物保険カード',
  modem: 'モデム・ルーター', 'modem-switch': '本体の電源スイッチ', power: '電源タップ',
  cable: 'LAN ケーブル', 'cable-pc':'LAN ケーブル · PC 側', 'cable-router':'LAN ケーブル · ルーター側', door: 'サーバー室の扉', keypad: 'テンキー',
  spare: '予備の LAN ケーブル', usb: 'USB ケーブル', rack: 'サーバーラック',
  sofa: 'ソファ', plant: '観葉植物', 'cat-mugi': 'える', 'cat-sumi': 'ぐり',
  ...Object.fromEntries(Object.entries(EXTRA_INSPECTIONS).map(([id, value]) => [id, value.name])),
};
export const MODEM_CENTER = new THREE.Vector3(...ROUTER_POSITION).add(new THREE.Vector3(0,3.4,0));

export function buildHouse(scene) {
  const kit = createModelKit();
  const { box, group, cylinder, sphere, tube, label, material, surface } = kit;
  const world = group(scene), upper = group(world, null, [0, 3.4, 0]);
  const palette = { wall: surface('plaster', '#b1ada3'), sage: surface('plaster', '#7c8785'), trim: surface('wood', '#585049'), wood: surface('wood', '#ad8967'), dark: '#253445' };
  function floor(parent, x, z, w, d, color) { box(parent, [w, .12, d], [x, -.07, z], color, 0).userData.walkable = true; }
  floor(world, 0, 0, 10, 10, '#b5a78d'); floor(world,1.7,7,6.6,4,'#b5a78d'); floor(upper, -1.025, 0, 7.95, 10, '#716b69'); floor(upper, 3.95, -4.12, 2.1, 1.76, '#716b69');floor(upper,3.95,4.18,2.1,1.64,'#716b69');
  const plankGeometry = new THREE.BoxGeometry(.197, .018, 1.255);
  for (const y of [0, 3.4]) {
    const coords = [];
    for (let column = 0; column < 50; column++) for (let z = -5.25 + column % 2 * .63; z < (y ? 5.6 : 9.1); z += 1.26) {
      const x = -4.9 + column * .2;
      const segments=y&&x>2.86?[[-5,-3.24],[3.36,5]]:[[-5,y||x< -1.6?5:9]];
      for(const [from,to] of segments){const low=Math.max(from,z-.6275),high=Math.min(to,z+.6275);if(high>low)coords.push([x,y+.004,(low+high)/2,high-low]);}
    }
    const planks = new THREE.InstancedMesh(plankGeometry, surface('wood', y ? '#a4876c' : '#9a8772'), coords.length), transform = new THREE.Object3D();
    coords.forEach((p, i) => { transform.position.set(p[0],p[1],p[2]);transform.scale.set(1,1,p[3]/1.255); transform.updateMatrix(); planks.setMatrixAt(i, transform.matrix); planks.setColorAt(i, new THREE.Color(['#eee5d8', '#e0d5c5', '#e8ded0', '#ece1d1'][i % 4])); }); planks.receiveShadow = true; planks.userData.walkable = true; world.add(planks);
  }
  // 窓の開口を避けて壁を組み、窓越しの奥行きを遮らない。
  function wallWithOpening(parent, x, z, rotation, opening) {
    const wall = group(parent, null, [x,0,z]); wall.rotation.y = rotation;
    const panel = (w,h,px,py) => { const part=box(wall,[w,h,.14],[px,py,0],palette.wall,0);part.castShadow=false; };
    if (!opening) { panel(10,3.3,0,1.65); return; }
    const [cx,cy]=opening, left=cx-1.34,right=cx+1.34,bottom=cy-1.035,top=cy+1.035;
    panel(left+5,3.3,(-5+left)/2,1.65);panel(5-right,3.3,(right+5)/2,1.65);
    panel(2.68,bottom,cx,bottom/2);panel(2.68,3.3-top,cx,(top+3.3)/2);
  }
  for (const [parent, height] of [[world,0],[upper,3.4]]) {
    wallWithOpening(parent,-5,0,Math.PI/2,height?[-1.9,1.91]:null);
    wallWithOpening(parent,5,0,Math.PI/2,null);
    wallWithOpening(parent,0,-5,0,height?[.88,1.97]:null);
    if(height)wallWithOpening(parent,0,5,0);
    for(const z of height?[-4.91,4.91]:[-4.91])box(parent,[9.9,.12,.045],[0,.06,z],palette.trim,.004);
    for(const x of [-4.91,4.91])box(parent,[.045,.12,9.9],[x,.06,0],palette.trim,.004);
  }
  for(const [w,d,x,z] of [[6.6,.14,1.7,9]]){box(world,[w,3.3,d],[x,1.65,z],palette.wall,0).castShadow=false;box(world,[w,.12,d],[x,.06,z],palette.trim,.003)}
  for(const [y,h] of [[.36,.72],[3.0,.6]])box(world,[.14,h,4],[5,y,7],palette.wall,0).castShadow=false;
  for(const z of [5.28,8.72])box(world,[.14,2.0,.56],[5,1.72,z],palette.wall,0).castShadow=false;
  const kitchenCeiling=box(world,[6.6,.12,4],[1.7,3.24,7],surface('plaster','#c8c4b9'),0);kitchenCeiling.castShadow=false;kitchenCeiling.userData.id='ceiling';kitchenCeiling.userData.remoteInspect=true;
  makePendant(kit,world,[1,3.2,6.4],'pendant');makePendant(kit,world,[2.4,3.2,6.4],'pendant');
  const lowerCeiling=box(world,[7.85,.12,10],[-1.07,3.24,0],surface('plaster','#c8c4b9'),0);lowerCeiling.castShadow=false;lowerCeiling.userData.id='ceiling';lowerCeiling.userData.remoteInspect=true;
  const ceiling=box(upper,[10,.12,10],[0,3.35,0],surface('plaster','#c8c4b9'),0);ceiling.castShadow=false;ceiling.userData.id='ceiling';ceiling.userData.remoteInspect=true;
  for(const x of [-3.6,-.3,2.8])box(upper,[.12,.11,10],[x,3.245,0],surface('wood','#66574a'),.008);
  const stairWall = box(world, [.17, 6.7, 6.3], [2.955, 3.35, 0], '#d2d4c1', 0); stairWall.castShadow = false;
  box(upper, [2.12, 1.05, .17], [3.94, .52, 3.24], palette.sage, 0);
  // 18 段を地続きの通路として登降する。カメラの足元高さは同じ勾配を使う。
  for (let i = 0; i < 18; i++) {
    const height = 3.4 * (i + 1) / 18, z = 3.15 - (i + .5) * .35;
    box(world, [1.88, height, .35], [3.985, height / 2, z], '#c0a17b', 0).userData.walkable = true;
    box(world, [1.87, .025, .06], [3.985, height + .012, z + .14], '#ddc6a0', 0).userData.walkable = true;
  }
  tube(world, [[3.13, .91, 3.1], [3.13, 2.6, 0], [3.13, 4.31, -3.1]], '#745c46', .045);
  tube(world, [[4.83, .91, 3.1], [4.83, 2.6, 0], [4.83, 4.31, -3.1]], '#745c46', .045);
  makeWindow(kit,upper,[-4.97,1.91,1.9],Math.PI/2,'window-lounge');
  makeWindow(kit,upper,[.88,1.97,-4.97],0,'window-desk');
  makeWindow(kit,world,[4.97,1.75,7],-Math.PI/2,'window-hall');
  // ワークデスク。
  const desk = group(upper);
  box(desk, [3.15, .12, 1.48], [-2.35, .87, -3.94], palette.wood);
  for (const x of [-3.78, -.93]) for (const z of [-4.56, -3.36]) box(desk, [.075, .83, .075], [x, .42, z], '#424e40');
  const pc = group(upper, 'pc');
  box(pc, [1.52, .91, .09], [-2.14, 1.52, -4.28], '#33453e');
  const screen = label(pc, [], [1.42, .8], [-2.14, 1.52, -4.225]);
  const monitor = createMonitorDisplay(screen);
  box(pc, [.1, .27, .09], [-2.14, 1.02, -4.28], '#536056'); box(pc, [.47, .035, .26], [-2.14, .96, -4.19], '#536056');
  buildDeskAccessories(kit,upper,pc);
  box(pc, [.39, .72, .66], [-.99, .4, -4.07], '#3e5047');
  box(pc, [.27, .47, .015], [-.99, .44, -3.73], '#2c3934');
  const pcLed = sphere(pc, [.018, .018, .009], [-.98, .72, -3.723], '#a9c68e');
  for (let i = 0; i < 8; i++) box(pc, [.24, .011, .01], [-.99, .28 + i * .04, -3.72], '#546356', 0);
  const drawer = group(upper, 'drawer', [0, 0, .35]);
  box(drawer, [.75, .7, 1.12], [-3.38, .42, -3.98], '#b5a080');
  const drawerSlide = group(drawer, null, [-3.38, .71, -3.55]);
  box(drawerSlide,[.69,.018,.86],[0,-.16,-.36],'#8c785a',.003);
  for(const x of [-.337,.337])box(drawerSlide,[.018,.16,.86],[x,-.08,-.36],'#9b8666',.003);
  box(drawerSlide,[.69,.16,.018],[0,-.08,-.78],'#9b8666',.003);
  box(drawerSlide, [.77, .25, .055], [0, 0, .065], '#c4ac88');
  box(drawerSlide, [.22, .025, .037], [0, -.01, .104], '#677361');
  const key = group(drawerSlide, 'key', [-.16, .012, -.14]);
  const keyRing = new THREE.Mesh(new THREE.TorusGeometry(.065, .012, 8, 20), material('#d2b16a')); keyRing.rotation.x = Math.PI / 2; key.add(keyRing);
  box(key, [.025, .019, .16], [0, 0, .11], '#d2b16a', .004); box(key, [.06, .021, .027], [.02, 0, .16], '#d2b16a', .003);
  const keyTag = label(key, ['サーバー室'], [.17, .08], [0, .014, -.07]); keyTag.plane.rotation.x = -Math.PI / 2;
  const tester = group(drawerSlide, 'tester',[0,-.145,0]); box(tester, [.17, .066, .29], [.18, .029, -.16], '#bdc475');
  for (let i = 0; i < 8; i++) sphere(tester, [.008, .007, .008], [.14, .066, -.26 + i * .026], '#4d6043');
  makeInvoice(kit,upper);
  const mugBody = group(desk, 'mug');
  cylinder(mugBody, .084, .065, .15, [-1.05, 1.01, -3.77], '#9aaa8a');
  box(desk, [.21, .025, .19], [-1.05, .94, -3.77], '#836e51');
  // 椅子は足元まで見える低い背もたれ。
  const chair = group(upper, 'chair-detail'); cylinder(chair, .035, .035, .47, [-2.15, .28, -2.6], '#5d6a5a');
  box(chair, [.55, .13, .5], [-2.15, .56, -2.6], '#9b9d7e', .065);
  box(chair, [.54, .58, .1], [-2.15, .88, -2.35], '#a1a185', .055);
  for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5; tube(chair, [[-2.15, .12, -2.6], [-2.15 + Math.cos(a) * .34, .08, -2.6 + Math.sin(a) * .34]], '#546150', .025); }
  const power = group(upper, 'power');
  box(power, [.55, .075, .15], [-.72, .085, -3.25], '#e1ddc6');
  for (let i = 0; i < 3; i++) box(power, [.065, .013, .073], [-.9 + i * .125, .13, -3.25], '#a5a995', .008);
  const powerSwitch = box(power, [.065, .019, .09], [-.52, .139, -3.25], '#bc8056');
  tube(power, [[-.96, .1, -3.25], [-1.15, .05, -3.46], [-1.2, .08, -4.6]], '#aaa48d', .02);
  const networkCable=buildNetworkCable(kit,upper);
  const equipment=buildEquipmentRacks(kit,world,upper);
  const {switchMesh}=equipment;
  // 本棚、ソファ、日常の小物。
  const library=buildLibrary(kit,upper);
  const sofa = group(upper, 'sofa');
  box(sofa, [1.24, .43, 2.65], [-4.12, .34, 1.78], surface('linen','#424b4b'), .12);
  box(sofa, [.23, .7, 2.64], [-4.58, .82, 1.78], surface('linen','#424b4b'), .1);
  for (const z of [.54, 3.01]) box(sofa, [1.22, .33, .24], [-4.12, .73, z], surface('linen','#424b4b'), .09);
  for (const z of [1.14, 2.32]) box(sofa, [.85, .18, 1.02], [-4.02, .6, z], surface('linen','#687470'), .065);
  buildSofaDetails(kit,upper);
  box(upper, [3.35, .024, 3.15], [-2.81, .04, 1.83], surface('linen','#646960'), .045).userData.walkable = true;
  for (let i = 0; i < 6; i++) box(upper, [3.24, .008, .018], [-2.81, .057, .53 + i * .53], '#9b9a83', 0).userData.walkable = true;
  const coffee = group(upper);
  box(coffee, [1.32, .09, 1.12], [-1.95, .48, 1.65], surface('wood','#bc9670'), .12);
  for (const x of [-2.43, -1.47]) for (const z of [1.26, 2.04]) box(coffee, [.055, .45, .055], [x, .24, z], '#826f52');
  makeClosedBook(kit,upper,'lounge-book',[-2.16,.531,1.57],{title:['猫と暮らす','日々の記録'],color:'#a28b69',size:[.19,.026,.25]});
  const card=makeInsuranceCard(kit,drawerSlide,[-.17,-.149,-.23]);

  cylinder(coffee, .077, .057, .11, [-2.22, .59, 1.94], '#ddd6b6');
  const plant = group(upper, 'plant');
  cylinder(plant, .28, .19, .47, [-4.37, .24, 4.1], '#bb987b');
  for (let i = 0; i < 12; i++) {
    const a = i * 2.399, y = .8 + i % 3 * .24, x = -4.37 + Math.sin(a) * .3, z = 4.1 + Math.cos(a) * .3;
    tube(plant, [[-4.37, .43, 4.1], [-4.37, y - .18, 4.1], [x, y, z]], '#74835e', .008);
    const shape = new THREE.Shape();shape.moveTo(0,0);shape.bezierCurveTo(-.18,.1,-.21,.35,0,.55);shape.bezierCurveTo(.21,.35,.18,.1,0,0);
    const geometry = new THREE.ShapeGeometry(shape,20);const vertices=geometry.attributes.position;
    for(let n=0;n<vertices.count;n++){const lx=vertices.getX(n),ly=vertices.getY(n);vertices.setZ(n,Math.sin(ly*5)*.06-Math.abs(lx)*.28)}geometry.computeVertexNormals();
    const leaf=kit.mesh(plant,geometry,new THREE.MeshStandardMaterial({color:i%2?'#3d5946':'#607b54',roughness:.56,side:THREE.DoubleSide}),[x,y,z]);leaf.rotation.set(.4,a,Math.sin(a)*.7);
    tube(leaf,[[0,0,.003],[0,.25,.06],[0,.53,.025]],'#83916a',.002);
  }
  makePainting(kit,upper);
  makePendant(kit,upper,[-.2,3.2,.3],'pendant');
  makePendant(kit,upper,[-3.4,3.2,-2.7],'pendant');
  // 階下のサーバー室。扉とテンキーは別々に調べられる。
  for (const [width, x] of [[4.34, -2.83], [.32, .88]]) box(world, [width, 3.25, .16], [x, 1.625, -1], '#97a79c', 0);
  box(world, [1.38, .76, .16], [.03, 2.87, -1], '#97a79c', 0);
  box(world, [.17, 3.25, 4], [.955, 1.625, -3], '#9faa9d', 0);
  const door = group(world, 'door', [-.66, 0, -1]);
  box(door, [1.38, 2.49, .105], [.69, 1.245, 0], '#526b60', .014);
  box(door, [.97, 1.65, .025], [.69, 1.29, .066], '#5f786a', .008);
  label(door, ['サーバー室', '関係者以外 立入禁止'], [.85, .28], [.69, 1.9, .086], { background: '#526b60', color: '#e2e7cc', fontSize: 57 });
  cylinder(door, .046, .046, .055, [1.16, 1.01, .082], '#c7b984').rotation.x = Math.PI / 2;
  box(door, [.16, .03, .035], [1.12, 1.11, .115], '#c7b984', .01);
  const keyhole = box(door, [.018, .045, .008], [1.16, 1.015, .114], '#33483c', .004);
  const keypad = group(world, 'keypad', [.071, .55, -.335]); keypad.scale.setScalar(.62); box(keypad, [.29, .46, .064], [1.31, 1.43, -.91], '#334b42');
  const keypadScreen = label(keypad, ['施錠中'], [.235, .074], [1.31, 1.56, -.872], { background: '#748b69', color: '#e5e9c9', fontSize: 100 });
  for (let row = 0; row < 4; row++) for (let col = 0; col < 3; col++) box(keypad, [.049, .048, .012], [1.245 + col * .065, 1.475 - row * .062, -.87], '#b5bdaa', .005);
  const shelf = group(world);
  for (const y of [.2, .95, 1.7]) box(shelf, [1.45, .06, .88], [-1.88, y, -4.24], '#9f9479');
  for (const x of [-2.56, -1.2]) for (const z of [-4.62, -3.86]) box(shelf, [.055, 2.1, .055], [x, 1.08, z], '#63776a');
  box(world,[.76,.8,.6],[2.32,.4,-3.2],surface('wood','#ac9275'),.04);
  box(world,[.78,.04,.63],[2.32,.82,-3.2],surface('wood','#c5ab88'),.015);
  // 日用品と保守資料も実体のある調査対象として置く。
  // 携帯回線の画面には実サイトのキャプチャを使い、自宅回線の状態には連動させない。
  const phone = group(upper, 'phone'); box(phone, [.18, .018, .32], [-1.44, .955, -4.15], '#1b2434', .025);
  const phoneCanvas = document.createElement('canvas'); phoneCanvas.width = 540; phoneCanvas.height = 966;
  const pc2 = phoneCanvas.getContext('2d');
  pc2.fillStyle = '#fbfbfd'; pc2.fillRect(0, 0, 540, 966);
  pc2.textBaseline = 'middle';
  pc2.fillStyle = '#1b2330'; pc2.textAlign = 'left'; pc2.font = '600 30px "Noto Sans JP", sans-serif'; pc2.fillText('9:41', 40, 46);
  pc2.textAlign = 'right'; pc2.font = '500 25px "Noto Sans JP", sans-serif'; pc2.fillText('5G', 452, 46);
  pc2.strokeStyle = '#1b2330'; pc2.lineWidth = 3; pc2.strokeRect(468, 34, 42, 23); pc2.fillRect(511, 41, 5, 9); pc2.fillRect(471, 37, 32, 17);
  pc2.fillStyle = '#ecedf1'; pc2.beginPath(); pc2.roundRect(34, 82, 472, 66, 33); pc2.fill();
  pc2.strokeStyle = '#3a7a53'; pc2.lineWidth = 4; pc2.beginPath(); pc2.arc(78, 111, 8, Math.PI, 0); pc2.stroke(); pc2.fillStyle = '#3a7a53'; pc2.fillRect(68, 111, 20, 17);
  pc2.fillStyle = '#4b5563'; pc2.font = '400 28px "Noto Sans JP", sans-serif'; pc2.textAlign = 'center'; pc2.fillText('i.mem.ooo', 288, 116);
  pc2.fillStyle = '#fff'; pc2.fillRect(0, 166, 540, 746);
  pc2.fillStyle = '#6b7280'; pc2.font = '400 26px "Noto Sans JP", sans-serif'; pc2.fillText('読み込み中…', 270, 535);
  pc2.fillStyle = '#c7ccd4'; pc2.beginPath(); pc2.roundRect(205, 926, 130, 8, 4); pc2.fill();
  const phoneTex = new THREE.CanvasTexture(phoneCanvas); phoneTex.colorSpace = THREE.SRGBColorSpace; phoneTex.anisotropy = 4;
  const phoneHomepage = new Image();
  phoneHomepage.addEventListener('load', () => {
    pc2.fillStyle = '#fff'; pc2.fillRect(0, 166, 540, 746);
    // 元のキャプチャの左右の余白だけを除き、本文と絵の縦横比を保つ。
    const sourceX = 340, sourceWidth = 760;
    const height = phoneHomepage.naturalHeight * 540 / sourceWidth;
    pc2.drawImage(phoneHomepage, sourceX, 0, sourceWidth, phoneHomepage.naturalHeight, 0, 166 + (746 - height) / 2, 540, height);
    phoneTex.needsUpdate = true;
  });
  phoneHomepage.addEventListener('error', () => {
    pc2.fillStyle = '#fff'; pc2.fillRect(0, 166, 540, 746);
    pc2.fillStyle = '#6b7280'; pc2.fillText('画面を読み込めませんでした', 270, 535);
    phoneTex.needsUpdate = true;
  });
  phoneHomepage.src = new URL('../assets/homepage-phone.png', import.meta.url).href;
  const phoneScreen = new THREE.Mesh(new THREE.PlaneGeometry(.152, .274), new THREE.MeshBasicMaterial({ map: phoneTex, toneMapped: false }));
  phoneScreen.position.set(-1.44, .9646, -4.15); phoneScreen.rotation.x = -Math.PI / 2; phone.add(phoneScreen);
  makePainting(kit,upper,{id:'painting-still',position:[-4.84,2.1,-3.63],rotation:Math.PI/2,image:'still-life.png',width:1.15,height:.8625});
  const walljack = group(upper, 'walljack'); box(walljack, [.23, .3, .07], [.31, .33, -4.83], '#b7c2cc'); label(walljack, ['LAN'], [.15, .11], [.31, .36, -4.788], { background: '#b7c2cc', fontSize: 90 });
  const toolbox = group(world, 'toolbox'); box(toolbox, [.74, .28, .48], [2.32,.99,-3.2], '#364e68'); box(toolbox, [.29, .06, .07], [2.32,1.18,-3.2], '#94a7b9');
  const maintenance = group(world, 'maintenance'); box(maintenance, [.36, .08, .48], [-1.85, .26, -4.1], '#527893'); label(maintenance, ['保守ノート'], [.3, .33], [-1.85, .305, -4.1], { background: '#527893', color: '#f2f4fa', fontSize: 73 }).plane.rotation.x = -Math.PI / 2;
  addRoomDetails(kit,upper,world);
  const domestic=buildDomestic(kit,world,upper);
  const supplies=buildServerStorage(kit,world,domestic),climate=buildClimate(kit,world,upper,domestic);buildPetStation(kit,upper,domestic);
  domestic.keyAnchor.add(key);key.position.set(-.13,-.069,.22);key.scale.setScalar(.65);
  const fixtures=buildHouseFixtures(kit,world,upper,domestic);
  makeClosedBook(kit,upper,'command-book',[.15,.600,4.46]);
  const catTower=makeCatTower(kit,upper,domestic);
  const poweredLights=[];world.traverse(object=>{if(object.isLight){const p=object.getWorldPosition(new THREE.Vector3());poweredLights.push({object,circuit:p.y>3.4?'living':p.z<-1?'equipment':'kitchen',intensity:object.intensity})}});
  domestic.register('book','pull',['一冊を引き出す','本を棚へ戻す'],['背表紙をそろえて棚へ戻した。','「ネットワーク調査の手引き」。付箋だらけで、仕事で何度も助けられた一冊だ。'],on=>library.setPulled(on));
  const inspectionPresets={
    modem:{focus:[0,0,0],distance:.48,minDistance:.22,maxDistance:.68,yaw:0,arc:Math.PI,tilt:.28},
    'window-desk':{focus:[0,0,0],distance:1.75,minDistance:.9,maxDistance:2.3,yaw:0,arc:.7,tilt:0},
    'window-lounge':{focus:[0,0,0],distance:1.8,minDistance:.9,maxDistance:2.4,yaw:Math.PI/2,arc:.7,tilt:0},
    'window-hall':{focus:[0,0,0],distance:1.5,minDistance:.7,maxDistance:1.7,yaw:-Math.PI/2,arc:.7,tilt:0},
    ceiling:{worldFocus:[-.6,6.66,.8],distance:1.6,minDistance:.9,maxDistance:2.3,yaw:0,tilt:-1,minTilt:-1.4,maxTilt:-.35},
    pendant:{worldFocus:[-.2,6.14,.3],distance:1.2,minDistance:.65,maxDistance:1.8,yaw:0,tilt:-.4,minTilt:-1.2,maxTilt:.2},
    'desk-lamp':{worldFocus:[-3.58,4.69,-4.2],distance:.8,minDistance:.45,maxDistance:1.2,yaw:.4,arc:1},
    vent:{worldFocus:[1.85,6.59,2.2],distance:.8,minDistance:.45,maxDistance:1.3,tilt:-1,minTilt:-1.4,maxTilt:-.4},
    'smoke-detector':{worldFocus:[-1.9,6.6,2.4],distance:.6,minDistance:.35,maxDistance:1,tilt:-1,minTilt:-1.4,maxTilt:-.4},
    mug:{worldFocus:[-1.05,4.43,-3.77],distance:.5,minDistance:.28,maxDistance:.8,yaw:0,tilt:.5},
    'chair-detail':{worldFocus:[-2.15,4.07,-2.58],distance:1.1,minDistance:.65,maxDistance:1.6,yaw:2.2,tilt:.2},
    sofa:{worldFocus:[-4.07,4.13,1.75],distance:2.1,minDistance:1.3,maxDistance:2.6,yaw:Math.PI/2,arc:.7,tilt:.35},
    plant:{worldFocus:[-4.37,4.24,4.1],distance:1.25,minDistance:.7,maxDistance:1.8,yaw:2.2,arc:.7,tilt:.2},
    rack:{worldFocus:[-4.05,1.05,-3.98],distance:1.4,minDistance:.65,maxDistance:1.8,yaw:Math.PI/2,arc:.65,tilt:.12},
    'rack-storage':{worldFocus:[-4.05,1.05,-2.56],distance:1.4,minDistance:.65,maxDistance:1.8,yaw:Math.PI/2,arc:.65,tilt:.12},
    catbowls:{worldFocus:[-.65,3.55,4.4],distance:.9,minDistance:.55,maxDistance:1.35,yaw:Math.PI,arc:1,tilt:.8},
    toolbox:{worldFocus:[2.32,.99,-3.2],distance:.9,minDistance:.55,maxDistance:1.4,yaw:Math.PI,arc:1,tilt:.5},

  };
  world.updateMatrixWorld(true);
  function inspection(id,player) {
    const objects=[];world.traverse(object=>{if(object.userData.id===id)objects.push(object)});
    if(!objects.length)return null;
    const configured=objects.find(object=>object.userData.inspection)||objects[0],custom=inspectionPresets[id]||configured.userData.inspection||{};
    const bounds=new THREE.Box3();objects.forEach(object=>bounds.union(new THREE.Box3().setFromObject(object)));
    const center=custom.worldFocus?new THREE.Vector3(...custom.worldFocus):custom.focus?configured.localToWorld(new THREE.Vector3(...custom.focus)):bounds.getCenter(new THREE.Vector3());
    if(id==='ceiling'&&player?.feet<.4)center.set(player.x,3.16,player.z);
    if(id==='pendant'&&player?.feet<.4)center.set(player.x<1.7?1:2.4,2.74,6.4);
    const size=bounds.getSize(new THREE.Vector3()),distance=Math.max(.55,Math.min(2.4,Math.max(size.x,size.y,size.z)*1.25));
    return {id,distance,minDistance:distance*.55,maxDistance:distance*1.5,tilt:.3,yaw:center.x<-3.6?Math.PI/2:center.z>4.1?Math.PI:center.z<-3.6?0:player?Math.atan2(player.x-center.x,player.z-center.z):0,arc:1.25,...custom,center:center.toArray()};
  }
  const mugi = makeCat(kit, world, 'ragdoll', 'cat-mugi');
  const sumi = makeCat(kit, world, 'ragamuffin', 'cat-sumi');
  mugi.group.scale.setScalar(.5);sumi.group.scale.setScalar(.5);
  const cats = [mugi, sumi], walkers = [createCatWalker({ x: .6, z: .5 }), createCatWalker({ x: .4, z: 7.4, feet:0 })];
  let catStates = [{ x: .6, z: .5, feet: 3.4 }, { x: .4, z: 7.4, feet: 0 }];
  let currentKeypad;
  function update(state, openingPhase = null) {
    drawerSlide.position.z = state.drawerOpen ? -2.96 : -3.55;
    domestic.setAction('nightstand:drawer',state.nightstandOpen);fixtures.update(state);
    poweredLights.forEach(({object,circuit,intensity})=>{object.intensity=state.circuits[circuit]?intensity:0});
    card.visible=state.drawerOpen;
    key.visible = state.nightstandOpen&&!state.keyTaken; tester.visible = !state.testerTaken;
    supplies.update(state);
    door.rotation.y = serverOpen(state) ? Math.PI / 2 : 0;
    keyhole.material = material(state.keyInserted ? '#d2b16a' : '#33483c');
    powerSwitch.material = material(state.powerOn ? '#c89454' : '#6a7463');
    switchMesh.material = material(state.modemOn ? '#789276' : '#354b42');
    networkCable.update(state);
    equipment.update(state);
    pcLed.material = material(pcPowered(state) ? '#a4d781' : '#485548', pcPowered(state) ? .4 : 0);
    monitor.update({...state,powerOn:pcPowered(state)}, openingPhase);
    const keypadText = serverOpen(state) ? '解錠済' : state.codeAccepted ? '認証済' : '施錠中';
    if (keypadText !== currentKeypad) { currentKeypad = keypadText; const { ctx, canvas, texture } = keypadScreen; ctx.fillStyle = '#748b69'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#e5e9c9'; ctx.fillText(keypadText, 512, canvas.height / 2); texture.needsUpdate = true; }
  }
  function animate(time, dt = .016, player) {
    domestic.animate(time,dt);fixtures.animate();catTower.animate(dt,time);supplies.animate(dt);equipment.temperature(climate.temperature());
    cats.forEach((cat, i) => {
      const current = walkers[i].step(dt, player, catStates[1 - i]); catStates[i] = current;
      cat.group.position.set(current.x, current.feet+.015, current.z);
      const angle = (current.yaw || 0) - cat.group.rotation.y;
      cat.group.rotation.y += Math.atan2(Math.sin(angle), Math.cos(angle)) * Math.min(1, dt * 6);
      cat.animate(time + i * 2.1, current.mode);
    });
  }
  animate(0);
  return { world,clockTime:fixtures.time, update, animate, inspection, actions:domestic.actions, doors:domestic.doors, operate:domestic.operate, fixtureState:domestic.state, resetFixtures:domestic.reset,
    pet(id, player) { const index = cats.findIndex(cat => cat.group.userData.id === id); if (index >= 0) walkers[index].pet(player); },
    cats() { return catStates.map((state, i) => ({ id: cats[i].group.userData.id, ...state })); },
  };
}
