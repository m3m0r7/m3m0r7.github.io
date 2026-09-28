import { BOOKS, FILE_TREE, fileDocument } from './documents.mjs';
import { icon } from './icons.js';
import { documentMarkup, escapeText as escape } from './document-format.mjs';
export { documentMarkup } from './document-format.mjs';
export function mountBook(container, kind, onPage) {
  const book=BOOKS[kind];let page=0,flipping=false;
  container.innerHTML=`<div class="book-reader"><div class="book-spread" aria-live="polite"></div><nav class="book-controls" aria-label="ページをめくる"><button class="secondary-button" data-reader="previous"><kbd>1</kbd> 前のページ</button><span></span><button class="secondary-button" data-reader="next"><kbd>2</kbd> 次のページ</button></nav></div>`;
  const spread=container.querySelector('.book-spread'),previous=container.querySelector('[data-reader="previous"]'),next=container.querySelector('[data-reader="next"]');
  function leaf(index){const [heading,text]=book.pages[index];return `<section class="book-leaf"><small>${escape(book.title)}</small><h3>${escape(heading)}</h3><p>${escape(text).replace(/\n/g,'<br>')}</p><span class="page-number">${index+1}</span></section>`;}
  function render(){spread.innerHTML=leaf(page)+leaf(page+1);container.querySelector('.book-controls span').textContent=`${page+1}–${page+2} / ${book.pages.length}`;previous.disabled=page===0;next.disabled=page+2>=book.pages.length;onPage?.(page);}
  function turn(delta){
    if(flipping||page+delta<0||page+delta>=book.pages.length)return;
    flipping=true;previous.disabled=next.disabled=true;const target=page+delta,forward=delta>0;
    spread.innerHTML=forward?leaf(page)+leaf(target+1):leaf(target)+leaf(page+1);
    const sheet=document.createElement('div');sheet.className=`book-sheet ${forward?'sheet-forward':'sheet-back'}`;sheet.setAttribute('aria-hidden','true');
    sheet.innerHTML=leaf(forward?page+1:page)+leaf(forward?target:target+1);sheet.children[0].classList.add('sheet-front');sheet.children[1].classList.add('sheet-reverse');spread.append(sheet);
    let done=false;const finish=()=>{if(done)return;done=true;page=target;flipping=false;render()};sheet.addEventListener('animationend',finish,{once:true});setTimeout(finish,480);
  }
  previous.onclick=()=>turn(-2);next.onclick=()=>turn(2);render();
}
export function createFileBrowser(onRead,{getChecks=()=>({}),onCheck=()=>{}}={}) {
  let path=['ホーム'],selected=null,container=null;
  function render(){
    const folder=path.at(-1),data=FILE_TREE[folder];
    container.innerHTML=`<div class="finder-toolbar"><button class="finder-back" aria-label="前のフォルダへ" ${path.length===1?'disabled':''}>‹</button><span>${path.map(escape).join(' / ')}</span><small>${data.folders.length+data.files.length} 項目</small></div><div class="finder-layout"><nav class="finder-sidebar" aria-label="よく使う場所">${['ホーム','仕事','住まい','猫たち','写真','ダウンロード'].map(name=>`<button data-folder-shortcut="${name}" class="${folder===name?'active':''}">${icon('notebook')} ${name}</button>`).join('')}</nav><div class="finder-main">${selected?`<div class="file-heading"><button class="secondary-button" data-close-file>一覧へ戻る</button><span>${escape(selected)}</span></div><div class="file-preview" tabindex="0">${documentMarkup(fileDocument(selected),getChecks())}</div>`:`<div class="file-grid">${data.folders.map(name=>`<button class="file-item" data-folder="${name}"><span class="folder-shape"></span><span>${name}</span></button>`).join('')}${data.files.map(name=>`<button class="file-item" data-file="${name}"><span class="file-shape">${name.endsWith('.jpg')?'写真':name.endsWith('.tdo')?'TODO':name.endsWith('.rtx')?'RTX':'MD'}</span><span>${name}</span></button>`).join('')}</div>`}</div></div>`;
    container.querySelector('.finder-back').onclick=()=>{selected=null;path.pop();render()};
    container.querySelectorAll('[data-folder]').forEach(button=>button.onclick=()=>{path.push(button.dataset.folder);selected=null;render()});
    container.querySelectorAll('[data-folder-shortcut]').forEach(button=>button.onclick=()=>{const name=button.dataset.folderShortcut;path=name==='ホーム'?['ホーム']:['ホーム',name];selected=null;render()});
    container.querySelectorAll('[data-file]').forEach(button=>button.onclick=()=>{selected=button.dataset.file;render();const doc=fileDocument(selected);if(doc.clue)onRead(doc.clue)});
    container.querySelectorAll('[data-task-id]').forEach(input=>input.addEventListener('change',()=>{
      onCheck(input.dataset.taskId,input.checked);
      const checks=getChecks(),inputs=[...container.querySelectorAll('[data-task-id]')];
      inputs.forEach(item=>{if(Object.hasOwn(checks,item.dataset.taskId))item.checked=checks[item.dataset.taskId];});
      const count=inputs.filter(item=>item.checked).length;
      container.querySelector('.todo-count').textContent=`${count} / ${inputs.length} 完了`;
      container.querySelector('.todo-document progress').value=count;
    }));
    container.querySelector('[data-close-file]')?.addEventListener('click',()=>{selected=null;render()});
  }
  return {mount(node){container=node;render()},reset(){path=['ホーム'];selected=null}};
}
