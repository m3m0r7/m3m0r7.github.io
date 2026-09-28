import { financialTotals } from './financial-documents.mjs';
import { taskDone } from './todo-documents.mjs';
export const escapeText = text => String(text).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const yen = value => new Intl.NumberFormat('ja-JP').format(value);
export function documentText(doc,checks={}) {
  if(doc.image)return '[画像ファイル：PC のファイルアプリで表示できます]';
  if(doc.kind==='todo')return [doc.title,doc.subtitle,...doc.groups.flatMap(group=>[group.title,...group.items.map(item=>`[${taskDone(item,checks)?'x':' '}] ${item.text}${item.detail?' — '+item.detail:''}`)])].join('\n');
  if(doc.kind==='financial'){
    const totals=financialTotals(doc);
    return [doc.title,doc.subtitle,`${doc.recipient} / ${doc.issuer} ${doc.department}`,`発行日：${doc.date} / 書類番号：${doc.number}`,`件名：${doc.subject}`,...doc.fields.map(([label,value])=>`${label}：${value}`),...doc.items.map(item=>`${item.name}　${item.quantity}${item.unit} × ${yen(item.price)}円　${yen(item.quantity*item.price)}円`),`小計（税抜）：${yen(totals.subtotal)}円`,`消費税（10％）：${yen(totals.tax)}円`,`${doc.amountLabel}：${yen(totals.total)}円`,doc.status,...doc.notes].join('\n');
  }
  return [doc.title,doc.subtitle||'',...doc.paragraphs].join('\n\n');
}
export function documentMarkup(doc,checks={}) {
  const e=escapeText;
  if(doc.image)return `<figure class="file-photo"><img src="${e(doc.image)}" alt="${e(doc.title)}"></figure>`;
  if(doc.kind==='todo'){
    const items=doc.groups.flatMap(group=>group.items),done=items.filter(item=>taskDone(item,checks)).length;
    return `<article class="todo-document"><header><span class="todo-format">tdo</span><div><h3>${e(doc.title)}</h3><p>${e(doc.subtitle)}</p></div><output class="todo-count" aria-live="polite">${done} / ${items.length} 完了</output></header><progress max="${items.length}" value="${done}" aria-label="タスクの進捗"></progress>${doc.groups.map(group=>`<section><h4>${e(group.title)}</h4><ul>${group.items.map(item=>`<li><label class="todo-row"><input type="checkbox" data-task-id="${e(item.id)}" ${taskDone(item,checks)?'checked':''}><span><strong>${e(item.text)}</strong>${item.detail?`<small>${e(item.detail)}</small>`:''}</span>${item.tag?`<em>${e(item.tag)}</em>`:''}</label></li>`).join('')}</ul></section>`).join('')}</article>`;
  }
  if(doc.kind==='financial'){
    const totals=financialTotals(doc);
    return `<article class="document-paper financial-document"><header class="financial-heading"><div><small>${e(doc.subtitle)}</small><h3>${e(doc.title)}</h3></div><div class="financial-number">書類番号 ${e(doc.number)}<br>発行日 ${e(doc.date)}</div></header><div class="financial-parties"><strong>${e(doc.recipient)}</strong><div><b>${e(doc.issuer)}</b><span>${e(doc.department)}</span></div></div><p class="financial-subject">件名：${e(doc.subject)}</p><div class="financial-total"><span>${e(doc.amountLabel)}</span><strong>¥ ${yen(totals.total)}<small>（税込）</small></strong></div><dl class="financial-fields">${doc.fields.map(([label,value])=>`<dt>${e(label)}</dt><dd>${e(value)}</dd>`).join('')}</dl><div class="financial-table"><table><caption>明細・単価${doc.taxMode==='inclusive'?'税込':'税抜'}</caption><thead><tr><th scope="col">内容</th><th scope="col">数量</th><th scope="col">単価（円）</th><th scope="col">金額（円）</th></tr></thead><tbody>${doc.items.map(item=>`<tr><td>${e(item.name)}</td><td>${item.quantity} ${e(item.unit)}</td><td>${yen(item.price)}</td><td>${yen(item.quantity*item.price)}</td></tr>`).join('')}</tbody><tfoot><tr><th colspan="3" scope="row">小計（税抜）</th><td>${yen(totals.subtotal)}</td></tr><tr><th colspan="3" scope="row">消費税（10％）</th><td>${yen(totals.tax)}</td></tr><tr><th colspan="3" scope="row">合計（税込）</th><td>${yen(totals.total)}</td></tr></tfoot></table></div><div class="financial-status">${e(doc.status)}</div><section class="financial-notes"><h4>備考</h4>${doc.notes.map(text=>`<p>${e(text)}</p>`).join('')}</section></article>`;
  }
  return `<article class="document-paper">${doc.subtitle?`<small>${e(doc.subtitle)}</small>`:''}<h3>${e(doc.title)}</h3>${doc.paragraphs.map(text=>`<p>${e(text).replace(/\n/g,'<br>')}</p>`).join('')}</article>`;
}
