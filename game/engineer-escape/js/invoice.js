import * as THREE from 'three';
import { FINANCIAL_DOCUMENTS, financialTotals } from './financial-documents.mjs';
import { documentMarkup } from './document-format.mjs';
const invoice=FINANCIAL_DOCUMENTS['今月の請求書.rtx'];
const totals=financialTotals(invoice);
const rows=[...invoice.items.map(item=>[item.name,(item.price*item.quantity).toLocaleString('ja-JP')]),['小計（税抜）',totals.subtotal.toLocaleString('ja-JP')],['消費税相当額（10％）',totals.tax.toLocaleString('ja-JP')]];
export function invoiceMarkup(){return documentMarkup({kind:'financial',...invoice});}
export function makeInvoice(kit,parent){
  const canvas=document.createElement('canvas');canvas.width=840;canvas.height=1188;const c=canvas.getContext('2d');c.fillStyle='#f3f1e6';c.fillRect(0,0,840,1188);
  const text=(str,x,y,size=20,color='#34474a')=>{c.fillStyle=color;c.font=`${size}px "Noto Sans JP",sans-serif`;c.fillText(str,x,y);};
  c.fillStyle='#b5c8cc';c.fillRect(35,35,770,65);text('ご利用料金のお知らせ',55,77,29);text('みどり通信',625,77,23);
  text('めもりー 様',52,155,26);text('ご請求番号 26-09-118042',52,194,18);text('お客様番号 0000-••••-0101',52,229,18);text('2026年9月発行',575,154,18);
  for(let i=0;i<43;i++)c.fillRect(56+i*5,259,i%3===0?3:1,32);
  text('いつもご利用いただき、ありがとうございます。',52,331,17);
  c.fillStyle='#dbe6e6';c.fillRect(44,364,752,115);text('2026年9月ご請求分',57,402,20);text('5,280 円',324,444,43);text('振替日 9月20日',590,423,19);
  text('ご利用料金の内訳',52,531,23);let y=583;for(const [name,value] of [...rows,['合計','5,280']]){text(name,60,y,21);text(value+' 円',651,y,21);c.strokeStyle='#91a7aa';c.beginPath();c.moveTo(52,y+13);c.lineTo(788,y+13);c.stroke();y+=48;}
  c.strokeStyle='#527e70';c.strokeRect(52,904,736,103);text('口座振替済み',75,944,27,'#44735f');text('未払い残高：0円 ／ ご契約状態：利用中',75,980,20);
  text('次回もご登録の口座から振り替えいたします。',52,1050,18);text('ご契約内容は会員ページで確認できます。',52,1083,18);text('みどり通信 料金センター',52,1145,16);
  const root=kit.group(parent,'invoice',[-3.18,.94,-3.92]),texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;
  const paper=new THREE.Mesh(new THREE.PlaneGeometry(.25,.354),new THREE.MeshStandardMaterial({map:texture,roughness:.96,side:THREE.DoubleSide}));paper.rotation.x=-Math.PI/2;paper.rotation.z=-.13;root.add(paper);
  root.userData.inspection={focus:[0,.01,0],distance:.55,tilt:1.1};return root;
}
