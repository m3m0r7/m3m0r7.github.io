import * as THREE from 'three';
export function makeClosedBook(kit,parent,id,position,{title=['memoryOS','コマンドリファレンス'],color='#395563',size=[.16,.029,.225]}={}){
  const book=kit.group(parent,id,position),[w,h,d]=size;book.userData.inspection={focus:[0,h/2,0],distance:.56,minDistance:.3,maxDistance:.9,yaw:Math.PI,arc:1.2,tilt:.9};
  kit.box(book,[w-.008,h-.005,d-.01],[0,h/2,0],'#d8d3c0',.001);for(const y of [.0015,h-.0015])kit.box(book,[w,.003,d],[0,y,0],color,.001);kit.box(book,[.006,h,d],[-w/2+.003,h/2,0],color,.001);
  for(let i=0;i<7;i++)kit.box(book,[w-.013,.0005,d-.014],[.003,.005+i*(h-.01)/7,0],'#b6af99',0);
  const cover=kit.label(book,title,[w*.88,d*.85],[0,h+.0003,0],{background:color,color:'#eee8d4',fontSize:85});cover.plane.rotation.x=-Math.PI/2;cover.plane.rotation.z=Math.PI;
  const ribbon=kit.box(book,[.012,.0008,.056],[w*.2,h*.4,-d*.5-.015],'#b1aa84',.001);ribbon.rotation.y=.08;return book;
}
export function makeBlanket(kit,bed){
  const w=1.65,length=1.57,geometry=new THREE.PlaneGeometry(w+.48,length,50,44),pos=geometry.attributes.position;
  for(let i=0;i<pos.count;i++){const u=pos.getX(i),v=pos.getY(i),edge=Math.max(0,Math.abs(u)-w/2),fold=Math.sin(u*12+v*4)*.011+Math.cos(v*22)*.009;pos.setXYZ(i,u,.595-edge*1.18+fold,v-.23);}
  geometry.computeVertexNormals();const fabric=kit.surface('linen','#7c9091').clone();fabric.side=THREE.DoubleSide;const quilt=kit.mesh(bed,geometry,fabric,[0,0,0]);
  const seam=kit.material('#acb8b4');for(let i=0;i<9;i++){const z=-.89+i*.17;kit.tube(bed,[[-1.04,.36,z],[-.81,.589,z],[0,.604+Math.cos(z*22)*.009,z],[.81,.59,z],[1.04,.36,z]],seam,.0015)}
  for(const x of [-1.04,1.04])kit.tube(bed,[[x,.36,-1.01],[x,.355,-.25],[x,.365,.555]],seam,.003);
  // 足元で折り返した毛布の縁。
  const hem=kit.box(bed,[1.64,.037,.16],[0,.61,.49],kit.surface('linen','#a2b0ab'),.016);hem.rotation.x=-.1;return quilt;
}
export function makeCatTower(kit,upper,domestic){
  const {box,cylinder,tube,group,sphere,surface}=kit,tower=group(upper,'cat-tower',[3.88,0,4.25]),fabric=surface('linen','#b9b1a0'),sisal=surface('linen','#9c8561');
  tower.userData.inspection={focus:[0,.82,0],distance:1.75,minDistance:.9,maxDistance:2.15,yaw:-Math.PI/2,arc:.8,tilt:.25};
  box(tower,[.56,.06,.66],[0,.045,0],fabric,.03);
  for(const [x,z,h] of [[-.17,-.19,1.45],[.16,.17,.76]]){cylinder(tower,.047,.047,h,[x,h/2+.07,z],sisal);for(let i=0;i<h/.025;i++){const cord=new THREE.Mesh(new THREE.TorusGeometry(.048,.003,6,20),kit.material('#b9a47d'));cord.rotation.x=Math.PI/2;cord.position.set(x,.08+i*.025,z);tower.add(cord)}}
  for(const [x,y,z] of [[.06,.78,.12],[-.09,1.51,-.1]]){box(tower,[.47,.055,.45],[x,y,z],fabric,.048);for(const side of [-1,1])box(tower,[.035,.10,.44],[x+side*.23,y+.055,z],fabric,.025)}
  const cubby=group(tower,null,[0,.27,.06]);cubby.rotation.y=Math.PI/2;
  for(const x of [-.216,.216])box(cubby,[.018,.39,.40],[x,0,0],fabric,.008);
  for(const y of [-.186,.186])box(cubby,[.45,.018,.40],[0,y,0],fabric,.008);
  box(cubby,[.45,.39,.018],[0,0,.191],fabric,.008);
  const face=new THREE.Shape();face.moveTo(-.225,-.195);face.lineTo(.225,-.195);face.lineTo(.225,.195);face.lineTo(-.225,.195);face.closePath();
  const hole=new THREE.Path();hole.absarc(0,.025,.13,0,Math.PI*2,true);face.holes.push(hole);
  kit.mesh(cubby,new THREE.ExtrudeGeometry(face,{depth:.014,steps:1,bevelEnabled:false,curveSegments:40}),fabric,[0,0,-.2]);
  const edge=new THREE.Mesh(new THREE.TorusGeometry(.135,.009,8,40),fabric);edge.position.set(0,.025,-.203);cubby.add(edge);
  box(cubby,[.40,.022,.33],[0,-.163,.013],surface('linen','#8c8272'),.012);

  const toy=group(tower,null,[.14,1.48,-.24]);tube(toy,[[0,0,0],[0,-.23,0]],'#756e60',.003);sphere(toy,[.044,.044,.044],[0,-.27,0],'#778d91');toy.userData.action='cat-tower:toy';let swing=0;domestic.register('cat-tower','toy',['おもちゃを揺らす','おもちゃを揺らす'],['小さなボールが揺れた。','小さなボールが揺れた。'],()=>{swing=1});return {animate(dt,time){swing=Math.max(0,swing-dt*.24);toy.rotation.z=Math.sin(time*7)*swing*.6}};
}
