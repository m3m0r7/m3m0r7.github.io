import * as THREE from 'three';

const TITLES = [
  'ネットワークの仕組み', 'ＴＣＰ／ＩＰ詳解', '名前解決のしくみ', 'ルーティング設計', 'パケットを読む',
  'memoryOSのしくみ', 'memoryOS環境構築', 'シェルと自動化', 'ＯＳの内部構造', 'コンピュータの構成',
  'データベース設計', 'ＳＱＬ実践ノート', '分散システム入門', 'アルゴリズム図解', 'データ構造の基本',
  'ソフトウェア設計', 'リファクタリング', 'テストの技法', '設計パターン', 'コードを読む技術',
  'Ｗｅｂのしくみ', 'ブラウザの内部', 'ＨＴＴＰの教科書', '暗号技術入門', '認証とアクセス制御',
  'サーバー運用手帳', '障害調査の実践', '監視と可観測性', '性能計測の技術', 'コンテナのしくみ',
  'プログラミング言語', '型と計算の理論', 'コンパイラ入門', '並行処理の基本', 'メモリ管理の技術',
  '画像処理の基礎', '線形代数と幾何', '統計とデータ分析', '技術文書の書き方', '実装のための数学',
];
const COVERS = ['#ded7bd','#435b60','#9a5343','#ccc8b9','#364650','#9f8d59','#536557','#c5b7a3'];

// 背表紙を一枚のアトラスへ集約し、本ごとの巨大な文字テクスチャを作らない。
function spineAtlas() {
  const columns=10, rows=8, cellWidth=96, cellHeight=384;
  const canvas=document.createElement('canvas');canvas.width=columns*cellWidth;canvas.height=rows*cellHeight;
  const ctx=canvas.getContext('2d');
  for(let i=0;i<80;i++) {
    const x=i%columns*cellWidth,y=Math.floor(i/columns)*cellHeight,dark=[1,2,4,6].includes(i%8);
    ctx.fillStyle=COVERS[i%8];ctx.fillRect(x,y,cellWidth,cellHeight);
    ctx.fillStyle=dark?'#eee8d7':'#343833';ctx.fillRect(x+8,y+25,80,2);ctx.fillRect(x+8,y+329,80,2);
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='500 24px "Noto Sans JP", sans-serif';
    const title=Array.from(i===28?'ネットワーク調査':TITLES[i%TITLES.length]);const step=Math.min(27,272/title.length);
    title.forEach((char,j)=>ctx.fillText(char,x+48,y+55+j*step));
    ctx.font='400 11px "Noto Sans JP", sans-serif';ctx.fillText(i<40?'技術叢書':'実践編',x+48,y+350);ctx.fillText(String(i%40+1).padStart(2,'0'),x+48,y+369);
    ctx.fillStyle=dark?'#ffffff18':'#0000000e';ctx.fillRect(x+3,y+3,3,378);ctx.fillRect(x+89,y+3,4,378);
  }
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;
  return {material:new THREE.MeshStandardMaterial({map:texture,roughness:.85}),columns,rows};
}

export function buildLibrary(kit,parent) {
  const {group,box,tube,surface}=kit, shelf=group(parent,'book',[-4.49,0,-1.67]);shelf.rotation.y=Math.PI/2;
  shelf.userData.inspection={focus:[0,1.25,.08],distance:2.4,minDistance:.75,maxDistance:2.65,yaw:Math.PI/2,arc:.65,tilt:.08};
  const oak=surface('wood','#81684f'),edge=surface('wood','#aa8c65');
  box(shelf,[2.32,2.39,.035],[0,1.27,-.286],oak,.004);
  for(const x of [-1.145,1.145])box(shelf,[.065,2.45,.59],[x,1.275,0],oak,.012);
  for(const y of [.15,.70,1.25,1.8,2.35]) {
    box(shelf,[2.25,.048,.59],[0,y,0],oak,.005);
    box(shelf,[2.25,.035,.025],[0,y,.297],edge,.004);
    for(const x of [-1.102,1.102])for(const z of [-.19,.2])box(shelf,[.012,.016,.028],[x,y-.034,z],'#a79c86',.002);
  }
  box(shelf,[2.35,.073,.62],[0,2.4,.006],edge,.01);box(shelf,[2.13,.13,.47],[0,.062,-.025],oak,.005);
  const atlas=spineAtlas();let featured=null, featuredPosition=null;
  function book(index,width,height,depth) {
    const volume=group(shelf);const cover=COVERS[index%8];
    box(volume,[width-.011,height-.015,depth-.018],[0,height/2,-.007],index%3?'#d9d3bb':'#c7bda2',0);
    for(const x of [-width/2+.003,width/2-.003])box(volume,[.006,height,depth],[x,height/2,0],cover,.002);
    box(volume,[width,height,.013],[0,height/2,depth/2],cover,.003);
    const geometry=new THREE.PlaneGeometry(width-.004,height-.007),uv=geometry.attributes.uv;
    const column=index%atlas.columns,row=Math.floor(index/atlas.columns);
    for(let i=0;i<uv.count;i++)uv.setXY(i,(column+uv.getX(i))/atlas.columns,1-(row+1-uv.getY(i))/atlas.rows);
    const spine=new THREE.Mesh(geometry,atlas.material);spine.position.set(0,height/2,depth/2+.007);volume.add(spine);
    for(let line=0;line<5;line++)box(volume,[width-.014,.0006,depth-.028],[0,height-.007-line*.0016,-.012],'#a9a38f',0);
    return volume;
  }
  let index=0;
  for(const [row,y] of [.174,.724,1.274,1.824].entries()) {
    let x=-1.095;
    for(let i=0;i<20;i++) {
      const width=[.064,.078,.084,.058,.074,.068,.086,.06][i%8],height=.36+(i*7+row)%6*.018,depth=.26+(i+row)%4*.02;
      const volume=book(index,width,height,depth);if(index===0)volume.userData.action='book:basics';volume.position.set(x+width/2,y,.055+(i%4)*.012);
      if(row===1&&i===8){featured=volume;featuredPosition=volume.position.clone();volume.userData.action='book:pull';
        const cover=kit.label(volume,['ネットワーク','調査の手引き'],[depth*.86,height*.8],[width/2+.001,height/2,0],{background:COVERS[index%8],color:'#eee9db',fontSize:95});cover.plane.rotation.y=Math.PI/2;
        box(volume,[.012,.057,.045],[width/2+.004,height-.012,-depth*.18],'#b68456',.002);
      }

      if(i===19)volume.rotation.z=-.055;
      x+=width+.009;index++;
    }
    for(let j=0;j<3;j++) {
      const volume=book(row*9+j,.033,.35,.265);volume.rotation.z=-Math.PI/2;volume.position.set(.71,y+.018+j*.04,.07+j*.008);volume.rotation.y=(j-1)*.035;
    }
    // 本の列の端は金属のブックエンドで支える。
    box(shelf,[.025,.23,.24],[x+.007,y+.115,.08],'#4e5552',.003);box(shelf,[.12,.008,.24],[x-.04,y+.005,.08],'#4e5552',.003);
  }
  tube(shelf,[[-1.02,2.32,-.26],[-1.02,2.28,-.23]],'#584a38',.006);
  return {group:shelf,setPulled(on){featured.position.copy(featuredPosition);featured.position.z+=on?.36:0;featured.rotation.y=on?-.5:0;},count:92};
}
