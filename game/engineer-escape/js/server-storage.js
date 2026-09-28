import { batchStatic } from './mesh-batching.js';
import * as THREE from 'three';
import { SUPPLY_BOXES } from './supply-search.mjs';
import { CABLES } from './cable-layout.mjs';

export function buildServerStorage(kit,world,domestic) {
  const {group,box,cylinder,tube,label,surface}=kit,contents=[];
  for(const item of SUPPLY_BOXES){
    const root=group(world,item.id,item.position),paper=surface('paper', '#aa8961');
    root.userData.inspection={focus:[0,.18,0],distance:.86,minDistance:.48,maxDistance:1.25,tilt:.65,yaw:0,arc:1.25};
    box(root,[.57,.014,.57],[0,.01,0],paper,.002);
    for(const x of [-.28,.28])box(root,[.012,.34,.57],[x,.18,0],paper,.001);
    for(const z of [-.28,.28])box(root,[.57,.34,.012],[0,.18,z],paper,.001);
    label(root,[item.label],[.20,.085],[0,.18,.287],{background:'#d3c3a5',color:'#4d4b43',fontSize:150,resolution:256});
    for(const x of [-.274,.274])for(let i=0;i<23;i++)box(root,[.002,.006,.002],[x,.355,-.265+i*.024],'#6d5840',0);
    const flaps=[];
    for(const side of [-1,1]){
      const flap=group(root,null,[side*.28,.355,0]);box(flap,[.278,.009,.56],[-side*.139,0,0],paper,.001);flaps.push({flap,side});
    }
    let target=0,angle=0;
    domestic.register(item.id,'open',['箱を開ける','箱を閉じる'],['ふたを閉じた。','ふたを開いた。中を見てみよう。'],on=>{target=on?2.05:0;});
    const inside=group(root);contents.push({root,item,inside,animate(dt){angle+=(target-angle)*Math.min(1,dt*9);flaps.forEach(({flap,side})=>flap.rotation.z=side*angle);}});
    if(['manuals','drives'].includes(item.kind))for(let i=0;i<5;i++)box(inside,[.35,.025,.4],[.015,.045+i*.031,0],item.kind==='drives'?'#66717b':['#d4d0bd','#777d73'][i%2],.003);
    if(item.kind==='fans')for(const x of [-.12,.12]){box(inside,[.21,.026,.21],[x,.05,0],'#263038',.005);const fan=cylinder(inside,.084,.084,.018,[x,.07,0],'#636d71');for(let i=0;i<7;i++){const blade=box(fan,[.075,.008,.018],[.04*Math.sin(i),.012,.04*Math.cos(i)],'#1f292d',.006);blade.rotation.y=i;}}
    if(item.kind==='packing')for(let i=0;i<8;i++){const pack=box(inside,[.21,.055,.16],[Math.sin(i)*.11,.05+Math.floor(i/3)*.065,Math.cos(i)*.12],'#ddd7c4',.022);pack.rotation.y=i;}
    if(item.kind==='rails')for(let i=0;i<4;i++)box(inside,[.43,.013,.035],[0,.042+i*.017,.05],surface('metal','#858c8e'),.002);
    if(['cables','adapters'].includes(item.kind))for(let j=0;j<(item.kind==='cables'?CABLES.length:5);j++){
      const points=Array.from({length:40},(_,i)=>{const a=i/39*Math.PI*4;return [Math.sin(a+j)*(.12+j*.006),.04+j*.024,Math.cos(a*1.15+j)*.19];});tube(inside,points,CABLES[j][2],.004);
      box(inside,[.026,.017,.045],points[0],CABLES[j][0]==='lan'?'#bacac6':'#232c33',.003);
      if(item.kind==='adapters')box(inside,[.095,.038,.15],[j*.07-.14,.11,j%2*.15-.075],'#30383a',.008);
    }
  }
  // 通路を空け、消耗品は棚と壁面の保管場所へまとめる。
  const tools=group(world,'server-tools',[-.24,1.10,-4.82]);
  box(tools,[.76,.46,.025],[0,0,0],surface('metal','#5d6b70'),.008);
  for(let row=0;row<6;row++)for(let col=0;col<12;col++)cylinder(tools,.006,.006,.006,[-.33+col*.06,-.17+row*.065,.018],'#28363d',8).rotation.x=Math.PI/2;
  for(let i=0;i<4;i++){box(tools,[.035,.12,.03],[-.26+i*.105,-.06,.043],i%2?'#7d4c34':'#303f4b',.009);cylinder(tools,.004,.004,.18,[-.26+i*.105,.09,.043],'#a5b1b5',10);}
  const spareTray=group(world,'server-parts',[-.23,.30,-4.53]);box(spareTray,[.73,.12,.43],[0,0,0],'#52636d',.015);
  for(let i=0;i<6;i++)box(spareTray,[.09,.047,.16],[-.28+i*.11,.083,0],'#a6b0ab',.004);
  const bench=group(world,'server-workbench',[-.2,0,-4.39]),steel=surface('metal','#4e5a60'),wood=surface('wood','#a58a66');
  bench.userData.inspection={focus:[0,.92,.03],distance:1.7,minDistance:.9,maxDistance:2.3,tilt:.72,yaw:0,arc:1.1,bounds:{x:[-4.72,.72],y:[.25,2.94],z:[-4.72,-1.28]}};
  box(bench,[1.75,.05,.78],[0,.9,0],wood,.014);
  for(const x of [-.79,.79])for(const z of [-.30,.30]){box(bench,[.045,.86,.045],[x,.44,z],steel,.005);box(bench,[.07,.035,.07],[x,.02,z],'#293137',.006);}
  for(const z of [-.30,.30])box(bench,[1.62,.055,.025],[0,.78,z],steel,.004);
  box(bench,[1.62,.026,.59],[0,.22,0],steel,.004);
  box(bench,[1.28,.009,.61],[-.1,.93,.025],'#354e54',.012);
  // 右端の照明とトレーを避け、ケーブルを広げる作業面を確保する。
  cylinder(bench,.09,.095,.023,[.74,.938,-.24],'#242d34',24);
  tube(bench,[[.74,.95,-.24],[.74,1.30,-.24],[.60,1.55,-.16],[.39,1.55,-.08]],steel,.013);
  box(bench,[.31,.025,.06],[.36,1.53,-.08],'#d6d9ce',.01);
  const lamp=new THREE.PointLight('#e8f0e8',1.6,1.5,2);lamp.position.set(.32,1.49,-.03);bench.add(lamp);
  const bundle=group(bench,null,[-.1,.95,.025]),strands=[];
  CABLES.forEach(([kind,,color],j)=>{
    const strand=group(bundle),points=Array.from({length:48},(_,i)=>{const a=i/47*Math.PI*3.4+j*.62;return [Math.sin(a)*(.31+j*.008),j*.011,Math.cos(a*1.16)*.22];});
    tube(strand,points,color,.004);for(const p of [points[0],points.at(-1)]){box(strand,[.014,.012,kind==='lan'?.03:.023],p,kind==='lan'?'#c5d9ce':'#272c32',.002);}
    strands.push({kind,strand});
  });
  let staged=null,transfer=1;
  const destination=bundle.position.clone(),source=new THREE.Vector3(...SUPPLY_BOXES.find(item=>item.kind==='cables').position).sub(bench.position).add(new THREE.Vector3(0,.18,0));
  batchStatic(bench);
  contents.forEach(entry=>batchStatic(entry.root));batchStatic(tools);batchStatic(spareTray);
  return {animate(dt){
    contents.forEach(entry=>entry.animate(dt));
    if(transfer<1){transfer=Math.min(1,transfer+dt/1.15);const t=transfer*transfer*(3-2*transfer);bundle.position.lerpVectors(source,destination,t);bundle.position.y+=Math.sin(t*Math.PI)*.42;}
  },update(state){
    const target=contents.find(entry=>entry.item.kind==='cables');target.inside.visible=!state.cablesOnBench;
    if(staged===false&&state.cablesOnBench){transfer=0;bundle.position.copy(source);}
    if(!state.cablesOnBench){transfer=1;bundle.position.copy(destination);}
    staged=state.cablesOnBench;bundle.visible=staged;strands.forEach(({kind,strand})=>{strand.visible=kind!=='lan'||!state.spareTaken;});
  }};
}
