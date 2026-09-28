import { makeSlippers } from './desk-accessories.js';
import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { HOME_WALLS, HOME_DOORS, doorContains } from './home-layout.mjs';

import { makeBlanket } from './bedroom.js';
import { buildKitchen } from './kitchen.js';
import { buildCareStorage } from './care-items.js';

function roundedRect(w,h,r) {
  const shape=new THREE.Shape(),x=-w/2,y=-h/2;
  shape.moveTo(x+r,y);shape.lineTo(x+w-r,y);shape.quadraticCurveTo(x+w,y,x+w,y+r);shape.lineTo(x+w,y+h-r);shape.quadraticCurveTo(x+w,y+h,x+w-r,y+h);shape.lineTo(x+r,y+h);shape.quadraticCurveTo(x,y+h,x,y+h-r);shape.lineTo(x,y+r);shape.quadraticCurveTo(x,y,x+r,y);return shape;
}
export function buildDomestic(kit,world,upper) {
  const {group,box,sphere,cylinder,tube,mesh,surface,label}=kit;
  const porcelain=new THREE.MeshPhysicalMaterial({color:'#ebece6',roughness:.16,clearcoat:.7}),chrome=surface('metal','#bec5c5'),wood=surface('wood','#b49777'),rubber=kit.material('#292f32'),water=new THREE.MeshPhysicalMaterial({color:'#91c9d1',roughness:.12,transparent:true,opacity:.58,metalness:.08});
  const registry=new Map(), streams=[], motions=[];
  const zones={wash:{x:[-4.85,-1.8],y:[.22,2.85],z:[1.06,2.7]},bath:{x:[-4.84,-1.81],y:[.25,2.85],z:[3.12,4.78]},toilet:{x:[-4.8,-2.82],y:[.22,2.85],z:[-.73,.71]},kitchen:{x:[-1.32,4.72],y:[.22,2.95],z:[4.65,8.72]}};
  function subject(parent,id,position,profile={}) {const object=group(parent,id,position);object.userData.inspection={focus:[0,.7,0],distance:1.4,minDistance:.65,maxDistance:2.2,tilt:.28,...profile};return object;}
  function action(owner,key,labels,messages,apply,guard) {
    const entry={owner,key:`${owner}:${key}`,labels,messages,on:false,apply,guard};registry.set(entry.key,entry);apply(false);return entry;
  }
  function ring(parent,width,depth,thickness,height,position,color,radius=.14) {
    const shape=roundedRect(width,depth,radius),hole=roundedRect(width-thickness*2,depth-thickness*2,Math.max(.03,radius-thickness));shape.holes.push(hole);
    const geometry=new THREE.ExtrudeGeometry(shape,{depth:height,bevelEnabled:true,bevelSize:.012,bevelThickness:.008,bevelSegments:3,curveSegments:16,steps:1});const object=mesh(parent,geometry,color,position);object.rotation.x=-Math.PI/2;return object;
  }
  function flow(parent,position,height,owner,key,labels=['水を出す','水を止める']) {
    const stream=cylinder(parent,.009,.015,height,[position[0],position[1]-height/2,position[2]],water,12);stream.castShadow=false;
    streams.push(stream);const lever=box(parent,[.09,.015,.035],[position[0],position[1]+.09,position[2]-.07],chrome,.008);lever.userData.action=`${owner}:${key}`;
    action(owner,key,labels,['蛇口を閉めた。水音が止まった。','水が流れた。排水口へすっと吸い込まれていく。'],on=>{stream.visible=on;lever.rotation.x=on?-.45:0});return stream;
  }
  function faucet(parent,position) {
    tube(parent,[[position[0],position[1]-.23,position[2]-.13],[position[0],position[1]+.02,position[2]-.13],[position[0],position[1]+.035,position[2]-.035],position],chrome,.019);
    cylinder(parent,.032,.036,.025,[position[0],position[1]-.24,position[2]-.13],chrome);
  }
  function bottle(parent,id,position,color,text,height=.22) {
    const item=subject(parent,id,position,{focus:[0,height/2,0],distance:.55,minDistance:.32,maxDistance:.9});cylinder(item,.035,.042,height,[0,height/2,0],color);cylinder(item,.019,.019,.035,[0,height+.016,0],rubber);label(item,[text],[.062,height*.47],[0,height*.48,.042],{background:color,color:'#394443',fontSize:100});return item;
  }
  // 一階の独立した水回り。出入口の幅と床の段差をモデルと歩行で揃える。
  const walls=group(world);
  for(const [x1,x2,z1,z2] of HOME_WALLS) {const wall=box(walls,[x2-x1,3.18,z2-z1],[(x1+x2)/2,1.59,(z1+z2)/2],surface('plaster','#cdc7bc'),0);wall.castShadow=false;}
  for(const [x,z,w,d] of [[-2.6,.07,.12,1.04],[-1.6,1.97,.12,1.18],[-2.27,2.91,1.36,.1]])box(walls,[w,.82,d],[x,2.77,z],surface('plaster','#cdc7bc'),0).castShadow=false;
  for(const [x,z] of [[-2.59,-.43],[-2.59,.57],[-1.6,1.38],[-1.6,2.56]]){const jamb=box(walls,[.2,2.36,.055],[x,1.18,z],wood,.006);jamb.userData.id=x< -2?'toilet-door':'washroom-door';jamb.userData.action=`${jamb.userData.id}:open`;}
  for(const x of [-2.95,-1.66]){const jamb=box(walls,[.055,2.36,.2],[x,1.18,2.91],chrome,.005);jamb.userData.id='bath-door';jamb.userData.action='bath-door:open';}
  // 扉の開閉と歩行の可否は同じ状態を参照する。
  for(const [id,position,width,axis,travel,yaw] of [
    ['washroom-door',[-1.59,0,1.97],1.18,'z',1.23,Math.PI/2],
    ['toilet-door',[-2.59,0,.07],1.04,'z',1.09,Math.PI/2],
    ['bath-door',[-2.30,0,2.91],1.29,'x',-1.34,Math.PI],
  ]) {
    const root=subject(world,id,position,{focus:[0,1.1,0],distance:1.5,minDistance:.7,maxDistance:1.8,yaw,arc:.55});
    const panel=group(root);panel.userData.action=`${id}:open`;
    const bath=id==='bath-door',face=bath?new THREE.MeshPhysicalMaterial({color:'#c5d6d1',transparent:true,opacity:.88,roughness:.78}):wood;
    box(panel,axis==='z'?[.075,2.27,width]:[width,2.27,.075],[0,1.14,0],face,.014);
    if(bath)for(const x of [-width/2,width/2])box(panel,[.035,2.29,.09],[x,1.14,0],chrome,.004);
    for(const side of [-1,1])box(panel,axis==='z'?[.032,.16,.04]:[.04,.2,.035],axis==='z'?[side*.054,1.05,(id==='toilet-door'?1:-1)*width*.32]:[width*.32,1.05,side*.055],chrome,.006);
    if(id!=='toilet-door')box(root,axis==='z'?[.08,.04,width*2+.06]:[width*2+.06,.04,.08],axis==='z'?[0,2.31,travel/2]:[travel/2,2.31,0],chrome,.004);
    let hinge=null;if(id==='toilet-door'){hinge=group(root,null,[0,0,-width/2]);hinge.add(panel);panel.position.z=width/2;for(const y of [.45,1.85])cylinder(root,.012,.012,.08,[.03,y,-width/2],chrome)}
    action(id,'open',['扉を開く','扉を閉じる'],['扉を閉めた。','扉を開いた。奥へ進める。'],on=>{if(hinge)hinge.rotation.y=on?-Math.PI/2:0;else panel.position[axis]=on?travel:0},(on,player)=>on||!player||!doorContains(id,player));
  }
  function tileFloor(x1,x2,z1,z2,color) {
    const g=new THREE.BoxGeometry(.294,.016,.294),coords=[];
    for(let x=x1+.15;x<x2;x+=.3)for(let z=z1+.15;z<z2;z+=.3)coords.push([x,.029,z]);
    const tiles=new THREE.InstancedMesh(g,kit.material(color),coords.length),transform=new THREE.Object3D();coords.forEach((p,i)=>{transform.position.set(...p);transform.updateMatrix();tiles.setMatrixAt(i,transform.matrix)});tiles.receiveShadow=true;tiles.userData.walkable=true;world.add(tiles);
  }
  tileFloor(-4.97,-1.68,.98,4.97,'#bbc4c0');tileFloor(-4.97,-2.69,-.87,.81,'#cfcec6');
  const bathroomLight=new THREE.PointLight('#eef5ed',15,5,2);bathroomLight.position.set(-2.6,2.8,3.9);world.add(bathroomLight);
  const washLight=new THREE.PointLight('#fff1d8',12,5,2);washLight.position.set(-2.7,2.6,1.9);world.add(washLight);
  const wcLight=new THREE.PointLight('#fff0d5',7,3,2);wcLight.position.set(-3.5,2.5,0);world.add(wcLight);
  for(const [x,z] of [[-2.6,3.9],[-2.7,1.9],[-3.5,0]])cylinder(world,.14,.14,.04,[x,3.13,z],new THREE.MeshStandardMaterial({color:'#f6edd9',emissive:'#f6edd9',emissiveIntensity:.7}));
  // 洗面台：陶器の窪み、排水口、蛇口、鏡、開く収納。
  const basin=subject(world,'washbasin',[-4.49,0,1.79],{focus:[0,1.03,0],distance:1.5,minDistance:.65,maxDistance:1.85,yaw:Math.PI/2,arc:.7,tilt:.28,bounds:zones.wash});basin.rotation.y=Math.PI/2;
  for(const x of [-.45,.45])box(basin,[.05,.72,.59],[x,.39,0],wood,.015);for(const y of [.075,.73])box(basin,[.95,.05,.59],[0,y,0],wood,.015);box(basin,[.85,.63,.032],[0,.4,-.278],'#a49580',.01);
  const doors=[];for(const side of [-1,1]) {const door=group(basin,null,[side*.46,.43,.311]);box(door,[.452,.65,.033],[-side*.225,0,0],porcelain,.015);box(door,[.027,.12,.02],[-side*.35,.1,.026],chrome,.008);door.userData.action='washbasin:cupboard';doors.push(door);}
  action('washbasin','cupboard',['収納を開く','収納を閉じる'],['扉を閉めた。','洗剤のボトルと予備の石けん。給水管も排水管も乾いている。'],on=>doors.forEach((door,i)=>{door.rotation.y=on?(i?1:-1)*1.05:0}));
  for(const x of [-.43,.43])box(basin,[.12,.055,.65],[x,.81,0],porcelain,.02);for(const z of [-.278,.278])box(basin,[.8,.055,.10],[0,.81,z],porcelain,.02);
  const bowl=mesh(basin,new THREE.LatheGeometry([[.02,-.09],[.1,-.083],[.21,-.01],[.29,.07],[.3,.09],[.29,.11],[.275,.105],[.24,.047],[.17,-.035],[.08,-.07],[.02,-.07]].map(p=>new THREE.Vector2(...p)),48),porcelain,[0,.84,.015]);bowl.scale.set(1.32,1,.82);
  cylinder(basin,.026,.026,.004,[0,.772,.015],chrome);faucet(basin,[0,1.11,-.055]);flow(basin,[0,1.11,-.055],.31,'washbasin','water');
  tube(basin,[[0,.77,0],[0,.34,0],[0,.27,-.14],[0,.47,-.24]],chrome,.025);
  cylinder(basin,.046,.046,.18,[.29,.19,.08],'#87a291');box(basin,[.14,.05,.09],[-.26,.14,.07],'#d8c8b2',.012);
  const mirror=subject(world,'mirror',[-4.89,1.52,1.79],{focus:[0,0,0],distance:1.13,yaw:Math.PI/2,arc:.5,tilt:0,bounds:zones.wash});mirror.rotation.y=Math.PI/2;
  box(mirror,[.82,.88,.07],[0,0,0],wood,.02);
  const reflection=new Reflector(new THREE.PlaneGeometry(.75,.8),{color:0xc9ceca,textureWidth:512,textureHeight:512,clipBias:.003});reflection.position.z=.039;mirror.add(reflection);
  const reflectionRender=reflection.onBeforeRender;reflection.onBeforeRender=function(renderer,scene,camera,...args){if(this.getWorldPosition(new THREE.Vector3()).distanceTo(camera.position)>3.6)return;reflectionRender.call(this,renderer,scene,camera,...args)};
  box(mirror,[.8,.035,.12],[0,-.48,.04],porcelain,.008);
  const soap=bottle(basin,'hand-soap',[.33,.852,.02],'#d6cbb7','泡',.14);soap.userData.inspection.bounds=zones.wash;
  const toothbrush=subject(basin,'toothbrushes',[-.32,.86,-.045],{focus:[0,.12,0],distance:.55,minDistance:.3,maxDistance:.85});cylinder(toothbrush,.045,.036,.12,[0,.06,0],porcelain);for(const [x,color] of [[-.018,'#83a8b2'],[.018,'#c8ac93']]){box(toothbrush,[.013,.19,.012],[x,.14,0],color,.006);box(toothbrush,[.021,.04,.018],[x,.245,0],'#e5e8e1',.006)}
  // 洗濯機は開くガラス扉の奥に、金属ドラムとリフターを置く。
  const washer=subject(world,'washer',[-3.03,0,1.33],{focus:[0,.5,.14],distance:1.15,minDistance:.6,maxDistance:1.55,yaw:0,arc:.65,bounds:zones.wash});
  box(washer,[.68,.85,.65],[0,.44,0],porcelain,.045);box(washer,[.64,.13,.03],[0,.77,.338],'#d1d8d4',.016);
  const drum=cylinder(washer,.23,.23,.02,[0,.42,.332],rubber);drum.rotation.x=Math.PI/2;
  const inside=cylinder(washer,.195,.195,.01,[0,.42,.347],chrome);inside.rotation.x=Math.PI/2;
  for(let i=0;i<32;i++){const a=i*Math.PI/16;sphere(washer,[.007,.007,.003],[Math.sin(a)*.175,.42+Math.cos(a)*.175,.356],'#586368')}
  const washerDoor=group(washer,null,[-.235,.42,.37]);washerDoor.userData.action='washer:door';
  const washerRim=new THREE.Mesh(new THREE.TorusGeometry(.228,.032,12,48),chrome);washerRim.position.x=.235;washerDoor.add(washerRim);
  sphere(washerDoor,[.204,.204,.031],[.235,0,0],new THREE.MeshPhysicalMaterial({color:'#87999e',transparent:true,opacity:.45,roughness:.09,metalness:.25}));
  action('washer','door',['扉を開く','扉を閉じる'],['洗濯機の扉を閉めた。','ドラムは空っぽ。昨日の洗濯はもう片づけてある。'],on=>{washerDoor.rotation.y=on?-1.25:0});
  cylinder(washer,.037,.037,.027,[.21,.78,.367],chrome).rotation.x=Math.PI/2;label(washer,['電源 切'],[.18,.05],[-.07,.78,.36],{background:'#343e40',color:'#aec3b2',fontSize:100});
  const basket=subject(world,'laundry-basket',[-2.23,0,1.28],{focus:[0,.24,0],distance:.85,tilt:.65,bounds:zones.wash});
  ring(basket,.42,.44,.03,.38,[0,.04,0],surface('linen','#b09c7f'),.05);for(let i=0;i<5;i++)box(basket,[.35,.052,.31],[0,.10+i*.05,0],surface('linen',i%2?'#ddd7ca':'#96a3a1'),.022);
  const towel=subject(world,'towels',[-4.86,1.2,2.51],{focus:[0,0,0],distance:.85,yaw:Math.PI/2,arc:.55,bounds:zones.wash});towel.rotation.y=Math.PI/2;tube(towel,[[-.27,0,0],[.27,0,0]],chrome,.014);box(towel,[.4,.51,.035],[0,-.21,.026],surface('linen','#d6c6af'),.018);
  // 浴槽は中空で、縁・底・排水口が別々に見える。
  const tub=subject(world,'bathtub',[-4.13,0,4.02],{focus:[0,.43,0],distance:1.6,minDistance:.85,maxDistance:2.05,yaw:Math.PI/2,arc:.5,tilt:.55,bounds:zones.bath});
  ring(tub,1.3,1.68,.095,.48,[0,.08,0],porcelain,.23);ring(tub,1.34,1.72,.09,.028,[0,.58,0],porcelain,.24);box(tub,[1.08,.06,1.43],[0,.12,0],porcelain,.18);cylinder(tub,.027,.027,.006,[.3,.155,.49],chrome);
  const tubWater=box(tub,[1.06,.006,1.4],[0,.28,0],water,.17);tubWater.visible=false;action('bathtub','plug',['栓をして水をためる','栓を抜く'],['栓を抜くと、水がゆっくり流れていった。','お湯はりの水が浴槽にたまった。底の栓はきちんと閉まる。'],on=>{tubWater.visible=on});
  const shower=subject(world,'shower',[-4.84,0,3.38],{focus:[0,1.27,0],distance:1.15,minDistance:.65,maxDistance:1.5,yaw:Math.PI/2,arc:.6,bounds:zones.bath});shower.rotation.y=Math.PI/2;
  tube(shower,[[0,.95,0],[0,1.95,0],[0,2.08,.19]],chrome,.017);const showerHead=cylinder(shower,.13,.13,.023,[0,2.07,.22],chrome);showerHead.rotation.x=.16;tube(shower,[[.03,1.1,.04],[.24,.58,.06],[.25,1.4,.05]],chrome,.01);
  box(shower,[.27,.062,.07],[0,1.06,.025],chrome,.025);const showerFlow=group(shower);for(let i=0;i<11;i++){const a=i*2.4;const jet=cylinder(showerFlow,.003,.004,1.45,[Math.sin(a)*.09,1.31,.22+Math.cos(a)*.09],water,6);jet.castShadow=false;streams.push(jet)}
  showerHead.userData.action='shower:water';action('shower','water',['シャワーを出す','シャワーを止める'],['シャワーを止めた。','シャワーの水音が浴室に響く。水は浴槽の中へ落ちている。'],on=>{showerFlow.visible=on});
  buildCareStorage(kit,world,{subject,action,zones});
  const drain=subject(world,'bath-drain',[-2.91,.04,4.42],{focus:[0,0,0],distance:.75,minDistance:.42,maxDistance:1.1,tilt:1.05,bounds:zones.bath});box(drain,[.21,.015,.21],[0,0,0],chrome,.015);for(let i=0;i<7;i++)box(drain,[.15,.007,.008],[0,.01,-.075+i*.025],rubber,.002);
  const stool=subject(world,'bath-stool',[-2.15,0,4.44],{focus:[0,.2,0],distance:.85,tilt:.5,bounds:zones.bath});box(stool,[.4,.075,.32],[0,.29,0],porcelain,.045);for(const x of [-.14,.14])box(stool,[.065,.26,.27],[x,.15,0],porcelain,.028);
  const bathControl=subject(world,'water-heater',[-1.72,1.34,3.71],{focus:[0,0,0],distance:.7,minDistance:.42,maxDistance:1.1,yaw:-Math.PI/2,arc:.6,bounds:zones.bath});bathControl.rotation.y=-Math.PI/2;box(bathControl,[.28,.21,.035],[0,0,0],porcelain,.018);label(bathControl,['給湯  40℃'],[.21,.063],[0,.027,.022],{background:'#687d71',color:'#e9efdb',fontSize:100});for(const x of [-.065,.065])box(bathControl,[.06,.026,.01],[x,-.061,.024],'#bbc4bc',.009);
  // トイレはタンク、空洞の便器、動くふた、給水管まで作る。
  const toilet=subject(world,'toilet',[-4.3,0,.03],{focus:[0,.46,0],distance:1.1,minDistance:.64,maxDistance:1.65,yaw:Math.PI/2,arc:.6,tilt:.35,bounds:zones.toilet});toilet.rotation.y=Math.PI/2;
  box(toilet,[.41,.63,.22],[0,.46,-.285],porcelain,.055);box(toilet,[.44,.045,.255],[0,.79,-.285],porcelain,.025);
  mesh(toilet,new THREE.LatheGeometry([[.17,0],[.19,.06],[.12,.23],[.19,.38]].map(p=>new THREE.Vector2(...p)),40),porcelain,[0,.055,.13]);
  const toiletBowl=mesh(toilet,new THREE.LatheGeometry([[.04,-.15],[.15,-.12],[.23,-.025],[.26,.03],[.25,.065],[.227,.062],[.20,.005],[.12,-.08],[.035,-.105]].map(p=>new THREE.Vector2(...p)),48),porcelain,[0,.38,.15]);toiletBowl.scale.z=1.26;
  const bowlWater=cylinder(toilet,.12,.12,.006,[0,.28,.15],water);bowlWater.scale.z=1.2;
  const seat=new THREE.Mesh(new THREE.TorusGeometry(.231,.024,12,48),kit.material('#f1eee6'));seat.rotation.x=Math.PI/2;seat.scale.y=1.32;seat.position.set(0,.462,.15);toilet.add(seat);
  const lid=group(toilet,null,[0,.47,-.16]);sphere(lid,[.253,.026,.33],[0,0,.3],porcelain);lid.userData.action='toilet:lid';action('toilet','lid',['ふたを開く','ふたを閉じる'],['ふたを閉めた。','ふたを上げた。便器も床も清潔に保たれている。'],on=>{lid.rotation.x=on?-1.46:0});
  tube(toilet,[[.24,.51,-.28],[.28,.21,-.28],[.32,.21,-.28]],chrome,.016);const handle=box(toilet,[.08,.025,.04],[.229,.68,-.25],chrome,.01);handle.userData.action='toilet:flush';let flush=0;
  action('toilet','flush',['水を流す','水を流す'],['水を流した。タンクの給水音がする。','水を流した。タンクの給水音がする。'],()=>{flush=2.2});flush=0;motions.push(dt=>{flush=Math.max(0,flush-dt);bowlWater.position.y=.28-(flush?Math.sin(flush*Math.PI/2.2)*.048:0);handle.rotation.z=flush?-.2:0});
  const paper=subject(world,'toilet-paper',[-3.66,.78,.784],{focus:[0,0,0],distance:.6,minDistance:.35,maxDistance:.9,yaw:Math.PI,arc:.65,bounds:zones.toilet});paper.rotation.y=Math.PI;tube(paper,[[-.09,0,0],[.09,0,0]],chrome,.012);const roll=cylinder(paper,.065,.065,.14,[0,-.006,.038],surface('linen','#eee9dd'));roll.rotation.z=Math.PI/2;box(paper,[.125,.17,.005],[0,-.08,.101],'#eee9dd',.001);
  const wcShelf=subject(world,'toilet-shelf',[-4.82,1.56,.03],{focus:[0,0,0],distance:.85,yaw:Math.PI/2,arc:.6,bounds:zones.toilet});box(wcShelf,[.23,.035,.82],[0,0,0],wood,.01);for(const z of [-.25,-.07,.12])cylinder(wcShelf,.065,.065,.1,[0,.067,z],'#eee9dd');
  buildKitchen(kit,world,{subject,action,ring,faucet,flow,zones});
  // 二階のベッドと枕元。可動の枕の下まで見られる。
  const bed=subject(upper,'bed',[1.4,0,3.81],{focus:[0,.43,0],distance:2,minDistance:1.1,maxDistance:2.6,yaw:Math.PI,arc:1.1,tilt:.55});
  box(bed,[1.64,.24,2.05],[0,.22,0],wood,.045);box(bed,[1.64,.85,.09],[0,.65,1.01],wood,.04);box(bed,[1.59,.2,1.96],[0,.44,-.015],surface('linen','#e5ded0'),.08);makeBlanket(kit,bed);

  const pillow=group(bed,null,[-.23,.6,.7]);box(pillow,[.72,.15,.36],[0,0,0],surface('linen','#e7e0d3'),.065);pillow.userData.action='bed:pillow';action('bed','pillow',['枕を持ち上げる','枕を戻す'],['枕を元に戻した。','枕の下には読みかけの文庫本。小物を隠した様子はない。'],on=>{pillow.position.y=on?.89:.6;pillow.rotation.z=on?-.22:0});box(bed,[.19,.025,.27],[-.23,.558,.7],'#9a7960',.004);
  const nightstand=subject(upper,'nightstand',[.15,0,4.48],{focus:[0,.38,-.16],distance:1.04,minDistance:.6,maxDistance:1.5,yaw:Math.PI,arc:1,tilt:.65});for(const x of [-.26,.26])box(nightstand,[.04,.59,.62],[x,.3,0],wood,.012);for(const y of [.035,.576])box(nightstand,[.56,.04,.62],[0,y,0],wood,.012);box(nightstand,[.49,.53,.025],[0,.3,.294],wood,.008);box(nightstand,[.49,.21,.035],[0,.14,-.293],wood,.008);const drawer=group(nightstand,null,[0,.38,-.33]);box(drawer,[.52,.21,.04],[0,0,0],wood,.012);box(drawer,[.12,.023,.019],[0,0,-.03],chrome,.005);drawer.userData.action='nightstand:drawer';action('nightstand','drawer',['引き出しを開く','引き出しを閉じる'],['引き出しを閉めた。','読書用の眼鏡と耳栓。隣に小物のトレーがある。'],on=>{drawer.position.z=on?-.73:-.33});box(drawer,[.46,.025,.39],[0,-.095,.21],'#68523c',.008);for(const x of [-.055,.055]){const lens=new THREE.Mesh(new THREE.TorusGeometry(.039,.004,6,24),chrome);lens.rotation.x=Math.PI/2;lens.position.set(x,-.072,.135);drawer.add(lens);tube(drawer,[[x*1.65,-.072,.135],[x*1.65,-.072,.24]],chrome,.004)}tube(drawer,[[-.018,-.072,.135],[.018,-.072,.135]],chrome,.004);for(const x of [.12,.15])cylinder(drawer,.009,.012,.025,[x,-.06,.1],'#d9b28a');tube(drawer,[[-.16,-.07,.26],[-.12,-.07,.31],[-.02,-.07,.3],[.01,-.07,.25],[-.1,-.07,.23],[-.16,-.07,.27]],rubber,.005);
  const alarm=subject(upper,'alarm-clock',[.16,.598,4.69],{focus:[0,.07,0],distance:.55,minDistance:.32,maxDistance:.9,yaw:Math.PI,arc:1});box(alarm,[.22,.14,.08],[0,.07,0],'#444e4f',.02);const alarmDisplay=label(alarm,[],[.18,.078],[0,.076,-.045],{background:'#2a3536',color:'#c7d1bc',fontSize:230});alarmDisplay.plane.rotation.y=Math.PI;let displayedTime='';motions.push(()=>{const text=new Date().toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit'});if(text===displayedTime)return;displayedTime=text;const {ctx,canvas,texture}=alarmDisplay;ctx.fillStyle='#2a3536';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#c7d1bc';ctx.fillText(text,512,canvas.height/2);texture.needsUpdate=true;});
  const entry=subject(world,'entrance',[-.5,0,8.9],{focus:[0,1.15,0],distance:1.65,minDistance:1,maxDistance:2.2,yaw:Math.PI,arc:.6});box(entry,[1.03,2.3,.05],[0,1.15,0],wood,.014);box(entry,[.04,.27,.07],[-.34,1.08,-.055],chrome,.01);cylinder(entry,.018,.018,.014,[0,1.61,-.041],chrome).rotation.x=Math.PI/2;
  makeSlippers(kit,world);
  const umbrella=subject(world,'umbrella-stand',[-1.26,0,8.65],{focus:[0,.48,0],distance:1,minDistance:.55,maxDistance:1.4,yaw:Math.PI,arc:1});ring(umbrella,.22,.24,.021,.37,[0,.02,0],rubber,.03);for(const x of [-.045,.045]){tube(umbrella,[[x,.07,0],[x,.86,0],[x-.04,.91,0],[x-.07,.85,0]],chrome,.009);cylinder(umbrella,.028,.004,.59,[x,.44,0],x<0?'#71848a':'#9a8b70')}
  return {keyAnchor:drawer,setAction(key,on){const entry=registry.get(key);if(entry&&entry.on!==on){entry.on=on;entry.apply(on)}},register:action,actions(owner){return [...registry.values()].filter(entry=>entry.owner===owner).map(({key,labels,on})=>({key,label:labels[Number(on)]}))},doors(){return Object.fromEntries(Object.keys(HOME_DOORS).map(id=>[id,registry.get(`${id}:open`).on]))},operate(owner,key,player){const entry=registry.get(key);if(!entry||entry.owner!==owner)return null;if(entry.guard&&!entry.guard(!entry.on,player))return '扉の前から少し離れてから閉めよう。';entry.on=!entry.on;entry.apply(entry.on);return entry.messages[Number(entry.on)]},animate(time,dt){streams.forEach((stream,i)=>{stream.scale.x=1+Math.sin(time*14+i)*.1});motions.forEach(update=>update(dt))},reset(){for(const entry of registry.values()){entry.on=false;entry.apply(false)}flush=0},state(){return Object.fromEntries([...registry.values()].map(entry=>[entry.key,entry.on]))}};
}
