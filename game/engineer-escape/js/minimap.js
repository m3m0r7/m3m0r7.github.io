import { HOME_WALLS, HOME_LOWER_FURNITURE, HOME_UPPER_FURNITURE } from './home-layout.mjs';
export function createMinimap(canvas) {
  const ctx=canvas.getContext('2d');canvas.width=400;canvas.height=420;
  let last=0,upperMap=true;
  const point=(x,z)=>[200+x*31,(upperMap?194:160)+z*(upperMap?31:25)];
  function rect(r,color){ctx.fillStyle=color;const [x,y]=point(r[0],r[2]);ctx.fillRect(x,y,(r[1]-r[0])*31,(r[3]-r[2])*(upperMap?31:25))}
  function label(text,x,z){ctx.fillStyle='#aebdc2';ctx.font='19px "Noto Sans JP", sans-serif';ctx.textAlign='center';ctx.fillText(text,...point(x,z))}
  return {update(player,cats=[]){
    const now=performance.now();if(now-last<100)return;last=now;
    const stairs=player.x>3&&Math.abs(player.z)<3.2,upper=player.feet>1.7;
    upperMap=upper;
    canvas.dataset.floor=stairs?'stairs':upper?'2':'1';canvas.setAttribute('aria-label',`${stairs?'階段':upper?'２階':'１階'}の地図。白い矢印が現在地です。`);
    ctx.clearRect(0,0,400,420);rect([-5,5,-5,5],'#b8cbcf13');if(!upper)rect([-1.6,5,5,9],'#b8cbcf13');
    ctx.strokeStyle='#c1d5d658';ctx.lineWidth=3;ctx.beginPath();const polygon=upper?[[-5,-5],[5,-5],[5,5],[-5,5]]:[[-5,-5],[5,-5],[5,9],[-1.6,9],[-1.6,5],[-5,5]];polygon.forEach(([x,z],i)=>{const p=point(x,z);if(!i)ctx.moveTo(...p);else ctx.lineTo(...p)});ctx.closePath();ctx.stroke();
    rect([2.87,3.04,-3.15,3.15],'#c4d7d86b');rect([3.1,4.96,-3.15,3.15],'#a4b7bf20');for(let i=0;i<18;i++)rect([3.1,4.96,-3.15+i*.35,-3.12+i*.35],'#a4b7bf49');
    if(upper){for(const r of [...HOME_UPPER_FURNITURE,[-3.9,-.8,-4.7,-3.18],[.45,1.05,-4.54,-3.90],[-4.8,-4.03,-2.85,-.4],[-4.8,-3.4,.5,3],[-2.6,-1.3,1.1,2.2]])rect(r,'#c0b69d37');label('仕事部屋',-.8,-.3);label('寝室',1.5,3.8)}
    else{for(const r of HOME_WALLS)rect(r,'#c4d7d870');for(const r of HOME_LOWER_FURNITURE)rect(r,'#c0b69d37');rect([.87,1.04,-5,-1],'#c4d7d870');rect([-5,-.66,-1.08,-.92],'#c4d7d870');label('サーバー室',-2,-2.8);label('洗面',-3.25,2);label('浴室',-3.3,4.3);label('台所',1.5,7.9)}
    ctx.save();const [sx,sz]=point(4.04,0);ctx.translate(sx,sz);ctx.rotate(Math.PI/2);ctx.fillStyle=stairs?'#f1d69f':'#ccd8d8';ctx.font='18px "Noto Sans JP"';ctx.fillText('階段',0,0);ctx.restore();
    for(const cat of cats)if((cat.feet>1.7)===upper){ctx.fillStyle=cat.id==='cat-mugi'?'#d8e5eb':'#a1acb8';ctx.beginPath();ctx.arc(...point(cat.x,cat.z),4,0,Math.PI*2);ctx.fill()}
    ctx.save();ctx.translate(...point(player.x,player.z));ctx.rotate(-player.yaw);ctx.fillStyle='#f3e5c7';ctx.shadowColor='#f3e5c7';ctx.shadowBlur=9;ctx.beginPath();ctx.moveTo(0,-11);ctx.lineTo(7,8);ctx.lineTo(0,4);ctx.lineTo(-7,8);ctx.closePath();ctx.fill();ctx.restore();
    ctx.fillStyle='#7e949e';ctx.textAlign='left';ctx.font='17px "Noto Sans JP"';ctx.fillText('N ↑',28,29);ctx.textAlign='right';ctx.fillText(upper?'２階':'１階',374,29);
  }};
}
