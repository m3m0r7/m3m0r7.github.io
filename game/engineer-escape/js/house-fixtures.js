import * as THREE from 'three';
import { makePainting } from './architecture.js';
export function buildHouseFixtures(kit,world,upper,domestic) {
  const {group,box,cylinder,sphere,tube,label,surface,material}=kit,metal=surface('metal','#aab4b8'),oak=surface('wood','#ab906d');
  // 分電盤の背後は天井までの設備収納。通れない厚みを衝突判定にも定義する。
  const utility=group(world,'utility-storage',[1.96,0,-4.42]);
  utility.userData.inspection={focus:[0,.65,.3],distance:1.5,minDistance:.8,maxDistance:2.2,yaw:0,arc:.8,tilt:.2};
  box(utility,[1.82,1.98,1.16],[0,2.19,0],surface('plaster','#b5b1a7'),.008);
  for(const x of [-.89,.89])box(utility,[.04,1.2,1.16],[x,.6,0],oak,.006);box(utility,[1.78,1.2,.04],[0,.6,-.56],oak,.006);for(const y of [.055,.57,1.18])box(utility,[1.78,.035,1.1],[0,y,0],oak,.005);
  const cupboardDoors=[];for(const side of [-1,1]){const hinge=group(utility,null,[side*.885,.62,.597]);box(hinge,[.87,1.13,.033],[-side*.435,0,0],oak,.008);box(hinge,[.025,.17,.03],[-side*.75,0,.027],metal,.003);hinge.userData.action='utility-storage:doors';cupboardDoors.push(hinge)}
  for(let i=0;i<4;i++){box(utility,[.34,.37,.46],[-.64+i*.42,.25,.04],i%2?'#c9baa0':'#a0aba6',.013);cylinder(utility,.08,.09,.28,[-.65+i*.43,.73,.04],i%2?'#a5b0a3':'#d5cbb7')}
  domestic.register('utility-storage','doors',['収納扉を開く','収納扉を閉じる'],['設備収納を閉じた。','掃除道具、替えのフィルター、工具の箱。奥は壁で仕切られている。'],on=>cupboardDoors.forEach((door,i)=>{door.rotation.y=on?(i?1:-1)*1.15:0}));
  const breaker=group(world,'breaker',[1.94,1.98,-3.80]);breaker.userData.inspection={focus:[0,0,0],distance:1.05,minDistance:.65,maxDistance:1.5,yaw:0,arc:.8,tilt:.06};
  box(breaker,[.79,.68,.11],[0,0,0],'#d6d9d3',.024);box(breaker,[.7,.43,.012],[0,-.025,.062],'#404c4e',.008);label(breaker,['分電盤'],[.36,.065],[0,.247,.065],{background:'#d6d9d3',color:'#3c4949',fontSize:100});
  const switches={};for(const [i,[id,name]] of [['living','居室'],['kitchen','水回り'],['equipment','機材室']].entries()){
    const x=(i-1)*.224;box(breaker,[.18,.24,.018],[x,-.032,.078],'#9ca9a6',.01);
    const lever=group(breaker,null,[x,-.034,.103]);box(lever,[.085,.081,.055],[0,.013,0],'#e0e1d7',.006);lever.userData.action=`breaker:${id}`;switches[id]=lever;
    label(breaker,[name],[.18,.05],[x,-.234,.064],{background:'#d6d9d3',color:'#3c4949',fontSize:90});
    label(breaker,['入'],[.041,.034],[x+.059,.074,.103],{background:'#9ca9a6',color:'#263f30',fontSize:110});label(breaker,['切'],[.041,.034],[x+.059,-.13,.103],{background:'#9ca9a6',color:'#3c4949',fontSize:110});
  }
  for(const x of [-.347,.347])for(const y of [-.28,.28])cylinder(breaker,.012,.012,.009,[x,y,.06],metal).rotation.x=Math.PI/2;
  // 段ボールは開く四枚のふたと、ずれた紙束で構成する。
  const delivery=group(world,'delivery',[2.27,0,-2.3]);delivery.userData.inspection={focus:[0,.37,0],distance:1,minDistance:.6,maxDistance:1.6,yaw:Math.PI,arc:1.4,tilt:.65};
  const card=surface('linen','#a98b61');for(const x of [-.31,.31])box(delivery,[.012,.52,.62],[x,.27,0],card,.003);for(const z of [-.31,.31])box(delivery,[.62,.52,.012],[0,.27,z],card,.003);box(delivery,[.61,.017,.61],[0,.017,0],card,.003);
  const flaps=[];for(const side of [-1,1]){const flap=group(delivery,null,[side*.316,.53,0]);box(flap,[.315,.008,.62],[-side*.157,0,0],card,.002);flap.userData.action='delivery:open';flaps.push({object:flap,side,axis:'z'});const end=group(delivery,null,[0,.527,side*.316]);box(end,[.6,.008,.24],[0,0,-side*.12],card,.002);end.userData.action='delivery:open';flaps.push({object:end,side:-side,axis:'x'});}
  for(let i=0;i<14;i++){const paper=box(delivery,[.40,.006,.51],[Math.sin(i*1.8)*.033,.31+i*.012,Math.cos(i*2)*.028],i%4===0?'#c3b492':'#e5dfcf',.001);paper.rotation.y=Math.sin(i)*.085;}
  const top=label(delivery,['業務委託基本契約書','ねこねこコーポレーション'],[.33,.4],[.01,.476,0],{background:'#e5dfcf',color:'#655f53',fontSize:60});top.plane.rotation.x=-Math.PI/2;
  domestic.register('delivery','open',['段ボールを開く','段ボールを閉じる'],['段ボールを閉じた。','契約書や明細が何枚も重なっている。'],on=>flaps.forEach(({object,side,axis})=>{object.rotation[axis]=on?side*1.9:0}));
  // 時計は階段との間仕切り壁の居室側。現在のローカル時刻を秒針まで反映する。
  const clock=group(upper,'clock',[2.85,2.32,-1.62]);clock.rotation.y=-Math.PI/2;clock.userData.remoteInspect=true;clock.userData.inspection={focus:[0,0,0],distance:1.1,minDistance:.5,maxDistance:1.6,yaw:-Math.PI/2,arc:.6,tilt:0};
  const rim=cylinder(clock,.31,.31,.062,[0,0,0],oak,64);rim.rotation.x=Math.PI/2;const face=cylinder(clock,.281,.281,.005,[0,0,.033],'#e6e3d8',64);face.rotation.x=Math.PI/2;
  for(let i=0;i<60;i++){const a=i*Math.PI/30,mark=box(clock,[i%5===0?.011:.004,i%5===0?.032:.013,.003],[Math.sin(a)*.254,Math.cos(a)*.254,.041],'#3f4948',0);mark.rotation.z=-a;}
  for(const [n,x,y] of [['12',0,.195],['3',.195,0],['6',0,-.195],['9',-.195,0]]){const mark=label(clock,[n],[.055,.043],[x,y,.044],{fontSize:600});mark.ctx.clearRect(0,0,mark.canvas.width,mark.canvas.height);mark.ctx.fillStyle='#3f4948';mark.ctx.fillText(n,512,mark.canvas.height/2);mark.plane.material.transparent=true;mark.texture.needsUpdate=true;}
  const hands=[group(clock),group(clock),group(clock)];hands.forEach((hand,i)=>{box(hand,[[.017,.143,.008],[.011,.207,.008],[.004,.236,.005]][i],[0,[.053,.084,.092][i],.054+i*.008],i===2?'#a85742':'#354341',.001)});sphere(clock,[.018,.018,.01],[0,0,.081],'#b69b63');
  let clockTime='';function animate(){const now=new Date(),seconds=now.getSeconds()+now.getMilliseconds()/1000,minutes=now.getMinutes()+seconds/60;hands[0].rotation.z=-(now.getHours()%12+minutes/60)*Math.PI/6;hands[1].rotation.z=-minutes*Math.PI/30;hands[2].rotation.z=-seconds*Math.PI/30;clockTime=now.toLocaleTimeString('ja-JP');}
  const fountain=group(upper,'cat-fountain',[-1.62,0,4.45]);fountain.userData.inspection={focus:[0,.2,0],distance:.75,minDistance:.4,maxDistance:1.1,yaw:Math.PI/2,arc:1.1,tilt:.65};
  cylinder(fountain,.205,.225,.18,[0,.10,0],'#d7dddb',48);cylinder(fountain,.18,.18,.014,[0,.2,0],metal,48);cylinder(fountain,.033,.034,.11,[0,.249,0],'#bfcac9');const stream=cylinder(fountain,.012,.014,.028,[0,.311,0],new THREE.MeshPhysicalMaterial({color:'#8ec3cf',transparent:true,opacity:.6,roughness:.1}));const water=cylinder(fountain,.167,.167,.005,[0,.217,0],new THREE.MeshPhysicalMaterial({color:'#a3cbd0',transparent:true,opacity:.42,roughness:.07}));tube(fountain,[[0,.03,-.19],[-.21,.029,-.19],[-.35,.06,-.19]],'#6f7772',.006);
  domestic.register('cat-fountain','pump',['ポンプを止める','ポンプを動かす'],['小さな水流が戻った。','ポンプを止めた。水面が静かになった。'],off=>{stream.visible=!off;water.material.opacity=off?.22:.42});
  for(const [image,z] of [['2.jpg',7.68],['6.jpg',6.13]]){const portrait=makePainting(kit,world,{position:[-1.51,1.91,z],rotation:Math.PI/2,image:`../../../assets/cats/${image}`,width:.86,height:.86});portrait.userData.id='cat-portraits';portrait.userData.inspection={worldFocus:[-1.51,1.91,6.90],distance:2.6,minDistance:1,maxDistance:3.2,yaw:Math.PI/2,arc:.55,tilt:0};}
  const serverPC=group(world,'server-pc',[.06,0,-4.38]);serverPC.userData.inspection={focus:[0,.62,0],distance:1.35,minDistance:.75,maxDistance:1.8,yaw:0,arc:.85,tilt:.25};
  box(serverPC,[.68,.94,.74],[0,.49,0],'#343c40',.024);box(serverPC,[.59,.79,.012],[0,.49,.381],'#232d32',.007);for(let i=0;i<12;i++)box(serverPC,[.45,.012,.015],[0,.2+i*.038,.392],'#515e62',.002);
  const serverLED=sphere(serverPC,[.014,.014,.007],[.21,.84,.401],'#82bfb4');tube(serverPC,[[.18,.14,-.35],[.36,.025,-.36],[.36,.04,-.5]],'#4c5354',.013);
  function update(state){serverLED.material=material(state.circuits.equipment?'#82bfb4':'#37403e',state.circuits.equipment?.9:0);for(const id of Object.keys(switches))switches[id].rotation.x=state.circuits[id]?-.38:.38;domestic.setAction('delivery:open',state.boxOpen);}
  return {update,animate,time:()=>clockTime};
}
