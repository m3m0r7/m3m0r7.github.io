import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeHistory, saveHistory, readHistory, HISTORY_LIMIT } from '../js/conversation.mjs';

test('会話ログは順序と全文を保存し、不正データを除外する', () => {
  const entries=[{kind:'opening',elapsed:0,text:'今日もシステムエンジニアの仕事だ…。'},{kind:'explore',elapsed:38,text:'えるを撫でた。'}];
  let raw;
  const storage={getItem:()=>raw,setItem:(_key,value)=>{raw=value}};
  assert.equal(saveHistory(storage,entries),true);assert.deepEqual(readHistory(storage),entries);
  assert.deepEqual(normalizeHistory([...entries,{text:'破損',elapsed:-1,kind:'explore'},null,{kind:'invalid',elapsed:0,text:'不正'}]),entries);
  raw='{';assert.deepEqual(readHistory(storage),[]);
});
test('会話は最新分を保持し、保存が使えなくても処理が継続する',()=>{
  const entries=Array.from({length:HISTORY_LIMIT+2},(_,i)=>({kind:'explore',elapsed:i,text:`記録${i}`}));
  const normalized=normalizeHistory(entries);assert.equal(normalized.length,HISTORY_LIMIT);assert.equal(normalized[0].elapsed,2);assert.equal(normalized.at(-1).elapsed,HISTORY_LIMIT+1);
  assert.equal(saveHistory({setItem:()=>{throw new Error('Unavailable')}},entries),false);
  assert.deepEqual(readHistory({getItem:()=>{throw new Error('Unavailable')}}),[]);
});
