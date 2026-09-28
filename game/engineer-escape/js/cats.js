import * as THREE from 'three';
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';

const clamp = THREE.MathUtils.clamp;
// 楕円体を滑らかに融合して、肩・胸・頬が連続する皮膚を作る。
function sculpt(parts, center, extent, paint, resolution = 42) {
  const field = new MarchingCubes(resolution, new THREE.MeshStandardMaterial(), false, false, 28000);
  field.isolation = 0;
  for (let z = 0; z < resolution; z++) for (let y = 0; y < resolution; y++) for (let x = 0; x < resolution; x++) {
    const px = (x / resolution * 2 - 1) * extent[0] + center[0], py = (y / resolution * 2 - 1) * extent[1] + center[1], pz = (z / resolution * 2 - 1) * extent[2] + center[2];
    let distance = 10;
    for (const [cx, cy, cz, rx, ry, rz] of parts) {
      const d = (Math.hypot((px - cx) / rx, (py - cy) / ry, (pz - cz) / rz) - 1) * Math.min(rx, ry, rz);
      const blend = Math.max(.045 - Math.abs(distance - d), 0) / .045;
      distance = Math.min(distance, d) - blend * blend * .045 * .25;
    }
    field.field[x + y * resolution + z * resolution ** 2] = -distance;
  }
  field.update();
  const count = field.geometry.drawRange.count, geometry = new THREE.BufferGeometry();
  for (const key of ['position', 'normal']) geometry.setAttribute(key, new THREE.BufferAttribute(field.geometry.attributes[key].array.slice(0, count * 3), 3));
  geometry.scale(...extent); geometry.translate(...center);
  const points = geometry.attributes.position, normals = geometry.attributes.normal, colors = new Float32Array(count * 3);
  const vector = new THREE.Vector3(), color = new THREE.Color();
  for (let i = 0; i < count; i++) {
    vector.fromBufferAttribute(points, i); paint(color, vector.x, vector.y, vector.z);
    const variation = .97 + .03 * Math.sin(vector.x * 357 + vector.z * 83) * Math.sin(vector.y * 211);
    color.multiplyScalar(variation).toArray(colors, i * 3);
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  field.geometry.dispose(); field.material.dispose();
  return { geometry, points, normals, colors };
}
function fur(parent, surface, length, count = 1400) {
  const positions = [], colors = [], normal = new THREE.Vector3(), at = new THREE.Vector3(), side = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    const n = (i * 619 + 37) % surface.points.count;
    at.fromBufferAttribute(surface.points, n); normal.fromBufferAttribute(surface.normals, n).normalize();
    side.crossVectors(normal, new THREE.Vector3(.21, 1, .17)).normalize().multiplyScalar(.0014);
    const l = length * (.55 + (i % 11) / 16), tip = at.clone().addScaledVector(normal, l); tip.y -= l * .25;
    positions.push(...at.clone().add(side).toArray(), ...at.clone().sub(side).toArray(), ...tip.toArray());
    for (let v = 0; v < 3; v++) colors.push(...surface.colors.slice(n * 3, n * 3 + 3));
  }
  const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3)); geometry.computeVertexNormals();
  parent.add(new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, side: THREE.DoubleSide })));
}
function taperedTail(kit, parent, color) {
  const curve = new THREE.CatmullRomCurve3([[0,0,0],[.025,.09,.17],[.06,.29,.29],[.13,.49,.3],[.2,.57,.23]].map(p => new THREE.Vector3(...p)));
  const geometry = new THREE.TubeGeometry(curve, 48, 1, 16, false), points = geometry.attributes.position;
  for (let i = 0; i <= 48; i++) {
    const t = i / 48, center = curve.getPointAt(t), radius = .001 + .085 * Math.sin(Math.PI * (t * .88 + .12)) * Math.pow(1 - t, .28);
    for (let j = 0; j <= 16; j++) { const n = i * 17 + j, point = new THREE.Vector3().fromBufferAttribute(points, n).sub(center).multiplyScalar(radius).add(center); points.setXYZ(n, point.x, point.y, point.z); }
  }
  geometry.computeVertexNormals();
  const mesh = kit.mesh(parent, geometry, color, [0,0,0]);
  const colors = new Float32Array(points.count * 3); for (let i = 0; i < points.count; i++) new THREE.Color(color).toArray(colors, i * 3);
  fur(parent, { points, normals: geometry.attributes.normal, colors }, .016, 700); return mesh;
}
export function makeCat(kit, parent, breed, id) {
  const { group, sphere, mesh, tube } = kit;
  const ragdoll = breed === 'ragdoll', coat = ragdoll ? '#f0ece2' : '#858791', point = ragdoll ? '#727d91' : '#676a75';
  const cat = group(parent, id), body = group(cat), head = group(body, null, [0, .64, -.32]);
  cat.userData.breed = ragdoll ? 'ラグドール / ブルーポイントバイカラー' : 'ラガマフィン / グレー';
  const paintBody = (color, x, y, z) => {
    color.set(coat);
    if (ragdoll) color.lerp(new THREE.Color('#9ba4b5'), clamp((y - .46) * 6, 0, .82) * clamp((z + .28) * 4, 0, 1));
    else color.multiplyScalar(.92 + clamp(y, 0, .7) * .18);
  };
  const skin = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .96 });
  const torso = sculpt([[0,.42,.02,.18,.205,.38],[0,.46,-.24,.18,.23,.19],[0,.37,-.31,.175,.22,.13],[0,.38,.28,.185,.2,.18]], [0,.4,0], [.32,.4,.6], paintBody);
  body.add(new THREE.Mesh(torso.geometry, skin)); fur(body, torso, .012, 1600);
  const face = sculpt([[0,0,0,.175,.15,.153],[-.12,-.04,-.018,.073,.082,.105],[.12,-.04,-.018,.073,.082,.105],[-.045,-.066,-.12,.055,.045,.065],[.045,-.066,-.12,.055,.045,.065],[0,-.095,-.096,.065,.045,.07]], [0,0,0], [.25,.24,.25], (c,x,y,z) => {
    c.set(point);
    if (ragdoll) { const white = clamp((.045 - y * .46 - Math.abs(x)) * 130, 0, 1) * clamp((-z - .055) * 18, 0, 1); c.lerp(new THREE.Color(coat), white); if (y < -.085) c.lerp(new THREE.Color(coat), .7); }
    else c.lerp(new THREE.Color('#a0a1a8'), clamp((-y - .035) * 6, 0, .5));
  });
  head.add(new THREE.Mesh(face.geometry, skin)); fur(head, face, .007, 850);
  const eyes = [];
  for (const side of [-1, 1]) {
    const ear = new THREE.Shape(); ear.moveTo(-.064,0); ear.quadraticCurveTo(-.052,.095,0,.19); ear.quadraticCurveTo(.039,.13,.064,0); ear.quadraticCurveTo(0,-.022,-.064,0);
    const geometry = new THREE.ExtrudeGeometry(ear, { depth:.037, bevelEnabled:true, bevelSegments:3, steps:1, bevelSize:.011, bevelThickness:.011, curveSegments:12 });
    const outer = mesh(head, geometry, point, [side * .111,.096,-.035]); outer.rotation.z = -side * .3; outer.scale.y=.66;
    const inner = new THREE.Shape(); inner.moveTo(-.035,.026); inner.quadraticCurveTo(-.025,.11,0,.158); inner.quadraticCurveTo(.023,.1,.037,.026); inner.closePath();
    const lining = mesh(head, new THREE.ShapeGeometry(inner, 16), '#b3959e', [side * .111,.096,-.048]); lining.rotation.set(0,Math.PI,side*.3); lining.scale.y=.66;
    const eye = group(head, null, [side * .067,.014,-.131]); eye.rotation.y = -side * .18; eyes.push(eye);
    sphere(eye,[.035,.024,.014],[0,0,0],'#242935');
    const iris = sphere(eye,[.028,.020,.012],[0,0,-.006],new THREE.MeshPhysicalMaterial({ color: ragdoll ? '#84c9ed' : '#bac289', roughness:.13, clearcoat:1 }));
    sphere(eye,[.006,.017,.006],[0,0,-.017],'#10141d'); sphere(eye,[.004,.004,.002],[-.008,.007,-.022],'#ffffff');
    for (let i = 0; i < 5; i++) tube(head, [[side*.04,-.068,-.174],[side*.145,-.053+i*.008,-.202],[side*(.24+i*.009),-.057+i*.015,-.17+i*.007]], '#dededc', .00085);
    tube(head, [[side*.012,-.095,-.18],[side*.033,-.104,-.172],[side*.057,-.095,-.166]], '#625760', .0019);
  }
  const nose = new THREE.Shape(); nose.moveTo(-.023,0); nose.quadraticCurveTo(0,.013,.023,0); nose.lineTo(0,-.019); nose.closePath();
  mesh(head,new THREE.ExtrudeGeometry(nose,{depth:.009,bevelEnabled:true,bevelSize:.003,bevelThickness:.003,bevelSegments:2}), '#b78591', [0,-.064,-.19]).rotation.y = Math.PI;
  tube(head,[[0,-.08,-.192],[0,-.1,-.18]],'#68565e',.002);
  const legs = [];
  for (const x of [-.115,.115]) for (const z of [-.235,.25]) {
    const leg = group(cat,null,[x,.34,z]);
    const surface = sculpt([[0,-.07,0,.07,.13,.08],[0,-.185,-.018,.047,.10,.057],[0,-.285,-.055,.064,.05,.085]], [0,-.14,-.01], [.14,.26,.16], (c,_x,y) => c.set(ragdoll || y < -.24 ? (ragdoll ? '#f4efe5' : '#95969e') : coat), 32);
    leg.add(new THREE.Mesh(surface.geometry,skin)); fur(leg,surface,.008,250);
    for (const offset of [-.018,.018]) tube(leg,[[offset,-.276,-.126],[offset,-.294,-.131]],ragdoll?'#c5beb7':'#737580',.001);
    legs.push(leg);
  }
  const tail = group(body,null,[0,.46,.32]); taperedTail(kit,tail,point);
  // 首輪と小さな名札は長毛の下に控えめに置く。
  const collar = new THREE.Mesh(new THREE.TorusGeometry(.135,.011,8,40),kit.material(ragdoll?'#497488':'#806182')); collar.rotation.x=Math.PI/2;collar.position.set(0,.525,-.29);body.add(collar);
  sphere(body,[.02,.025,.008],[0,.497,-.437],kit.surface('metal','#d5b878'));
  const hearts = group(cat); const heart = new THREE.Shape();heart.moveTo(0,0);heart.bezierCurveTo(-.11,.07,-.045,.16,0,.105);heart.bezierCurveTo(.045,.16,.11,.07,0,0);
  for(let i=0;i<3;i++){const shape=new THREE.Mesh(new THREE.ShapeGeometry(heart),new THREE.MeshBasicMaterial({color:'#e9a6b8',side:THREE.DoubleSide}));shape.position.set((i-1)*.16,.99+i*.07,-.2);hearts.add(shape)}
  hearts.visible=false;
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=128;const context=shadowCanvas.getContext('2d'),gradient=context.createRadialGradient(64,64,4,64,64,64);gradient.addColorStop(0,'rgba(10,8,8,.38)');gradient.addColorStop(1,'rgba(10,8,8,0)');context.fillStyle=gradient;context.fillRect(0,0,128,128);
  const shadow=new THREE.Mesh(new THREE.PlaneGeometry(.65,1.1),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(shadowCanvas),transparent:true,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.004;cat.add(shadow);
  // 移動する猫の接地影は専用面で追従させ、静的な影地図に残像を残さない。
  cat.traverse(object=>{if(object.isMesh)object.castShadow=false});
  return { group:cat, animate(time,mode='idle') {
    const walking=mode==='walk';
    legs.forEach((leg,i)=>{const phase=time*7.5+(i===0||i===3?0:Math.PI);leg.rotation.x=walking?Math.sin(phase)*.36:0;leg.position.y=.34+(walking?Math.max(0,Math.cos(phase))*.025:0)});
    body.position.y=Math.sin(time*(walking?15:2))*(walking?.007:.004);
    head.rotation.set(mode==='pet'?-.14:Math.sin(time*.8)*.025, Math.sin(time*.65)*.05,mode==='pet'?Math.sin(time*3)*.12:0);
    const blink=Math.pow(Math.max(0,Math.cos(time*.65)),70);eyes.forEach(eye=>{eye.scale.y=mode==='pet'?.38:1-blink*.88});
    tail.rotation.z=Math.sin(time*(mode==='pet'?3:1.6))*.22;hearts.visible=mode==='pet';hearts.position.y=Math.sin(time*2)*.045;
  }};
}
