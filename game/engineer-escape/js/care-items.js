import * as THREE from 'three';

// ケア用品は棚の一部と個々の品をそれぞれ観察できる。
export function buildCareStorage(kit,world,{subject,action,zones}) {
  const {group,box,cylinder,tube,sphere,surface,label}=kit;
  const metal=surface('metal','#bcc5c4'),dark=kit.material('#373c3c'),wood=surface('wood','#b19b7d');
  const profile=(zone,h=.2)=>({focus:[0,h/2,0],distance:.6,minDistance:.27,maxDistance:1.05,yaw:0,arc:1.3,tilt:.23,bounds:zones[zone]});
  function pump(parent,id,x,y,color,title,h=.23,w=.085,zone='wash') {
    const g=subject(parent,id,[x,y,0],profile(zone,h));
    box(g,[w,h*.78,w*.66],[0,h*.4,0],new THREE.MeshPhysicalMaterial({color,roughness:.31,clearcoat:.3}),.018);
    cylinder(g,w*.24,w*.35,h*.12,[0,h*.85,0],color);cylinder(g,.009,.012,.037,[0,h+.006,0],dark);box(g,[w*.8,.014,.018],[w*.19,h+.03,0],dark,.006);
    label(g,[title],[w*.8,h*.35],[0,h*.44,w*.335],{background:color,color:'#343d3a',fontSize:80});return g;
  }
  function jar(parent,id,x,y,color,title,zone='wash') {
    const g=subject(parent,id,[x,y,0],profile(zone,.09));cylinder(g,.052,.049,.067,[0,.035,0],color);cylinder(g,.054,.054,.018,[0,.077,0],'#e2d6c4');
    for(const h of [.068,.079]){const rim=new THREE.Mesh(new THREE.TorusGeometry(.054,.0015,5,40),metal);rim.rotation.x=Math.PI/2;rim.position.y=h;g.add(rim)}
    label(g,[title],[.075,.032],[0,.038,.054],{background:color,color:'#38423c',fontSize:90});return g;
  }
  const bath=subject(world,'bath-shelf',[-3.06,.83,4.76],{focus:[0,.4,0],distance:1.2,minDistance:.65,maxDistance:1.6,yaw:Math.PI,arc:.7,tilt:.2,bounds:zones.bath});bath.rotation.y=Math.PI;
  for(const x of [-.58,.58])box(bath,[.035,.82,.25],[x,.4,-.04],metal,.008);
  for(const y of [0,.43]){box(bath,[1.2,.025,.28],[0,y,0],metal,.007);tube(bath,[[-.58,y+.085,.13],[.58,y+.085,.13]],metal,.006)}
  const shampoo=pump(bath,'shampoo',-.36,.45,'#d3c8ad','シャンプー',.26,.10,'bath');
  const liquid=pump(bath,'liquid-soap',-.02,.45,'#adc1b6','ボディソープ',.27,.115,'bath');
  const treatment=pump(bath,'hair-treatment',.32,.45,'#c4b4a8','トリートメント',.25,.1,'bath');
  const scent=subject(bath,'scented-soap',[.23,.025,0],profile('bath',.1));box(scent,[.24,.02,.17],[0,0,0],'#d5ccb7',.03);box(scent,[.14,.045,.095],[0,.028,0],'#a699b3',.035);box(scent,[.085,.003,.04],[0,.052,0],'#bfb0c9',.015);
  const meshBag=group(bath,null,[-.3,.12,.02]);for(let i=0;i<7;i++)tube(meshBag,[[-.07,.03+i*.015,-.04],[.07,.03+i*.015,-.04],[.07,.03+i*.015,.04],[-.07,.03+i*.015,.04]],'#dad6c5',.002);
  for(const item of [shampoo,liquid,treatment,scent])item.userData.inspection.yaw=Math.PI;
  const vanity=subject(world,'vanity-shelf',[-3.05,1.07,1.14],{focus:[0,.56,0],distance:1.15,minDistance:.6,maxDistance:1.6,yaw:0,arc:.7,tilt:.15,bounds:zones.wash});
  box(vanity,[1.32,1.41,.025],[0,.66,-.145],wood,.008);
  for(const x of [-.66,.66])box(vanity,[.03,1.41,.32],[x,.66,0],wood,.008);
  for(const y of [-.03,.41,.85,1.36])box(vanity,[1.34,.035,.33],[0,y,0],wood,.008);
  pump(vanity,'leave-in-treatment',-.46,.875,'#b9b0a2','ヘアミルク',.22,.075);
  jar(vanity,'body-cream',-.1,.875,'#d9c8b4','ボディクリーム');
  const cosmetics=subject(vanity,'cosmetics',[.28,.875,0],{...profile('wash',.18),focus:[-.24,-.19,.04],distance:1.05,minDistance:.6,maxDistance:1.4});
  // 化粧水、乳液、スポイト、美容液、口紅、ブラシ、開いたコンパクト。
  for(const [x,h,c] of [[-.03,.23,'#ccb29b'],[.10,.17,'#dcd6c5'],[.22,.125,'#967c63']]){cylinder(cosmetics,.024,.029,h,[x,h/2,0],c);cylinder(cosmetics,.018,.018,.033,[x,h+.015,0],dark)}
  const compact=group(vanity,null,[-.34,.445,.02]);compact.userData.id='cosmetics';compact.userData.action='cosmetics:compact';cylinder(compact,.068,.068,.021,[0,.011,0],'#d3b697');cylinder(compact,.058,.058,.007,[0,.024,0],'#c89d7a');
  const lid=group(compact,null,[0,.041,-.068]);const disc=cylinder(lid,.069,.069,.015,[0,0,.068],dark);const mirror=cylinder(lid,.059,.059,.002,[0,-.009,.068],metal);action('cosmetics','compact',['コンパクトを開く','コンパクトを閉じる'],['コンパクトを閉じた。','小さな鏡と、使いかけのパウダー。'],on=>{lid.rotation.x=on?-1.9:0});
  const brushes=group(vanity,null,[.38,.435,.035]);cylinder(brushes,.041,.038,.09,[0,.045,0],'#d0c1ad');for(let i=0;i<5;i++){const x=(i%3-1)*.021,z=Math.floor(i/3)*.023;cylinder(brushes,.005,.005,.16,[x,.12,z],dark);sphere(brushes,[.016,.027,.013],[x,.21,z],'#715a4c')}
  for(const x of [-.14,-.05]){cylinder(vanity,.013,.014,.085,[x,.482,.04],dark);cylinder(vanity,.01,.01,.029,[x,.537,.04],x<-.1?'#9c5b59':'#a86557')}
  // 家電は金属のプレート、グリル、コードまで別の形を持たせる。
  const dryer=subject(vanity,'hair-dryer',[-.4,.075,.04],{...profile('wash',.16),distance:.65});
  const body=cylinder(dryer,.058,.065,.19,[0,.13,0],dark);body.rotation.z=Math.PI/2;const nozzle=cylinder(dryer,.038,.054,.085,[.13,.13,0],metal);nozzle.rotation.z=Math.PI/2;
  box(dryer,[.04,.115,.05],[-.02,.044,0],'#797d79',.018).rotation.z=-.2;
  for(let i=0;i<8;i++)tube(dryer,[[-.102,.13+Math.sin(i*Math.PI/4)*.044,Math.cos(i*Math.PI/4)*.044],[-.107,.13,0]],metal,.002);
  tube(dryer,[[-.03,-.005,0],[-.08,-.044,0],[.06,-.054,.035],[.13,-.04,-.025],[.04,-.035,-.04]],dark,.0025);
  const curling=subject(vanity,'curling-iron',[-.06,.023,.06],{...profile('wash',.08),distance:.62});curling.rotation.y=.18;
  const handle=cylinder(curling,.021,.026,.12,[0,.04,0],dark);handle.rotation.z=Math.PI/2;const barrel=cylinder(curling,.018,.018,.2,[.15,.04,0],metal);barrel.rotation.z=Math.PI/2;box(curling,[.16,.008,.022],[.14,.06,0],'#8c9596',.004);sphere(curling,[.018,.019,.019],[.26,.04,0],dark);
  const straight=subject(vanity,'straightener',[.35,.025,.06],{...profile('wash',.08),distance:.65});straight.rotation.y=-.13;
  box(straight,[.23,.021,.05],[0,.018,0],dark,.012);box(straight,[.13,.004,.04],[.025,.032,0],metal,.004);
  const upper=group(straight,null,[-.10,.04,0]);box(upper,[.23,.023,.05],[.10,0,0],dark,.012);box(upper,[.13,.003,.04],[.125,-.014,0],metal,.004);upper.userData.action='straightener:open';action('straightener','open',['プレートを開く','プレートを閉じる'],['プレートを閉じた。コードは抜いてある。','金属のプレートは冷たい。電源は入っていない。'],on=>{upper.rotation.z=on?.35:0});
  for(const item of [curling,straight])tube(item,[[-.12,.02,0],[-.15,.01,.06],[-.02,.005,.09],[.07,.005,.04]],dark,.0025);
}
