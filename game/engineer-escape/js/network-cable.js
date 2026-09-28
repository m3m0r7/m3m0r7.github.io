import * as THREE from 'three';
import { ROUTER_PORT } from './equipment-racks.js';

export function buildNetworkCable(kit,upper) {
  const {group,box,tube,surface}=kit;
  const cable=group(upper,'cable');cable.userData.inspection={focus:[-.1,.018,-2.8],distance:.62,minDistance:.18,maxDistance:1.1,yaw:0,arc:Math.PI,tilt:.7};
  const jacket=kit.material('#647d8b'),gold=surface('metal','#bea269'),socket=kit.material('#242b2d');
  const hitMaterial=new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,colorWrite:false});
  const clear=new THREE.MeshPhysicalMaterial({color:'#c9d4d3',transparent:true,opacity:.66,roughness:.22,clearcoat:.6});
  const endpoints={pc:[-.99,.42,-4.416],router:ROUTER_PORT},plugs={};
  for(const [side,position] of Object.entries(endpoints)) {
    const g=group(cable,`cable-${side}`,position);g.userData.inspection={focus:[0,0,-.025],distance:.23,minDistance:.09,maxDistance:.55,yaw:Math.PI,arc:1.05,tilt:.3};
    // 8P8C の透明ハウジング、接点、爪と蛇腹のストレインリリーフ。
    const plug=group(g);plug.userData.action=`cable-${side}:toggle`;plugs[side]=plug;
    box(plug,[.033,.027,.078],[0,0,-.025],hitMaterial,.003);
    box(plug,[.012,.009,.022],[0,0,-.007],clear,.001);
    for(let pin=0;pin<8;pin++)box(plug,[.0007,.0006,.007],[-.0035+pin*.001,.0048,.001],gold,.0001);
    const latch=box(plug,[.006,.0012,.015],[0,.006,-.006],'#c0cbca',.0005);latch.rotation.x=-.15;
    box(plug,[.012,.009,.013],[0,-.001,-.023],jacket,.002);
    for(let i=0;i<4;i++)box(plug,[.009-i*.0008,.009-i*.0008,.002],[0,-.001,-.031-i*.003],jacket,.001);
    box(g,[.018,.016,.004],[0,0,.006],surface('metal','#aab4b4'),.001);box(g,[.013,.011,.005],[0,0,.003],socket,.0005);
  }
  // 直径 6 mm。壁・床沿いに緩い曲率で引き回し、両端の移動に追従させる。
  let wire=null,hitWire=null,last='';const kink=group(cable,null,[-.1,.018,-2.8]);
  box(kink,[.026,.003,.007],[0,0,0],'#9aa6a5',.001).rotation.y=-.22;
  for(const x of [-.005,.005])tube(kink,[[x-.009,0,.001],[x,.003,.002],[x+.009,0,-.001]],'#a88b66',.0007);
  return {update(state) {
    const key=`${state.pcConnected}:${state.routerConnected}:${state.cableReplaced}`;if(last===key)return;last=key;
    for(const side of ['pc','router'])plugs[side].position.z=state[`${side}Connected`]===false?-.075:0;
    const a=endpoints.pc,b=endpoints.router,az=a[2]+plugs.pc.position.z-.039,bz=b[2]+plugs.router.position.z-.039;
    const points=[[a[0],a[1]-.001,az],[a[0],a[1]-.001,az-.035],[a[0],a[1]-.04,az-.065],[-.82,.08,-4.57],[-.60,.018,-4.40],[-.45,.018,-3.22],[-.1,.018,-2.8],[.17,.018,-3.12],[.25,.018,-4.20],[.38,.06,-4.59],[.97,.10,-4.59],[1.01,.5,-4.49],[b[0]+.10,b[1]-.02,bz-.10],[b[0],b[1]-.001,bz-.035],[b[0],b[1]-.001,bz]];
    const spline=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),false,'centripetal');
    // 床板上面は 13 mm。補間時の沈み込みも含めてケーブル下面を上に保つ。
    const curve=new THREE.Curve();curve.getPoint=(t,target=new THREE.Vector3())=>{spline.getPoint(t,target);target.y=Math.max(.017,target.y);return target;};
    function updateGeometry(object,radius,material) {
      const geometry=new THREE.TubeGeometry(curve,180,radius,8,false);
      if(!object){object=new THREE.Mesh(geometry,material);cable.add(object)}else{for(const attribute of ['position','normal']){object.geometry.attributes[attribute].array.set(geometry.attributes[attribute].array);object.geometry.attributes[attribute].needsUpdate=true}object.geometry.computeBoundingSphere();object.geometry.computeBoundingBox();geometry.dispose()}
      return object;
    }
    wire=updateGeometry(wire,.003,jacket);wire.castShadow=true;
    // 見た目の径を保ち、小さな端子や細い線にもクリックの余裕を持たせる。
    hitWire=updateGeometry(hitWire,.014,hitMaterial);
    jacket.color.set(state.cableReplaced?'#73938d':'#647d8b');kink.visible=!state.cableReplaced;
  }};
}
