import test from 'node:test';
import assert from 'node:assert/strict';
import { FILE_TREE,fileDocument } from '../js/documents.mjs';
import { financialTotals } from '../js/financial-documents.mjs';
import { documentMarkup,documentText } from '../js/document-format.mjs';
import { initialState,transition,hydrate,readSave,writeSave,STORAGE_KEY } from '../js/state.mjs';
import { executeCommand } from '../js/terminal.mjs';

const names=Object.values(FILE_TREE).flatMap(folder=>folder.files);
test('全フォルダの資料を開け、拡張子に応じて読める',()=>{
  assert.ok(names.length>30);
  for(const name of names){
    assert.match(name,/\.(rtx|tdo|md|jpg)$/);
    const doc=fileDocument(name);assert.ok(documentMarkup(doc));assert.ok(documentText(doc));
    if(name.endsWith('.tdo'))assert.equal(doc.kind,'todo');
    assert.doesNotMatch(documentText(doc),/株式会社|登録番号 T\d|以上 \/ 保管用/);
  }
  assert.equal(fileDocument('サーバー室施工契約書.rtx').clue,'construction');
  assert.match(documentText(fileDocument('サーバー室施工契約書.rtx')),/猫の誕生日とする/);
  assert.throws(()=>fileDocument('今月の請求書.txt'),/未登録/);
});

test('請求書・見積書は明細と税額が一致し、端末でも全項目を読める',()=>{
  for(const [name,expected] of [['今月の請求書.rtx',5280],['配管工事見積.rtx',16280],['キッチン施工明細.rtx',1482000],['領収書.rtx',6468]]){
    const doc=fileDocument(name),totals=financialTotals(doc),html=documentMarkup(doc),plain=documentText(doc);
    assert.equal(totals.total,expected);assert.equal(totals.subtotal+totals.tax,expected);
    assert.match(html,/<table>/);assert.match(plain,new RegExp(expected.toLocaleString('ja-JP')+'円'));
    for(const item of doc.items){assert.ok(html.includes(item.name));assert.ok(plain.includes(item.name));}
  }
  const output=executeCommand('read ダウンロード/今月の請求書.rtx',initialState()).output;
  assert.match(output,/口座振替済み/);assert.match(output,/未払い残高：0円/);assert.match(output,/今回のご請求額：5,280円/);
  assert.match(executeCommand('grep 出張費 住まい/設備・工事/配管工事見積.rtx',initialState()).output,/3,000円/);
});

test('タスクの操作・保存・読み戻しをファイル画面と端末に反映する',()=>{
  let state=initialState();const doc=fileDocument('作業予定.tdo');
  assert.match(documentText(doc,state.taskChecks),/\[ \] 帳票改修の動作確認/);
  state=transition(state,{type:'TASK_CHECK',id:'work-review',checked:true});
  assert.deepEqual(transition(state,{type:'TASK_CHECK',id:'work-review',checked:true}),state);
  const previous=Object.getOwnPropertyDescriptor(globalThis,'localStorage'),storage=new Map();
  try{
    Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{setItem:(key,value)=>storage.set(key,value),getItem:key=>storage.get(key)||null}});
    assert.ok(writeSave(state));assert.equal(JSON.parse(storage.get(STORAGE_KEY)).taskChecks['work-review'],true);
    const restored=readSave().state;
    assert.match(documentMarkup(doc,restored.taskChecks),/data-task-id="work-review" checked/);
    assert.match(executeCommand('read 仕事/作業予定.tdo',restored).output,/\[x\] 帳票改修の動作確認/);
    state=transition(restored,{type:'TASK_CHECK',id:'work-review',checked:false});
    assert.match(documentText(doc,state.taskChecks),/\[ \] 帳票改修の動作確認/);
  }finally{if(previous)Object.defineProperty(globalThis,'localStorage',previous);else delete globalThis.localStorage;}
  for(const action of [{id:'missing',checked:true},{id:'__proto__',checked:true},{id:'work-review',checked:'yes'}])assert.deepEqual(transition(state,{type:'TASK_CHECK',...action}),state);
  for(const taskChecks of [null,[],{unknown:true},{'work-review':1}])assert.equal(hydrate({...state,taskChecks}),null);
});

test('猫たちのプロフィールと日常記録が指定の性格に沿う',()=>{
  const eru=documentText(fileDocument('えるのこと.rtx')),guri=documentText(fileDocument('ぐりのこと.rtx'));
  for(const text of ['クールビューティー','選り好み','うなって','腕をまくら'])assert.ok(eru.includes(text));
  for(const text of ['おてんば','1.5 倍','何でも食べ','病院は大嫌い'])assert.ok(guri.includes(text));
  assert.match(documentText(fileDocument('おもちゃリスト.rtx')),/える[\s\S]*目では追う[\s\S]*ぐり[\s\S]*食いつき/);
  assert.doesNotMatch(eru+guri,/0619|1228|誕生日/);
});

test('文書本文とタスク名は HTML として解釈しない',()=>{
  const html=documentMarkup({title:'<script>',paragraphs:['<img src=x onerror=alert(1)>']});
  assert.doesNotMatch(html,/<script>|<img/);assert.match(html,/&lt;img/);
  const todo=documentMarkup({kind:'todo',title:'tasks',subtitle:'',groups:[{title:'',items:[{id:'test',text:'<script>',done:false}]}]});
  assert.doesNotMatch(todo,/<script>/);
});
