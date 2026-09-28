import * as THREE from 'three';

export function buildDeskAccessories(kit, upper, pc) {
  const { group, box, tube, cylinder, label, surface, mesh } = kit;
  const keyboard=group(pc,null,[-2.12,.939,-3.57]);
  box(keyboard,[.365,.021,.139],[0,.0105,0],surface('metal','#aab1b5'),.008);
  box(keyboard,[.351,.004,.125],[0,.022,0],'#252b31',.005);
  const rows=[['Esc','1','2','3','4','5','6','7','8','9','0','−','⌫'],['Tab','Q','W','E','R','T','Y','U','I','O','P','[',']'],['英数','A','S','D','F','G','H','J','K','L',';','Enter'],['Shift','Z','X','C','V','B','N','M',',','.','/','↑']];
  rows.forEach((keys,row)=>keys.forEach((text,index)=>{
    const x=-.159+index*.026,z=-.047+row*.024;
    box(keyboard,[.023,.008,.021],[x,.027,z],row===0&&index===0?'#677d86':'#d5d8d5',.002);
    const key=label(keyboard,[text],[.019,.012],[x,.0312,z],{background:row===0&&index===0?'#677d86':'#d5d8d5',color:'#27313b',fontSize:260,resolution:128});key.plane.rotation.x=-Math.PI/2;
  }));
  for(const [x,w,text] of [[-.154,.03,'Ctrl'],[-.119,.03,'⌘'],[-.022,.145,''],[.071,.03,'かな'],[.106,.026,'←'],[.136,.026,'↓'],[.165,.026,'→']]){
    box(keyboard,[w,.008,.021],[x,.027,.049],'#c0c7c9',.002);
    if(text){const key=label(keyboard,[text],[w*.8,.012],[x,.0312,.049],{background:'#c0c7c9',color:'#27313b',fontSize:180,resolution:128});key.plane.rotation.x=-Math.PI/2;}
  }
  tube(pc,[[-2.12,.953,-3.646],[-2.12,.953,-3.8],[-2.03,.953,-3.97],[-2.03,.97,-4.23]],'#313941',.002);
  box(pc,[.27,.003,.245],[-1.72,.935,-3.59],surface('linen','#2d343c'),.012);
  const mouse=group(pc,null,[-1.72,.939,-3.57]);
  const shape=new THREE.SphereGeometry(1,32,20);const p=shape.attributes.position;
  for(let i=0;i<p.count;i++){const y=p.getY(i);p.setXYZ(i,p.getX(i)*.032,Math.max(0,y)*.033+.006,p.getZ(i)*.058);}shape.computeVertexNormals();
  mesh(mouse,shape,surface('metal','#b9c2c5'),[0,0,0]);
  box(mouse,[.058,.006,.105],[0,.004,0],'#28313b',.012);
  tube(mouse,[[0,.038,-.013],[0,.028,-.038],[0,.012,-.057]],'#303943',.0008);
  const wheel=cylinder(mouse,.006,.006,.007,[0,.035,-.013],'#39434b',20);wheel.rotation.z=Math.PI/2;
  for(const x of [-.025,.025])tube(mouse,[[x,.011,.032],[x*1.06,.019,0],[x,.011,-.033]],'#6d7c84',.0006);

  // スタンドの底を天板の上に置き、イヤーカップにも余裕を持たせる。
  const headphones=group(upper,'headphones',[-2.94,.938,-4.06]);
  box(headphones,[.17,.014,.13],[0,.007,0],surface('metal','#42494f'),.025);
  box(headphones,[.016,.29,.017],[0,.16,.012],surface('metal','#808a90'),.004);
  box(headphones,[.075,.012,.032],[0,.302,.012],'#656d71',.008);
  const band=[];for(let i=0;i<=24;i++){const a=Math.PI*i/24;band.push([Math.cos(a)*.103,.196+Math.sin(a)*.123,0]);}
  tube(headphones,band,'#2c333c',.013);tube(headphones,band.map(([x,y,z])=>[x*.88,y-.006,z]),surface('linen','#4a535b'),.010);
  for(const x of [-.1,.1]){
    box(headphones,[.034,.089,.068],[x,.170,0],surface('metal','#515d67'),.017);
    box(headphones,[.02,.084,.065],[x-Math.sign(x)*.02,.169,0],surface('linen','#222a32'),.016);
    box(headphones,[.008,.046,.009],[x,.223,0],'#899298',.003);
  }
  headphones.userData.inspection={focus:[0,.18,0],distance:.55,minDistance:.32,maxDistance:.8,tilt:.4};
}

export function makeSlippers(kit,parent) {
  const {group,mesh,surface,tube}=kit;
  const pair=group(parent,'slippers',[-.51,0,8.1]);
  pair.userData.inspection={focus:[0,.07,0],distance:.56,minDistance:.35,maxDistance:.95,tilt:.9};
  for(const side of [-1,1]){
    const slipper=group(pair,null,[side*.085,.021,side*.018]);slipper.rotation.y=side*.065;
    const outline=new THREE.Shape();outline.moveTo(-.047,.105);outline.bezierCurveTo(-.06,.06,-.057,-.072,-.042,-.119);outline.bezierCurveTo(-.017,-.147,.038,-.145,.053,-.103);outline.bezierCurveTo(.069,-.044,.058,.066,.041,.109);outline.quadraticCurveTo(0,.134,-.047,.105);
    const sole=new THREE.ExtrudeGeometry(outline,{depth:.012,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.003,bevelThickness:.002});sole.rotateX(Math.PI/2);
    mesh(slipper,sole,surface('linen','#636560'),[0,.016,0]);
    const inset=new THREE.ShapeGeometry(outline,24);inset.rotateX(Math.PI/2);inset.scale(.92,1,.94);
    mesh(slipper,inset,new THREE.MeshStandardMaterial({color:'#b7b2a4',roughness:1,side:THREE.DoubleSide}),[0,.021,0]);
    const upper=new THREE.PlaneGeometry(1,1,22,20),v=upper.attributes.position;
    for(let i=0;i<v.count;i++){const u=v.getX(i)+.5,t=v.getY(i)+.5,a=u*Math.PI;v.setXYZ(i,Math.cos(a)*(.053*(1-t*.25)),.025+Math.sin(a)*(.048*(1-t*.65)),-.005-t*.11);}
    upper.computeVertexNormals();mesh(slipper,upper,new THREE.MeshStandardMaterial({color:'#9a9e97',roughness:1,side:THREE.DoubleSide}),[0,0,0]);
    const piping=[];for(let i=0;i<=24;i++){const a=Math.PI*i/24;piping.push([Math.cos(a)*.053,.025+Math.sin(a)*.048,-.005]);}tube(slipper,piping,'#d0cdbf',.002);
  }
  return pair;
}
