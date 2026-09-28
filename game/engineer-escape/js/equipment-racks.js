import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { hasLink } from './state.mjs';

export const ROUTER_POSITION=[.75,.858,-4.18];
export const ROUTER_PORT=[.703,.858,-4.274];

export function buildEquipmentRacks(kit,world,upper) {
  const {group,box,cylinder,tube,label,surface,sphere}=kit;
  const black=surface('metal','#242c32'),steel=surface('metal','#747f86'),leds=[];
  function rack(parent,id,position,height,depth,rotation=0) {
    const frame=group(parent,id,position);frame.rotation.y=rotation;
    box(frame,[.6,.05,depth],[0,.055,0],black,.009);box(frame,[.6,.03,depth],[0,height,0],black,.008);
    for(const x of [-.276,.276])for(const z of [-depth/2+.027,depth/2-.027])box(frame,[.032,height-.04,.035],[x,height/2,z],black,.004);
    for(const x of [-.236,.236]){
      box(frame,[.026,height-.12,.02],[x,height/2,depth/2-.06],steel,.003);
      for(let y=.13;y<height-.07;y+=.04445)for(const dy of [-.013,0,.013])box(frame,[.009,.007,.003],[x,y+dy,depth/2-.048],'#131a1f',0);
    }
    for(const x of [-.265,.265])for(const z of [-depth/2+.055,depth/2-.055])cylinder(frame,.015,.021,.045,[x,.024,z],black,12);
    return frame;
  }
  function appliance(parent,y,height,title,drives=0) {
    const unit=group(parent,null,[0,y,0]);
    box(unit,[.445,height,.53],[0,0,-.025],black,.006);box(unit,[.483,height,.016],[0,0,.247],steel,.003);
    for(const x of [-.231,.231])for(const dy of [-height*.28,height*.28]){const screw=cylinder(unit,.003,.003,.002,[x,dy,.258],'#263039',8);screw.rotation.x=Math.PI/2;}
    if(drives)for(let i=0;i<drives;i++){
      const x=-.177+i*.073;box(unit,[.067,height*.7,.012],[x,0,.26],'#303b44',.003);
      box(unit,[.051,.008,.009],[x,-height*.19,.27],'#929ca1',.002);
      for(let k=0;k<4;k++)box(unit,[.042,.002,.002],[x,height*.2-k*.006,.268],'#111b22',0);
      leds.push(sphere(unit,[.0018,.0018,.001],[x+.023,-height*.2,.278],'#69b9a2'));
    }
    else for(let i=0;i<20;i++)box(unit,[.004,height*.57,.003],[-.11+i*.012,0,.257],'#253039',.001);
    label(unit,[title],[.095,.018],[-.164,height*.2,.26],{background:'#747f86',color:'#1b252a',fontSize:150,resolution:256});
    leds.push(sphere(unit,[.0027,.0027,.001],[-.204,-height*.2,.26],'#75c3ac'));
    return unit;
  }
  function patch(parent,y,id) {
    const panel=group(parent,id,[0,y,.255]);box(panel,[.483,.044,.04],[0,0,0],black,.003);
    box(parent,[.445,.044,.25],[0,y-.20,.11],black,.004);
    box(parent,[.483,.044,.018],[0,y-.20,.255],steel,.003);
    for(let i=0;i<12;i++){
      const x=-.206+i*.0375;box(panel,[.017,.015,.004],[x,0,.024],steel,.001);box(panel,[.013,.011,.004],[x,0,.027],'#0e171e',.001);
      box(parent,[.017,.015,.005],[x,y-.20,.268],black,.001);
      if(i<8){box(panel,[.011,.008,.017],[x,0,.039],i%3?'#638b9c':'#ac9973',.001);
        box(parent,[.011,.008,.017],[x,y-.20,.281],i%3?'#638b9c':'#ac9973',.001);
        tube(parent,[[x,y,.305],[x,y-.045,.351],[x,y-.14,.351],[x,y-.20,.294]],i%3?'#638b9c':'#ac9973',.0025);}
    }
    box(parent,[.46,.033,.06],[0,y-.07,.263],black,.004);
    return panel;
  }
  // 居室の小型ラック。ルーターと保存装置を棚板に載せる。
  const network=rack(upper,'network-rack',[.75,0,-4.22],.97,.64);
  for(const y of [.13,.51,.80])box(network,[.49,.016,.53],[0,y,-.016],black,.004);
  appliance(network,.20,.088,'保存装置',4);
  const modem=group(upper,'modem',ROUTER_POSITION);
  box(modem,[.24,.065,.18],[0,0,0],'#c3cbcc',.009);
  for(const x of [-.086,.086])for(const z of [-.061,.061])box(modem,[.018,.017,.018],[x,-.0415,z],'#303b40',.003);
  box(modem,[.231,.039,.005],[0,-.005,.092],'#46535c',.004);
  const routerLeds=[];
  for(let i=0;i<4;i++)routerLeds.push(sphere(modem,[.0028,.0028,.0015],[-.081+i*.024,-.002,.096],'#7ac8a2'));
  for(let i=0;i<14;i++)box(modem,[.003,.001,.055],[-.089+i*.013,.033,0],'#67767c',.0004);
  for(const x of [-.094,-.047,0,.047]){box(modem,[.019,.016,.006],[x,0,-.091],steel,.001);box(modem,[.013,.011,.005],[x,0,-.095],'#121d25',.001);}
  const modemSwitch=group(modem,'modem-switch');box(modemSwitch,[.025,.027,.018],[.087,-.002,-.096],black,.003);
  const switchMesh=box(modemSwitch,[.012,.017,.004],[.087,-.002,-.107],'#889994',.002);
  // 一階の ONU から壁内 Ethernet を経由し、WAN ポートへ接続する。
  tube(upper,[[.31,.33,-4.79],[.31,.33,-4.70],[.42,.55,-4.65],[.58,.86,-4.49],[.656,.858,-4.28]],'#ae9975',.003);
  box(upper,[.034,.052,.03],[.31,.33,-4.786],'#d5d4c9',.003);
  for(const y of [.2,.4,.6]){box(network,[.017,.022,.027],[.248,y,-.267],'#63686b',.003);}
  tube(network,[[.105,.826,-.066],[.22,.80,-.26],[.245,.62,-.266],[.245,.29,-.266],[.2,.14,-.25]],'#2c353b',.003);
  network.userData.inspection={focus:[0,.52,0],distance:1.15,minDistance:.7,maxDistance:1.5,tilt:.1};
  modem.userData.inspection={focus:[0,0,0],distance:.48,minDistance:.22,maxDistance:.68,yaw:0,arc:Math.PI,tilt:.28};

  // 19 インチ機器と短いパッチコードを実寸で配置する。
  const server=rack(world,'rack',[-4.33,0,-3.98],1.99,.88,Math.PI/2);
  const storage=rack(world,'rack-storage',[-4.33,0,-2.56],1.99,.88,Math.PI/2);
  for(const [index,frame] of [server,storage].entries()){
    for(const [y,h,name,drives] of [[.29,.178,'無停電電源',0],[.56,.088,'保存装置',6],[.78,.088,'検証機',4],[1.01,.044,'管理装置',0],[1.40,.044,'スイッチ',0]])appliance(frame,y,h,name,drives);
    patch(frame,1.60,index===0?'patchpanel':undefined);
    for(const y of [1.16,1.25,1.81])box(frame,[.483,.044,.018],[0,y,.25],black,.003);
    // 配線は背面の縦マネージャーから天井ラックへまとめる。
    box(frame,[.042,1.78,.045],[.25,.98,-.395],black,.004);
    for(let i=0;i<5;i++)tube(frame,[[.245,1.54,-.38],[.245,1.80,-.38],[.245,2.07,-.34],[.11,2.22,-.29]],i%2?'#7191a0':'#606f7a',.003);
    for(const x of [-.275,.275])box(frame,[.008,1.82,.73],[x,1.04,-.025],new THREE.MeshStandardMaterial({color:'#33414b',roughness:.6,transparent:true,opacity:.17,depthWrite:false}),.003);
  }
  const ups=group(server,'ups');label(ups,['100 %'],[.085,.038],[.117,.29,.272],{background:'#11222b',color:'#88c2c5',fontSize:180,resolution:256});
  const roomDetails=group(world,'server-services');
  for(const x of [-4.75,-4.32])box(roomDetails,[.025,.06,3.35],[x,2.38,-3.02],steel,.003);
  for(let z=-4.6;z<-1.4;z+=.18)box(roomDetails,[.46,.018,.025],[-4.535,2.355,z],steel,.002);
  for(let i=0;i<6;i++)tube(roomDetails,[[-4.45+i*.019,2.405,-4.55],[-4.45+i*.019,2.405,-3.3],[-4.45+i*.019,2.405,-1.58]],'#626f7c',.003);
  const wan=group(world,'server-wan',[-.24,1.83,-4.83]);
  box(wan,[.77,.79,.035],[0,0,0],'#67797c',.009);
  box(wan,[.12,.17,.062],[-.25,.14,.049],'#d8d9ce',.008);
  label(wan,['光回線'],[.088,.032],[-.25,.17,.082],{fontSize:225,resolution:128});
  box(wan,[.21,.27,.10],[.065,.08,.084],'#bdcbc8',.016);
  box(wan,[.21,.012,.009],[.065,-.012,.14],'#435b63',.002);
  for(let i=0;i<4;i++)sphere(wan,[.003,.003,.002],[.016+i*.03,.15,.137],'#80c9ad');
  tube(wan,[[-.25,.08,.083],[-.25,-.08,.10],[-.14,-.14,.12],[.045,-.072,.12]],'#ded3b8',.002);
  label(wan,['ONU'],[.068,.032],[.065,.22,.14],{fontSize:255,resolution:128});
  box(wan,[.64,.082,.06],[0,-.29,.054],'#314751',.005);
  for(let i=0;i<5;i++){box(wan,[.026,.024,.006],[-.24+i*.10,-.29,.087],'#8faaa8',.002);box(wan,[.017,.016,.01],[-.24+i*.10,-.29,.093],'#172e3a',.001);}
  tube(wan,[[.075,-.065,.14],[.15,-.18,.18],[-.24,-.29,.117]],'#ac9570',.003);
  tube(world,[[-.38,1.54,-4.72],[.31,1.54,-4.72],[.31,2.8,-4.78],[.31,3.15,-4.83]],'#7194a6',.003);
  tube(world,[[-.28,1.54,-4.72],[-.5,1.62,-4.67],[-.6,2.48,-4.67],[-4.45,2.405,-4.55]],'#698695',.003);
  wan.userData.inspection={focus:[0,0,.07],distance:1.05,minDistance:.6,maxDistance:1.5,tilt:.1};
  const sensor=group(world,'server-sensor',[.825,1.54,-2.08]);box(sensor,[.055,.13,.105],[0,0,0],'#bac4c6',.009);
  const reading=label(sensor,['22.3 ℃','42 %'],[.076,.063],[-.03,.007,0],{background:'#405961',color:'#cee5dd',fontSize:175,resolution:256});reading.plane.rotation.y=-Math.PI/2;
  // 動かないねじ・レール・通気孔は材質ごとにまとめ、調査対象の ID は保持する。
  const moving=new Set([...leds,...routerLeds,switchMesh]);
  for(const root of [network,modem,server,storage,roomDetails,wan]){
    root.updateWorldMatrix(true,true);const batches=new Map(),originals=[];
    root.traverse(object=>{
      if(!object.isMesh||moving.has(object)||object.material.transparent)return;
      let owner=object.parent;while(owner!==root&&!owner.userData.id)owner=owner.parent;
      const key=`${owner.uuid}:${object.material.uuid}`;
      if(!batches.has(key))batches.set(key,{owner,material:object.material,geometries:[]});
      const matrix=new THREE.Matrix4().copy(owner.matrixWorld).invert().multiply(object.matrixWorld);
      batches.get(key).geometries.push((object.geometry.index?object.geometry.toNonIndexed():object.geometry.clone()).applyMatrix4(matrix));originals.push(object);
    });
    for(const batch of batches.values()){
      const geometry=mergeGeometries(batch.geometries,false),mesh=new THREE.Mesh(geometry,batch.material);
      mesh.castShadow=true;mesh.receiveShadow=true;batch.owner.add(mesh);batch.geometries.forEach(part=>part.dispose());
    }
    originals.forEach(object=>object.removeFromParent());
  }
  let lastTemperature;
  return {modem,switchMesh,temperature(value){if(lastTemperature===value)return;lastTemperature=value;const {ctx,texture}=reading;ctx.fillStyle='#405961';ctx.fillRect(0,0,1024,849);ctx.fillStyle='#cee5dd';ctx.fillText(`${(value+.3).toFixed(1)} ℃`,512,280);ctx.fillText('42 %',512,570);texture.needsUpdate=true;},update(state){
    routerLeds.forEach((led,i)=>{led.material=kit.material(state.circuits.living&&state.modemOn&&(i!==3||hasLink(state))?'#8ad7b4':'#33484c',state.circuits.living&&state.modemOn?.35:0);});
    leds.forEach(led=>{led.material=kit.material(state.circuits.equipment?'#7bb8a8':'#34454d',state.circuits.equipment?.2:0);});
  }};
}
