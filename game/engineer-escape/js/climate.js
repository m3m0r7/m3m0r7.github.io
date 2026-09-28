import { batchStatic } from './mesh-batching.js';
import * as THREE from 'three';

export function buildClimate(kit,world,upper,domestic) {
  const {group,box,label}=kit,units=[];
  // 仕事部屋の室内機は窓開口（x -0.46〜2.22）を避け、階段側の壁面に掛ける。
  for(const [id,parent,pos,yaw] of [['ac-work',upper,[3.60,2.78,-4.85],0],['ac-bedroom',upper,[1.50,2.78,4.85],Math.PI],['ac-kitchen',world,[4.85,2.70,6.65],-Math.PI/2]]){
    const unit=group(parent,id,pos);unit.rotation.y=yaw;unit.userData.remoteInspect=true;
    box(unit,[.84,.27,.19],[0,0,0],'#d5d9d6',.027);
    box(unit,[.75,.029,.03],[0,-.085,.102],'#304248',.007);
    const vane=box(unit,[.74,.025,.076],[0,-.10,.107],'#a5b1b0',.007);vane.rotation.x=.30;
    for(let i=0;i<22;i++)box(unit,[.012,.012,.078],[-.32+i*.03,.137,-.02],'#7b8887',.002);
    const display=label(unit,['25°'],[.063,.028],[.30,-.013,.1],{background:'#d5d9d6',color:'#49676a',fontSize:270,resolution:128});
    domestic.register(id,'power',['運転を止める','冷房をつける'],['冷房を再開した。設定温度は25度。','冷房を停止した。'],off=>{vane.rotation.x=off?0:.3;display.plane.visible=!off;});
    unit.userData.inspection={focus:[0,0,0],distance:1.05,minDistance:.55,maxDistance:1.6,yaw,tilt:-.2,minTilt:-1.1,maxTilt:.6};units.push(unit);batchStatic(unit,new Set([vane,display.plane]));
  }
  const cassette=group(world,'server-cooling',[-2.25,3.08,-2.82]);cassette.userData.remoteInspect=true;
  box(cassette,[.88,.16,.88],[0,.012,0],'#cdd5d4',.018);
  box(cassette,[.49,.012,.49],[0,-.081,0],'#748787',.008);
  for(let i=0;i<17;i++)box(cassette,[.455,.011,.008],[0,-.094,-.224+i*.028],'#2c3e45',.001);
  for(let side=0;side<4;side++){
    const duct=group(cassette);duct.rotation.y=side*Math.PI/2;
    box(duct,[.60,.013,.10],[0,-.087,.35],'#32484e',.007);
    for(let i=0;i<3;i++){const vane=box(duct,[.57,.008,.026],[0,-.105,.324+i*.026],'#a0b2b1',.002);vane.rotation.x=.32;}
  }
  cassette.userData.inspection={focus:[0,-.07,0],distance:1.1,minDistance:.6,maxDistance:1.6,tilt:-1.2,minTilt:-1.45,maxTilt:-.5};
  const control=group(world,'server-thermostat',[.825,1.50,-2.35]);control.rotation.y=-Math.PI/2;
  box(control,[.17,.23,.034],[0,0,0],'#d0d8d5',.009);
  const screen=label(control,['冷房 22℃','風量 自動'],[.137,.10],[0,.033,.02],{background:'#283e47',color:'#c8dedb',fontSize:135,resolution:256});
  for(const x of [-.044,.044])box(control,[.056,.023,.006],[x,-.07,.022],'#7f9194',.004);
  let setpoint=22;
  function refresh(){const {ctx,canvas,texture}=screen;ctx.fillStyle='#283e47';ctx.fillRect(0,0,1024,1024*.1/.137);ctx.fillStyle='#c8dedb';ctx.fillText(`冷房 ${setpoint}℃`,512,250);ctx.fillText('風量 自動',512,530);texture.needsUpdate=true;}
  domestic.register('server-thermostat','temperature',['20度に下げる','22度に戻す'],['設定を22度に戻した。','設定を20度に下げた。'],on=>{setpoint=on?20:22;refresh();});
  for(const [id,x,z] of [['vent-bath',-2.6,3.9],['vent-toilet',-3.5,.12],['vent-washroom',-3.1,2.1]]){
    const fan=group(world,id,[x,3.13,z]);fan.userData.remoteInspect=true;
    box(fan,[.35,.06,.35],[0,0,0],'#c9d1cd',.015);for(let i=0;i<12;i++)box(fan,[.28,.006,.009],[0,-.034,-.132+i*.024],'#566b6d',.001);
    fan.userData.inspection={focus:[0,0,0],distance:.7,minDistance:.4,maxDistance:1.1,tilt:-1.2,minTilt:-1.45,maxTilt:-.6};
  }
  batchStatic(cassette);batchStatic(control,new Set([screen.plane]));
  return {temperature:()=>setpoint};
}
