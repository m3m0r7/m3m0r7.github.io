import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
// 動くグループを維持し、同じ親の静的な部品だけを材質別にまとめる。
export function batchStatic(root,excluded=new Set()) {
  for(const child of [...root.children])if(child.isGroup)batchStatic(child,excluded);
  const batches=new Map();
  for(const child of [...root.children]){
    if(!child.isMesh||child.children.length||excluded.has(child)||child.userData.id||child.userData.action||child.material.transparent)continue;
    if(!batches.has(child.material))batches.set(child.material,[]);batches.get(child.material).push(child);
  }
  for(const [material,children] of batches){if(children.length<2)continue;const parts=children.map(child=>{child.updateMatrix();return (child.geometry.index?child.geometry.toNonIndexed():child.geometry.clone()).applyMatrix4(child.matrix);});const geometry=mergeGeometries(parts,false);parts.forEach(part=>part.dispose());const joined=new THREE.Mesh(geometry,material);joined.castShadow=true;joined.receiveShadow=true;root.add(joined);children.forEach(child=>child.removeFromParent());}
}
