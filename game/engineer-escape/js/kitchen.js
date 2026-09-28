import * as THREE from 'three';
import { stockFridge } from './fridge-food.js';
export function buildKitchen(kit,world,{subject,action,ring,faucet,flow,zones}) {
  const {box,group,cylinder,tube,sphere,surface,label,mesh}=kit,wood=surface('wood','#866f56'),stone=surface('stone','#d1cec2'),silver=surface('metal','#b8bfc2'),dark=kit.material('#263034'),white=kit.material('#e6e6dd'),bounds=zones.kitchen;
  function cup(parent,x,y,z,color='#b4bdb2'){
    mesh(parent,new THREE.LatheGeometry([[.032,0],[.042,.01],[.046,.095],[.043,.103],[.038,.096],[.035,.017],[0,.017]].map(p=>new THREE.Vector2(...p)),24),color,[x,y,z]);
    tube(parent,[[x+.04,y+.075,z],[x+.073,y+.081,z],[x+.077,y+.032,z],[x+.042,y+.025,z]],color,.006);
  }
  function plate(parent,x,y,z,r=.115){mesh(parent,new THREE.LatheGeometry([[0,0],[r*.50,0],[r*.51,.003],[r*.80,.007],[r,.018],[r,.022],[r*.96,.022],[r*.76,.011],[r*.49,.006],[0,.006]].map(p=>new THREE.Vector2(...p)),36),white,[x,y,z]);}
  function bowl(parent,x,y,z,r=.10,color=white){
    mesh(parent,new THREE.LatheGeometry([[.03,0],[r*.68,.015],[r,.085],[r*.97,.096],[r*.9,.093],[r*.60,.024],[0,.021]].map(p=>new THREE.Vector2(...p)),32),color,[x,y,z]);
  }
  function pot(parent,x,y,z,r=.13,height=.15,lid=true){
    const root=group(parent,null,[x,y,z]);
    mesh(root,new THREE.LatheGeometry([[0,0],[r*.82,0],[r,.025],[r,height],[r-.008,height],[r-.012,.018],[0,.018]].map(p=>new THREE.Vector2(...p)),32),silver,[0,0,0]);
    for(const side of [-1,1])tube(root,[[side*r,height*.72,0],[side*(r+.055),height*.72,-.015],[side*(r+.065),height*.5,-.015],[side*r,height*.5,0]],dark,.011);
    if(lid){cylinder(root,r+.005,r,.012,[0,height+.006,0],silver,32);tube(root,[[-.032,height+.016,0],[-.03,height+.048,0],[.03,height+.048,0],[.032,height+.016,0]],dark,.009);}
    return root;
  }
  function pan(parent,x,y,z,angle=0){
    const root=group(parent,null,[x,y,z]);root.rotation.y=angle;
    mesh(root,new THREE.LatheGeometry([[0,0],[.115,0],[.151,.042],[.149,.051],[.14,.045],[.108,.009],[0,.009]].map(p=>new THREE.Vector2(...p)),36),dark,[0,0,0]);
    box(root,[.055,.015,.055],[.148,.03,0],silver,.005);box(root,[.19,.03,.037],[.255,.032,0],dark,.015);
    return root;
  }
  const island=subject(world,'kitchen-island',[1.7,0,6.4],{focus:[0,.69,0],distance:2.3,minDistance:1.25,maxDistance:3,yaw:Math.PI,arc:Math.PI,tilt:.42,bounds});
  // キャビネットは中空。側板、背板、仕切りと、実際に動く引き出しを別々に組む。
  for(const x of [-1.1,-.35,.38,1.1])box(island,[.035,.78,1.02],[x,.445,0],wood,.008);
  for(const y of [.08])box(island,[2.24,.035,1.02],[0,y,0],wood,.008);
  box(island,[2.21,.74,.025],[0,.45,.495],wood,.006);box(island,[2.13,.1,.91],[0,.065,0],dark,.01);
  for(const [x,w] of [[-.735,.69],[.015,.69],[.75,.66]]){
    const drawer=group(island,null,[x,.53,-.528]);drawer.userData.action=`kitchen-island:drawer${x}`;
    box(drawer,[w,.54,.028],[0,0,0],wood,.009);box(drawer,[.27,.015,.025],[0,.21,-.026],silver,.003);
    box(drawer,[w-.055,.025,.69],[0,-.247,.35],wood,.004);for(const side of [-1,1])box(drawer,[.016,.28,.68],[side*(w/2-.035),-.095,.35],wood,.003);box(drawer,[w-.055,.28,.02],[0,-.095,.68],wood,.003);
    if(x<0){for(let i=0;i<6;i++){box(drawer,[.06,.018,.21],[-.23+i*.085,-.215,.32],silver,.006);cylinder(drawer,.022,.022,.012,[-.23+i*.085,-.204,.2],silver)}}else{for(let i=0;i<5;i++)plate(drawer,0,-.21+i*.015,.33,x>.1?.16:.12)}
    action('kitchen-island',`drawer${x}`,[`${x<0?'左':x>.1?'右':'中央'}の収納を引き出す`,`${x<0?'左':x>.1?'右':'中央'}の収納を閉じる`],['引き出しを閉めた。',x<0?'カトラリーが種類ごとに並んでいる。':'大きさをそろえた皿が重なっている。'],on=>{drawer.position.z=on?-1.12:-.528});
  }
  // 天板の四辺でシンクの穴を作り、底を塞がない。
  const sx=-.64,sw=.76,sd=.57;
  box(island,[.20,.055,1.15],[-1.1,.88,0],stone,.01);box(island,[1.54,.055,1.15],[.43,.88,0],stone,.01);
  for(const z of [-.44,.44])box(island,[sw,.055,.27],[sx,.88,z],stone,.008);
  const sink=subject(island,'kitchen-sink',[sx,0,0],{focus:[0,.94,0],distance:1.25,minDistance:.55,maxDistance:1.7,yaw:Math.PI,arc:1.3,tilt:.8,bounds});
  ring(sink,sw,sd,.034,.14,[0,.738,0],silver,.085);box(sink,[sw-.09,.016,sd-.085],[0,.736,0],silver,.04);cylinder(sink,.024,.024,.006,[.18,.748,0],dark);
  faucet(sink,[0,1.21,.02]);flow(sink,[0,1.21,.02],.45,'kitchen-sink','water');tube(sink,[[0,.73,0],[0,.3,0],[0,.25,.18]],silver,.023);
  box(sink,[.11,.045,.065],[.49,.927,-.25],'#b5b89e',.012);cylinder(sink,.035,.036,.13,[.49,.972,-.38],'#a7b9a6');tube(sink,[[.49,1.04,-.38],[.49,1.08,-.38],[.44,1.08,-.38]],dark,.011);
  const board=box(island,[.45,.018,.34],[.22,.921,.05],surface('wood','#c5a16d'),.035);board.rotation.y=.08;
  box(island,[.26,.016,.035],[.28,.94,.06],silver,.006);box(island,[.11,.024,.042],[.45,.945,.06],wood,.009);cup(island,.83,.912,-.3);cup(island,.99,.912,-.28,'#7f9393');
  // 食洗機は島の反対側。前扉を倒すと二段のラックが見える。
  const dishwasher=subject(island,'dishwasher',[.64,0,.537],{focus:[0,.44,0],distance:1.1,minDistance:.65,maxDistance:1.6,yaw:0,arc:1,tilt:.55,bounds});
  box(dishwasher,[.76,.74,.014],[0,.46,-.04],dark,.005);const dwDoor=group(dishwasher,null,[0,.105,0]);box(dwDoor,[.73,.70,.04],[0,.35,0],silver,.012);box(dwDoor,[.53,.021,.027],[0,.65,.03],dark,.005);dwDoor.userData.action='dishwasher:door';
  const racks=group(dishwasher,null,[0,.12,-.22]);for(const y of [.05,.35]){for(let i=0;i<10;i++)tube(racks,[[-.30+i*.067,y,-.12],[-.30+i*.067,y,.25]],silver,.004);for(let i=0;i<7;i++)tube(racks,[[-.3,y,-.12+i*.06],[.3,y,-.12+i*.06]],silver,.004)}
  for(let i=0;i<6;i++){const dish=cylinder(racks,.11,.11,.009,[-.24+i*.09,.2,.02],white);dish.rotation.z=Math.PI/2;}for(let i=0;i<4;i++)cup(racks,-.22+i*.14,.47,0);
  action('dishwasher','door',['食洗機を開く','食洗機を閉じる'],['食洗機を閉めた。','洗い終わった皿とグラス。上下のラックを手前へ引き出した。'],on=>{dwDoor.rotation.x=on?Math.PI*.48:0;racks.position.z=on?.36:-.22});
  const rear=subject(world,'kitchen-storage',[1.48,0,8.58],{focus:[0,1,0],distance:2,minDistance:.9,maxDistance:2.7,yaw:Math.PI,arc:.9,tilt:.25,bounds});rear.rotation.y=Math.PI;
  for(const x of [-1.32,0,1.32])box(rear,[.045,.79,.72],[x,.44,0],wood,.01);for(const y of [.075,.85])box(rear,[2.68,.045,.74],[0,y,0],wood,.01);box(rear,[2.68,.05,.79],[0,.89,0],stone,.012);box(rear,[2.62,.74,.025],[0,.46,-.35],wood,.004);
  const cabinetDoors=[];for(let i=0;i<4;i++){const x=-1.3+i*.66,hinge=group(rear,null,[x,.47,.385]);box(hinge,[.64,.71,.025],[.32,0,0],wood,.006);box(hinge,[.028,.16,.024],[.56,.12,.021],silver,.003);cabinetDoors.push(hinge);hinge.userData.action='kitchen-storage:doors';}
  pot(rear,-1.02,.105,0,.14,.20);pot(rear,-.57,.105,.015,.11,.12);pan(rear,.40,.106,0,Math.PI*.45);
  for(let i=0;i<3;i++){box(rear,[.27,.08,.21],[.93,.145+i*.087,0],'#c4c9bd',.015);box(rear,[.28,.012,.22],[.93,.191+i*.087,0],'#748c85',.012);}
  action('kitchen-storage','doors',['背面収納を開く','背面収納を閉じる'],['背面収納を閉めた。','鍋、保存容器、調理器具。奥の配管スペースも乾いている。'],on=>cabinetDoors.forEach(door=>{door.rotation.y=on?-1.15:0}));
  const stove=subject(rear,'stove',[.35,.94,.03],{focus:[0,0,0],distance:.95,minDistance:.6,maxDistance:1.4,yaw:Math.PI,tilt:.65,bounds});box(stove,[.78,.024,.54],[0,0,0],dark,.016);for(const x of [-.2,.2]){const coil=new THREE.Mesh(new THREE.TorusGeometry(.115,.003,6,48),silver);coil.rotation.x=Math.PI/2;coil.position.set(x,.016,-.035);stove.add(coil)}const led=sphere(stove,[.006,.002,.006],[.3,.016,.21],'#663731');action('stove','power',['表示を入れる','表示を消す'],['コンロの表示を消した。','コンロの表示が点いた。フライパンが一枚載っている。加熱はしていない。'],on=>{led.material=kit.material(on?'#df8958':'#663731',on?1:0)});
  pan(stove,-.2,.017,-.035,Math.PI*.7);
  const kettle=subject(rear,'kettle',[-.94,.92,.03],{focus:[0,.16,0],distance:.6,minDistance:.35,maxDistance:1,yaw:Math.PI,bounds});cylinder(kettle,.085,.11,.2,[0,.11,0],silver);tube(kettle,[[.08,.12,0],[.14,.21,0],[.18,.24,0]],silver,.022);tube(kettle,[[-.08,.17,0],[-.16,.23,0],[-.17,.05,0],[-.08,.04,0]],dark,.016);
  const cups=subject(rear,'kitchen-cups',[-.44,1.5,-.08],{focus:[0,.25,0],distance:1.2,minDistance:.7,maxDistance:1.6,yaw:Math.PI,arc:.8,bounds});
  for(const y of [0,.35,.7])box(cups,[1.72,.032,.3],[0,y,0],wood,.008);for(const x of [-.85,.85])box(cups,[.032,.73,.3],[x,.35,0],wood,.006);
  for(let i=0;i<3;i++)cup(cups,-.65+i*.20,.022,.025,['#b4bdb2','#708a8b','#d4c3a1'][i]);
  for(let i=0;i<5;i++)plate(cups,.34,.024+i*.014,0,.14);
  for(let i=0;i<3;i++){bowl(cups,-.59,.374+i*.033,0,.105);bowl(cups,-.27,.374+i*.029,0,.08,'#78918b');}
  for(let i=0;i<4;i++)plate(cups,.17,.377+i*.013,0,.10);
  const platter=group(cups,null,[.60,.377,0]);platter.scale.set(.85,1,1);plate(platter,0,0,0,.15);
  pot(cups,-.55,.724,0,.13,.15);pot(cups,-.12,.724,0,.095,.11);
  for(const x of [.32,.59]){cylinder(cups,.082,.08,.18,[x,.81,0],'#c0b29b',24);cylinder(cups,.084,.084,.017,[x,.91,0],wood,24);}

  // 幅 1.3 m の観音開き冷蔵庫。上下の冷凍・野菜室も引き出せる。
  const fridge=subject(world,'fridge',[3.79,0,8.54],{focus:[0,1,0],distance:2.05,minDistance:1,maxDistance:2.65,yaw:Math.PI,arc:1.1,tilt:.12,bounds});fridge.rotation.y=Math.PI;
  for(const x of [-.63,.63])box(fridge,[.055,1.92,.75],[x,1,0],silver,.025);for(const y of [.065,1.96])box(fridge,[1.3,.055,.75],[0,y,0],silver,.025);box(fridge,[1.2,1.8,.045],[0,1,-.35],white,.009);
  for(const y of [.74,1.02,1.31,1.61])box(fridge,[1.18,.013,.6],[0,y,-.01],white,.003);box(fridge,[.025,1.24,.59],[0,1.34,0],white,.003);
  const coldLight=new THREE.PointLight('#eef4ff',1,1.2,2);coldLight.position.set(0,1.82,.16);fridge.add(coldLight);
  const fridgeDoors=[];for(const side of [-1,1]){const hinge=group(fridge,null,[side*.65,1.35,.40]);box(hinge,[.637,1.20,.065],[-side*.32,0,0],silver,.024);box(hinge,[.021,.53,.046],[-side*.58,-.015,.052],dark,.008);box(hinge,[.5,.08,.095],[-side*.32,-.42,-.08],white,.008);hinge.userData.action='fridge:door';fridgeDoors.push(hinge)}
  action('fridge','door',['冷蔵室を開く','冷蔵室を閉じる'],['観音開きの扉を閉めた。','庫内灯が点いた。牛乳、卵、野菜、作り置きが並んでいる。'],on=>{fridgeDoors.forEach((door,i)=>door.rotation.y=on?(i?1:-1)*1.15:0);coldLight.visible=on});
  const coldDrawers=[];
  for(const [i,y] of [.22,.55].entries()){const drawer=group(fridge,null,[0,y,.415]);box(drawer,[1.23,.295,.065],[0,0,0],silver,.02);box(drawer,[.76,.021,.02],[0,.10,.041],dark,.005);box(drawer,[1.1,.18,.57],[0,-.04,-.30],white,.02);drawer.userData.action=`fridge:drawer${i}`;action('fridge',`drawer${i}`,[`${i?'野菜室':'冷凍室'}を開く`,`${i?'野菜室':'冷凍室'}を閉じる`],['引き出し室を閉めた。',i?'野菜室には葉物と根菜。':'冷凍室に小分けの食品がある。'],on=>drawer.position.z=on?.96:.415);coldDrawers.push(drawer)}
  stockFridge(kit,fridge,fridgeDoors,coldDrawers);
  label(fridge,['冷蔵 3℃ / 冷凍 −18℃'],[.37,.055],[.19,1.84,.443],{background:'#444e50',color:'#dae4de',fontSize:65});
  const light=new THREE.PointLight('#ffe7c7',24,7,2);light.position.set(1.7,2.7,6.6);world.add(light);
}
