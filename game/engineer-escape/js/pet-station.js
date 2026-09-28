import { batchStatic } from './mesh-batching.js';
import * as THREE from 'three';
export function buildPetStation(kit,upper,domestic){
  const {group,box,cylinder,sphere,label,tube}=kit;
  for(const [id,x,name,color] of [['feeder-eru',-.35,'える','#829eaa'],['feeder-guri',-.96,'ぐり','#8d8699']]){
    const feeder=group(upper,id,[x,0,4.54]);feeder.rotation.y=Math.PI;
    box(feeder,[.265,.31,.24],[0,.21,0],'#d8ddda',.06);
    box(feeder,[.29,.035,.44],[0,.045,.072],'#bec9c4',.025);
    const hopper=cylinder(feeder,.106,.101,.15,[0,.435,0],new THREE.MeshPhysicalMaterial({color:'#687773',transparent:true,opacity:.65,roughness:.18}),40);
    cylinder(feeder,.11,.108,.024,[0,.521,0],'#3c4c50',40);
    for(let i=0;i<48;i++)sphere(feeder,[.009,.006,.007],[Math.sin(i*2.4)*(.025+i%6*.01),.387+Math.floor(i/12)*.017,Math.cos(i*2.4)*(.025+i%6*.01)],'#8b674a');
    box(feeder,[.092,.044,.012],[0,.24,.127],'#263c45',.006);
    label(feeder,['07:00'],[.077,.027],[0,.24,.135],{background:'#263c45',color:'#acd2c8',fontSize:210,resolution:128});
    box(feeder,[.064,.047,.044],[0,.123,.125],'#344e54',.005);
    const dish=group(feeder,null,[0,.065,.175]);cylinder(dish,.108,.092,.025,[0,0,0],'#aab8b5',40);
    const rim=new THREE.Mesh(new THREE.TorusGeometry(.105,.007,8,40),kit.material('#c8d2ce'));rim.rotation.x=Math.PI/2;rim.position.y=.014;dish.add(rim);
    const food=group(dish);for(let i=0;i<25;i++)sphere(food,[.008,.005,.007],[Math.sin(i*2.4)*(i%7*.011),.019,Math.cos(i*2.4)*(i%7*.011)],'#9c7653');
    label(feeder,[name],[.091,.031],[0,.07,.297],{background:color,color:'#edf1e9',fontSize:220,resolution:128});
    tube(feeder,[[.08,.045,-.12],[.10,.022,-.24],[.1,.10,-.29]],'#555f61',.004);
    domestic.register(id,'feed',['少量を給餌する','トレーを確かめる'],['トレーにフードが入っている。','モーターが回り、少量のフードが出てきた。'],on=>food.visible=on);
    batchStatic(feeder);
    feeder.userData.inspection={focus:[0,.25,.06],distance:.78,minDistance:.4,maxDistance:1.1,yaw:Math.PI,tilt:.45};
  }
}
