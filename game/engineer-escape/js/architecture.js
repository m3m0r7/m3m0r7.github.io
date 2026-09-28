import * as THREE from 'three';

export function makeWindow(kit, parent, position, rotation, id) {
  const {group,box,cylinder,surface,mesh}=kit;
  const frame=group(parent,id,position);frame.rotation.y=rotation;frame.userData.remoteInspect=true;
  const metal=surface('metal','#34383b'),wood=surface('wood','#aa8966');
  // 開口の向こうに街並みを配置し、見る角度で手前と奥の位置関係が変わる。
  const skyCanvas=document.createElement('canvas');skyCanvas.width=32;skyCanvas.height=256;const ctx=skyCanvas.getContext('2d'),sky=ctx.createLinearGradient(0,0,0,256);sky.addColorStop(0,'#294358');sky.addColorStop(.5,'#91a9b0');sky.addColorStop(1,'#eed5b0');ctx.fillStyle=sky;ctx.fillRect(0,0,32,256);
  const skyMesh=new THREE.Mesh(new THREE.PlaneGeometry(16,10),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(skyCanvas),side:THREE.DoubleSide}));skyMesh.position.set(0,1,-9);frame.add(skyMesh);
  box(frame,[14,.1,10],[0,-2.1,-5],'#405653',0);
  for(let i=0;i<8;i++) {
    const x=(i-3.5)*1.28,h=1.25+(i*7%5)*.38,z=-4.1-(i%3)*.6;
    box(frame,[1.04,h,.84],[x,-1.9+h/2,z],['#526371','#617079','#7c7c78'][i%3],.012);
    box(frame,[1.09,.09,.94],[x,-1.88+h,z],'#3b4d58',.005);
    for(let row=0;row<Math.floor(h/.45);row++)for(let col=0;col<3;col++)box(frame,[.16,.24,.01],[x-.3+col*.3,-1.62+row*.44,z+.425],(i+row+col)%3?'#899ea6':'#e6c48e',.002,(i+row+col)%3?0:.25);
  }
  // 手前の枝葉と欄干を実寸で作る。
  const leafShape=new THREE.Shape();leafShape.moveTo(0,0);leafShape.quadraticCurveTo(-.065,.08,0,.19);leafShape.quadraticCurveTo(.065,.08,0,0);
  const leafGeometry=new THREE.ShapeGeometry(leafShape,8);const leafPoints=leafGeometry.attributes.position;
  for(let i=0;i<leafPoints.count;i++)leafPoints.setZ(i,Math.sin(leafPoints.getY(i)*16)*.022);leafGeometry.computeVertexNormals();
  const leaves=new THREE.InstancedMesh(leafGeometry,new THREE.MeshStandardMaterial({color:'#779481',roughness:.82,side:THREE.DoubleSide}),500);const transform=new THREE.Object3D();let leafIndex=0;
  for(let i=0;i<5;i++) {
    const root=new THREE.Vector3(-1.7+i*.83,-1.5,-2.1-(i%2)*.6);
    const branch=group(frame,null,root.toArray());cylinder(branch,.012,.027,1.05,[0,.4,0],'#444d41');
    for(let j=0;j<10;j++) {
      const angle=j*2.399+i*.7,tip=new THREE.Vector3(Math.sin(angle)*(.25+j%3*.07),.68+j%4*.17,Math.cos(angle)*(.25+j%3*.07));
      kit.tube(branch,[[0,.35,0],[tip.x*.5,tip.y*.8,tip.z*.5],tip.toArray()],'#4e6150',.005);
      for(let k=0;k<10;k++) {
        const t=.35+k*.072,side=k%2?1:-1;transform.position.copy(root).addScaledVector(tip,t);transform.position.y+=.12;
        transform.rotation.set(.6+Math.sin(j+k)*.6,angle+side*.8,side*.65);transform.scale.setScalar(.7+(j+k)%4*.13);transform.updateMatrix();leaves.setMatrixAt(leafIndex,transform.matrix);leaves.setColorAt(leafIndex++,new THREE.Color(['#bdc7ac','#869e7c','#a5b599'][j%3]));
      }
    }
  }
  frame.add(leaves);
  for(const x of [-1.3,0,1.3])box(frame,[.065,2.07,.16],[x,0,0],metal,.007);
  for(const y of [-1.015,1.015])box(frame,[2.66,.065,.16],[0,y,0],metal,.007);
  box(frame,[2.65,.047,.13],[0,-.3,.005],metal,.005);
  box(frame,[2.86,.10,.38],[0,-1.06,.09],wood,.01);
  for(const x of [-.65,.65])box(frame,[1.23,1.94,.006],[x,0,-.025],new THREE.MeshPhysicalMaterial({color:'#adcee0',transparent:true,opacity:.09,roughness:.08,metalness:.25,side:THREE.DoubleSide}),0);
  box(frame,[.026,.19,.04],[.06,-.02,.105],metal,.008);
  kit.tube(frame,[[-1.58,1.18,.19],[1.58,1.18,.19]],metal,.018);
  for(const side of [-1,1]) {
    const geometry=new THREE.PlaneGeometry(.52,2.39,24,30),points=geometry.attributes.position;
    for(let i=0;i<points.count;i++){const x=points.getX(i),y=points.getY(i);points.setXYZ(i,x*(1+.12*Math.sin(y*2)),y,Math.sin(x*62)*.048)}geometry.computeVertexNormals();
    const curtain=mesh(frame,geometry,surface('linen','#b9ada0'),[side*1.47,-.035,.19]);curtain.material.side=THREE.DoubleSide;
    for(let i=0;i<6;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(.027,.005,6,16),metal);ring.position.set(side*1.47-.23+i*.09,1.18,.19);frame.add(ring)}
  }
  return frame;
}
export function makePendant(kit,parent,position,id) {
  const {group,cylinder,mesh,surface}=kit;const lamp=group(parent,id,position);lamp.userData.remoteInspect=true;
  cylinder(lamp,.095,.095,.055,[0,.05,0],surface('metal','#292b2d'));
  cylinder(lamp,.009,.009,.34,[0,-.13,0],'#25282b');
  const points=[[.04,0],[.09,.01],[.14,.05],[.22,.1],[.3,.15],[.315,.19],[.31,.21]].map(([r,y])=>new THREE.Vector2(r,-y));
  mesh(lamp,new THREE.LatheGeometry(points,48),new THREE.MeshStandardMaterial({color:'#333a3d',metalness:.65,roughness:.3,side:THREE.DoubleSide}),[0,-.27,0]);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.305,.008,8,48),surface('metal','#bf9a64'));ring.rotation.x=Math.PI/2;ring.position.y=-.475;lamp.add(ring);
  cylinder(lamp,.272,.272,.008,[0,-.479,0],new THREE.MeshStandardMaterial({color:'#ffe4ac',emissive:'#ffd29a',emissiveIntensity:1.2}));
  const glow=new THREE.PointLight('#ffd5a3',5,5,2);glow.position.y=-.55;lamp.add(glow);return lamp;
}
export function makePainting(kit,parent,{id='painting-river',position=[-2.25,1.98,4.86],rotation=Math.PI,image='river-painting.png',width=1.48,height=.986}={}) {
  const frame=kit.group(parent,id,position);frame.rotation.y=rotation;frame.userData.remoteInspect=true;
  frame.userData.inspection={focus:[0,0,0],distance:1.65,minDistance:.8,maxDistance:2.4,yaw:rotation,arc:.95,tilt:0};
  const wood=kit.surface('wood','#795436'),outerWidth=width+.23,outerHeight=height+.194;
  kit.box(frame,[outerWidth,outerHeight,.052],[0,0,0],'#9d866b',.004);
  for(const x of [-outerWidth/2,outerWidth/2])kit.box(frame,[.063,outerHeight+.05,.081],[x,0,.035],wood,.007);
  for(const y of [-outerHeight/2,outerHeight/2])kit.box(frame,[outerWidth,.063,.081],[0,y,.035],wood,.007);
  kit.box(frame,[width+.12,height+.08,.016],[0,0,.043],'#e1d8c6',.001);
  const texture=new THREE.TextureLoader().load(new URL('../assets/'+image,import.meta.url).href);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;
  const painting=new THREE.Mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshStandardMaterial({map:texture,roughness:.92}));painting.position.z=.054;frame.add(painting);
  for(const x of [-width*.425,width*.425])kit.box(frame,[.075,.015,.011],[x,0,-.035],kit.surface('metal','#82755d'),.003);
  return frame;
}
export function addRoomDetails(kit,upper,world) {
  const {group,box,cylinder,sphere,tube,surface,label}=kit;
  const metal=surface('metal','#34393d'),brass=surface('metal','#b49a76');
  // モニター背面の吸音パネルは細いスラットとフェルトの二層。
  box(upper,[3.64,1.37,.065],[-2.52,1.78,-4.85],surface('linen','#262b2d'),.005);
  for(let i=0;i<41;i++)box(upper,[.052,1.35,.052],[-4.29+i*.088,1.78,-4.79],surface('wood','#78614d'),.005);
  const task=group(upper,'desk-lamp');
  cylinder(task,.105,.12,.025,[-3.77,.958,-4.29],metal);
  tube(task,[[-3.77,.965,-4.29],[-3.77,1.33,-4.32],[-3.43,1.6,-4.21]],metal,.023);
  for(const point of [[-3.77,1.33,-4.32],[-3.43,1.6,-4.21]])sphere(task,[.038,.038,.038],point,brass);
  const shade=cylinder(task,.06,.135,.17,[-3.42,1.54,-4.19],metal);shade.rotation.z=.2;
  cylinder(task,.117,.117,.012,[-3.402,1.455,-4.19],new THREE.MeshStandardMaterial({color:'#ffdeb0',emissive:'#ffd6a0',emissiveIntensity:1.6}));
  const light=new THREE.PointLight('#ffd8a6',2.6,2.2,2);light.position.set(-3.4,1.42,-4.15);upper.add(light);
  box(upper,[1.38,.006,.65],[-2.07,.936,-3.7],surface('linen','#313b3b'),.025);
  // 天井の目地・換気口・煙感知器も調査できる。
  const vent=group(upper,'vent');box(vent,[.58,.027,.4],[1.85,3.21,2.2],metal,.014);
  for(let i=0;i<10;i++)box(vent,[.48,.018,.015],[1.85,3.19,2.04+i*.034],'#989c99',.003);
  const smoke=group(upper,'smoke-detector');cylinder(smoke,.1,.13,.045,[-1.9,3.245,2.4],'#c7c9c3');cylinder(smoke,.064,.089,.02,[-1.9,3.21,2.4],'#aaaead');sphere(smoke,[.007,.003,.007],[-1.86,3.197,2.36],'#84bd8c');
  for(const item of [task,vent,smoke])item.userData.remoteInspect=true;
  // ソファの縫い目、脚、クッションのパイピング。
  for(const z of [.67,2.9])for(const x of [-4.52,-3.65])cylinder(upper,.034,.026,.17,[x,.08,z],metal);
  for(const z of [1.14,2.32])tube(upper,[[-4.4,.69,z-.45],[-3.64,.69,z-.45],[-3.6,.69,z+.45],[-4.4,.69,z+.45]],'#7f8580',.0035);
  // 細部を見た時にも穴や縁が見えるマグ。
  const cup=group(upper,'mug',[-1.05,1.01,-3.77]);
  const rim=new THREE.Mesh(new THREE.TorusGeometry(.079,.008,10,40),kit.material('#9aaca4'));rim.rotation.x=Math.PI/2;rim.position.y=.075;cup.add(rim);
  cylinder(cup,.07,.07,.002,[0,.065,0],'#34271e');tube(cup,[[.073,.055,0],[.13,.07,0],[.15,.002,0],[.09,-.028,0]],'#9aaca4',.013);
  for(let i=0;i<5;i++){const a=i*Math.PI*2/5,roller=cylinder(upper,.045,.045,.065,[-2.15+Math.cos(a)*.34,.052,-2.6+Math.sin(a)*.34],metal);roller.rotation.z=Math.PI/2;}
  const chair=group(upper,'chair-detail');for(const side of [-1,1]){tube(chair,[[-2.15+side*.245,.59,-2.45],[-2.15+side*.33,.81,-2.46],[-2.15+side*.33,.81,-2.78]],metal,.019);box(chair,[.08,.035,.32],[-2.15+side*.33,.83,-2.66],'#303937',.017)}
}
