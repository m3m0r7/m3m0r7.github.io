import * as THREE from 'three';
// 実物のカード寸法を使い、文字を読むときは別途拡大表示する。
export function makeInsuranceCard(kit,parent,position) {
  const card=kit.group(parent,'birthday',position);card.rotation.y=-.14;
  kit.box(card,[.0856,.0008,.054],[0,0,0],'#eef0e6',.0015);
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=646;const ctx=canvas.getContext('2d');
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;
  function draw(photo){ctx.fillStyle='#f3f4e9';ctx.fillRect(0,0,1024,646);ctx.fillStyle='#317260';ctx.fillRect(0,0,1024,83);ctx.fillStyle='#fff';ctx.font='500 38px "Noto Sans JP"';ctx.fillText('どうぶつ健康保険証',43,56);ctx.font='22px "Noto Sans JP"';ctx.fillText('フェリス少額短期保険',745,54);ctx.fillStyle='#62776a';ctx.font='23px "Noto Sans JP"';ctx.fillText('証券番号 ＦＰ２６−０４１３５５',43,128);ctx.fillStyle='#273e35';ctx.font='30px "Noto Sans JP"';for(const [i,line] of ['どうぶつ名　える','品種　　　　ラグドール','毛色　　　　ブルーポイントバイカラー','生年月日　　２０２１年６月１９日','保険期間　　２０２６年４月１日から１年間','補償割合　　７０％プラン'].entries())ctx.fillText(line,43,189+i*62);ctx.fillStyle='#dbe7da';ctx.fillRect(725,177,244,302);if(photo)ctx.drawImage(photo,725,177,244,302);ctx.fillStyle='#4b7062';ctx.font='22px "Noto Sans JP"';ctx.fillText('診療の際に受付でご提示ください',43,600);ctx.strokeStyle='#a9b9ab';ctx.lineWidth=2;ctx.strokeRect(28,100,968,520);texture.needsUpdate=true;}
  draw();const photo=new Image();photo.onload=()=>draw(photo);photo.src=new URL('../../../assets/cats/2.jpg',import.meta.url).href;
  const face=new THREE.Mesh(new THREE.PlaneGeometry(.084,.0524),new THREE.MeshBasicMaterial({map:texture}));face.rotation.x=-Math.PI/2;face.position.y=.0005;card.add(face);
  const pick=kit.box(card,[.13,.008,.085],[0,.001,0],new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,colorWrite:false}),0);pick.castShadow=false;pick.receiveShadow=false;
  return card;
}
export function insuranceMarkup(){return '<div class="insurance-card"><header>どうぶつ健康保険証</header><div class="insurance-body"><small>証券番号 ＦＰ２６−０４１３５５</small><img src="../../assets/cats/2.jpg" alt="えるの顔写真"><dl><dt>どうぶつ名</dt><dd>える</dd><dt>品種</dt><dd>ラグドール</dd><dt>毛色</dt><dd>ブルーポイント<br>バイカラー</dd><dt>生年月日</dt><dd>２０２１年６月１９日</dd><dt>保険期間</dt><dd>２０２６年４月１日から１年間</dd><dt>補償割合</dt><dd>７０％プラン</dd></dl></div><footer>フェリス少額短期保険 / 診療の際に受付でご提示ください</footer></div>';}
