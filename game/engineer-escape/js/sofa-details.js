import { batchStatic } from './mesh-batching.js';
import * as THREE from 'three';
export function buildSofaDetails(kit,upper){
  const {group,box,sphere,tube,surface,mesh}=kit,sofa=group(upper,'sofa');
  for(const [z,color,angle] of [[.98,'#b29973',-.17],[2.49,'#718784',.15]]){
    const pillow=group(sofa,null,[-4.30,.93,z]);pillow.rotation.z=angle;
    sphere(pillow,[.13,.255,.255],[0,0,0],surface('linen',color));
    const edge=Array.from({length:49},(_,i)=>{const a=i/48*Math.PI*2;return [.025,Math.cos(a)*.235,Math.sin(a)*.235];});tube(pillow,edge,'#b0b1a2',.003);
  }
  const cloth=group(sofa,null,[-3.99,.708,2.16]),geometry=new THREE.PlaneGeometry(.96,.70,44,34),v=geometry.attributes.position;
  for(let i=0;i<v.count;i++){
    const x=v.getX(i),z=v.getY(i),drop=Math.max(0,x-.33)*2.9;
    v.setXYZ(i,x,.021+Math.sin(z*36+x*10)*(.014+Math.max(0,x)*.035)-drop,z+Math.sin(x*12)*.012);
  }
  geometry.computeVertexNormals();const fabric=surface('linen','#b7ac96').clone();fabric.side=THREE.DoubleSide;mesh(cloth,geometry,fabric,[0,0,0]);
  for(let i=0;i<19;i++){const z=-.32+i*.035;tube(cloth,[[.475,-.391,z],[.49,-.43,z+.008],[.487,-.46,z+.01]],'#b7ac96',.0022);}
  const remote=group(upper,'sofa-remote',[-3.92,.716,1.05]);remote.rotation.y=.22;
  box(remote,[.052,.017,.16],[0,0,0],'#30393e',.008);box(remote,[.043,.004,.023],[0,.009,-.051],'#83938f',.002);
  for(let i=0;i<3;i++)for(let j=0;j<3;j++)box(remote,[.009,.003,.011],[-.014+i*.014,.011,-.014+j*.025],i===0&&j===0?'#947765':'#777f80',.003);
  batchStatic(sofa);batchStatic(remote);
}
